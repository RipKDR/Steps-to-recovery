import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Chip, Text } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCreateJournalEntry, useUpdateJournalEntry, useJournalEntries } from '../hooks/useJournalEntries';

const MOOD_LABELS: Record<number, string> = {
  1: 'Very Sad',
  2: 'Sad',
  3: 'Neutral',
  4: 'Good',
  5: 'Great',
};

const MOOD_EMOJI: Record<number, string> = {
  1: '😢',
  2: '😔',
  3: '😐',
  4: '🙂',
  5: '😊',
};

interface JournalEditorScreenProps {
  userId: string;
}

export function JournalEditorScreen({ userId }: JournalEditorScreenProps): React.ReactElement {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as { mode?: 'create' | 'edit'; entryId?: string } | undefined;

  const { entries } = useJournalEntries(userId);
  const { createEntry, isPending: isCreating } = useCreateJournalEntry(userId);
  const { updateEntry, isPending: isUpdating } = useUpdateJournalEntry(userId);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState<number | null>(3);
  const [craving, setCraving] = useState<number | null>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const isEditMode = params?.mode === 'edit';
  const entryId = params?.entryId;

  useEffect(() => {
    if (isEditMode && entryId) {
      const entry = entries.find(e => e.id === entryId);
      if (entry) {
        setTitle(entry.title || '');
        setBody(entry.body);
        setMood(entry.mood);
        setCraving(entry.craving);
        setTags(entry.tags);
      }
    }
  }, [isEditMode, entryId, entries]);

  const handleAddTag = (): void => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string): void => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = async (): Promise<void> => {
    if (!body.trim()) return;

    try {
      if (isEditMode && entryId) {
        await updateEntry(entryId, { title: title.trim() || null, body: body.trim(), mood, craving, tags });
      } else {
        await createEntry({ title: title.trim() || null, body: body.trim(), mood, craving, tags });
      }
      navigation.goBack();
    } catch (err) {
      // Error handled by hook
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <TextInput
          mode="outlined"
          label="Title (optional)"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          accessibilityLabel="Journal entry title"
          accessibilityRole="text"
        />

        <TextInput
          mode="outlined"
          label="Write your thoughts..."
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={10}
          style={[styles.input, styles.bodyInput]}
          accessibilityLabel="Journal entry body"
          accessibilityRole="text"
        />

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            How are you feeling? {mood !== null && MOOD_EMOJI[mood]}
          </Text>
          <View style={styles.sliderContainer}>
            <Slider
              value={mood || 3}
              onValueChange={setMood}
              minimumValue={1}
              maximumValue={5}
              step={1}
              minimumTrackTintColor="#2196f3"
              maximumTrackTintColor="#e0e0e0"
              accessibilityLabel={`Mood: ${mood !== null ? MOOD_LABELS[mood] : 'Not set'}`}
              accessibilityRole="adjustable"
            />
            <Text variant="bodySmall" style={styles.sliderLabel}>
              {mood !== null ? MOOD_LABELS[mood] : 'Not set'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Craving level (0-10)
          </Text>
          <View style={styles.sliderContainer}>
            <Slider
              value={craving || 0}
              onValueChange={setCraving}
              minimumValue={0}
              maximumValue={10}
              step={1}
              minimumTrackTintColor={craving && craving > 5 ? '#ff5722' : '#4caf50'}
              maximumTrackTintColor="#e0e0e0"
              accessibilityLabel={`Craving level: ${craving || 0} out of 10`}
              accessibilityRole="adjustable"
            />
            <Text variant="bodySmall" style={styles.sliderLabel}>
              {craving || 0}/10
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Tags
          </Text>
          <View style={styles.tagInputContainer}>
            <TextInput
              mode="outlined"
              label="Add tag"
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={handleAddTag}
              style={styles.tagInput}
              accessibilityLabel="Add tag"
              accessibilityRole="text"
            />
            <Button mode="contained" onPress={handleAddTag} style={styles.addTagButton}>
              Add
            </Button>
          </View>
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                onClose={() => handleRemoveTag(tag)}
                style={styles.tag}
                accessibilityLabel={`Tag: ${tag}`}
                accessibilityRole="button"
              >
                {tag}
              </Chip>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleSave}
          disabled={!body.trim() || isPending}
          loading={isPending}
          style={styles.saveButton}
          accessibilityLabel={isEditMode ? 'Update entry' : 'Save entry'}
          accessibilityRole="button"
        >
          {isEditMode ? 'Update' : 'Save'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  bodyInput: {
    minHeight: 200,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  sliderContainer: {
    paddingHorizontal: 8,
  },
  sliderLabel: {
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  addTagButton: {
    justifyContent: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e3f2fd',
  },
  footer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    paddingVertical: 6,
  },
});
