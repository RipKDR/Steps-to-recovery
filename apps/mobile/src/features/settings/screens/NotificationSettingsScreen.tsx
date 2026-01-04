/**
 * NotificationSettingsScreen - Manage Notification Preferences
 *
 * Allows users to:
 * - Enable/disable notifications
 * - Customize reminder times
 * - Send test notifications
 * - View scheduled notifications
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNotifications } from '../../../contexts/NotificationContext';
import {
  scheduleDailyReminders,
  cancelDailyReminders,
  sendTestNotification,
  getScheduledNotifications,
  DEFAULT_REMINDERS,
  type DailyReminderConfig,
} from '../../../services/notificationService';
import { logger } from '../../../utils/logger';

export function NotificationSettingsScreen() {
  const { permissionStatus, requestPermissions, notificationsEnabled, setNotificationsEnabled } =
    useNotifications();

  const [morningEnabled, setMorningEnabled] = useState(true);
  const [morningHour, setMorningHour] = useState(DEFAULT_REMINDERS.morning.hour);
  const [morningMinute, setMorningMinute] = useState(DEFAULT_REMINDERS.morning.minute);

  const [eveningEnabled, setEveningEnabled] = useState(true);
  const [eveningHour, setEveningHour] = useState(DEFAULT_REMINDERS.evening.hour);
  const [eveningMinute, setEveningMinute] = useState(DEFAULT_REMINDERS.evening.minute);

  const [scheduledCount, setScheduledCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const [showMorningTimePicker, setShowMorningTimePicker] = useState(false);
  const [showEveningTimePicker, setShowEveningTimePicker] = useState(false);

  /**
   * Load current notification count
   */
  useEffect(() => {
    loadScheduledNotifications();
  }, []);

  /**
   * Get scheduled notification count
   */
  const loadScheduledNotifications = async () => {
    const scheduled = await getScheduledNotifications();
    setScheduledCount(scheduled.length);
  };

  /**
   * Toggle master notification switch
   */
  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled && permissionStatus !== 'granted') {
      // Need to request permissions first
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive reminders.'
        );
        return;
      }
    }

    setNotificationsEnabled(enabled);

    if (enabled) {
      // Re-schedule daily reminders
      await applyReminderSettings();
    } else {
      // Cancel all reminders
      await cancelDailyReminders();
      await loadScheduledNotifications();
    }
  };

  /**
   * Apply current reminder settings
   */
  const applyReminderSettings = async () => {
    if (!notificationsEnabled) return;

    setIsUpdating(true);
    try {
      const morning: DailyReminderConfig = {
        enabled: morningEnabled,
        hour: morningHour,
        minute: morningMinute,
      };

      const evening: DailyReminderConfig = {
        enabled: eveningEnabled,
        hour: eveningHour,
        minute: eveningMinute,
      };

      await scheduleDailyReminders(morning, evening);
      await loadScheduledNotifications();

      Alert.alert('Success', 'Notification reminders updated!');
    } catch (error) {
      logger.error('Error updating reminders', { error });
      Alert.alert('Error', 'Failed to update notification reminders. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Send test notification
   */
  const handleSendTest = async () => {
    if (permissionStatus !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please enable notifications first to receive test notifications.'
      );
      return;
    }

    await sendTestNotification(
      '🔔 Test Notification',
      'This is how your check-in reminders will look!'
    );

    Alert.alert('Test Sent', 'You should receive a test notification in a moment.');
  };

  /**
   * Format time for display
   */
  const formatTime = (hour: number, minute: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const displayMinute = String(minute).padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
  };

  /**
   * Create a Date object from hour and minute for DateTimePicker
   */
  const createTimeDate = (hour: number, minute: number): Date => {
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(0);
    return date;
  };

  /**
   * Handle morning time change
   */
  const handleMorningTimeChange = (event: any, selectedDate?: Date): void => {
    if (Platform.OS === 'android') {
      setShowMorningTimePicker(false);
    }
    if (selectedDate) {
      setMorningHour(selectedDate.getHours());
      setMorningMinute(selectedDate.getMinutes());
    }
  };

  /**
   * Handle evening time change
   */
  const handleEveningTimeChange = (event: any, selectedDate?: Date): void => {
    if (Platform.OS === 'android') {
      setShowEveningTimePicker(false);
    }
    if (selectedDate) {
      setEveningHour(selectedDate.getHours());
      setEveningMinute(selectedDate.getMinutes());
    }
  };

  const permissionGranted = permissionStatus === 'granted';

  return (
    <ScrollView style={styles.container}>
      {/* Permission Status Banner */}
      {permissionStatus === 'denied' && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            ⚠️ Notifications are disabled in your device settings. Please enable them to receive
            reminders.
          </Text>
        </View>
      )}

      {/* Master Toggle */}
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <Text style={styles.sectionTitle}>Enable Notifications</Text>
            <Text style={styles.description}>
              Receive daily reminders for check-ins and milestone celebrations
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: '#ccc', true: '#4CAF50' }}
          />
        </View>
      </View>

      {/* Morning Reminder */}
      {notificationsEnabled && permissionGranted && (
        <>
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>🌅 Morning Check-In</Text>
                <Text style={styles.timeDisplay}>{formatTime(morningHour, morningMinute)}</Text>
              </View>
              <Switch
                value={morningEnabled}
                onValueChange={setMorningEnabled}
                trackColor={{ false: '#ccc', true: '#4CAF50' }}
              />
            </View>

            {morningEnabled && (
              <View style={styles.timePicker}>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowMorningTimePicker(!showMorningTimePicker)}
                  accessibilityLabel="Change morning reminder time"
                  accessibilityRole="button"
                  accessibilityHint="Opens time picker to customize morning check-in reminder"
                >
                  <Text style={styles.timeButtonText}>
                    {showMorningTimePicker ? '✓ Close Time Picker' : '🕐 Change Time'}
                  </Text>
                </TouchableOpacity>

                {showMorningTimePicker && (
                  <DateTimePicker
                    value={createTimeDate(morningHour, morningMinute)}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleMorningTimeChange}
                    testID="morning-time-picker"
                  />
                )}

                {Platform.OS === 'ios' && showMorningTimePicker && (
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => setShowMorningTimePicker(false)}
                    accessibilityLabel="Done selecting morning time"
                    accessibilityRole="button"
                  >
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Evening Reminder */}
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>🌙 Evening Check-In</Text>
                <Text style={styles.timeDisplay}>{formatTime(eveningHour, eveningMinute)}</Text>
              </View>
              <Switch
                value={eveningEnabled}
                onValueChange={setEveningEnabled}
                trackColor={{ false: '#ccc', true: '#4CAF50' }}
              />
            </View>

            {eveningEnabled && (
              <View style={styles.timePicker}>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowEveningTimePicker(!showEveningTimePicker)}
                  accessibilityLabel="Change evening reminder time"
                  accessibilityRole="button"
                  accessibilityHint="Opens time picker to customize evening check-in reminder"
                >
                  <Text style={styles.timeButtonText}>
                    {showEveningTimePicker ? '✓ Close Time Picker' : '🕐 Change Time'}
                  </Text>
                </TouchableOpacity>

                {showEveningTimePicker && (
                  <DateTimePicker
                    value={createTimeDate(eveningHour, eveningMinute)}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleEveningTimeChange}
                    testID="evening-time-picker"
                  />
                )}

                {Platform.OS === 'ios' && showEveningTimePicker && (
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => setShowEveningTimePicker(false)}
                    accessibilityLabel="Done selecting evening time"
                    accessibilityRole="button"
                  >
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Apply Button */}
          <TouchableOpacity
            style={[styles.button, isUpdating && styles.buttonDisabled]}
            onPress={applyReminderSettings}
            disabled={isUpdating}
          >
            <Text style={styles.buttonText}>
              {isUpdating ? 'Updating...' : 'Apply Settings'}
            </Text>
          </TouchableOpacity>

          {/* Test Notification */}
          <TouchableOpacity style={[styles.button, styles.testButton]} onPress={handleSendTest}>
            <Text style={styles.buttonText}>Send Test Notification</Text>
          </TouchableOpacity>

          {/* Scheduled Notifications Info */}
          <View style={styles.infoSection}>
            <Text style={styles.infoText}>
              📅 Scheduled notifications: {scheduledCount}
            </Text>
            <Text style={styles.infoSubtext}>
              Includes daily reminders and upcoming milestone celebrations
            </Text>
          </View>
        </>
      )}

      {/* Request Permission Button */}
      {!permissionGranted && permissionStatus === 'undetermined' && (
        <TouchableOpacity style={styles.button} onPress={requestPermissions}>
          <Text style={styles.buttonText}>Grant Notification Permission</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  banner: {
    backgroundColor: '#FFF3CD',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  bannerText: {
    color: '#856404',
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    flex: 1,
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  timeDisplay: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  timePicker: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  pickerNote: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  timeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  timeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testButton: {
    backgroundColor: '#2196F3',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1565C0',
    fontWeight: '500',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#1976D2',
    lineHeight: 18,
  },
});
