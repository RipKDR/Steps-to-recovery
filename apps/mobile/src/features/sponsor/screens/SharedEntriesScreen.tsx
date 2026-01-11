/**
 * Shared Entries Screen
 * View journal entries shared by sponsee (read-only)
 */

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { supabase } from '../../../lib/supabase';
import { JournalCard } from '../../journal/components/JournalCard';
import { decryptContent } from '../../../utils/encryption';
import { logger } from '../../../utils/logger';
import { useTheme } from '../../../design-system/hooks/useTheme';
import { Card, EmptyState } from '../../../design-system/components';
import type { JournalEntryDecrypted } from '@recovery/shared/types';

type RouteParams = {
  SharedEntries: {
    sponseeId: string;
  };
};

export function SharedEntriesScreen(): React.ReactElement {
  const route = useRoute<RouteProp<RouteParams, 'SharedEntries'>>();
  const theme = useTheme();
  const { sponseeId } = route.params;

  const [entries, setEntries] = useState<JournalEntryDecrypted[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSharedEntries();
  }, [sponseeId]);

  const fetchSharedEntries = async (isRefresh = false): Promise<void> => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Query journal entries where current user is in shared_with array
      const { data, error: fetchError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', sponseeId)
        .eq('is_shared', true)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Decrypt entries for display
      const decrypted = await Promise.all(
        (data || []).map(async (entry) => {
          try {
            const decryptedTitle = entry.title ? await decryptContent(entry.title) : '';
            const decryptedBody = await decryptContent(entry.content);
            const decryptedMood = entry.mood ? await decryptContent(entry.mood) : undefined;

            return {
              id: entry.id,
              user_id: entry.user_id,
              title: decryptedTitle,
              body: decryptedBody,
              mood: decryptedMood ? parseInt(decryptedMood, 10) : null,
              craving: null, // Not available in shared entries
              tags: entry.tags || [],
              created_at: entry.created_at,
              updated_at: entry.updated_at,
              sync_status: 'synced',
              supabase_id: entry.id,
            } as JournalEntryDecrypted;
          } catch (decryptError) {
            logger.error('Failed to decrypt shared entry', { entryId: entry.id, error: decryptError });
            return null;
          }
        })
      );

      setEntries(decrypted.filter((e): e is JournalEntryDecrypted => e !== null));
    } catch (err) {
      logger.error('Failed to fetch shared entries', err);
      setError(err instanceof Error ? err.message : 'Failed to load entries');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = (): void => {
    fetchSharedEntries(true);
  };

  const renderItem = ({ item }: { item: JournalEntryDecrypted }): React.ReactElement => (
    <JournalCard
      entry={item}
      onPress={() => {}} // Read-only, no press action
      accessibilityHint="Shared journal entry (read-only)"
    />
  );

  const renderEmpty = (): React.ReactElement => (
    <EmptyState
      icon="folder-shared"
      title="No Shared Entries"
      description="Your sponsee hasn't shared any journal entries with you yet. They can share entries from their journal screen."
    />
  );

  const renderError = (): React.ReactElement => (
    <View style={styles.errorContainer}>
      <Card variant="elevated" style={styles.errorCard}>
        <Text
          style={[
            theme.typography.title2,
            { color: theme.colors.danger, marginBottom: 8, textAlign: 'center' },
          ]}
        >
          Error
        </Text>
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.text, textAlign: 'center' },
          ]}
        >
          {error}
        </Text>
      </Card>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['bottom']}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[
              theme.typography.body,
              { color: theme.colors.textSecondary, marginTop: 12 },
            ]}
          >
            Loading shared entries...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['bottom']}
      >
        {renderError()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['bottom']}
    >
      {/* Header */}
      <Card variant="flat" style={styles.header}>
        <Text
          style={[
            theme.typography.title1,
            { color: theme.colors.text, marginBottom: 4 },
          ]}
        >
          Shared Entries
        </Text>
        <Text
          style={[
            theme.typography.caption,
            { color: theme.colors.textSecondary },
          ]}
        >
          Your sponsee's shared journal entries (read-only)
        </Text>
      </Card>

      {/* Entries List */}
      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          entries.length === 0 && styles.listContentEmpty,
        ]}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        accessibilityRole="list"
        accessibilityLabel="Shared journal entries list"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorCard: {
    padding: 24,
    width: '100%',
  },
});
