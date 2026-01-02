import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, ProgressBar, Button, ActivityIndicator } from 'react-native-paper';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { STEP_PROMPTS } from '@repo/shared/constants';
import { useStepWork, useSaveStepAnswer } from '../hooks/useStepWork';
import { useAuth } from '../../../contexts/AuthContext';

type RouteParams = {
  StepDetail: {
    stepNumber: number;
  };
};

export function StepDetailScreen(): React.ReactElement {
  const route = useRoute<RouteProp<RouteParams, 'StepDetail'>>();
  const { stepNumber } = route.params;
  const { user } = useAuth();
  const userId = user?.id || '';

  const stepData = STEP_PROMPTS.find(s => s.step === stepNumber);
  const { questions, progress, isLoading } = useStepWork(userId, stepNumber);
  const { saveAnswer, isPending } = useSaveStepAnswer(userId);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [savingQuestion, setSavingQuestion] = useState<number | null>(null);

  // Initialize answers from database
  React.useEffect(() => {
    if (questions.length > 0) {
      const initialAnswers: Record<number, string> = {};
      questions.forEach(q => {
        if (q.answer) {
          initialAnswers[q.question_number] = q.answer;
        }
      });
      setAnswers(initialAnswers);
    }
  }, [questions]);

  const handleSaveAnswer = useCallback(async (questionNumber: number) => {
    const answer = answers[questionNumber];
    if (!answer?.trim()) return;

    setSavingQuestion(questionNumber);
    try {
      await saveAnswer(stepNumber, questionNumber, answer, true);
    } catch (error) {
      // Error logged by hook
    } finally {
      setSavingQuestion(null);
    }
  }, [answers, saveAnswer, stepNumber]);

  if (!stepData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Step not found</Text>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196f3" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>{stepNumber}</Text>
          </View>
          <View style={styles.headerContent}>
            <Text variant="headlineSmall" style={styles.title}>
              Step {stepNumber}: {stepData.title}
            </Text>
            <Text variant="bodyMedium" style={styles.principle}>
              Principle: {stepData.principle}
            </Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <Text variant="bodyMedium" style={styles.progressText}>
            Progress: {Math.round(progress)}%
          </Text>
          <ProgressBar
            progress={progress / 100}
            color="#4caf50"
            style={styles.progressBar}
          />
        </View>

        {/* Description */}
        <Card style={styles.descriptionCard}>
          <Card.Content>
            <Text variant="bodyLarge" style={styles.description}>
              "{stepData.description}"
            </Text>
          </Card.Content>
        </Card>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Questions */}
          {stepData.prompts.map((prompt, index) => {
            const questionNumber = index + 1;
            const isAnswered = questions.find(q => q.question_number === questionNumber && q.is_complete);
            const isSaving = savingQuestion === questionNumber;

            return (
              <Card key={questionNumber} style={styles.questionCard}>
                <Card.Content>
                  <View style={styles.questionHeader}>
                    <View style={styles.questionNumber}>
                      {isAnswered ? (
                        <MaterialCommunityIcons name="check-circle" size={24} color="#4caf50" />
                      ) : (
                        <Text style={styles.questionNumberText}>{questionNumber}</Text>
                      )}
                    </View>
                    <Text variant="titleMedium" style={styles.questionText}>
                      {prompt}
                    </Text>
                  </View>

                  <TextInput
                    style={styles.answerInput}
                    value={answers[questionNumber] || ''}
                    onChangeText={(text) => setAnswers(prev => ({ ...prev, [questionNumber]: text }))}
                    placeholder="Write your answer here..."
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    editable={!isSaving}
                    accessibilityLabel={`Answer for question ${questionNumber}`}
                  />

                  <Button
                    mode="contained"
                    onPress={() => handleSaveAnswer(questionNumber)}
                    disabled={!answers[questionNumber]?.trim() || isSaving}
                    loading={isSaving}
                    style={styles.saveButton}
                    accessibilityLabel="Save answer"
                    accessibilityRole="button"
                  >
                    {isSaving ? 'Saving...' : isAnswered ? 'Update Answer' : 'Save Answer'}
                  </Button>
                </Card.Content>
              </Card>
            );
          })}

          <View style={styles.infoBox}>
            <MaterialCommunityIcons name="lock" size={20} color="#4caf50" style={styles.infoIcon} />
            <Text variant="bodySmall" style={styles.infoText}>
              Your answers are encrypted and stored securely on your device. Only you can read them.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  stepBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepBadgeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  principle: {
    color: '#2196f3',
    fontWeight: '600',
  },
  progressSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  progressText: {
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  descriptionCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#e3f2fd',
  },
  description: {
    fontStyle: 'italic',
    color: '#1565c0',
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  questionCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  questionNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  questionText: {
    flex: 1,
    color: '#1a1a1a',
    lineHeight: 24,
  },
  answerInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
    marginBottom: 12,
  },
  saveButton: {
    marginTop: 4,
  },
  infoBox: {
    marginTop: 8,
    padding: 16,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    color: '#2e7d32',
    lineHeight: 18,
  },
});
