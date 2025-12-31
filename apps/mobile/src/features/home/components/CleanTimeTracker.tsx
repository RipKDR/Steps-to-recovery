import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar, ActivityIndicator } from 'react-native-paper';
import type { Milestone } from '@repo/shared/types';

interface CleanTimeTrackerProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  nextMilestone: Milestone | null;
  isLoading: boolean;
}

export function CleanTimeTracker({
  days,
  hours,
  minutes,
  seconds,
  nextMilestone,
  isLoading,
}: CleanTimeTrackerProps): React.ReactElement {
  if (isLoading) {
    return (
      <Card style={styles.card} accessibilityRole="progressbar" accessibilityLabel="Loading clean time">
        <Card.Content style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </Card.Content>
      </Card>
    );
  }

  const progress = nextMilestone ? days / nextMilestone.days : 1;
  const daysUntilNext = nextMilestone ? nextMilestone.days - days : 0;

  return (
    <Card style={styles.card} accessibilityRole="article" accessibilityLabel={`Clean time: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.title}>
          Clean Time
        </Text>

        <View style={styles.timeContainer}>
          <View style={styles.timeBlock}>
            <Text variant="displayMedium" style={styles.timeValue}>
              {days}
            </Text>
            <Text variant="bodyMedium" style={styles.timeLabel}>
              Days
            </Text>
          </View>

          <View style={styles.timeBlock}>
            <Text variant="displaySmall" style={styles.timeValue}>
              {hours}
            </Text>
            <Text variant="bodySmall" style={styles.timeLabel}>
              Hours
            </Text>
          </View>

          <View style={styles.timeBlock}>
            <Text variant="displaySmall" style={styles.timeValue}>
              {minutes}
            </Text>
            <Text variant="bodySmall" style={styles.timeLabel}>
              Minutes
            </Text>
          </View>

          <View style={styles.timeBlock}>
            <Text variant="displaySmall" style={styles.timeValue}>
              {seconds}
            </Text>
            <Text variant="bodySmall" style={styles.timeLabel}>
              Seconds
            </Text>
          </View>
        </View>

        {nextMilestone && (
          <View style={styles.milestoneContainer}>
            <View style={styles.milestoneHeader}>
              <Text variant="bodyLarge" style={styles.milestoneEmoji}>
                {nextMilestone.icon}
              </Text>
              <View style={styles.milestoneTextContainer}>
                <Text variant="bodyMedium" style={styles.milestoneTitle}>
                  Next: {nextMilestone.title}
                </Text>
                <Text variant="bodySmall" style={styles.milestoneDays}>
                  {daysUntilNext} days to go
                </Text>
              </View>
            </View>
            <ProgressBar
              progress={progress}
              color="#4caf50"
              style={styles.progressBar}
              accessibilityLabel={`Progress to ${nextMilestone.title}: ${Math.round(progress * 100)}%`}
              accessibilityRole="progressbar"
            />
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
    padding: 40,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  timeBlock: {
    alignItems: 'center',
  },
  timeValue: {
    fontWeight: 'bold',
    color: '#4caf50',
  },
  timeLabel: {
    color: '#666',
    marginTop: 4,
  },
  milestoneContainer: {
    marginTop: 8,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  milestoneEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  milestoneTextContainer: {
    flex: 1,
  },
  milestoneTitle: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  milestoneDays: {
    color: '#666',
    marginTop: 2,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});
