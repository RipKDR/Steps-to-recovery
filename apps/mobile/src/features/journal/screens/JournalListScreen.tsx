import React, { useState, useRef, useEffect } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { JournalCard } from '../components/JournalCard';
import { useJournalEntries } from '../hooks/useJournalEntries';
import type { JournalEntryDecrypted } from '@recovery/shared/types';
import { useTheme, FloatingActionButton, Input, EmptyState } from '../../../design-system';

interface JournalListScreenProps {
  userId: string;
}

export function JournalListScreen({ userId }: JournalListScreenProps): React.ReactElement {
  const theme = useTheme();
  const navigation = useNavigation();
  const { entries, isLoading, refetch } = useJournalEntries(userId);
  const [searchQuery, setSearchQuery] = useState('');

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

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
    <EmptyState
      icon={<MaterialIcons name="book" size={64} color={theme.colors.textSecondary} />}
      title={searchQuery ? 'No entries found' : 'Your thoughts are safe here'}
      description={
        searchQuery
          ? `No entries match "${searchQuery}". Try a different search term.`
          : 'Start your first journal entry to track your thoughts, feelings, and progress on your recovery journey.'
      }
      actionLabel={searchQuery ? undefined : 'Create Entry'}
      onAction={searchQuery ? undefined : handleNewEntry}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <Animated.View
        style={[
          styles.searchContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Input
          label=""
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search entries..."
          leftIcon={<MaterialIcons name="search" size={20} color={theme.colors.textSecondary} />}
          containerStyle={styles.searchInputContainer}
          accessibilityLabel="Search journal entries"
          accessibilityRole="search"
        />
      </Animated.View>

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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchInputContainer: {
    marginBottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 100,
  },
});
