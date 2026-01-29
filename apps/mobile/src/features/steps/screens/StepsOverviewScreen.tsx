/**
 * Steps Overview Screen
 * Displays all 12 steps with progress tracking
 * Design: iOS-style with interactive cards and clear visual hierarchy
 *
 * Premium Animations: Staggered card entrances, pulse indicator for current step
 */

import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import type { StepsStackParamList } from '../../../navigation/types';
import { useTheme, Card, ProgressBar, CircularProgress } from '../../../design-system';
import { useStepProgress } from '../hooks/useStepWork';
import { hapticSelection } from '../../../utils/haptics';

type NavigationProp = NativeStackNavigationProp<StepsStackParamList>;

interface StepsOverviewScreenProps {
  userId: string;
}

interface Step {
  number: number;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: 1,
    title: 'Admit powerlessness',
    description: 'We admitted we were powerless over our addiction - that our lives had become unmanageable.',
  },
  {
    number: 2,
    title: 'Believe in a higher power',
    description: 'Came to believe that a Power greater than ourselves could restore us to sanity.',
  },
  {
    number: 3,
    title: 'Decide to turn will over',
    description: 'Made a decision to turn our will and our lives over to the care of God as we understood Him.',
  },
  {
    number: 4,
    title: 'Make a moral inventory',
    description: 'Made a searching and fearless moral inventory of ourselves.',
  },
  {
    number: 5,
    title: 'Admit wrongs',
    description: 'Admitted to God, to ourselves, and to another human being the exact nature of our wrongs.',
  },
  {
    number: 6,
    title: 'Be ready for change',
    description: 'Were entirely ready to have God remove all these defects of character.',
  },
  {
    number: 7,
    title: 'Ask for removal',
    description: 'Humbly asked Him to remove our shortcomings.',
  },
  {
    number: 8,
    title: 'Make a list',
    description: 'Made a list of all persons we had harmed, and became willing to make amends to them all.',
  },
  {
    number: 9,
    title: 'Make amends',
    description: 'Made direct amends to such people wherever possible, except when to do so would injure them or others.',
  },
  {
    number: 10,
    title: 'Continue inventory',
    description: 'Continued to take personal inventory and when we were wrong promptly admitted it.',
  },
  {
    number: 11,
    title: 'Seek conscious contact',
    description: 'Sought through prayer and meditation to improve our conscious contact with God as we understood Him.',
  },
  {
    number: 12,
    title: 'Carry the message',
    description: 'Having had a spiritual awakening as the result of these steps, we tried to carry this message to addicts.',
  },
];

// Animation delay per item for stagger effect
const getStaggerDelay = (index: number): number => 100 + index * 60;

// Current step pulse indicator component
function PulseIndicator({ color }: { color: string }): React.ReactElement {
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.6);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.pulseIndicator,
        { backgroundColor: color },
        pulseStyle,
      ]}
    />
  );
}

