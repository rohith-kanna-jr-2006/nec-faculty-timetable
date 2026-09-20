import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Typography, Spacing, Shadows } from '../constants/theme';

export default function NotificationItem({ notification, onMarkRead }) {
  const router = useRouter();
  if (!notification) return null;

  const isUnread = notification.status === 'unread';

  const getIconName = () => {
    switch (notification.icon) {
      case 'campaign':
        return 'campaign';
      case 'meeting-room':
        return 'meeting-room';
      case 'assignment-ind':
        return 'assignment-ind';
      case 'school':
        return 'school';
      default:
        return 'notifications';
    }
  };

  return (
    <View
      style={[
        styles.card,
        isUnread ? styles.unreadCard : styles.readCard,
      ]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconContainer,
            isUnread ? styles.iconContainerUnread : styles.iconContainerRead,
          ]}
        >
          <MaterialIcons
            name={getIconName()}
            size={20}
            color={isUnread ? Colors.secondary : Colors.onSurfaceVariant}
          />
        </View>

        <View style={styles.contentCol}>
          <View style={styles.headerInfo}>
            <View style={styles.titleGroup}>
              {isUnread && <View style={styles.unreadPip} />}
              <Text style={styles.title} numberOfLines={1}>
                {notification.title}
              </Text>
            </View>
            <Text style={styles.timestamp}>{notification.timestamp}</Text>
          </View>

          <Text style={styles.message}>{notification.message}</Text>

          {/* Badges */}
          <View style={styles.badgeRow}>
            {notification.badge && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{notification.badge}</Text>
              </View>
            )}
            {notification.author && (
              <View style={styles.authorBadge}>
                <MaterialIcons name="person" size={10} color={Colors.onSurfaceVariant} />
                <Text style={styles.authorBadgeText}>{notification.author}</Text>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            {notification.actionRoute ? (
              <Pressable
                style={({ pressed }) => [styles.actionLink, pressed && styles.pressed]}
                onPress={() => router.push(notification.actionRoute)}
              >
                <Text style={styles.actionLinkText}>View Timetable</Text>
                <MaterialIcons name="arrow-forward" size={14} color={Colors.secondary} />
              </Pressable>
            ) : (
              <View />
            )}

            {isUnread && onMarkRead && (
              <Pressable
                style={({ pressed }) => [styles.markReadButton, pressed && styles.pressed]}
                onPress={() => onMarkRead(notification.id)}
                accessibilityLabel="Mark notification as read"
              >
                <MaterialIcons name="check-circle" size={18} color={Colors.onSurfaceVariant} />
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    ...Shadows.sm,
  },
  unreadCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderColor: Colors.surfaceContainerHigh,
  },
  readCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    opacity: 0.85,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerUnread: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  iconContainerRead: {
    backgroundColor: Colors.surfaceContainer,
  },
  contentCol: {
    flex: 1,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 6,
  },
  unreadPip: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    flex: 1,
  },
  timestamp: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.onSurface,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  authorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  authorBadgeText: {
    fontSize: 9,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerLow,
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  actionLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
  },
  markReadButton: {
    padding: 4,
  },
  pressed: {
    opacity: 0.7,
  },
});
