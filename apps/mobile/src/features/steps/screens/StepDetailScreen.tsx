import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { STEP_PROMPTS } from '@repo/shared/constants';
import { useStepWork, useSaveStepAnswer } from '../hooks/useStepWork';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme, Card, Button, TextArea, ProgressBar, Badge, Toast, Divider, Text } from '../../../design-system';

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
  const theme = useTheme();

  const stepData = STEP_PROMPTS.find(s => s.step === stepNumber);
  const { questions, progress, isLoading } = useStepWork(userId, stepNumber);
  const { saveAnswer, isPending } = useSaveStepAnswer(userId);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [savingQuestion, setSavingQuestion] = useState<number | null>(null);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Initialize answers from database
  useEffect(() => {
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

      // Success feedback
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setToastMessage('Answer saved successfully');
      setToastVariant('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Failed to save answer. Please try again.');
      setToastVariant('error');
      setShowToast(true);
    } finally {
      setSavingQuestion(null);
    }
  }, [answers, saveAnswer, stepNumber]);

  if (!stepData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={theme.colors.danger} />
          <Text style={[theme.typography.h2, { color: theme.colors.text, marginTop: 16 }]}>
            Step not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: 16 }]}>
            Loading step {stepNumber}...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <Toast
        visible={showToast}
        message={toastMessage}
        variant={toastVariant}
        onDismiss={() => setShowToast(false)}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <Card variant="elevated" style={styles.headerCard}>
            <View style={styles.header}>
              <View style={[styles.stepBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.stepBadgeText}>{stepNumber}</Text>
              </View>
              <View style={styles.headerContent}>
                <Text style={[theme.typography.h2, { color: theme.colors.text, fontWeight: '600' }]}>
                  Step {stepNumber}: {stepData.title}
                </Text>
                <Badge variant="primary" size="medium" style={styles.principleBadge}>
                  {stepData.principle}
                </Badge>
              </View>
            </View>

            {/* Progress */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={[theme.typography.label, { color: theme.colors.textSecondary }]}>
                  Your Progress
                </Text>
                <Text style={[theme.typography.h3, { color: theme.colors.primary, fontWeight: '600' }]}>
                  {Math.round(progress)}%
                </Text>
              </View>
              <ProgressBar progress={progress / 100} style={styles.progressBar} />
            </View>
          </Card>

          {/* Description */}
          <Card variant="outlined" style={[styles.descriptionCard, { borderColor: theme.colors.primary }]}>
            <View style={styles.descriptionHeader}>
              <MaterialCommunityIcons name="lightbulb-outline" size={24} color={theme.colors.primary} />
              <Text style={[theme.typography.label, { color: theme.colors.primary, marginLeft: 8 }]}>
                STEP GUIDANCE
              </Text>
            </View>
            <Text style={[theme.typography.body, { color: theme.colors.text, lineHeight: 24, fontStyle: 'italic' }]}>
              "{stepData.description}"
            </Text>
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
                <Card key={questionNumber} variant="elevated" style={styles.questionCard}>
                  <View style={styles.questionHeader}>
                    <View
                      style={[
                        styles.questionNumber,
                        isAnswered
                          ? { backgroundColor: theme.colors.success }
                          : { backgroundColor: theme.colors.surface, borderWidth: 2, borderColor: theme.colors.border },
                      ]}
                    >
                      {isAnswered ? (
                        <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
                      ) : (
                        <Text style={[theme.typography.body, { color: theme.colors.textSecondary, fontWeight: '600' }]}>
                          {questionNumber}
                        </Text>
                      )}
                    </View>
                    <Text style={[theme.typography.h3, { color: theme.colors.text, flex: 1, lineHeight: 24 }]}>
                      {prompt}
                    </Text>
                  </View>

                  <Divider style={styles.questionDivider} />

                  <TextArea
                    label=""
                    value={answers[questionNumber] || ''}
                    onChangeText={(text) => setAnswers(prev => ({ ...prev, [questionNumber]: text }))}
                    placeholder="Take your time to reflect and write your answer here. Remember, this is a private space for your personal growth."
                    containerStyle={styles.answerTextArea}
                    minHeight={150}
                    maxLength={2000}
                    showCharacterCount
                    editable={!isSaving}
                    accessibilityLabel={`Answer for question ${questionNumber}`}
                  />

                  <Button
                    title={isSaving ? 'Saving...' : isAnswered ? 'Update Answer' : 'Save Answer'}
                    onPress={() => handleSaveAnswer(questionNumber)}
                    disabled={!answers[questionNumber]?.trim() || isSaving}
                    loading={isSaving}
                    variant="primary"
                    fullWidth
                  />
                </Card>
              );
            })}

            <Card variant="outlined" style={[styles.infoCard, { borderColor: theme.colors.success }]}>
              <View style={styles.infoContent}>
                <MaterialCommunityIcons name="lock" size={24} color={theme.colors.success} />
                <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginLeft: 12, flex: 1, lineHeight: 18 }]}>
                  Your answers are encrypted and stored securely on your device. Only you can read them. Your progress is private and safe.
                </Text>
              </View>
            </Card>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  animatedContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepBadgeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerContent: {
    flex: 1,
  },
  principleBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  progressSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
  },
  descriptionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 32,
  },
  questionCard: {
    marginBottom: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  questionNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  questionDivider: {
    marginBottom: 16,
  },
  answerTextArea: {
    marginBottom: 16,
  },
  infoCard: {
    marginTop: 8,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
