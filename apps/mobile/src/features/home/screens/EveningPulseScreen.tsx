/**
 * Evening Pulse Check Screen
 * Daily reflection, mood tracking, and craving assessment
 */

import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, Text, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useCreateCheckIn, useTodayCheckIns } from '../hooks/useCheckIns';
import { useTheme } from '../../../design-system/hooks/useTheme';
import { TextArea, Button, Card, Toast } from '../../../design-system/components';
import { Slider } from '../../../components/Slider';

interface EveningPulseScreenProps {
  userId: string;
}

export function EveningPulseScreen({ userId }: EveningPulseScreenProps): React.ReactElement {
  const navigation = useNavigation();
  const theme = useTheme();
  const { createCheckIn, isPending } = useCreateCheckIn(userId);
  const { morning } = useTodayCheckIns(userId);

  const [reflection, setReflection] = useState('');
  const [mood, setMood] = useState(3);
  const [craving, setCraving] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');

  // Entrance animation
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
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSubmit = async (): Promise<void> => {
    try {
      await createCheckIn({
        type: 'evening',
        reflection: reflection.trim(),
        mood,
        craving,
      });

      // Haptic feedback on success
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Show success toast
      setToastMessage('Evening check-in complete! Rest well tonight.');
      setToastVariant('success');
      setShowToast(true);

      // Navigate back after toast
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (err) {
      setToastMessage('Failed to save check-in. Please try again.');
      setToastVariant('error');
      setShowToast(true);
    }
  };

  const moodEmojis = ['😢', '😔', '😐', '🙂', '😊'];
  const moodLabels = ['Very Low', 'Low', 'Okay', 'Good', 'Great'];

  const getCravingColor = (value: number): string => {
    if (value === 0) return theme.colors.success;
    if (value <= 3) return theme.colors.primary;
    if (value <= 6) return '#FF9800'; // Orange
    return theme.colors.danger;
  };

  const getCravingLabel = (value: number): string => {
    if (value === 0) return 'None';
    if (value <= 3) return 'Mild';
    if (value <= 6) return 'Moderate';
    return 'Strong';
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['bottom']}
    >
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Card */}
          <Card variant="flat" style={styles.headerCard}>
            <Text
              style={[
                theme.typography.largeTitle,
                { color: theme.colors.text, marginBottom: 4 },
              ]}
            >
              Good Evening
            </Text>
            <Text
              style={[
                theme.typography.body,
                { color: theme.colors.textSecondary },
              ]}
            >
              Reflect on your day
            </Text>
          </Card>

          {/* Morning Intention Reminder (if exists) */}
          {morning?.intention && (
            <Card
              variant="flat"
              style={[
                styles.intentionCard,
                { backgroundColor: theme.colors.primaryLight },
              ]}
            >
              <Text
                style={[
                  theme.typography.caption,
                  { color: theme.colors.primary, marginBottom: 4 },
                ]}
              >
                This morning's intention:
              </Text>
              <Text
                style={[
                  theme.typography.body,
                  { color: theme.colors.text, fontStyle: 'italic' },
                ]}
              >
                "{morning.intention}"
              </Text>
            </Card>
          )}

          {/* Reflection Input */}
          <TextArea
            label="How did your day go?"
            value={reflection}
            onChangeText={setReflection}
            placeholder="I stayed present during difficult moments..."
            minHeight={140}
            maxLength={500}
            showCharacterCount
            accessibilityLabel="Daily reflection"
            accessibilityHint="Reflect on your day"
          />

          {/* Mood Section */}
          <Card variant="flat" style={styles.sectionCard}>
            <Text
              style={[
                theme.typography.title3,
                { color: theme.colors.text, marginBottom: 4 },
              ]}
            >
              How are you feeling now?
            </Text>
            <Text
              style={[
                theme.typography.caption,
                { color: theme.colors.textSecondary, marginBottom: 20 },
              ]}
            >
              {moodLabels[mood - 1]}
            </Text>

            {/* Mood Emoji Display */}
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>
                {moodEmojis[mood - 1]}
              </Text>
            </View>

            {/* Slider */}
            <Slider
              value={mood}
              onValueChange={setMood}
              minimumValue={1}
              maximumValue={5}
              step={1}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.border}
              style={styles.slider}
              accessibilityLabel={`Mood level: ${moodLabels[mood - 1]}`}
              accessibilityRole="adjustable"
            />
          </Card>

          {/* Craving Level Section */}
          <Card variant="flat" style={styles.sectionCard}>
            <Text
              style={[
                theme.typography.title3,
                { color: theme.colors.text, marginBottom: 4 },
              ]}
            >
              Craving level
            </Text>
            <Text
              style={[
                theme.typography.caption,
                { color: theme.colors.textSecondary, marginBottom: 20 },
              ]}
            >
              {getCravingLabel(craving)} ({craving}/10)
            </Text>

            {/* Craving Value Display */}
            <View style={styles.emojiContainer}>
              <Text
                style={[
                  styles.cravingValue,
                  { color: getCravingColor(craving) },
                ]}
              >
                {craving}
              </Text>
            </View>

            {/* Slider */}
            <Slider
              value={craving}
              onValueChange={setCraving}
              minimumValue={0}
              maximumValue={10}
              step={1}
              minimumTrackTintColor={getCravingColor(craving)}
              maximumTrackTintColor={theme.colors.border}
              style={styles.slider}
              accessibilityLabel={`Craving level: ${getCravingLabel(craving)}, ${craving} out of 10`}
              accessibilityRole="adjustable"
            />

            {/* High Craving Warning */}
            {craving > 6 && (
              <View
                style={[
                  styles.warningContainer,
                  { backgroundColor: theme.colors.dangerLight },
                ]}
              >
                <Text
                  style={[
                    theme.typography.caption,
                    { color: theme.colors.danger },
                  ]}
                >
                  Consider reaching out to your sponsor or attending a meeting if cravings are strong.
                </Text>
              </View>
            )}
          </Card>

          {/* Submit Button */}
          <Button
            variant="primary"
            size="large"
            onPress={handleSubmit}
            disabled={!reflection.trim() || isPending}
            loading={isPending}
            accessibilityLabel="Submit evening check-in"
            accessibilityHint="Complete your evening check-in"
            style={styles.submitButton}
          >
            Complete Day
          </Button>
        </ScrollView>
      </Animated.View>

      {/* Toast Notification */}
      <Toast
        visible={showToast}
        message={toastMessage}
        variant={toastVariant}
        duration={3000}
        onDismiss={() => setShowToast(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  headerCard: {
    marginBottom: 24,
  },
  intentionCard: {
    marginBottom: 24,
    padding: 16,
  },
  sectionCard: {
    marginBottom: 24,
    padding: 20,
  },
  emojiContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 64,
  },
  cravingValue: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  slider: {
    height: 40,
  },
  warningContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  submitButton: {
    marginTop: 8,
  },
});
