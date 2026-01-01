/**
 * Navigation Ref
 * Provides navigation outside of React components (e.g., for notification handling)
 */

import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';
import type { RootStackParamList, MainTabParamList } from './types';

// Create a navigation ref that can be accessed anywhere
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Navigate to a specific screen
 * Use this for navigation from outside of React components
 */
export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.navigate({
        name,
        params,
      })
    );
  }
}

/**
 * Navigate to a main tab
 * Handles nested navigation to tabs within MainApp
 */
export function navigateToTab(tabName: keyof MainTabParamList) {
  if (navigationRef.isReady()) {
    // Navigate to MainApp with the specific tab
    navigationRef.dispatch(
      CommonActions.navigate({
        name: 'MainApp',
        params: {
          screen: tabName,
        },
      })
    );
  }
}

/**
 * Check if navigation is ready
 */
export function isNavigationReady(): boolean {
  return navigationRef.isReady();
}

/**
 * Map notification screen names to actual navigation actions
 */
export type NotificationScreen = 
  | 'journal'
  | 'checkin'
  | 'steps'
  | 'home'
  | 'profile'
  | 'meeting'
  | 'reading';

/**
 * Navigate based on notification data
 */
export function navigateFromNotification(screen?: NotificationScreen) {
  if (!screen) {
    // Default to home
    navigateToTab('Home');
    return;
  }

  switch (screen) {
    case 'journal':
      navigateToTab('Journal');
      break;
    case 'checkin':
      navigateToTab('Home'); // Check-in is typically on home screen
      break;
    case 'steps':
      navigateToTab('Steps');
      break;
    case 'home':
      navigateToTab('Home');
      break;
    case 'profile':
      navigateToTab('Profile');
      break;
    case 'meeting':
      navigateToTab('Home'); // Meetings accessed from home
      break;
    case 'reading':
      navigateToTab('Home'); // Daily reading on home
      break;
    default:
      navigateToTab('Home');
  }
}
