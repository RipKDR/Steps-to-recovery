import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Slider } from '../../../components/Slider';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCreateJournalEntry, useUpdateJournalEntry, useJournalEntries } from '../hooks/useJournalEntries';
import { useTheme, Input, Button, Badge } from '../../../design-system';

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
  const theme = useTheme();
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Input
          label="Title (optional)"
          value={title}
          onChangeText={setTitle}
          placeholder="Give your entry a title"
          containerStyle={styles.inputContainer}
        />

        <View style={styles.bodyContainer}>
          <Text style={[theme.typography.label, { color: theme.colors.text, marginBottom: 8 }]}>
            Write your thoughts...
          </Text>
          <View
            style={[
              styles.bodyInputContainer,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.input,
              },
            ]}
          >
            <TextInput
              style={[
                styles.bodyInput,
                theme.typography.body,
                { color: theme.colors.text },
              ]}
              value={body}
              onChangeText={setBody}
              multiline
              placeholder="Share your thoughts, feelings, and progress..."
              placeholderTextColor={theme.colors.textSecondary}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.h3, { marginBottom: 12, fontWeight: '600', color: theme.colors.text }]}>
            How are you feeling? {mood !== null && MOOD_EMOJI[mood]}
          </Text>
          <View style={styles.sliderContainer}>
            <Slider
              value={mood || 3}
              onValueChange={setMood}
              minimumValue={1}
              maximumValue={5}
              step={1}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.border}
              accessibilityLabel={`Mood: ${mood !== null ? MOOD_LABELS[mood] : 'Not set'}`}
              accessibilityRole="adjustable"
            />
            <Text style={[theme.typography.caption, { textAlign: 'center', marginTop: 8, color: theme.colors.textSecondary }]}>
              {mood !== null ? MOOD_LABELS[mood] : 'Not set'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.h3, { marginBottom: 12, fontWeight: '600', color: theme.colors.text }]}>
            Craving level (0-10)
          </Text>
          <View style={styles.sliderContainer}>
            <Slider
              value={craving || 0}
              onValueChange={setCraving}
              minimumValue={0}
              maximumValue={10}
              step={1}
              minimumTrackTintColor={craving && craving > 5 ? theme.colors.danger : theme.colors.success}
              maximumTrackTintColor={theme.colors.border}
              accessibilityLabel={`Craving level: ${craving || 0} out of 10`}
              accessibilityRole="adjustable"
            />
            <Text style={[theme.typography.caption, { textAlign: 'center', marginTop: 8, color: theme.colors.textSecondary }]}>
              {craving || 0}/10
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.h3, { marginBottom: 12, fontWeight: '600', color: theme.colors.text }]}>
            Tags
          </Text>
          <View style={styles.tagInputContainer}>
            <Input
              label=""
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={handleAddTag}
              placeholder="Add a tag"
              containerStyle={styles.tagInputField}
            />
            <Button
              title="Add"
              onPress={handleAddTag}
              variant="primary"
              size="medium"
              style={styles.addTagButton}
            />
          </View>
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tagWrapper}>
                <Badge variant="primary" size="medium">
                  {tag}
                </Badge>
                <TouchableOpacity
                  onPress={() => handleRemoveTag(tag)}
                  style={styles.removeTagButton}
                  accessibilityLabel={`Remove tag ${tag}`}
                  accessibilityRole="button"
                >
                  <MaterialIcons name="close" size={16} color={theme.colors.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <Button
          title={isEditMode ? 'Update' : 'Save'}
          onPress={handleSave}
          disabled={!body.trim() || isPending}
          loading={isPending}
          variant="primary"
          fullWidth
        />
      </View>
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
    padding: 16,
  },
  inputContainer: {
    marginBottom: 0,
  },
  bodyContainer: {
    marginBottom: 16,
  },
  bodyInputContainer: {
    borderWidth: 2,
    padding: 16,
    minHeight: 200,
  },
  bodyInput: {
    flex: 1,
    padding: 0,
    minHeight: 168,
  },
  section: {
    marginBottom: 24,
  },
  sliderContainer: {
    paddingHorizontal: 8,
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
    alignItems: 'flex-start',
  },
  tagInputField: {
    flex: 1,
    marginBottom: 0,
  },
  addTagButton: {
    minWidth: 80,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  removeTagButton: {
    marginLeft: -8,
    marginTop: -8,
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
});
