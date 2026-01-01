import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useStepProgress } from '../hooks/useStepWork';

interface StepsOverviewScreenProps {
  userId: string;
}

const STEPS = [
  { number: 1, title: 'Admit powerlessness', description: 'We admitted we were powerless over our addiction - that our lives had become unmanageable.' },
  { number: 2, title: 'Believe in a higher power', description: 'Came to believe that a Power greater than ourselves could restore us to sanity.' },
  { number: 3, title: 'Decide to turn will over', description: 'Made a decision to turn our will and our lives over to the care of God as we understood Him.' },
  { number: 4, title: 'Make a moral inventory', description: 'Made a searching and fearless moral inventory of ourselves.' },
  { number: 5, title: 'Admit wrongs', description: 'Admitted to God, to ourselves, and to another human being the exact nature of our wrongs.' },
  { number: 6, title: 'Be ready for change', description: 'Were entirely ready to have God remove all these defects of character.' },
  { number: 7, title: 'Ask for removal', description: 'Humbly asked Him to remove our shortcomings.' },
  { number: 8, title: 'Make a list', description: 'Made a list of all persons we had harmed, and became willing to make amends to them all.' },
  { number: 9, title: 'Make amends', description: 'Made direct amends to such people wherever possible, except when to do so would injure them or others.' },
  { number: 10, title: 'Continue inventory', description: 'Continued to take personal inventory and when we were wrong promptly admitted it.' },
  { number: 11, title: 'Seek conscious contact', description: 'Sought through prayer and meditation to improve our conscious contact with God as we understood Him.' },
  { number: 12, title: 'Carry the message', description: 'Having had a spiritual awakening as the result of these steps, we tried to carry this message to addicts.' },
];

export function StepsOverviewScreen({ userId }: StepsOverviewScreenProps): React.ReactElement {
  const { stepsCompleted, currentStep, overallProgress } = useStepProgress(userId);

  const isStepCompleted = (stepNumber: number): boolean => {
    return stepsCompleted.includes(stepNumber);
  };

  const isStepCurrent = (stepNumber: number): boolean => {
    return stepNumber === currentStep;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          The 12 Steps
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Your journey through recovery
        </Text>
        <View style={styles.progressContainer}>
          <Text variant="bodyMedium" style={styles.progressText}>
            Overall Progress: {Math.round(overallProgress)}%
          </Text>
          <ProgressBar
            progress={overallProgress / 100}
            color="#4caf50"
            style={styles.progressBar}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {STEPS.map((step) => {
          const completed = isStepCompleted(step.number);
          const current = isStepCurrent(step.number);

          return (
            <Card
              key={step.number}
              style={[
                styles.card,
                completed && styles.cardCompleted,
                current && styles.cardCurrent,
              ]}
            >
              <Card.Content style={styles.cardContent}>
                <View style={styles.stepHeader}>
                  <View
                    style={[
                      styles.stepNumber,
                      completed && styles.stepNumberCompleted,
                      current && styles.stepNumberCurrent,
                    ]}
                  >
                    {completed ? (
                      <MaterialCommunityIcons name="check" size={24} color="#ffffff" />
                    ) : (
                      <Text style={[styles.stepNumberText, current && styles.stepNumberTextCurrent]}>
                        {step.number}
                      </Text>
                    )}
                  </View>
                  <View style={styles.stepInfo}>
                    <Text variant="titleMedium" style={styles.stepTitle}>
                      Step {step.number}: {step.title}
                    </Text>
                    {current && !completed && (
                      <Text variant="bodySmall" style={styles.currentLabel}>
                        Current Step
                      </Text>
                    )}
                  </View>
                </View>
                <Text variant="bodyMedium" style={styles.stepDescription}>
                  {step.description}
                </Text>
              </Card.Content>
            </Card>
          );
        })}

        <View style={styles.footer}>
          <MaterialCommunityIcons name="information" size={20} color="#f57c00" style={styles.footerIcon} />
          <Text variant="bodySmall" style={styles.footerText}>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
    backgroundColor: '#ffffff',
  },
  cardCompleted: {
    backgroundColor: '#e8f5e9',
  },
  cardCurrent: {
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  cardContent: {
    padding: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberCompleted: {
    backgroundColor: '#4caf50',
  },
  stepNumberCurrent: {
    backgroundColor: '#2196f3',
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  stepNumberTextCurrent: {
    color: '#ffffff',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  currentLabel: {
    color: '#2196f3',
    marginTop: 2,
  },
  stepDescription: {
    color: '#666',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  footer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    marginRight: 12,
  },
  footerText: {
    color: '#1565c0',
    flex: 1,
    lineHeight: 20,
  },
});
