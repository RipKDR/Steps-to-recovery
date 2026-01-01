import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { JournalEntryDecrypted } from '@repo/shared/types';
import { useTheme, Card, Badge } from '../../../design-system';

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
  const theme = useTheme();

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
    <Card variant="interactive" onPress={onPress} animate style={styles.cardContainer}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {entry.title && (
            <Text
              style={[theme.typography.h3, { color: theme.colors.text, fontWeight: '600' }]}
              numberOfLines={1}
            >
              {entry.title}
            </Text>
          )}
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
            {formatDate(entry.created_at)}
          </Text>
        </View>
        <MaterialCommunityIcons name="lock" size={16} color={theme.colors.textSecondary} />
      </View>

      <Text
        style={[theme.typography.body, { color: theme.colors.text, marginBottom: 12, lineHeight: 20 }]}
        numberOfLines={3}
      >
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
              <Badge key={index} variant="primary" size="small">
                {tag}
              </Badge>
            ))}
            {entry.tags.length > 2 && (
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                +{entry.tags.length - 2}
              </Text>
            )}
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
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
});
