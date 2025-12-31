import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CleanTimeTracker } from '../components/CleanTimeTracker';
import { DailyCheckInCard } from '../components/DailyCheckInCard';
import { QuickActions } from '../components/QuickActions';
import { SyncStatusIndicator } from '../components/SyncStatusIndicator';
import { useCleanTime } from '../hooks/useCleanTime';
import { useTodayCheckIns } from '../hooks/useCheckIns';

interface HomeScreenProps {
  userId: string;
}

export function HomeScreen({ userId }: HomeScreenProps): React.ReactElement {
  const navigation = useNavigation();
  const { days, hours, minutes, seconds, nextMilestone, isLoading: cleanTimeLoading } = useCleanTime(userId);
  const { morning, evening, isLoading: checkInsLoading } = useTodayCheckIns(userId);

  const handleEmergency = (): void => {
    navigation.navigate('Emergency' as never);
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          accessibilityRole="scrollbar"
          accessibilityLabel="Home screen content"
        >
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.headerText}>
              Welcome Back
            </Text>
          </View>

          <CleanTimeTracker
            days={days}
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            nextMilestone={nextMilestone}
            isLoading={cleanTimeLoading}
          />

          <SyncStatusIndicator />

          <DailyCheckInCard
            morningCheckIn={morning}
            eveningCheckIn={evening}
            isLoading={checkInsLoading}
            userId={userId}
          />

          <QuickActions userId={userId} />
        </ScrollView>
      </SafeAreaView>

      <FAB
        icon="phone-alert"
        label="Emergency"
        onPress={handleEmergency}
        style={styles.fab}
        color="#ffffff"
        accessibilityLabel="Emergency support button"
        accessibilityRole="button"
        accessibilityHint="Opens emergency support tools and resources"
      />
    </>
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
    paddingBottom: 100,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#d32f2f',
  },
});
