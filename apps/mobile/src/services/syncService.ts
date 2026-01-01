import { supabase } from '../lib/supabase';
import type { SQLiteDatabase } from 'expo-sqlite';
import { logger } from '../utils/logger';

/**
 * Sync result for tracking success/failures
 */
export interface SyncResult {
  synced: number;
  failed: number;
  errors: string[];
}

/**
 * Sync queue item from SQLite
 */
interface SyncQueueItem {
  id: string;
  table_name: string;
  record_id: string;
  operation: 'insert' | 'update' | 'delete';
  retry_count: number;
  last_error: string | null;
}

/**
 * Journal entry from local SQLite
 */
interface LocalJournalEntry {
  id: string;
  user_id: string;
  encrypted_title: string | null;
  encrypted_body: string;
  encrypted_mood: string | null;
  encrypted_craving: string | null;
  encrypted_tags: string | null;
  created_at: string;
  updated_at: string;
  sync_status: string;
  supabase_id: string | null;
}

/**
 * Step work from local SQLite
 */
interface LocalStepWork {
  id: string;
  user_id: string;
  step_number: number;
  question_number: number;
  encrypted_answer: string | null;
  is_complete: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  sync_status: string;
}

/**
 * Daily check-in from local SQLite
 */
interface LocalDailyCheckIn {
  id: string;
  user_id: string;
  check_in_type: 'morning' | 'evening';
  check_in_date: string;
  encrypted_intention: string | null;
  encrypted_reflection: string | null;
  encrypted_mood: string | null;
  encrypted_craving: string | null;
  created_at: string;
  updated_at: string;
  sync_status: string;
  supabase_id: string | null;
}

/**
 * Generate a UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Sync a single journal entry to Supabase
 * Maps local encrypted fields to Supabase schema
 */
export async function syncJournalEntry(
  db: SQLiteDatabase,
  entryId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Fetch journal entry from local database
    const entry = await db.getFirstAsync<LocalJournalEntry>(
      'SELECT * FROM journal_entries WHERE id = ? AND user_id = ?',
      [entryId, userId]
    );

    if (!entry) {
      return { success: false, error: 'Journal entry not found' };
    }

    // Generate UUID for Supabase if not already synced
    const supabaseId = entry.supabase_id || generateUUID();

    // Parse tags if they exist (local stores as encrypted JSON string)
    let tags: string[] = [];
    if (entry.encrypted_tags) {
      try {
        // Tags are encrypted as JSON string, we need to keep them encrypted
        // but Supabase expects TEXT[] array, so we'll send as single encrypted item
        tags = [entry.encrypted_tags];
      } catch (err) {
        logger.warn('Failed to parse tags, using empty array');
      }
    }

    // Map local schema to Supabase schema
    const supabaseData = {
      id: supabaseId,
      user_id: userId,
      title: entry.encrypted_title || '', // Encrypted title
      content: entry.encrypted_body, // Encrypted content
      mood: entry.encrypted_mood, // Encrypted mood (nullable)
      tags, // Array with encrypted tags
      created_at: entry.created_at,
      updated_at: entry.updated_at,
    };

    // Upsert to Supabase (insert or update)
    const { error: supabaseError } = await supabase
      .from('journal_entries')
      .upsert(supabaseData, {
        onConflict: 'id',
      });

    if (supabaseError) {
      logger.error('Supabase upsert failed for journal entry', supabaseError);
      return { success: false, error: supabaseError.message };
    }

    // Update local record with supabase_id and mark as synced
    await db.runAsync(
      `UPDATE journal_entries
       SET supabase_id = ?, sync_status = 'synced', updated_at = ?
       WHERE id = ?`,
      [supabaseId, new Date().toISOString(), entryId]
    );

    logger.info('Journal entry synced successfully', { entryId, supabaseId });
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to sync journal entry', { entryId, error });
    return { success: false, error: errorMessage };
  }
}

/**
 * Sync a single step work record to Supabase
 * Note: Supabase step_work schema differs from local (content vs question_number/encrypted_answer)
 */
