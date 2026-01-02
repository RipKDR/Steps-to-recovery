import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { supabase } from '../../../lib/supabase';
import { JournalCard } from '../../journal/components/JournalCard';
import { decryptContent } from '../../../utils/encryption';
import { logger } from '../../../utils/logger';
import type { JournalEntryDecrypted } from '@repo/shared/types';

type RouteParams = {
  SharedEntries: {
    sponseeId: string;
  };
};

export function SharedEntriesScreen(): React.ReactElement {
  const route = useRoute<RouteProp<RouteParams, 'SharedEntries'>>();
  const { sponseeId } = route.params;
  const [entries, setEntries] = useState<JournalEntryDecrypted[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSharedEntries();
  }, [sponseeId]);

  const fetchSharedEntries = async (): Promise<void> => {
    try {
      setLoading(true);
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
              userId: entry.user_id,
              title: decryptedTitle,
              body: decryptedBody,
              mood: decryptedMood,
              tags: entry.tags || [],
              createdAt: entry.created_at,
              updatedAt: entry.updated_at,
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
    }
  };

  const renderItem = ({ item }: { item: JournalEntryDecrypted }): React.ReactElement => (
    <JournalCard
      entry={item}
      onPress={() => {}} // Read-only, no press action
      accessibilityHint="Shared journal entry (read-only)"
    />
  );

  const renderEmpty = (): React.ReactElement => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Shared Entries</Text>
      <Text style={styles.emptyText}>
        Your sponsee hasn't shared any journal entries with you yet.
        {'\n\n'}
        They can share entries from their journal screen.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Loading shared entries...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shared Entries</Text>
        <Text style={styles.headerSubtitle}>
          Your sponsee's shared journal entries (read-only)
        </Text>
      </View>

      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onRefresh={fetchSharedEntries}
        refreshing={loading}
        ListEmptyComponent={renderEmpty}
        accessibilityRole="list"
        accessibilityLabel="Shared journal entries list"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
});
