import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Card, ProgressBar, Badge } from '../../../design-system/components';
import { useTheme } from '../../../design-system/hooks/useTheme';
import type { Milestone } from '@recovery/shared/types';

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

  // Calculate circular progress for milestone
  const progress = nextMilestone ? (days / nextMilestone.days) * 100 : 100;

  // Circle dimensions
  const size = 180;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressOffset = circumference - (progress / 100) * circumference;

  const daysUntilNext = nextMilestone ? nextMilestone.days - days : 0;
  const isStreakIntact = days > 0; // Simple logic for MVP

  return (
    <Card
      variant="elevated"
      style={styles.card}
      accessibilityRole="none"
      accessibilityLabel={`Clean time: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}
    >
      {/* Header with title and streak badge */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.iconText, { color: theme.colors.success }]}>⚡</Text>
          <Text style={[theme.typography.title2, styles.title, { color: theme.colors.text }]}>
            Clean Time Streak
          </Text>
        </View>
        {isStreakIntact && (
          <Badge
            variant="success"
            size="medium"
            accessibilityLabel="Streak intact"
            accessibilityRole="text"
          >
            STREAK INTACT
          </Badge>
        )}
      </View>

      {/* Circular progress tracker */}
      <View style={styles.circularContainer}>
        <Svg width={size} height={size} style={styles.svg}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.surfaceVariant}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.success}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>

        {/* Center content */}
        <View style={styles.centerContent}>
          <Text style={[styles.daysNumber, { color: theme.colors.success }]}>
            {days}
          </Text>
          <Text style={[styles.daysLabel, { color: theme.colors.textSecondary }]}>
            DAYS CLEAN
          </Text>
        </View>
      </View>

      {/* Motivational text */}
      {days > 0 && (
        <Text style={[styles.motivationalText, { color: theme.colors.textSecondary }]}>
          {days < 7
            ? "🎉 Great start! Keep going!"
            : days < 30
            ? "💪 Another week stronger. Keep going!"
            : days < 90
            ? "🌟 Amazing progress! You're doing it!"
            : "🏆 Incredible! You're an inspiration!"}
        </Text>
      )}

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Text style={{ fontSize: 20 }}>🔄</Text>
          </View>
          <Text style={[styles.statNumber, { color: theme.colors.text }]}>0</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>RELAPSES</Text>
        </View>

        <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Text style={{ fontSize: 20 }}>🤝</Text>
          </View>
          <Text style={[styles.statNumber, { color: theme.colors.text }]}>0</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>SPONSOR EST</Text>
        </View>

        <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Text style={{ fontSize: 20 }}>📅</Text>
          </View>
          <Text style={[styles.statNumber, { color: theme.colors.text }]}>{days}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>DAY STREAK</Text>
        </View>
      </View>

      {/* Milestone progress */}
      {nextMilestone && (
        <View style={styles.milestoneContainer}>
          <View style={styles.milestoneHeader}>
            <View style={styles.milestoneLeft}>
              <Text style={styles.milestoneEmoji}>
                {nextMilestone.icon}
              </Text>
              <View style={styles.milestoneTextContainer}>
                <Text style={[styles.milestoneTitle, { color: theme.colors.text }]}>
                  Next Milestone
                </Text>
                <Text style={[styles.milestoneSubtitle, { color: theme.colors.textSecondary }]}>
                  {nextMilestone.title} • {daysUntilNext} days to go
                </Text>
              </View>
            </View>
          </View>
          <ProgressBar
            progress={progress / 100}
            style={styles.progressBar}
            color={theme.colors.success}
            backgroundColor={theme.colors.surfaceVariant}
            accessibilityLabel={`Progress to ${nextMilestone.title}: ${Math.round(progress)}%`}
            accessibilityRole="progressbar"
          />
        </View>
      )}

      {/* Time breakdown */}
      <View style={styles.timeBreakdown}>
        <View style={styles.timeItem}>
          <Text style={[styles.timeNumber, { color: theme.colors.text }]}>{hours}</Text>
          <Text style={[styles.timeLabel, { color: theme.colors.textSecondary }]}>Hours</Text>
        </View>
        <View style={styles.timeItem}>
          <Text style={[styles.timeNumber, { color: theme.colors.text }]}>{minutes}</Text>
          <Text style={[styles.timeLabel, { color: theme.colors.textSecondary }]}>Minutes</Text>
        </View>
        <View style={styles.timeItem}>
          <Text style={[styles.timeNumber, { color: theme.colors.text }]}>{seconds}</Text>
          <Text style={[styles.timeLabel, { color: theme.colors.textSecondary }]}>Seconds</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginTop: 8,
    padding: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconText: {
    fontSize: 20,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
  },
  circularContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    position: 'relative',
  },
  svg: {
    // SVG container
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysNumber: {
    fontSize: 56,
    fontWeight: '700',
    lineHeight: 64,
  },
  daysLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 4,
  },
  motivationalText: {
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 12,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 48,
  },
  milestoneContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  milestoneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  milestoneEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  milestoneTextContainer: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  milestoneSubtitle: {
    fontSize: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  timeBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  timeItem: {
    alignItems: 'center',
  },
  timeNumber: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  timeLabel: {
    fontSize: 11,
  },
});
