import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSync } from '../../../contexts/SyncContext';

export function SyncStatusIndicator() {
  const { isSyncing, lastSyncTime, pendingCount, error, isOnline, triggerSync } = useSync();

  // Determine sync status
  const getStatus = () => {
    if (!isOnline) {
      return {
        icon: 'cloud-off-outline' as const,
        color: '#9E9E9E', // Gray
        label: 'Offline',
        subtext: 'Sync paused',
      };
    }

    if (isSyncing) {
      return {
        icon: 'cloud-sync' as const,
        color: '#2196F3', // Blue
        label: 'Syncing...',
        subtext: `${pendingCount} item${pendingCount !== 1 ? 's' : ''}`,
      };
    }

    if (error) {
      return {
        icon: 'cloud-alert' as const,
        color: '#F44336', // Red
        label: 'Sync Error',
        subtext: 'Tap to retry',
      };
    }

    if (pendingCount > 0) {
      return {
        icon: 'cloud-upload-outline' as const,
        color: '#FF9800', // Orange
        label: `${pendingCount} Pending`,
        subtext: 'Tap to sync',
      };
    }

    return {
      icon: 'cloud-check' as const,
      color: '#4CAF50', // Green
      label: 'Synced',
      subtext: lastSyncTime ? formatSyncTime(lastSyncTime) : 'Never',
    };
  };

  const formatSyncTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const status = getStatus();

  const handlePress = () => {
    if (!isSyncing && isOnline) {
      triggerSync();
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      disabled={isSyncing || !isOnline}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {isSyncing ? (
          <ActivityIndicator size={20} color={status.color} />
        ) : (
          <MaterialCommunityIcons name={status.icon} size={20} color={status.color} />
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: status.color }]}>{status.label}</Text>
          <Text style={styles.subtext}>{status.subtext}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  subtext: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
});