export function StepsOverviewScreen({ userId }: StepsOverviewScreenProps): React.ReactElement {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
  const { stepsCompleted, currentStep, overallProgress } = useStepProgress(userId);

  const isStepCompleted = (stepNumber: number): boolean => {
    return stepsCompleted.includes(stepNumber);
  };

  const isStepCurrent = (stepNumber: number): boolean => {
    return stepNumber === currentStep;
  };

  const handleStepPress = (stepNumber: number): void => {
    hapticSelection();
    navigation.navigate('StepDetail', { stepNumber });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['bottom']}
    >
      {/* Header with Progress */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(100)}
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surface,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.lg,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <Text
          style={[theme.typography.h1, { color: theme.colors.text }]}
          accessibilityRole="header"
        >
          The 12 Steps
        </Text>
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.textSecondary, marginTop: theme.spacing.xs },
          ]}
        >
          Your journey through recovery
        </Text>

        {/* Circular Progress Display */}
        <Animated.View
          entering={FadeIn.duration(600).delay(300)}
          style={styles.progressContainer}
        >
          <CircularProgress
            progress={overallProgress}
            size={100}
            strokeWidth={8}
            progressColor={theme.colors.success}
            trackColor={theme.colors.surfaceVariant}
            animated
            duration={1000}
            centerContent={
              <View style={styles.progressCenter}>
                <Text style={[styles.progressPercent, { color: theme.colors.success }]}>
                  {Math.round(overallProgress)}%
                </Text>
                <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
                  Complete
                </Text>
              </View>
            }
          />
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={[styles.statNumber, { color: theme.colors.success }]}>
                {stepsCompleted.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Steps Done
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.progressStat}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                {12 - stepsCompleted.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Remaining
              </Text>
            </View>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Steps List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingHorizontal: theme.spacing.md },
        ]}
        showsVerticalScrollIndicator={false}
        accessibilityRole="scrollbar"
        accessibilityLabel="12 Steps list"
      >
        {STEPS.map((step, index) => {
          const completed = isStepCompleted(step.number);
          const current = isStepCurrent(step.number);

          return (
            <Animated.View
              key={step.number}
              entering={FadeInRight.duration(400).delay(getStaggerDelay(index)).springify()}
              layout={Layout.springify()}
            >
              <TouchableOpacity
                onPress={() => handleStepPress(step.number)}
                activeOpacity={0.7}
                accessibilityLabel={`Step ${step.number}: ${step.title}`}
                accessibilityRole="button"
                accessibilityHint="Tap to view step questions and add your answers"
                accessibilityState={{ selected: current }}
              >
                <Card
                  variant="interactive"
                  style={[
                    { marginBottom: theme.spacing.md },
                    completed && {
                      backgroundColor: theme.colors.success + '10',
                    },
                    current && {
                      borderWidth: 2,
                      borderColor: theme.colors.primary,
                    },
                  ]}
                >
                  <View style={styles.stepCard}>
                    {/* Step Number Badge with Pulse for Current */}
                    <View style={styles.badgeContainer}>
                      {current && !completed && (
                        <PulseIndicator color={theme.colors.primary} />
                      )}
                      <Animated.View
                        entering={FadeIn.duration(300).delay(getStaggerDelay(index) + 100)}
                        style={[
                          styles.stepBadge,
                          {
                            backgroundColor: completed
                              ? theme.colors.success
                              : current
                              ? theme.colors.primary
                              : theme.colors.disabled,
                            width: 52,
                            height: 52,
                            borderRadius: 26,
                          },
                        ]}
                      >
                        {completed ? (
                          <MaterialCommunityIcons
                            name="check"
                            size={28}
                            color="#FFFFFF"
                          />
                        ) : (
                          <Text
                            style={[
                              theme.typography.h2,
                              {
                                color: current ? '#FFFFFF' : theme.colors.textSecondary,
                              },
                            ]}
                          >
                            {step.number}
                          </Text>
                        )}
                      </Animated.View>
                    </View>

                    {/* Step Content */}
                    <View style={[styles.stepContent, { marginLeft: theme.spacing.md }]}>
                      <View style={styles.stepHeader}>
                        <Text
                          style={[
                            theme.typography.h3,
                            { color: theme.colors.text, flex: 1 },
                          ]}
                          numberOfLines={2}
                        >
                          Step {step.number}: {step.title}
                        </Text>
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={24}
                          color={theme.colors.textSecondary}
                          style={{ marginLeft: theme.spacing.xs }}
                        />
                      </View>

                      {/* Current Step Badge */}
                      {current && !completed && (
                        <Animated.View
                          entering={FadeIn.duration(300).delay(getStaggerDelay(index) + 200)}
                          style={[
                            styles.currentBadge,
                            {
                              backgroundColor: theme.colors.primary + '20',
                              paddingHorizontal: theme.spacing.sm,
                              paddingVertical: theme.spacing.xs,
                              borderRadius: theme.radius.button,
                              marginTop: theme.spacing.xs,
                              alignSelf: 'flex-start',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              theme.typography.caption,
                              { color: theme.colors.primary, fontWeight: '600' },
                            ]}
                          >
                            Current Step
                          </Text>
                        </Animated.View>
                      )}

                      {/* Completed Badge */}
                      {completed && (
                        <Animated.View
                          entering={FadeIn.duration(300).delay(getStaggerDelay(index) + 200)}
                          style={[
                            styles.currentBadge,
                            {
                              backgroundColor: theme.colors.success + '20',
                              paddingHorizontal: theme.spacing.sm,
                              paddingVertical: theme.spacing.xs,
                              borderRadius: theme.radius.button,
                              marginTop: theme.spacing.xs,
                              alignSelf: 'flex-start',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              theme.typography.caption,
                              { color: theme.colors.success, fontWeight: '600' },
                            ]}
                          >
                            Completed
                          </Text>
                        </Animated.View>
                      )}

                      {/* Step Description */}
                      <Text
                        style={[
                          theme.typography.bodySmall,
                          {
                            color: theme.colors.textSecondary,
                            marginTop: theme.spacing.sm,
                            fontStyle: 'italic',
                            lineHeight: 20,
                          },
                        ]}
                        numberOfLines={3}
                      >
                        {step.description}
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Info Footer */}
        <Animated.View
          entering={FadeIn.duration(400).delay(getStaggerDelay(12))}
          style={[
            styles.infoCard,
            {
              backgroundColor: theme.colors.info + '15',
              padding: theme.spacing.md,
              borderRadius: theme.radius.card,
              marginTop: theme.spacing.md,
              marginBottom: theme.spacing.xl,
              flexDirection: 'row',
            },
          ]}
        >
          <MaterialCommunityIcons
            name="information"
            size={24}
            color={theme.colors.info}
            style={{ marginRight: theme.spacing.sm }}
          />
          <Text
            style={[
              theme.typography.bodySmall,
              {
                color: theme.colors.text,
                flex: 1,
                lineHeight: 20,
              },
            ]}
          >
            Tap on any step to begin your step work. Your progress is saved locally and encrypted for privacy.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    // Styles defined inline with theme
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  progressCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    fontSize: 22,
    fontWeight: '700',
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  progressStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 20,
  },
  progressStat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 16,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  badgeContainer: {
    position: 'relative',
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseIndicator: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  stepBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currentBadge: {
    // Styles defined inline with theme
  },
  infoCard: {
    // Styles defined inline with theme
  },
});
