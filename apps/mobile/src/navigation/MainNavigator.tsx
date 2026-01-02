import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { JournalListScreen } from '../features/journal/screens/JournalListScreen';
import { JournalEditorScreen } from '../features/journal/screens/JournalEditorScreen';
import { MorningIntentionScreen } from '../features/home/screens/MorningIntentionScreen';
import { EveningPulseScreen } from '../features/home/screens/EveningPulseScreen';
import { EmergencyScreen } from '../features/emergency/screens/EmergencyScreen';
import { StepsOverviewScreen } from '../features/steps/screens/StepsOverviewScreen';
import { StepDetailScreen } from '../features/steps/screens/StepDetailScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { NotificationSettingsScreen } from '../features/settings/screens/NotificationSettingsScreen';
import { SponsorScreen } from '../features/sponsor/screens/SponsorScreen';
import { InviteSponsorScreen } from '../features/sponsor/screens/InviteSponsorScreen';
import { SharedEntriesScreen } from '../features/sponsor/screens/SharedEntriesScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const JournalStack = createNativeStackNavigator();
const StepsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function HomeStackNavigator(): React.ReactElement {
  const { user } = useAuth();
  const userId = user?.id || '';

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeMain"
        options={{ headerShown: false }}
      >
        {() => <HomeScreen userId={userId} />}
      </HomeStack.Screen>
      <HomeStack.Screen
        name="MorningIntention"
        options={{ title: 'Morning Intention', headerBackTitle: 'Back' }}
      >
        {() => <MorningIntentionScreen userId={userId} />}
      </HomeStack.Screen>
      <HomeStack.Screen
        name="EveningPulse"
        options={{ title: 'Evening Pulse Check', headerBackTitle: 'Back' }}
      >
        {() => <EveningPulseScreen userId={userId} />}
      </HomeStack.Screen>
      <HomeStack.Screen
        name="Emergency"
        options={{ title: 'Emergency Support', headerBackTitle: 'Back', presentation: 'modal' }}
      >
        {() => <EmergencyScreen userId={userId} />}
      </HomeStack.Screen>
    </HomeStack.Navigator>
  );
}

function JournalStackNavigator(): React.ReactElement {
  const { user } = useAuth();
  const userId = user?.id || '';

  return (
    <JournalStack.Navigator>
      <JournalStack.Screen
        name="JournalList"
        options={{ title: 'Journal' }}
      >
        {() => <JournalListScreen userId={userId} />}
      </JournalStack.Screen>
      <JournalStack.Screen
        name="JournalEditor"
        options={{ title: 'Journal Entry', headerBackTitle: 'Back' }}
      >
        {() => <JournalEditorScreen userId={userId} />}
      </JournalStack.Screen>
    </JournalStack.Navigator>
  );
}

function StepsStackNavigator(): React.ReactElement {
  const { user } = useAuth();
  const userId = user?.id || '';

  return (
    <StepsStack.Navigator>
      <StepsStack.Screen
        name="StepsOverview"
        options={{ title: '12 Steps' }}
      >
        {() => <StepsOverviewScreen userId={userId} />}
      </StepsStack.Screen>
      <StepsStack.Screen
        name="StepDetail"
        component={StepDetailScreen}
        options={({ route }) => ({
          title: `Step ${(route.params as { stepNumber: number }).stepNumber}`,
          headerBackTitle: 'Steps',
        })}
      />
    </StepsStack.Navigator>
  );
}

function ProfileStackNavigator(): React.ReactElement {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileHome"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <ProfileStack.Screen
        name="Sponsor"
        component={SponsorScreen}
        options={{ title: 'Sponsor', headerBackTitle: 'Back' }}
      />
      <ProfileStack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
        options={{ title: 'Notifications', headerBackTitle: 'Back' }}
      />
      <ProfileStack.Screen
        name="InviteSponsor"
        component={InviteSponsorScreen}
        options={{ title: 'Find a Sponsor', headerBackTitle: 'Back' }}
      />
      <ProfileStack.Screen
        name="SharedEntries"
        component={SharedEntriesScreen}
        options={{ title: 'Shared Entries', headerBackTitle: 'Back' }}
      />
    </ProfileStack.Navigator>
  );
}

export function MainNavigator(): React.ReactElement {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2196f3',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-variant" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Steps"
        component={StepsStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="stairs" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
