import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Button, List, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/AuthContext';

export function ProfileScreen(): React.ReactElement {
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = React.useState(false);

  const handleSignOut = async (): Promise<void> => {
    setSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      // Error handled
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Card style={styles.card}>
          <Card.Content style={styles.userInfoContainer}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons name="account-circle" size={80} color="#2196f3" />
            </View>
            {user && (
              <Text variant="bodyLarge" style={styles.email}>
                {user.email}
              </Text>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              App Settings
            </Text>
            <List.Item
              title="Notifications"
              description="Coming in Phase 2"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              disabled
              accessibilityLabel="Notifications settings"
              accessibilityRole="button"
            />
            <Divider />
            <List.Item
              title="Privacy & Security"
              description="Coming in Phase 2"
              left={(props) => <List.Icon {...props} icon="shield-lock" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              disabled
              accessibilityLabel="Privacy and security settings"
              accessibilityRole="button"
            />
            <Divider />
            <List.Item
              title="Data Export"
              description="Coming in Phase 2"
              left={(props) => <List.Icon {...props} icon="download" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              disabled
              accessibilityLabel="Export data"
              accessibilityRole="button"
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Support & Resources
            </Text>
            <List.Item
              title="Emergency Support"
              description="Crisis hotlines and resources"
              left={(props) => <List.Icon {...props} icon="phone-alert" color="#d32f2f" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              disabled
              accessibilityLabel="Emergency support resources"
              accessibilityRole="button"
            />
            <Divider />
            <List.Item
              title="About"
              description="Version 0.1.0 (Phase 2 Alpha)"
              left={(props) => <List.Icon {...props} icon="information" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              disabled
              accessibilityLabel="About the app"
              accessibilityRole="button"
            />
          </Card.Content>
        </Card>

        <Card style={[styles.card, styles.privacyCard]}>
          <Card.Content>
            <View style={styles.privacyHeader}>
              <MaterialCommunityIcons name="lock" size={24} color="#4caf50" />
              <Text variant="titleMedium" style={styles.privacyTitle}>
                Your Privacy is Protected
              </Text>
            </View>
            <Text variant="bodyMedium" style={styles.privacyText}>
              All your journal entries and step work are encrypted with AES-256 encryption before being stored. Only you can decrypt and read your data.
            </Text>
          </Card.Content>
        </Card>

        <Button
          mode="outlined"
          onPress={handleSignOut}
          loading={signingOut}
          disabled={signingOut}
          style={styles.signOutButton}
          icon="logout"
          accessibilityLabel="Sign out"
          accessibilityRole="button"
        >
          Sign Out
        </Button>

        <Text variant="bodySmall" style={styles.footer}>
          Made with care for the recovery community
        </Text>
      </ScrollView>
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
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#ffffff',
  },
  userInfoContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  email: {
    color: '#666',
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  privacyCard: {
    backgroundColor: '#e8f5e9',
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  privacyTitle: {
    fontWeight: 'bold',
    color: '#2e7d32',
    marginLeft: 8,
  },
  privacyText: {
    color: '#1b5e20',
    lineHeight: 22,
  },
  signOutButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  footer: {
    textAlign: 'center',
    color: '#999',
    marginTop: 8,
  },
});
