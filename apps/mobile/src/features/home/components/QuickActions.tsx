import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface QuickActionsProps {
  userId: string;
}

interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  screen: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'journal',
    title: 'Journal',
    icon: 'book-open-variant',
    color: '#2196f3',
    screen: 'JournalList',
  },
  {
    id: 'steps',
    title: 'Step Work',
    icon: 'stairs',
    color: '#9c27b0',
    screen: 'StepsOverview',
  },
  {
    id: 'emergency',
    title: 'Emergency',
    icon: 'phone-alert',
    color: '#d32f2f',
    screen: 'Emergency',
  },
  {
    id: 'resources',
    title: 'Resources',
    icon: 'book-heart',
    color: '#ff9800',
    screen: 'Resources',
  },
];

export function QuickActions({ userId }: QuickActionsProps): React.ReactElement {
  const navigation = useNavigation();

  const handleActionPress = (screen: string): void => {
    navigation.navigate(screen as never, { userId } as never);
  };

  return (
    <Card style={styles.card} accessibilityRole="menu" accessibilityLabel="Quick actions menu">
      <Card.Content>
        <Text variant="titleLarge" style={styles.title}>
          Quick Actions
        </Text>

        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionButton}
              onPress={() => handleActionPress(action.screen)}
              accessibilityLabel={action.title}
              accessibilityRole="button"
              accessibilityHint={`Navigate to ${action.title}`}
            >
              <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
                <MaterialCommunityIcons name={action.icon} size={28} color="#ffffff" />
              </View>
              <Text variant="bodyMedium" style={styles.actionText}>
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
    backgroundColor: '#ffffff',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
});