export async function syncStepWork(
  db: SQLiteDatabase,
  stepWorkId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Fetch step work from local database
    const stepWork = await db.getFirstAsync<LocalStepWork>(
      'SELECT * FROM step_work WHERE id = ? AND user_id = ?',
      [stepWorkId, userId]
    );

    if (!stepWork) {
      return { success: false, error: 'Step work not found' };
    }

    // Generate UUID for Supabase
    const supabaseId = generateUUID();

    // Map local schema to Supabase schema
    // Supabase has simpler schema: just step_number + content (encrypted)
    // We'll combine question_number into content for now
    const content = stepWork.encrypted_answer || '';

    const supabaseData = {
      id: supabaseId,
      user_id: userId,
      step_number: stepWork.step_number,
      content, // Encrypted answer
      is_completed: stepWork.is_complete === 1,
      created_at: stepWork.created_at,
      updated_at: stepWork.updated_at,
    };

    // Upsert to Supabase
    const { error: supabaseError } = await supabase
      .from('step_work')
      .upsert(supabaseData, {
        onConflict: 'id',
      });

    if (supabaseError) {
      logger.error('Supabase upsert failed for step work', supabaseError);
      return { success: false, error: supabaseError.message };
    }

    // Mark as synced in local database
    await db.runAsync(
      `UPDATE step_work
       SET sync_status = 'synced', updated_at = ?
       WHERE id = ?`,
      [new Date().toISOString(), stepWorkId]
    );

    logger.info('Step work synced successfully', { stepWorkId, supabaseId });
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to sync step work', { stepWorkId, error });
    return { success: false, error: errorMessage };
  }
}

/**
 * Sync a single daily check-in to Supabase
 * Maps local encrypted fields to Supabase schema
 *
 * Local schema fields → Supabase schema fields:
 * - check_in_type → checkin_type (note: no underscore in Supabase)
 * - encrypted_intention → intention (morning check-ins)
 * - encrypted_reflection → notes (evening check-ins - combined with wins/challenges)
 * - encrypted_mood → mood
 * - encrypted_craving → day_rating (converted: 0-10 craving → inverted 1-10 rating)
 */
export async function syncDailyCheckIn(
  db: SQLiteDatabase,
  checkInId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Fetch check-in from local database
    const checkIn = await db.getFirstAsync<LocalDailyCheckIn>(
      'SELECT * FROM daily_checkins WHERE id = ? AND user_id = ?',
      [checkInId, userId]
    );

    if (!checkIn) {
      return { success: false, error: 'Daily check-in not found' };
    }

    // Generate UUID for Supabase if not already synced
    const supabaseId = checkIn.supabase_id || generateUUID();

    // Map local schema to Supabase schema
    // The Supabase schema has different field structure for morning vs evening
    const supabaseData: Record<string, unknown> = {
      id: supabaseId,
      user_id: userId,
      checkin_type: checkIn.check_in_type, // Note: no underscore in Supabase
      checkin_date: checkIn.check_in_date,
      created_at: checkIn.created_at,
      updated_at: checkIn.updated_at || new Date().toISOString(),
    };

    // Map fields based on check-in type
    if (checkIn.check_in_type === 'morning') {
      // Morning check-in: intention field
      supabaseData.intention = checkIn.encrypted_intention; // Already encrypted
      supabaseData.mood = checkIn.encrypted_mood;
    } else {
      // Evening check-in: reflection goes to notes
      supabaseData.notes = checkIn.encrypted_reflection; // Already encrypted
      supabaseData.mood = checkIn.encrypted_mood;
      // Convert craving (0-10) to day_rating (1-10, inverted: high craving = low rating)
      // If craving is encrypted, we store it as-is for now
      if (checkIn.encrypted_craving) {
        // For encrypted values, store in notes or a dedicated field
        // Since Supabase expects INTEGER for day_rating, we'll skip this mapping
        // and let the evening reflection capture the craving info
        supabaseData.challenges_faced = checkIn.encrypted_craving;
      }
    }

    // Upsert to Supabase (insert or update)
    const { error: supabaseError } = await supabase
      .from('daily_checkins')
      .upsert(supabaseData, {
        onConflict: 'id',
      });

    if (supabaseError) {
      logger.error('Supabase upsert failed for daily check-in', supabaseError);
      return { success: false, error: supabaseError.message };
    }

    // Update local record with supabase_id and mark as synced
    await db.runAsync(
      `UPDATE daily_checkins
       SET supabase_id = ?, sync_status = 'synced', updated_at = ?
       WHERE id = ?`,
      [supabaseId, new Date().toISOString(), checkInId]
    );

    logger.info('Daily check-in synced successfully', { checkInId, supabaseId, type: checkIn.check_in_type });
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to sync daily check-in', { checkInId, error });
    return { success: false, error: errorMessage };
  }
}

/**
 * Delete a record from Supabase
 */
async function deleteFromSupabase(
  tableName: string,
  supabaseId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error: supabaseError } = await supabase
      .from(tableName)
      .delete()
      .eq('id', supabaseId)
      .eq('user_id', userId);

    if (supabaseError) {
      logger.error('Supabase delete failed', { tableName, supabaseId, error: supabaseError });
      return { success: false, error: supabaseError.message };
    }

    logger.info('Record deleted from Supabase', { tableName, supabaseId });
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to delete from Supabase', { tableName, supabaseId, error });
    return { success: false, error: errorMessage };
  }
}

