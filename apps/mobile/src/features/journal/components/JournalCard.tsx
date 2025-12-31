import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { JournalEntryDecrypted } from '@repo/shared/types';

interface JournalCardProps {
  entry: JournalEntryDecrypted;
  onPress: () => void;
}

const MOOD_EMOJI: Record<number, string> = {
  1: '😢',
  2: '😔',
  3: '😐',
  4: '🙂',
  5: '😊',
};

const CRAVING_COLORS: Record<number, string> = {
  0: '#4caf50',
  1: '#4caf50',
  2: '#4caf50',
  3: '#8bc34a',
  4: '#cddc39',
  5: '#ffeb3b',
  6: '#ffc107',
  7: '#ff9800',
  8: '#ff5722',
  9: '#f44336',
  10: '#d32f2f',
};

export function JournalCard({ entry, onPress }: JournalCardProps): React.ReactElement {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const truncateBody = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Journal entry ${entry.title || 'Untitled'}, ${formatDate(entry.created_at)}`}
      accessibilityHint="Double tap to view and edit this journal entry"
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              {entry.title && (
                <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
                  {entry.title}
                </Text>
              )}
              <Text variant="bodySmall" style={styles.date}>
                {formatDate(entry.created_at)}
              </Text>
            </View>
            <MaterialCommunityIcons name="lock" size={16} color="#666" />
          </View>

          <Text variant="bodyMedium" style={styles.body} numberOfLines={3}>
            {truncateBody(entry.body)}
          </Text>

          <View style={styles.footer}>
            <View style={styles.indicators}>
              {entry.mood !== null && (
                <View style={styles.indicator}>
                  <Text style={styles.emoji}>{MOOD_EMOJI[entry.mood]}</Text>
                </View>
              )}
              {entry.craving !== null && (
                <View style={[styles.cravingIndicator, { backgroundColor: CRAVING_COLORS[entry.craving] }]}>
                  <Text style={styles.cravingText}>{entry.craving}</Text>
                </View>
              )}
            </View>

            {entry.tags.length > 0 && (
              <View style={styles.tags}>
                {entry.tags.slice(0, 2).map((tag, index) => (
                  <Chip key={index} style={styles.chip} textStyle={styles.chipText} compact>
                    {tag}
                  </Chip>
                ))}
                {entry.tags.length > 2 && (
                  <Text style={styles.moreTags}>+{entry.tags.length - 2}</Text>
                )}
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  date: {
    color: '#666',
    marginTop: 2,
  },
  body: {
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    padding: 4,
  },
  emoji: {
    fontSize: 20,
  },
  cravingIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cravingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chip: {
    height: 24,
    backgroundColor: '#e3f2fd',
  },
  chipText: {
    fontSize: 11,
    color: '#1976d2',
  },
  moreTags: {
    fontSize: 11,
    color: '#666',
  },
});
