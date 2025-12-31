import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, Chip, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { DailyCheckInDecrypted } from '@repo/shared/types';

interface DailyCheckInCardProps {
  morningCheckIn: DailyCheckInDecrypted | null;
  eveningCheckIn: DailyCheckInDecrypted | null;
  isLoading: boolean;
  userId: string;
}

export function DailyCheckInCard({
  morningCheckIn,
  eveningCheckIn,
  isLoading,
  userId,
}: DailyCheckInCardProps): React.ReactElement {
  const navigation = useNavigation();

  const handleMorningCheckIn = (): void => {
    navigation.navigate('MorningIntention' as never, { userId } as never);
  };

  const handleEveningCheckIn = (): void => {
    navigation.navigate('EveningPulse' as never, { userId } as never);
  };

  if (isLoading) {
    return (
      <Card style={styles.card} accessibilityRole="none" accessibilityLabel="Loading daily check-ins">
        <Card.Content style={styles.loadingContainer}>
          <ActivityIndicator size="small" />
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card} accessibilityRole="none" accessibilityLabel="Daily check-in card">
      <Card.Content>
        <Text variant="titleLarge" style={styles.title}>
          Daily Check-In
        </Text>

        <View style={styles.checkInRow}>
          <View style={styles.checkInItem}>
            <View style={styles.checkInHeader}>
              <Text variant="bodyLarge" style={styles.checkInEmoji}>
                🌅
              </Text>
              <Text variant="titleMedium" style={styles.checkInTitle}>
                Morning
              </Text>
            </View>
            {morningCheckIn ? (
              <Chip
                icon="check-circle"
                style={styles.completedChip}
                textStyle={styles.chipText}
                accessibilityLabel="Morning check-in completed"
                accessibilityRole="text"
              >
                Completed
              </Chip>
            ) : (
              <Button
                mode="contained"
                onPress={handleMorningCheckIn}
                style={styles.checkInButton}
                accessibilityLabel="Start morning intention"
                accessibilityRole="button"
                accessibilityHint="Opens morning intention check-in form"
              >
                Start
              </Button>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.checkInItem}>
            <View style={styles.checkInHeader}>
              <Text variant="bodyLarge" style={styles.checkInEmoji}>
                🌙
              </Text>
              <Text variant="titleMedium" style={styles.checkInTitle}>
                Evening
              </Text>
            </View>
            {eveningCheckIn ? (
              <Chip
                icon="check-circle"
                style={styles.completedChip}
                textStyle={styles.chipText}
                accessibilityLabel="Evening check-in completed"
                accessibilityRole="text"
              >
                Completed
              </Chip>
            ) : (
              <Button
                mode="contained"
                onPress={handleEveningCheckIn}
                style={styles.checkInButton}
                disabled={!morningCheckIn}
                accessibilityLabel="Start evening pulse check"
                accessibilityRole="button"
                accessibilityHint="Opens evening pulse check-in form"
                accessibilityState={{ disabled: !morningCheckIn }}
              >
                Start
              </Button>
            )}
          </View>
        </View>

        {morningCheckIn && morningCheckIn.intention && (
          <View style={styles.intentionPreview}>
            <Text variant="bodySmall" style={styles.intentionLabel}>
              Today's Intention:
            </Text>
            <Text variant="bodyMedium" style={styles.intentionText}>
              "{morningCheckIn.intention}"
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  checkInRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkInItem: {
    flex: 1,
    alignItems: 'center',
  },
  checkInHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  checkInEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  checkInTitle: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  checkInButton: {
    minWidth: 100,
  },
  completedChip: {
    backgroundColor: '#e8f5e9',
  },
  chipText: {
    color: '#2e7d32',
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  intentionPreview: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  intentionLabel: {
    color: '#666',
    marginBottom: 4,
  },
  intentionText: {
    fontStyle: 'italic',
    color: '#1a1a1a',
  },
});
