import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import type { MainTabParamList, MainTabScreenProps } from './types';

// Tab Icons (using emoji for now - replace with proper icons in production)
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const icons: Record<string, string> = {
    Home: '🏠',
    Journal: '📓',
    Steps: '📋',
    Profile: '👤',
  };
  
  return (
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      {icons[name] || '•'}
    </Text>
  );
};

// Home Screen
function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🌅</Text>
        <Text style={styles.screenTitle}>Dashboard</Text>
        <Text style={styles.comingSoon}>Coming in Phase 2</Text>
        <View style={styles.featurePreview}>
          <Text style={styles.featureText}>• Sobriety streak counter</Text>
          <Text style={styles.featureText}>• Daily check-in</Text>
          <Text style={styles.featureText}>• Milestone celebrations</Text>
          <Text style={styles.featureText}>• Quick journal access</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Journal Screen
function JournalScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.emoji}>📓</Text>
        <Text style={styles.screenTitle}>Journal</Text>
        <Text style={styles.comingSoon}>Coming in Phase 2</Text>
        <View style={styles.featurePreview}>
          <Text style={styles.featureText}>• Encrypted entries</Text>
          <Text style={styles.featureText}>• Mood tracking</Text>
          <Text style={styles.featureText}>• Tags & search</Text>
          <Text style={styles.featureText}>• Share with sponsor</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Steps Screen
function StepsScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.emoji}>📋</Text>
        <Text style={styles.screenTitle}>12 Steps</Text>
        <Text style={styles.comingSoon}>Coming in Phase 2</Text>
        <View style={styles.featurePreview}>
          <Text style={styles.featureText}>• Step work tracker</Text>
          <Text style={styles.featureText}>• Guided prompts</Text>
          <Text style={styles.featureText}>• Progress overview</Text>
          <Text style={styles.featureText}>• Notes & reflections</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Profile Screen
function ProfileScreen() {
  const { signOut, user } = useAuth();
  const [signingOut, setSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.emoji}>👤</Text>
        <Text style={styles.screenTitle}>Profile</Text>
        
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        )}

        <Text style={styles.comingSoon}>More features coming in Phase 2</Text>
        <View style={styles.featurePreview}>
          <Text style={styles.featureText}>• Sponsor connection</Text>
          <Text style={styles.featureText}>• Notification settings</Text>
          <Text style={styles.featureText}>• Data export</Text>
          <Text style={styles.featureText}>• Privacy controls</Text>
        </View>

        <View style={styles.signOutContainer}>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="outline"
            loading={signingOut}
            testID="sign-out-button"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Journal" 
        component={JournalScreen}
        options={{ title: 'Journal' }}
      />
      <Tab.Screen 
        name="Steps" 
        component={StepsScreen}
        options={{ title: 'Steps' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  emoji: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  screenTitle: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  comingSoon: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.lg,
  },
  featurePreview: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  featureText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  userInfo: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  userEmail: {
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
  },
  signOutContainer: {
    marginTop: theme.spacing.xl,
    width: '100%',
  },
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.xs,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
  },
  tabIcon: {
    fontSize: 24,
  },
  tabIconFocused: {
    transform: [{ scale: 1.1 }],
  },
  header: {
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
});
