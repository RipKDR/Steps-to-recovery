import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Card, ProgressBar } from '../../../design-system/components';
import { useTheme } from '../../../design-system/hooks/useTheme';
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
  const theme = useTheme();

  if (isLoading) {
    return (
      <Card variant="elevated" style={styles.card} accessibilityRole="progressbar" accessibilityLabel="Loading clean time">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </Card>
    );
  }

  const progress = nextMilestone ? days / nextMilestone.days : 1;
  const daysUntilNext = nextMilestone ? nextMilestone.days - days : 0;

  return (
    <Card variant="elevated" style={styles.card} accessibilityRole="none" accessibilityLabel={`Clean time: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}>
      <Text style={[theme.typography.title2, styles.title]}>
        Clean Time
      </Text>

      <View style={styles.timeContainer}>
        <View style={styles.timeBlock}>
          <Text style={[theme.typography.largeTitle, { color: theme.colors.success }]}>
            {days}
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: 4 }]}>
            Days
          </Text>
        </View>

        <View style={styles.timeBlock}>
          <Text style={[theme.typography.title1, { color: theme.colors.success }]}>
            {hours}
          </Text>
          <Text style={[theme.typography.caption1, { color: theme.colors.textSecondary, marginTop: 4 }]}>
            Hours
          </Text>
        </View>

        <View style={styles.timeBlock}>
          <Text style={[theme.typography.title1, { color: theme.colors.success }]}>
            {minutes}
          </Text>
          <Text style={[theme.typography.caption1, { color: theme.colors.textSecondary, marginTop: 4 }]}>
            Minutes
          </Text>
        </View>

        <View style={styles.timeBlock}>
          <Text style={[theme.typography.title1, { color: theme.colors.success }]}>
            {seconds}
          </Text>
          <Text style={[theme.typography.caption1, { color: theme.colors.textSecondary, marginTop: 4 }]}>
            Seconds
          </Text>
        </View>
      </View>

      {nextMilestone && (
        <View style={styles.milestoneContainer}>
          <View style={styles.milestoneHeader}>
            <Text style={styles.milestoneEmoji}>
              {nextMilestone.icon}
            </Text>
            <View style={styles.milestoneTextContainer}>
              <Text style={[theme.typography.body, { fontWeight: '600', color: theme.colors.text }]}>
                Next: {nextMilestone.title}
              </Text>
              <Text style={[theme.typography.caption1, { color: theme.colors.textSecondary, marginTop: 2 }]}>
                {daysUntilNext} days to go
              </Text>
            </View>
          </View>
          <ProgressBar
            progress={progress}
            variant="primary"
            style={styles.progressBar}
            accessibilityLabel={`Progress to ${nextMilestone.title}: ${Math.round(progress * 100)}%`}
            accessibilityRole="progressbar"
          />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginTop: 8,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  timeBlock: {
    alignItems: 'center',
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
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});
