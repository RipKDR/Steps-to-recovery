import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

// Placeholder screens (will be replaced in Phase 2+)
function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Home - Coming in Phase 2</Text>
      <Text style={styles.subtext}>Dashboard with sobriety streak</Text>
    </View>
  );
}

function JournalScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Journal - Coming in Phase 2</Text>
      <Text style={styles.subtext}>Encrypted journaling</Text>
    </View>
  );
}

function StepsScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Steps - Coming in Phase 2</Text>
      <Text style={styles.subtext}>12-step work tracker</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Profile - Coming in Phase 2</Text>
      <Text style={styles.subtext}>Settings and sponsor connection</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerShown: true,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Steps" component={StepsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  text: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  subtext: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});
