import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useSponsorships } from '../hooks';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// TODO: Complete sponsor feature navigation integration
// import type { MainStackParamList } from '../../../navigation/types';
import type { MainTabParamList } from '../../../navigation/types';

type NavigationProp = NativeStackNavigationProp<MainTabParamList, 'Profile'>;

export function SponsorScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    mySponsor,
    mySponsees,
    pendingRequests,
    sentRequests,
    loading,
    acceptRequest,
    declineRequest,
    removeSponsor
  } = useSponsorships();

  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAccept = async (id: string) => {
    setProcessingId(id);
    try {
      await acceptRequest(id);
      Alert.alert('Success', 'Sponsor request accepted!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to accept');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (id: string) => {
    setProcessingId(id);
    try {
      await declineRequest(id);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to decline');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemove = (id: string, isSponsor: boolean) => {
    Alert.alert(
      'Confirm Remove',
      isSponsor ? 'Remove your sponsor?' : 'Remove this sponsee?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeSponsor(id);
              Alert.alert('Success', isSponsor ? 'Sponsor removed' : 'Sponsee removed');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sponsor Connections</Text>

      {/* My Sponsor Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Sponsor</Text>
        {mySponsor ? (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Connected</Text>
              <Text style={styles.cardSubtitle}>Active sponsor relationship</Text>
            </View>
            <TouchableOpacity
              style={styles.dangerButton}
              onPress={() => handleRemove(mySponsor.id, true)}
            >
              <Text style={styles.dangerButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No sponsor connected</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                // TODO: Implement sponsor invitation flow
                // navigation.navigate('InviteSponsor')
                Alert.alert('Coming Soon', 'Sponsor invitation feature is under development');
              }}
            >
              <Text style={styles.primaryButtonText}>Find a Sponsor</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Sent Requests */}
        {sentRequests.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pending Request</Text>
            <Text style={styles.cardSubtitle}>Waiting for sponsor to accept</Text>
          </View>
        )}
      </View>

      {/* Pending Requests (as potential sponsor) */}
      {pendingRequests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sponsorship Requests</Text>
          <FlatList
            data={pendingRequests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>New Request</Text>
                  <Text style={styles.cardSubtitle}>Someone wants you as their sponsor</Text>
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.secondaryButton, { marginRight: 8 }]}
                    onPress={() => handleDecline(item.id)}
                    disabled={processingId === item.id}
                  >
                    <Text style={styles.secondaryButtonText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => handleAccept(item.id)}
                    disabled={processingId === item.id}
                  >
                    <Text style={styles.primaryButtonText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}

      {/* My Sponsees */}
      {mySponsees.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Sponsees</Text>
          <FlatList
            data={mySponsees}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Sponsee Connected</Text>
                  <TouchableOpacity
                    onPress={() => {
                      // TODO: Implement shared entries view
                      // navigation.navigate('SharedEntries', { sponseeId: item.sponsee_id })
                      Alert.alert('Coming Soon', 'Shared entries view is under development');
                    }}
                  >
                    <Text style={styles.linkText}>View Shared Entries →</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.dangerButton}
                  onPress={() => handleRemove(item.id, false)}
                >
                  <Text style={styles.dangerButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
  },
  linkText: {
    fontSize: 14,
    color: '#6200ee',
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d32f2f',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  dangerButtonText: {
    color: '#d32f2f',
    fontSize: 14,
    fontWeight: '600',
  },
});
