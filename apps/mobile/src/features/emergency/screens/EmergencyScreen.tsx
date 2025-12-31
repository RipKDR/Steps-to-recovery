import React from 'react';
import { ScrollView, StyleSheet, View, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface EmergencyScreenProps {
  userId: string;
}

const CRISIS_HOTLINES = [
  {
    name: 'National Suicide Prevention Lifeline',
    number: '988',
    description: '24/7 free and confidential support',
  },
  {
    name: 'SAMHSA National Helpline',
    number: '1-800-662-4357',
    description: 'Substance abuse treatment referral',
  },
  {
    name: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    description: 'Free 24/7 crisis support via text',
  },
];

export function EmergencyScreen({ userId }: EmergencyScreenProps): React.ReactElement {
  const handleCall = (number: string): void => {
    const phoneNumber = number.replace(/[^0-9]/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="phone-alert" size={64} color="#d32f2f" />
          <Text variant="headlineLarge" style={styles.title}>
            Emergency Support
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            You're not alone. Help is available 24/7.
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Crisis Hotlines
          </Text>
          {CRISIS_HOTLINES.map((hotline, index) => (
            <Card key={index} style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.hotlineName}>
                  {hotline.name}
                </Text>
                <Text variant="bodyMedium" style={styles.hotlineDescription}>
                  {hotline.description}
                </Text>
                <Button
                  mode="contained"
                  onPress={() => handleCall(hotline.number)}
                  style={styles.callButton}
                  icon="phone"
                  buttonColor="#d32f2f"
                  accessibilityLabel={`Call ${hotline.name}`}
                  accessibilityRole="button"
                >
                  {hotline.number}
                </Button>
              </Card.Content>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Grounding Techniques
          </Text>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.techniqueTitle}>
                5-4-3-2-1 Grounding
              </Text>
              <Text variant="bodyMedium" style={styles.techniqueStep}>
                <Text style={styles.bold}>5</Text> things you can see
              </Text>
              <Text variant="bodyMedium" style={styles.techniqueStep}>
                <Text style={styles.bold}>4</Text> things you can touch
              </Text>
              <Text variant="bodyMedium" style={styles.techniqueStep}>
                <Text style={styles.bold}>3</Text> things you can hear
              </Text>
              <Text variant="bodyMedium" style={styles.techniqueStep}>
                <Text style={styles.bold}>2</Text> things you can smell
              </Text>
              <Text variant="bodyMedium" style={styles.techniqueStep}>
                <Text style={styles.bold}>1</Text> thing you can taste
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.techniqueTitle}>
                Box Breathing
              </Text>
              <Text variant="bodyMedium" style={styles.techniqueDescription}>
                1. Breathe in for 4 seconds{'\n'}
                2. Hold for 4 seconds{'\n'}
                3. Breathe out for 4 seconds{'\n'}
                4. Hold for 4 seconds{'\n'}
                Repeat 4 times
              </Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Immediate Actions
          </Text>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="bodyMedium" style={styles.actionText}>
                • Remove yourself from triggering situations{'\n'}
                • Call your sponsor or a trusted friend{'\n'}
                • Attend a meeting (in-person or virtual){'\n'}
                • Journal your feelings{'\n'}
                • Practice deep breathing{'\n'}
                • Remember: This feeling is temporary
              </Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
    backgroundColor: '#ffffff',
  },
  hotlineName: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  hotlineDescription: {
    color: '#666',
    marginBottom: 12,
  },
  callButton: {
    marginTop: 8,
  },
  techniqueTitle: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  techniqueStep: {
    color: '#333',
    marginBottom: 6,
    lineHeight: 24,
  },
  techniqueDescription: {
    color: '#333',
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
    color: '#2196f3',
  },
  actionText: {
    color: '#333',
    lineHeight: 24,
  },
});
