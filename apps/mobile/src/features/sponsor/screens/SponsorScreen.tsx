/**
 * Sponsor Connections Screen
 * Manages sponsor relationships and sponsee connections
 * Design: iOS-style with proper confirmation modals (no Alert dialogs)
 */

import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../../navigation/types';
import { useTheme, Card, Button, Modal } from '../../../design-system';
import { useSponsorships } from '../hooks';
import { Text } from 'react-native';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

interface ConfirmationState {
  visible: boolean;
  title: string;
  message: string;
  action: () => Promise<void>;
  variant: 'danger' | 'primary';
}

export function SponsorScreen(): React.ReactElement {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
  const {
    mySponsor,
    mySponsees,
    pendingRequests,
    sentRequests,
    loading,
    acceptRequest,
    declineRequest,
    removeSponsor,
  } = useSponsorships();

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    visible: false,
    title: '',
    message: '',
    action: async () => {},
    variant: 'primary',
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showConfirmation = (
    title: string,
    message: string,
    action: () => Promise<void>,
    variant: 'danger' | 'primary' = 'primary'
  ): void => {
    setConfirmation({
      visible: true,
      title,
      message,
      action,
      variant,
    });
  };

  const handleAccept = async (id: string): Promise<void> => {
    showConfirmation(
      'Accept Sponsorship',
      'Are you ready to take on this sponsorship responsibility?',
      async () => {
        setProcessingId(id);
        try {
          await acceptRequest(id);
          setSuccessMessage('Sponsorship request accepted!');
          setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
          // Error handled by hook
        } finally {
          setProcessingId(null);
        }
      }
    );
  };

  const handleDecline = async (id: string): Promise<void> => {
    showConfirmation(
      'Decline Request',
      'Are you sure you want to decline this sponsorship request?',
      async () => {
        setProcessingId(id);
        try {
          await declineRequest(id);
        } catch (error) {
          // Error handled by hook
        } finally {
          setProcessingId(null);
        }
      },
      'danger'
    );
  };

  const handleRemove = (id: string, isSponsor: boolean): void => {
    showConfirmation(
      isSponsor ? 'Remove Sponsor' : 'Remove Sponsee',
      isSponsor
        ? 'Are you sure you want to remove your sponsor? This will end your sponsorship relationship.'
        : 'Are you sure you want to remove this sponsee? This will end your sponsorship relationship with them.',
      async () => {
        try {
          await removeSponsor(id);
          setSuccessMessage(isSponsor ? 'Sponsor removed' : 'Sponsee removed');
          setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
          // Error handled by hook
        }
      },
      'danger'
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['bottom']}
      >
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[
              theme.typography.body,
              { color: theme.colors.textSecondary, marginTop: theme.spacing.md },
            ]}
          >
            Loading connections...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['bottom']}
      >
        <View style={[styles.content, { paddingHorizontal: theme.spacing.md }]}>
          {/* Header */}
          <View style={[styles.header, { marginBottom: theme.spacing.lg }]}>
            <Text
              style={[theme.typography.h1, { color: theme.colors.text }]}
              accessibilityRole="header"
            >
              Sponsor Connections
            </Text>
            <Text
              style={[
                theme.typography.body,
                { color: theme.colors.textSecondary, marginTop: theme.spacing.xs },
              ]}
            >
              Build and maintain recovery relationships
            </Text>
          </View>

          <FlatList
            data={[
              { type: 'my-sponsor' },
              { type: 'sent-requests' },
              { type: 'pending-requests' },
              { type: 'my-sponsees' },
            ]}
            keyExtractor={(item) => item.type}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              if (item.type === 'my-sponsor') {
                return (
                  <View style={{ marginBottom: theme.spacing.lg }}>
                    <Text
                      style={[
                        theme.typography.h3,
                        { color: theme.colors.text, marginBottom: theme.spacing.sm },
                      ]}
                      accessibilityRole="header"
                    >
                      My Sponsor
                    </Text>
                    {mySponsor ? (
                      <Card variant="elevated">
                        <View style={styles.cardHeader}>
                          <MaterialCommunityIcons
                            name="account-supervisor"
                            size={24}
                            color={theme.colors.primary}
                          />
                          <Text
                            style={[
                              theme.typography.h3,
                              { color: theme.colors.text, marginLeft: theme.spacing.sm },
                            ]}
                          >
                            Connected
                          </Text>
                        </View>
                        <Text
                          style={[
                            theme.typography.bodySmall,
                            { color: theme.colors.textSecondary, marginTop: theme.spacing.xs },
                          ]}
                        >
                          Active sponsor relationship
                        </Text>
                        <Button
                          title="Remove Sponsor"
                          onPress={() => handleRemove(mySponsor.id, true)}
                          variant="outline"
                          size="small"
                          style={{ marginTop: theme.spacing.md }}
                          textStyle={{ color: theme.colors.danger }}
                          accessibilityLabel="Remove your sponsor"
                          accessibilityHint="Ends your sponsorship relationship"
                        />
                      </Card>
                    ) : (
                      <Card variant="elevated">
                        <View style={styles.emptyState}>
                          <MaterialCommunityIcons
                            name="account-search"
                            size={48}
                            color={theme.colors.muted}
                            style={{ marginBottom: theme.spacing.sm }}
                          />
                          <Text
                            style={[
                              theme.typography.body,
                              { color: theme.colors.textSecondary, textAlign: 'center' },
                            ]}
                          >
                            No sponsor connected
                          </Text>
                          <Button
                            title="Find a Sponsor"
                            onPress={() => navigation.navigate('InviteSponsor')}
                            variant="primary"
                            size="medium"
                            style={{ marginTop: theme.spacing.md }}
                            accessibilityLabel="Find and invite a sponsor"
                            accessibilityHint="Navigate to sponsor invitation screen"
                          />
                        </View>
                      </Card>
                    )}
                  </View>
                );
              }

              if (item.type === 'sent-requests' && sentRequests.length > 0) {
                return (
                  <View style={{ marginBottom: theme.spacing.lg }}>
                    <Card variant="elevated">
                      <View style={styles.cardHeader}>
                        <MaterialCommunityIcons
                          name="clock-outline"
                          size={20}
                          color={theme.colors.warning}
                        />
                        <Text
                          style={[
                            theme.typography.label,
                            { color: theme.colors.warning, marginLeft: theme.spacing.sm },
                          ]}
                        >
                          Pending Request
                        </Text>
                      </View>
                      <Text
                        style={[
                          theme.typography.bodySmall,
                          { color: theme.colors.textSecondary, marginTop: theme.spacing.xs },
                        ]}
                      >
                        Waiting for sponsor to accept your request
                      </Text>
                    </Card>
                  </View>
                );
              }

              if (item.type === 'pending-requests' && pendingRequests.length > 0) {
                return (
                  <View style={{ marginBottom: theme.spacing.lg }}>
                    <Text
                      style={[
                        theme.typography.h3,
                        { color: theme.colors.text, marginBottom: theme.spacing.sm },
                      ]}
                      accessibilityRole="header"
                    >
                      Sponsorship Requests
                    </Text>
                    <FlatList
                      data={pendingRequests}
                      keyExtractor={(request) => request.id}
                      renderItem={({ item: request }) => (
                        <Card variant="elevated" style={{ marginBottom: theme.spacing.sm }}>
                          <View style={styles.cardHeader}>
                            <MaterialCommunityIcons
                              name="account-plus"
                              size={24}
                              color={theme.colors.secondary}
                            />
                            <Text
                              style={[
                                theme.typography.h3,
                                { color: theme.colors.text, marginLeft: theme.spacing.sm },
                              ]}
                            >
                              New Request
                            </Text>
                          </View>
                          <Text
                            style={[
                              theme.typography.bodySmall,
                              { color: theme.colors.textSecondary, marginTop: theme.spacing.xs },
                            ]}
                          >
                            Someone wants you as their sponsor
                          </Text>
                          <View style={[styles.buttonRow, { marginTop: theme.spacing.md }]}>
                            <Button
                              title="Decline"
                              onPress={() => handleDecline(request.id)}
                              variant="outline"
                              size="small"
                              disabled={processingId === request.id}
                              style={{ flex: 1, marginRight: theme.spacing.xs }}
                              accessibilityLabel="Decline sponsorship request"
                            />
                            <Button
                              title="Accept"
                              onPress={() => handleAccept(request.id)}
                              variant="secondary"
                              size="small"
                              disabled={processingId === request.id}
                              loading={processingId === request.id}
                              style={{ flex: 1, marginLeft: theme.spacing.xs }}
                              accessibilityLabel="Accept sponsorship request"
                            />
                          </View>
                        </Card>
                      )}
                    />
                  </View>
                );
              }

              if (item.type === 'my-sponsees' && mySponsees.length > 0) {
                return (
                  <View style={{ marginBottom: theme.spacing.xl }}>
                    <Text
                      style={[
                        theme.typography.h3,
                        { color: theme.colors.text, marginBottom: theme.spacing.sm },
                      ]}
                      accessibilityRole="header"
                    >
                      My Sponsees ({mySponsees.length})
                    </Text>
                    <FlatList
                      data={mySponsees}
                      keyExtractor={(sponsee) => sponsee.id}
                      renderItem={({ item: sponsee }) => (
                        <Card variant="interactive" style={{ marginBottom: theme.spacing.sm }}>
                          <View style={styles.cardHeader}>
                            <MaterialCommunityIcons
                              name="account-check"
                              size={24}
                              color={theme.colors.success}
                            />
                            <Text
                              style={[
                                theme.typography.h3,
                                { color: theme.colors.text, marginLeft: theme.spacing.sm },
                              ]}
                            >
                              Sponsee Connected
                            </Text>
                          </View>
                          <Button
                            title="View Shared Entries →"
                            onPress={() =>
                              navigation.navigate('SharedEntries', {
                                sponseeId: sponsee.sponsee_id,
                              })
                            }
                            variant="outline"
                            size="small"
                            style={{ marginTop: theme.spacing.md }}
                            accessibilityLabel="View shared journal entries from this sponsee"
                          />
                          <Button
                            title="Remove Sponsee"
                            onPress={() => handleRemove(sponsee.id, false)}
                            variant="outline"
                            size="small"
                            textStyle={{ color: theme.colors.danger }}
                            style={{ marginTop: theme.spacing.sm }}
                            accessibilityLabel="Remove this sponsee"
                            accessibilityHint="Ends your sponsorship relationship with this person"
                          />
                        </Card>
                      )}
                    />
                  </View>
                );
              }

              return null;
            }}
          />
        </View>

        {/* Success Message Toast */}
        {successMessage && (
          <View
            style={[
              styles.successToast,
              {
                backgroundColor: theme.colors.success,
                borderRadius: theme.radius.button,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
              },
            ]}
          >
            <MaterialCommunityIcons name="check-circle" size={20} color="#FFFFFF" />
            <Text
              style={[
                theme.typography.label,
                { color: '#FFFFFF', marginLeft: theme.spacing.sm },
              ]}
            >
              {successMessage}
            </Text>
          </View>
        )}
      </SafeAreaView>

      {/* Confirmation Modal */}
      <Modal
        visible={confirmation.visible}
        onClose={() => setConfirmation({ ...confirmation, visible: false })}
        title={confirmation.title}
        message={confirmation.message}
        variant="center"
        actions={[
          {
            title: 'Cancel',
            onPress: () => {},
            variant: 'outline',
            accessibilityLabel: 'Cancel action',
          },
          {
            title: 'Confirm',
            onPress: confirmation.action,
            variant: confirmation.variant === 'danger' ? 'danger' : 'primary',
            accessibilityLabel: 'Confirm action',
          },
        ]}
        dismissable
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  header: {
    // Spacing handled inline
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  successToast: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
