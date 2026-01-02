/**
 * Steps Overview Screen
 * Displays all 12 steps with progress tracking
 * Design: iOS-style with interactive cards and clear visual hierarchy
 */

import React from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { StepsStackParamList } from '../../../navigation/types';
import { useTheme, Card, ProgressBar } from '../../../design-system';
import { useStepProgress } from '../hooks/useStepWork';
import { Text } from 'react-native';

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
    navigation.navigate('StepDetail', { stepNumber });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['bottom']}
    >
      {/* Header with Progress */}
      <View
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

        <View style={{ marginTop: theme.spacing.md }}>
          <View style={[styles.progressHeader, { marginBottom: theme.spacing.sm }]}>
            <Text
              style={[
                theme.typography.label,
                { color: theme.colors.textSecondary },
              ]}
            >
              Overall Progress
            </Text>
            <Text
              style={[
                theme.typography.labelLarge,
                { color: theme.colors.primary },
              ]}
            >
              {Math.round(overallProgress)}%
            </Text>
          </View>
          <ProgressBar
            progress={overallProgress / 100}
            color={theme.colors.success}
            backgroundColor={theme.colors.disabled}
            height={8}
          />
        </View>
      </View>

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
        {STEPS.map((step) => {
          const completed = isStepCompleted(step.number);
          const current = isStepCurrent(step.number);

          return (
            <TouchableOpacity
              key={step.number}
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
                  {/* Step Number Badge */}
                  <View
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
                      <View
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
                      </View>
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
          );
        })}

        {/* Info Footer */}
        <View
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
        </View>
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
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
