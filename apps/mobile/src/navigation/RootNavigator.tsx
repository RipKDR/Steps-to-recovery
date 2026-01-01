import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { OnboardingScreen } from '../features/auth/screens/OnboardingScreen';
import { supabase } from '../lib/supabase';
import { navigationRef } from './navigationRef';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { user, loading: authLoading } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  const checkOnboardingStatus = useCallback(async () => {
    if (!user) {
      setCheckingProfile(false);
      return;
    }

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
      console.error('Error checking profile:', error);
      setNeedsOnboarding(true);
    } finally {
      setCheckingProfile(false);
    }
  }, [user]);

  useEffect(() => {
    checkOnboardingStatus();
  }, [checkOnboardingStatus]);

  // Re-check when user completes onboarding
  useEffect(() => {
    if (user && needsOnboarding) {
      const subscription = supabase
        .channel('profile_changes')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
          () => {
            setNeedsOnboarding(false);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user, needsOnboarding]);

  if (authLoading || checkingProfile) {
    return <LoadingSpinner message="Loading your journey..." />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animation: 'fade',
        }}
      >
        {!user ? (
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator}
            options={{ animationTypeForReplace: 'pop' }}
          />
        ) : needsOnboarding ? (
          <Stack.Screen 
            name="Onboarding" 
            component={OnboardingScreen}
          />
        ) : (
          <Stack.Screen 
            name="MainApp" 
            component={MainNavigator}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
