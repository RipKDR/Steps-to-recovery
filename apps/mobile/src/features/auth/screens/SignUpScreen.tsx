import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme, Input, Button } from '../../../design-system';
import { validateEmail, validatePassword } from '../../../utils/validation';
import type { AuthStackScreenProps } from '../../../navigation/types';

type Props = AuthStackScreenProps<'SignUp'>;

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function SignUpScreen({ navigation }: Props) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const { signUp } = useAuth();

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    const passwordValidation = validatePassword(password);
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      await signUp(email.trim().toLowerCase(), password);
      // After successful signup, user will be navigated to onboarding
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Please try again';
      Alert.alert('Sign Up Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, { marginBottom: theme.spacing.xl }]}>
            <Text style={[theme.typography.h1, { color: theme.colors.text, marginBottom: theme.spacing.sm }]}>
              Start Your Journey
            </Text>
            <Text style={[theme.typography.body, { color: theme.colors.textSecondary, lineHeight: 24 }]}>
              A private, secure space for your recovery
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                clearError('email');
              }}
              placeholder="your.email@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              error={errors.email}
              required
              testID="signup-email-input"
            />

            <Input
              ref={passwordRef}
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                clearError('password');
              }}
              placeholder="Create a strong password"
              secureTextEntry
              autoComplete="new-password"
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              error={errors.password}
              hint="At least 8 characters with uppercase, lowercase, and number"
              required
              testID="signup-password-input"
            />

            <Input
              ref={confirmPasswordRef}
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                clearError('confirmPassword');
              }}
              placeholder="Re-enter your password"
              secureTextEntry
              autoComplete="new-password"
              returnKeyType="done"
              onSubmitEditing={handleSignUp}
              error={errors.confirmPassword}
              required
              testID="signup-confirm-password-input"
            />

            <View style={[
              styles.privacyNotice,
              {
                backgroundColor: theme.colors.surface,
                padding: theme.spacing.md,
                borderRadius: theme.radius.md,
                marginVertical: theme.spacing.sm,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }
            ]}>
              <Text style={[styles.privacyIcon, { marginRight: theme.spacing.sm }]}>🔒</Text>
              <Text style={[theme.typography.caption, { flex: 1, color: theme.colors.textSecondary, lineHeight: 20 }]}>
                Your data is encrypted and never shared without your permission.
                We're committed to your privacy and security.
              </Text>
            </View>

            <Button
              title="Create Account"
              onPress={handleSignUp}
              loading={loading}
              testID="signup-submit-button"
            />
          </View>

          <View style={[styles.footer, { marginTop: theme.spacing.xl, paddingVertical: theme.spacing.md }]}>
            <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              accessibilityRole="link"
              accessibilityLabel="Navigate to login"
            >
              <Text style={[theme.typography.body, { color: theme.colors.primary, fontWeight: '600' }]}>
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginTop: 24,
  },
  form: {
    gap: 8,
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  privacyIcon: {
    fontSize: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
