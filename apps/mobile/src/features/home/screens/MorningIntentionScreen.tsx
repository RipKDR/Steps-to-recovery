import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Text } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { useCreateCheckIn } from '../hooks/useCheckIns';

interface MorningIntentionScreenProps {
  userId: string;
}

export function MorningIntentionScreen({ userId }: MorningIntentionScreenProps): React.ReactElement {
  const navigation = useNavigation();
  const { createCheckIn, isPending } = useCreateCheckIn(userId);

  const [intention, setIntention] = useState('');
  const [mood, setMood] = useState(3);

  const handleSubmit = async (): Promise<void> => {
    try {
      await createCheckIn({
        type: 'morning',
        intention: intention.trim(),
        mood,
      });
      navigation.goBack();
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text variant="headlineMedium" style={styles.title}>
          Morning Check-In
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Set your intention for today
        </Text>

        <TextInput
          mode="outlined"
          label="What's your intention for today?"
          value={intention}
          onChangeText={setIntention}
          multiline
          numberOfLines={4}
          style={styles.input}
          placeholder="I intend to stay present and grateful today..."
          accessibilityLabel="Daily intention"
          accessibilityRole="text"
        />

        <View style={styles.moodSection}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            How are you feeling right now?
          </Text>
          <Slider
            value={mood}
            onValueChange={setMood}
            minimumValue={1}
            maximumValue={5}
            step={1}
            minimumTrackTintColor="#2196f3"
            maximumTrackTintColor="#e0e0e0"
            style={styles.slider}
            accessibilityLabel={`Mood level: ${mood} out of 5`}
            accessibilityRole="adjustable"
          />
          <Text variant="bodyMedium" style={styles.moodLabel}>
            {['😢', '😔', '😐', '🙂', '😊'][mood - 1]}
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!intention.trim() || isPending}
          loading={isPending}
          style={styles.button}
          accessibilityLabel="Submit morning check-in"
          accessibilityRole="button"
        >
          Start My Day
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5e6',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
    marginBottom: 24,
  },
  input: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
  },
  moodSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  slider: {
    marginBottom: 12,
  },
  moodLabel: {
    textAlign: 'center',
    fontSize: 32,
  },
  button: {
    paddingVertical: 8,
  },
});
