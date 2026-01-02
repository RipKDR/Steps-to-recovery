/**
 * Invite Sponsor Screen
 * Send sponsor connection request via email
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSponsorships } from '../hooks';
import { useTheme } from '../../../design-system/hooks/useTheme';
import { Input, Button, Card, Modal, Toast } from '../../../design-system/components';
import type { ModalAction } from '../../../design-system/components';

export function InviteSponsorScreen(): React.ReactElement {
  const navigation = useNavigation();
  const theme = useTheme();
  const { sendRequest } = useSponsorships();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const validateEmail = (emailAddress: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAddress);
  };

  const handleSendRequest = async (): Promise<void> => {
    // Validation
    if (!email.trim()) {
      setEmailError('Email address is required');
      return;
    }

    if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setLoading(true);

    try {
      await sendRequest(email.trim().toLowerCase());
      setShowSuccessModal(true);
      setEmail(''); // Clear form
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send request';
      setErrorMessage(message);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = (): void => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  const successActions: ModalAction[] = [
    {
      label: 'Done',
      onPress: handleSuccessModalClose,
      style: 'primary',
    },
  ];

  const errorActions: ModalAction[] = [
    {
      label: 'OK',
      onPress: () => setShowErrorModal(false),
      style: 'primary',
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['bottom']}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[
                theme.typography.largeTitle,
                { color: theme.colors.text, marginBottom: 8 },
              ]}
            >
              Find a Sponsor
            </Text>
            <Text
              style={[
                theme.typography.body,
                { color: theme.colors.textSecondary, lineHeight: 22 },
              ]}
            >
              Enter your sponsor's email address to send them a connection request.
              They'll need to have an account in the app.
            </Text>
          </View>

          {/* Email Input */}
          <Input
            label="Sponsor's Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(''); // Clear error on change
            }}
            error={emailError}
            placeholder="sponsor@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            editable={!loading}
            accessibilityLabel="Sponsor email input"
            accessibilityHint="Enter your sponsor's email address"
          />

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              variant="primary"
              size="large"
              onPress={handleSendRequest}
              disabled={loading}
              loading={loading}
              accessibilityLabel="Send sponsor request"
              style={styles.button}
            >
              Send Request
            </Button>

            <Button
              variant="secondary"
              size="large"
              onPress={() => navigation.goBack()}
              disabled={loading}
              accessibilityLabel="Cancel"
              style={styles.button}
            >
              Cancel
            </Button>
          </View>

          {/* Info Card */}
          <Card
            variant="flat"
            style={[
              styles.infoCard,
              { backgroundColor: theme.colors.primaryLight },
            ]}
          >
            <Text
              style={[
                theme.typography.title3,
                { color: theme.colors.primary, marginBottom: 12 },
              ]}
            >
              How it works:
            </Text>
            <View style={styles.infoList}>
              <InfoItem theme={theme} text="Enter your sponsor's email" />
              <InfoItem theme={theme} text="They'll receive your request" />
              <InfoItem theme={theme} text="Once accepted, you can share journal entries" />
              <InfoItem theme={theme} text="Only you control what gets shared" />
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        title="Request Sent!"
        message="Your sponsor request has been sent. They'll receive a notification to accept your request."
        actions={successActions}
        variant="center"
        onClose={handleSuccessModalClose}
      />

      {/* Error Modal */}
      <Modal
        visible={showErrorModal}
        title="Error"
        message={errorMessage}
        actions={errorActions}
        variant="center"
        onClose={() => setShowErrorModal(false)}
      />

      {/* Toast (for non-critical feedback) */}
      <Toast
        visible={showToast}
        message="Request sent successfully"
        variant="success"
        duration={2000}
        onDismiss={() => setShowToast(false)}
      />
    </SafeAreaView>
  );
}

// Info List Item Component
function InfoItem({ theme, text }: { theme: any; text: string }): React.ReactElement {
  return (
    <View style={styles.infoItem}>
      <Text
        style={[
          theme.typography.body,
          { color: theme.colors.primary },
        ]}
      >
        • {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    marginBottom: 12,
  },
  infoCard: {
    padding: 20,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    paddingVertical: 4,
  },
});
