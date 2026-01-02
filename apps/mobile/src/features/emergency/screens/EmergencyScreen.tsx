/**
 * Emergency Support Screen
 * CRITICAL: This screen must be immediately accessible for users in crisis
 * Design: Calming, clear visual hierarchy, large touch targets (≥48x48dp)
 * Accessibility: WCAG AAA compliant, high contrast, clear labels
 */

import React from 'react';
import { ScrollView, StyleSheet, View, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, Card, Button } from '../../../design-system';
import { Text } from 'react-native';

interface EmergencyScreenProps {
  userId: string;
}

interface CrisisHotline {
  name: string;
  number: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const CRISIS_HOTLINES: CrisisHotline[] = [
  {
    name: 'National Suicide Prevention Lifeline',
    number: '988',
    description: '24/7 free and confidential support',
    icon: 'phone-alert',
  },
  {
    name: 'SAMHSA National Helpline',
    number: '1-800-662-4357',
    description: 'Substance abuse treatment referral',
    icon: 'hospital-box',
  },
  {
    name: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    description: 'Free 24/7 crisis support via text',
    icon: 'message-text',
  },
];

export function EmergencyScreen({ userId }: EmergencyScreenProps): React.ReactElement {
  const theme = useTheme();

  const handleCall = (number: string): void => {
    const phoneNumber = number.replace(/[^0-9]/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['bottom']}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        accessibilityRole="scrollbar"
        accessibilityLabel="Emergency support resources"
      >
        {/* Header Section */}
        <View style={[styles.header, { paddingHorizontal: theme.spacing.lg }]}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.colors.danger + '20' },
            ]}
          >
            <MaterialCommunityIcons
              name="phone-alert"
              size={48}
              color={theme.colors.danger}
            />
          </View>
          <Text
            style={[
              theme.typography.h1,
              { color: theme.colors.text, textAlign: 'center', marginTop: theme.spacing.md },
            ]}
            accessibilityRole="header"
          >
            Emergency Support
          </Text>
          <Text
            style={[
              theme.typography.body,
              {
                color: theme.colors.textSecondary,
                textAlign: 'center',
                marginTop: theme.spacing.xs,
              },
            ]}
          >
            You're not alone. Help is available 24/7.
          </Text>
        </View>

        {/* Crisis Hotlines Section */}
        <View style={[styles.section, { paddingHorizontal: theme.spacing.md }]}>
          <Text
            style={[
              theme.typography.h2,
              { color: theme.colors.text, marginBottom: theme.spacing.md },
            ]}
            accessibilityRole="header"
          >
            Crisis Hotlines
          </Text>

          {CRISIS_HOTLINES.map((hotline, index) => (
            <Card
              key={index}
              variant="elevated"
              style={{ marginBottom: theme.spacing.md }}
            >
              <View style={styles.hotlineCard}>
                <View style={styles.hotlineIcon}>
                  <MaterialCommunityIcons
                    name={hotline.icon}
                    size={32}
                    color={theme.colors.danger}
                  />
                </View>
                <View style={styles.hotlineContent}>
                  <Text
                    style={[
                      theme.typography.h3,
                      { color: theme.colors.text, marginBottom: theme.spacing.xs },
                    ]}
                  >
                    {hotline.name}
                  </Text>
                  <Text
                    style={[
                      theme.typography.bodySmall,
                      { color: theme.colors.textSecondary, marginBottom: theme.spacing.md },
                    ]}
                  >
                    {hotline.description}
                  </Text>
                  <Button
                    title={hotline.number}
                    onPress={() => handleCall(hotline.number)}
                    variant="danger"
                    size="large"
                    fullWidth
                    icon={<MaterialCommunityIcons name="phone" size={20} color="#FFFFFF" />}
                    accessibilityLabel={`Call ${hotline.name} at ${hotline.number}`}
                    accessibilityHint="Initiates a phone call to crisis support"
                  />
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Grounding Techniques Section */}
        <View style={[styles.section, { paddingHorizontal: theme.spacing.md }]}>
          <Text
            style={[
              theme.typography.h2,
              { color: theme.colors.text, marginBottom: theme.spacing.md },
            ]}
            accessibilityRole="header"
          >
            Grounding Techniques
          </Text>

          {/* 5-4-3-2-1 Grounding */}
          <Card variant="elevated" style={{ marginBottom: theme.spacing.md }}>
            <Text
              style={[
                theme.typography.h3,
                { color: theme.colors.text, marginBottom: theme.spacing.sm },
              ]}
            >
              5-4-3-2-1 Grounding
            </Text>
            <Text
              style={[
                theme.typography.bodySmall,
                { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm },
              ]}
            >
              Use your senses to anchor yourself in the present moment:
            </Text>
            {[
              { count: '5', sense: 'things you can see' },
              { count: '4', sense: 'things you can touch' },
              { count: '3', sense: 'things you can hear' },
              { count: '2', sense: 'things you can smell' },
              { count: '1', sense: 'thing you can taste' },
            ].map((step, index) => (
              <View key={index} style={styles.techniqueStep}>
                <Text
                  style={[
                    theme.typography.labelLarge,
                    { color: theme.colors.primary, width: 28 },
                  ]}
                >
                  {step.count}
                </Text>
                <Text
                  style={[
                    theme.typography.body,
                    { color: theme.colors.text, flex: 1 },
                  ]}
                >
                  {step.sense}
                </Text>
              </View>
            ))}
          </Card>

          {/* Box Breathing */}
          <Card variant="elevated" style={{ marginBottom: theme.spacing.md }}>
            <Text
              style={[
                theme.typography.h3,
                { color: theme.colors.text, marginBottom: theme.spacing.sm },
              ]}
            >
              Box Breathing
            </Text>
            <Text
              style={[
                theme.typography.bodySmall,
                { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm },
              ]}
            >
              A simple breathing technique to calm your nervous system:
            </Text>
            {[
              'Breathe in for 4 seconds',
              'Hold for 4 seconds',
              'Breathe out for 4 seconds',
              'Hold for 4 seconds',
            ].map((instruction, index) => (
              <View key={index} style={styles.techniqueStep}>
                <Text
                  style={[
                    theme.typography.labelLarge,
                    { color: theme.colors.secondary, width: 28 },
                  ]}
                >
                  {index + 1}.
                </Text>
                <Text
                  style={[
                    theme.typography.body,
                    { color: theme.colors.text, flex: 1 },
                  ]}
                >
                  {instruction}
                </Text>
              </View>
            ))}
            <Text
              style={[
                theme.typography.bodySmall,
                { color: theme.colors.textSecondary, marginTop: theme.spacing.sm, fontStyle: 'italic' },
              ]}
            >
              Repeat this cycle 4 times
            </Text>
          </Card>
        </View>

        {/* Immediate Actions Section */}
        <View style={[styles.section, { paddingHorizontal: theme.spacing.md }]}>
          <Text
            style={[
              theme.typography.h2,
              { color: theme.colors.text, marginBottom: theme.spacing.md },
            ]}
            accessibilityRole="header"
          >
            Immediate Actions
          </Text>

          <Card variant="elevated" style={{ marginBottom: theme.spacing.xl }}>
            <Text
              style={[
                theme.typography.bodySmall,
                { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm },
              ]}
            >
              When you're feeling overwhelmed:
            </Text>
            {[
              'Remove yourself from triggering situations',
              'Call your sponsor or a trusted friend',
              'Attend a meeting (in-person or virtual)',
              'Journal your feelings',
              'Practice deep breathing',
              'Remember: This feeling is temporary',
            ].map((action, index) => (
              <View key={index} style={styles.actionItem}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={theme.colors.success}
                  style={{ marginRight: theme.spacing.sm }}
                />
                <Text
                  style={[
                    theme.typography.body,
                    { color: theme.colors.text, flex: 1 },
                  ]}
                >
                  {action}
                </Text>
              </View>
            ))}
          </Card>
        </View>

        {/* Safety Reminder */}
        <View style={[styles.reminderCard, {
          backgroundColor: theme.colors.success + '15',
          marginHorizontal: theme.spacing.md,
          marginBottom: theme.spacing.xl,
          padding: theme.spacing.md,
          borderRadius: theme.radius.card,
        }]}>
          <MaterialCommunityIcons
            name="shield-heart"
            size={28}
            color={theme.colors.success}
            style={{ marginBottom: theme.spacing.sm }}
          />
          <Text
            style={[
              theme.typography.label,
              { color: theme.colors.success, marginBottom: theme.spacing.xs },
            ]}
          >
            You are stronger than you know
          </Text>
          <Text
            style={[
              theme.typography.bodySmall,
              { color: theme.colors.text, textAlign: 'center', lineHeight: 20 },
            ]}
          >
            Every moment you choose recovery is a victory. This crisis will pass, and you have the tools to get through it.
          </Text>
        </View>
      </ScrollView>
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
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: 24,
  },
  hotlineCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hotlineIcon: {
    marginRight: 16,
    paddingTop: 4,
  },
  hotlineContent: {
    flex: 1,
  },
  techniqueStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reminderCard: {
    alignItems: 'center',
  },
});
