import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FAB, Searchbar, ActivityIndicator, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { JournalCard } from '../components/JournalCard';
import { useJournalEntries } from '../hooks/useJournalEntries';
import type { JournalEntryDecrypted } from '@repo/shared/types';

interface JournalListScreenProps {
  userId: string;
}

export function JournalListScreen({ userId }: JournalListScreenProps): React.ReactElement {
  const navigation = useNavigation();
  const { entries, isLoading, refetch } = useJournalEntries(userId);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = entries.filter((entry) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      entry.title?.toLowerCase().includes(query) ||
      entry.body.toLowerCase().includes(query) ||
      entry.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const handleNewEntry = (): void => {
    (navigation.navigate as (screen: string, params?: Record<string, unknown>) => void)('JournalEditor', { userId, mode: 'create' });
  };

  const handleEntryPress = (entry: JournalEntryDecrypted): void => {
    (navigation.navigate as (screen: string, params?: Record<string, unknown>) => void)('JournalEditor', { userId, mode: 'edit', entryId: entry.id });
  };

  const renderItem = ({ item }: { item: JournalEntryDecrypted }): React.ReactElement => (
    <JournalCard entry={item} onPress={() => handleEntryPress(item)} />
  );

  const renderEmpty = (): React.ReactElement => (
    <View style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No Journal Entries
      </Text>
      <Text variant="bodyMedium" style={styles.emptyText}>
        Start writing your first entry to track your thoughts and progress
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Searchbar
        placeholder="Search entries..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        accessibilityLabel="Search journal entries"
        accessibilityRole="search"
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredEntries}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onRefresh={refetch}
          refreshing={isLoading}
          ListEmptyComponent={renderEmpty}
          accessibilityRole="list"
          accessibilityLabel="Journal entries list"
        />
      )}

      <FAB
        icon="plus"
        label="New Entry"
        onPress={handleNewEntry}
        style={styles.fab}
        accessibilityLabel="Create new journal entry"
        accessibilityRole="button"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    marginBottom: 8,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
});
