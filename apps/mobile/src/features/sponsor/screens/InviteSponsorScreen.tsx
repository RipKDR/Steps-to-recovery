import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSponsorships } from '../hooks';

export function InviteSponsorScreen(): React.ReactElement {
  const navigation = useNavigation();
  const { sendRequest } = useSponsorships();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendRequest = async (): Promise<void> => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your sponsor\'s email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await sendRequest(email.trim().toLowerCase());
      Alert.alert(
        'Request Sent!',
        'Your sponsor request has been sent. They\'ll receive a notification to accept your request.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      setEmail('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send request';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.header}>Find a Sponsor</Text>
        <Text style={styles.description}>
          Enter your sponsor's email address to send them a connection request.
          They'll need to have an account in the app.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Sponsor's Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="sponsor@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            editable={!loading}
            accessibilityLabel="Sponsor email input"
            accessibilityHint="Enter your sponsor's email address"
          />
        </View>

        <TouchableOpacity
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={handleSendRequest}
          disabled={loading}
          accessibilityLabel="Send sponsor request"
          accessibilityRole="button"
          accessibilityState={{ disabled: loading }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Send Request</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
          accessibilityLabel="Cancel"
          accessibilityRole="button"
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            1. Enter your sponsor's email{'\n'}
            2. They'll receive your request{'\n'}
            3. Once accepted, you can share journal entries{'\n'}
            4. Only you control what gets shared
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#9e9e9e',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 24,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1565c0',
    lineHeight: 20,
  },
});
