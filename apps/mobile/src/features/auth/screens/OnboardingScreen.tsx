import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDatabase } from '../../../contexts/DatabaseContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/Button';
import { theme } from '../../../utils/theme';
import { generateEncryptionKey } from '../../../utils/encryption';
import { formatDate, calculateDaysSober } from '../../../utils/validation';
import { supabase } from '../../../lib/supabase';

export function OnboardingScreen() {
  const [sobrietyDate, setSobrietyDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { db, isReady } = useDatabase();

  const daysSober = calculateDaysSober(sobrietyDate);

  const handleComplete = async () => {
    if (!user || !db || !isReady) {
      Alert.alert('Error', 'Please wait for initialization');
      return;
    }

    setLoading(true);

    try {
      // Generate encryption key for secure local storage
      await generateEncryptionKey();

      // Save profile to Supabase
      const { error: supabaseError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          sobriety_start_date: formatDate(sobrietyDate),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (supabaseError) throw supabaseError;

      // Save profile locally for offline access
      await db.runAsync(
        `INSERT INTO user_profile (id, email, sobriety_start_date, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?)`,
        [
          user.id,
          user.email || '',
          formatDate(sobrietyDate),
          new Date().toISOString(),
          new Date().toISOString(),
        ]
      );

      // Navigation will be handled by RootNavigator detecting profile exists
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Please try again';
      Alert.alert('Setup Failed', message);
    } finally {
      setLoading(false);
    }
  };

  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.welcomeEmoji}>🌱</Text>
          <Text style={styles.title}>Welcome to Your{'\n'}Recovery Journey</Text>
          <Text style={styles.subtitle}>
            This app is your private, secure companion for recovery. All your
            data is encrypted and stays on your device unless you choose to share.
          </Text>
        </View>

        <View style={styles.dateSection}>
          <Text style={styles.sectionTitle}>When did your sobriety begin?</Text>
          <Text style={styles.sectionHint}>
            This helps us celebrate your milestones with you
          </Text>

          <Button
            title={formatDisplayDate(sobrietyDate)}
            onPress={() => setShowDatePicker(true)}
            variant="outline"
            testID="date-picker-button"
          />

          {daysSober > 0 && (
            <View style={styles.streakCard}>
              <Text style={styles.streakNumber}>{daysSober}</Text>
              <Text style={styles.streakLabel}>
                {daysSober === 1 ? 'day' : 'days'} of recovery
              </Text>
              <Text style={styles.streakMessage}>
                {daysSober < 7
                  ? "Every day counts. You're doing great!"
                  : daysSober < 30
                    ? "Amazing progress! Keep going!"
                    : "Incredible dedication. You're an inspiration!"}
              </Text>
            </View>
          )}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={sobrietyDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              if (Platform.OS === 'android') {
                setShowDatePicker(false);
              }
              if (selectedDate) {
                setSobrietyDate(selectedDate);
              }
            }}
            maximumDate={new Date()}
            testID="date-picker"
          />
        )}

        {Platform.OS === 'ios' && showDatePicker && (
          <Button
            title="Done"
            onPress={() => setShowDatePicker(false)}
            variant="secondary"
            size="small"
          />
        )}

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>What you can do:</Text>
          <FeatureItem
            emoji="📓"
            title="Private Journaling"
            description="Write encrypted entries only you can read"
          />
          <FeatureItem
            emoji="📋"
            title="Step Work"
            description="Track your progress through the 12 steps"
          />
          <FeatureItem
            emoji="🤝"
            title="Sponsor Connection"
            description="Securely share selected entries with your sponsor"
          />
          <FeatureItem
            emoji="🔔"
            title="Reminders"
            description="Get gentle nudges to check in and reflect"
          />
        </View>

        <View style={styles.footer}>
          <Button
            title="Complete Setup"
            onPress={handleComplete}
            loading={loading}
            size="large"
            testID="complete-setup-button"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface FeatureItemProps {
  emoji: string;
  title: string;
  description: string;
}

function FeatureItem({ emoji, title, description }: FeatureItemProps) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureEmoji}>{emoji}</Text>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  welcomeEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing.md,
  },
  dateSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sectionHint: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  streakCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  streakLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  streakMessage: {
    ...theme.typography.caption,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  features: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  featuresTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  featureDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: theme.spacing.md,
  },
});
