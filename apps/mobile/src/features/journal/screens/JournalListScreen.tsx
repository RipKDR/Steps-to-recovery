import React, { useState } from 'react';
import { FlatList, StyleSheet, View, TextInput, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { JournalCard } from '../components/JournalCard';
import { useJournalEntries } from '../hooks/useJournalEntries';
import type { JournalEntryDecrypted } from '@repo/shared/types';
import { useTheme, FloatingActionButton } from '../../../design-system';

interface JournalListScreenProps {
  userId: string;
}

export function JournalListScreen({ userId }: JournalListScreenProps): React.ReactElement {
  const theme = useTheme();
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
      <Text style={[theme.typography.h2, { marginBottom: 8, color: theme.colors.textSecondary }]}>
        No Journal Entries
      </Text>
      <Text style={[theme.typography.body, { textAlign: 'center', color: theme.colors.textSecondary }]}>
        Start writing your first entry to track your thoughts and progress
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.input,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          placeholder="Search entries..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[
            styles.searchInput,
            theme.typography.body,
            { color: theme.colors.text },
          ]}
          placeholderTextColor={theme.colors.textSecondary}
          accessibilityLabel="Search journal entries"
          accessibilityRole="search"
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
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

      <FloatingActionButton
        icon={<MaterialIcons name="add" size={24} color="#FFFFFF" />}
        label="New Entry"
        variant="primary"
        onPress={handleNewEntry}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    minHeight: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 0,
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
});
