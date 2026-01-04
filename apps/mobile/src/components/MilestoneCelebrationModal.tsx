/**
 * Milestone Celebration Modal
 *
 * Displays a congratulatory modal when user reaches a recovery milestone.
 * Celebrates achievements with encouraging messages and animations.
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import type { Milestone } from '@recovery/shared/types';

interface MilestoneCelebrationModalProps {
  visible: boolean;
  milestone: Milestone | null;
  onClose: () => void;
}

export function MilestoneCelebrationModal({
  visible,
  milestone,
  onClose,
}: MilestoneCelebrationModalProps) {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      // Animate modal entrance
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible, scaleAnim]);

  if (!milestone) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Confetti Effect (Visual Only) */}
          <View style={styles.confetti}>
            <Text style={styles.confettiEmoji}>🎉</Text>
            <Text style={styles.confettiEmoji}>✨</Text>
            <Text style={styles.confettiEmoji}>🎊</Text>
            <Text style={styles.confettiEmoji}>⭐</Text>
          </View>

          {/* Milestone Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.milestoneIcon}>{milestone.icon}</Text>
          </View>

          {/* Celebration Message */}
          <Text style={styles.title}>{milestone.title}</Text>
          <Text style={styles.subtitle}>{milestone.description}</Text>

          {/* Days Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{milestone.days}</Text>
            <Text style={styles.badgeLabel}>
              {milestone.days === 1 ? 'Day' : 'Days'} Clean
            </Text>
          </View>

          {/* Encouragement Message */}
          <View style={styles.messageContainer}>
            <Text style={styles.message}>
              {getEncouragementMessage(milestone.days)}
            </Text>
          </View>

          {/* Close Button */}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Continue Journey</Text>
          </TouchableOpacity>

          {/* Quote */}
          <Text style={styles.quote}>
            "Progress, not perfection"
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

/**
 * Get personalized encouragement message based on milestone
 */
function getEncouragementMessage(days: number): string {
  if (days === 1) {
    return "You've taken the most important step. Every journey begins with a single day. Celebrate this victory!";
  }
  if (days <= 7) {
    return "You're building momentum! Each day makes you stronger. Keep going!";
  }
  if (days <= 30) {
    return "Look at how far you've come! Your dedication is inspiring. Recovery is becoming your new normal.";
  }
  if (days <= 90) {
    return "This is a major milestone! You're proving to yourself that lasting change is possible. Be proud!";
  }
  if (days <= 180) {
    return "Your transformation is remarkable! You've built strong foundations for a life in recovery.";
  }
  return "Your journey is an inspiration! You've demonstrated incredible strength and commitment. Celebrate how far you've come!";
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: width - 40,
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  confettiEmoji: {
    fontSize: 32,
    opacity: 0.6,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#4CAF50',
  },
  milestoneIcon: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  badge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  badgeLabel: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  messageContainer: {
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  message: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  quote: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
