import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../../contexts/AuthContext';
import { useDatabase } from '../../../contexts/DatabaseContext';
import { Button } from '../../../components/Button';
import { theme } from '../../../utils/theme';
import { generateEncryptionKey } from '../../../utils/encryption';
import { formatDate } from '../../../utils/validation';
import { supabase } from '../../../lib/supabase';

export function OnboardingScreen() {
  const [sobrietyDate, setSobrietyDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { db, isReady } = useDatabase();

  const handleComplete = async () => {
    if (!user || !db || !isReady) {
      Alert.alert('Error', 'Please wait for initialization');
      return;
    }

    setLoading(true);

    try {
      // Generate encryption key
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

      // Save profile locally
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
    } catch (error: any) {
      Alert.alert('Setup Failed', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Your Recovery Journey</Text>
        <Text style={styles.subtitle}>
          This app is your private, secure companion for recovery. All your
          data is encrypted and stays on your device unless you choose to share.
        </Text>

        <View style={styles.section}>
          <Text style={styles.label}>When did your sobriety begin?</Text>
          <Button
            title={formatDate(sobrietyDate)}
            onPress={() => setShowDatePicker(true)}
            variant="outline"
          />
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={sobrietyDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setSobrietyDate(selectedDate);
              }
            }}
            maximumDate={new Date()}
          />
        )}

        <Button
          title="Complete Setup"
          onPress={handleComplete}
          loading={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontWeight: '600',
  },
});
