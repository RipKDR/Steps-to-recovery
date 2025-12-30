import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { OnboardingScreen } from '../features/auth/screens/OnboardingScreen';
import { supabase } from '../lib/supabase';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { user, loading } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = React.useState(false);
  const [checkingProfile, setCheckingProfile] = React.useState(true);

  React.useEffect(() => {
    async function checkOnboardingStatus() {
      if (user) {
        try {
          // Check if user has completed onboarding by querying profiles table
          const { data, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();

          if (error || !data) {
            // No profile found, needs onboarding
            setNeedsOnboarding(true);
          } else {
            // Profile exists, skip onboarding
            setNeedsOnboarding(false);
          }
        } catch (error) {
          // On error, assume needs onboarding
          setNeedsOnboarding(true);
        }
      }
      setCheckingProfile(false);
    }

    checkOnboardingStatus();
  }, [user]);

  if (loading || checkingProfile) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : needsOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="MainApp" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
