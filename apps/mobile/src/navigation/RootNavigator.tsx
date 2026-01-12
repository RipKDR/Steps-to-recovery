import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import { logger } from '../utils/logger';

const Stack = createNativeStackNavigator<RootStackParamList>();
let navigatorInstanceCounter = 0;

export function RootNavigator() {
  const { user, loading: authLoading, initialized: authInitialized } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const instanceIdRef = useRef<number | null>(null);
  if (instanceIdRef.current === null) {
    instanceIdRef.current = navigatorInstanceCounter++;
  }
  const instanceId = instanceIdRef.current;

  useEffect(() => {
    logger.info('RootNavigator mounted', { instanceId });
    return () => {
      logger.warn('RootNavigator unmounted', { instanceId });
    };
  }, [instanceId]);

  useEffect(() => {
    logger.info('Navigation auth state', {
      instanceId,
      hasUser: Boolean(user),
      authLoading,
      authInitialized,
      needsOnboarding,
      checkingProfile,
    });
  }, [user, authLoading, needsOnboarding, checkingProfile, authInitialized, instanceId]);

  const checkOnboardingStatus = useCallback(async () => {
    if (!user) {
      setCheckingProfile(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      logger.warn('Onboarding profile check timed out, falling back to onboarding');
      setNeedsOnboarding(true);
      setCheckingProfile(false);
    }, 8000);

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
      logger.error('Error checking profile', error);
      setNeedsOnboarding(true);
    } finally {
      clearTimeout(timeoutId);
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

  if ((!authInitialized && authLoading) || checkingProfile) {
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