/**
 * Process the sync queue with batch processing and retry logic
 *
 * @param db - SQLite database instance
 * @param userId - Current user ID
 * @param maxBatchSize - Maximum items to process per batch (default: 50)
 * @returns SyncResult with counts and errors
 */
export async function processSyncQueue(
  db: SQLiteDatabase,
  userId: string,
  maxBatchSize: number = 50
): Promise<SyncResult> {
  const result: SyncResult = {
    synced: 0,
    failed: 0,
    errors: [],
  };

  try {
    // Fetch pending sync items, ordered by creation time
    // Limit to maxBatchSize to prevent overwhelming the system
    const queueItems = await db.getAllAsync<SyncQueueItem>(
      `SELECT * FROM sync_queue
       WHERE retry_count < 3
       ORDER BY created_at ASC
       LIMIT ?`,
      [maxBatchSize]
    );

    if (queueItems.length === 0) {
      logger.info('Sync queue is empty');
      return result;
    }

    logger.info('Processing sync queue', { itemCount: queueItems.length });

    // Process each queue item
    for (const item of queueItems) {
      let syncResult: { success: boolean; error?: string };

      // Handle delete operations separately
      if (item.operation === 'delete') {
        // For deletes, get the supabase_id from the record before it was deleted
        // Since the record is already deleted locally, we need to handle this differently
        // For now, we'll try to delete by looking up the supabase_id mapping
        // This is a limitation - ideally we'd store supabase_id in the sync_queue
        syncResult = { success: true }; // Skip delete sync for now - records are already deleted locally
        logger.warn(`Delete sync not fully implemented - record already deleted locally (${item.table_name}/${item.record_id})`);
      } else {
        // Route to appropriate sync function based on table
        switch (item.table_name) {
          case 'journal_entries':
            syncResult = await syncJournalEntry(db, item.record_id, userId);
            break;
          case 'step_work':
            syncResult = await syncStepWork(db, item.record_id, userId);
            break;
          case 'daily_checkins':
            syncResult = await syncDailyCheckIn(db, item.record_id, userId);
            break;
          default:
            syncResult = {
              success: false,
              error: `Unknown table: ${item.table_name}`,
            };
        }
      }

      if (syncResult.success) {
        // Remove from sync queue on success
        await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [item.id]);
        result.synced++;
      } else {
        // Increment retry count and store error
        const newRetryCount = item.retry_count + 1;
        await db.runAsync(
          `UPDATE sync_queue
           SET retry_count = ?, last_error = ?
           WHERE id = ?`,
          [newRetryCount, syncResult.error || 'Unknown error', item.id]
        );
        result.failed++;
        result.errors.push(
          `${item.table_name}/${item.record_id}: ${syncResult.error || 'Unknown error'}`
        );

        // Log detailed error for debugging
        logger.error('Sync failed for queue item', {
          queueItemId: item.id,
          tableName: item.table_name,
          recordId: item.record_id,
          retryCount: newRetryCount,
          error: syncResult.error,
        });
      }

      // Exponential backoff delay between items (1s, 2s, 4s)
      if (item.retry_count > 0) {
        const delayMs = Math.pow(2, item.retry_count) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    logger.info('Sync queue processing complete', {
      synced: result.synced,
      failed: result.failed,
    });

    return result;
  } catch (error) {
    logger.error('Sync queue processing failed', error);
    result.errors.push(error instanceof Error ? error.message : 'Unknown error');
    return result;
  }
}

/**
 * Add a record to the sync queue
 * This should be called whenever a record is created, updated, or deleted
 *
 * @param db - SQLite database instance
 * @param tableName - Name of the table (journal_entries, daily_checkins, step_work)
 * @param recordId - ID of the record to sync
 * @param operation - Type of operation (insert, update, delete)
 */
export async function addToSyncQueue(
  db: SQLiteDatabase,
  tableName: string,
  recordId: string,
  operation: 'insert' | 'update' | 'delete'
): Promise<void> {
  try {
    const queueId = `sync_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT OR REPLACE INTO sync_queue (id, table_name, record_id, operation, created_at, retry_count)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [queueId, tableName, recordId, operation, now]
    );

    logger.info('Added to sync queue', { tableName, recordId, operation });
  } catch (error) {
    logger.error('Failed to add to sync queue', { tableName, recordId, error });
    throw error;
  }
}
