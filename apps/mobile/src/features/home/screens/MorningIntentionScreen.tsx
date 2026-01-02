/**
 * Morning Check-In Screen
 * Daily intention setting and mood tracking
 */

import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, Text, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useCreateCheckIn } from '../hooks/useCheckIns';
import { useTheme } from '../../../design-system/hooks/useTheme';
import { TextArea, Button, Card, Toast } from '../../../design-system/components';
import { Slider } from '../../../components/Slider';

interface MorningIntentionScreenProps {
  userId: string;
}

export function MorningIntentionScreen({ userId }: MorningIntentionScreenProps): React.ReactElement {
  const navigation = useNavigation();
  const theme = useTheme();
  const { createCheckIn, isPending } = useCreateCheckIn(userId);

  const [intention, setIntention] = useState('');
  const [mood, setMood] = useState(3);
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
        type: 'morning',
        intention: intention.trim(),
        mood,
      });

      // Haptic feedback on success
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Show success toast
      setToastMessage('Morning check-in complete! Have a great day.');
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
              Good Morning
            </Text>
            <Text
              style={[
                theme.typography.body,
                { color: theme.colors.textSecondary },
              ]}
            >
              Set your intention for today
            </Text>
          </Card>

          {/* Intention Input */}
          <TextArea
            label="Today's Intention"
            value={intention}
            onChangeText={setIntention}
            placeholder="I intend to stay present and grateful today..."
            minHeight={140}
            maxLength={500}
            showCharacterCount
            accessibilityLabel="Daily intention"
            accessibilityHint="Enter your intention for the day"
          />

          {/* Mood Section */}
          <Card variant="flat" style={styles.moodCard}>
            <Text
              style={[
                theme.typography.title3,
                { color: theme.colors.text, marginBottom: 4 },
              ]}
            >
              How are you feeling right now?
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
            <View style={styles.moodEmojiContainer}>
              <Text style={styles.moodEmoji}>
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

          {/* Submit Button */}
          <Button
            variant="primary"
            size="large"
            onPress={handleSubmit}
            disabled={!intention.trim() || isPending}
            loading={isPending}
            accessibilityLabel="Submit morning check-in"
            accessibilityHint="Complete your morning check-in and start your day"
            style={styles.submitButton}
          >
            Start My Day
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
  moodCard: {
    marginBottom: 24,
    padding: 20,
  },
  moodEmojiContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  moodEmoji: {
    fontSize: 64,
  },
  slider: {
    height: 40,
  },
  submitButton: {
    marginTop: 8,
  },
});
