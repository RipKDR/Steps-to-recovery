import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Text, Slider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useCreateCheckIn, useTodayCheckIns } from '../hooks/useCheckIns';

interface EveningPulseScreenProps {
  userId: string;
}

export function EveningPulseScreen({ userId }: EveningPulseScreenProps): React.ReactElement {
  const navigation = useNavigation();
  const { createCheckIn, isPending } = useCreateCheckIn(userId);
  const { morning } = useTodayCheckIns(userId);

  const [reflection, setReflection] = useState('');
  const [mood, setMood] = useState(3);
  const [craving, setCraving] = useState(0);

  const handleSubmit = async (): Promise<void> => {
    try {
      await createCheckIn({
        type: 'evening',
        reflection: reflection.trim(),
        mood,
        craving,
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
          Evening Pulse Check
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Reflect on your day
        </Text>

        {morning && morning.intention && (
          <View style={styles.intentionReminder}>
            <Text variant="bodySmall" style={styles.reminderLabel}>
              This morning's intention:
            </Text>
            <Text variant="bodyMedium" style={styles.reminderText}>
              "{morning.intention}"
            </Text>
          </View>
        )}

        <TextInput
          mode="outlined"
          label="How did your day go?"
          value={reflection}
          onChangeText={setReflection}
          multiline
          numberOfLines={4}
          style={styles.input}
          placeholder="I stayed present during difficult moments..."
          accessibilityLabel="Daily reflection"
          accessibilityRole="text"
        />

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            How are you feeling now?
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
          <Text variant="bodyMedium" style={styles.label}>
            {['😢', '😔', '😐', '🙂', '😊'][mood - 1]}
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Craving level (0-10)
          </Text>
          <Slider
            value={craving}
            onValueChange={setCraving}
            minimumValue={0}
            maximumValue={10}
            step={1}
            minimumTrackTintColor={craving > 5 ? '#ff5722' : '#4caf50'}
            maximumTrackTintColor="#e0e0e0"
            style={styles.slider}
            accessibilityLabel={`Craving level: ${craving} out of 10`}
            accessibilityRole="adjustable"
          />
          <Text variant="bodyMedium" style={styles.label}>
            {craving}/10
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!reflection.trim() || isPending}
          loading={isPending}
          style={styles.button}
          accessibilityLabel="Submit evening check-in"
          accessibilityRole="button"
        >
          Complete Day
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8eaf6',
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
    marginBottom: 16,
  },
  intentionReminder: {
    backgroundColor: '#fff9c4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  reminderLabel: {
    color: '#666',
    marginBottom: 4,
  },
  reminderText: {
    fontStyle: 'italic',
    color: '#1a1a1a',
  },
  input: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  slider: {
    marginBottom: 12,
  },
  label: {
    textAlign: 'center',
    fontSize: 24,
  },
  button: {
    paddingVertical: 8,
    marginTop: 8,
  },
});
