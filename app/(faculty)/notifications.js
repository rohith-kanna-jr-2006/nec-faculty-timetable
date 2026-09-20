import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import NotificationItem from '../../components/NotificationItem';
import Card from '../../components/Card';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { NOTIFICATIONS_DATA, FACULTY_PROFILE } from '../../constants/demoData';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unread' | 'timetable' | 'assignment' | 'academic'

  const unreadCount = notifications.filter((n) => n.status === 'unread').length;

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, status: 'read' }))
    );
  };

  const handleMarkSingleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'read' } : n))
    );
  };

  const filterChips = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount, isUnread: true },
    { id: 'timetable', label: 'Timetable', count: notifications.filter((n) => n.category === 'timetable').length },
    { id: 'assignment', label: 'Assignment', count: notifications.filter((n) => n.category === 'assignment').length },
    { id: 'academic', label: 'Academic', count: notifications.filter((n) => n.category === 'academic').length },
  ];

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return n.status === 'unread';
    return n.category === activeFilter;
  });

  return (
    <View style={styles.screenContainer}>
      <AppHeader
        title="Nandha Engg College"
        subtitle="CSE Dept • Ms. C. Navamani"
        badgeText="ALERTS"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Context Bar */}
        <View style={styles.contextBar}>
          <View style={styles.contextLeft}>
            <View style={styles.pulseDot} />
            <Text style={styles.contextIdText}>{FACULTY_PROFILE.id} • {FACULTY_PROFILE.academicYear}</Text>
          </View>
          <View style={styles.regulationBadge}>
            <MaterialIcons name="verified-user" size={12} color={Colors.secondary} />
            <Text style={styles.regulationText}>REGULATION R2022</Text>
          </View>
        </View>

        {/* Screen Header & Actions */}
        <View style={styles.headerActionRow}>
          <View style={styles.titleGroup}>
            <Text style={styles.heading}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadCountBadge}>
                <Text style={styles.unreadCountText}>{unreadCount} NEW</Text>
              </View>
            )}
          </View>

          {unreadCount > 0 && (
            <Pressable
              style={({ pressed }) => [styles.markAllBtn, pressed && styles.pressed]}
              onPress={handleMarkAllRead}
            >
              <MaterialIcons name="done-all" size={16} color={Colors.secondary} />
              <Text style={styles.markAllBtnText}>Mark all as read</Text>
            </Pressable>
          )}
        </View>

        {/* Filter Chips Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipsScroll}
        >
          {filterChips.map((chip) => {
            const isActive = activeFilter === chip.id;
            return (
              <Pressable
                key={chip.id}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                ]}
                onPress={() => setActiveFilter(chip.id)}
              >
                {chip.isUnread && <View style={styles.unreadFilterDot} />}
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {chip.label}
                </Text>
                <View
                  style={[
                    styles.filterCountPill,
                    isActive && styles.filterCountPillActive,
                    chip.isUnread && !isActive && styles.filterCountPillUnread,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterCountText,
                      isActive && styles.filterCountTextActive,
                      chip.isUnread && !isActive && styles.filterCountTextUnread,
                    ]}
                  >
                    {chip.count}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Notification Feed Stream */}
        <View style={styles.notificationsList}>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkSingleRead}
              />
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <View style={styles.emptyIconBox}>
                <MaterialIcons name="task-alt" size={26} color={Colors.secondary} />
              </View>
              <Text style={styles.emptyTitle}>All Caught Up!</Text>
              <Text style={styles.emptyDesc}>
                No notifications in this filter. You're completely up to date with your teaching schedule and academic alerts.
              </Text>
            </Card>
          )}
        </View>

        {/* Institutional Academic Footer Note */}
        <View style={styles.footerInfoBox}>
          <MaterialIcons name="info" size={16} color={Colors.onSurfaceVariant} />
          <Text style={styles.footerInfoText}>
            Academic slot notifications are automatically mirrored to your registered campus email (@nandhaengg.org).
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  contextBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  contextLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
  },
  contextIdText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
    textTransform: 'uppercase',
  },
  regulationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  regulationText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  headerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  unreadCountBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  unreadCountText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: Typography.labelMono.fontFamily,
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  markAllBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
  },
  filterChipsScroll: {
    gap: 6,
    paddingBottom: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  unreadFilterDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.onSurface,
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  filterCountPill: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
  },
  filterCountPillActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  filterCountPillUnread: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  filterCountText: {
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
    fontWeight: '600',
  },
  filterCountTextActive: {
    color: '#ffffff',
  },
  filterCountTextUnread: {
    color: Colors.secondary,
    fontWeight: '700',
  },
  notificationsList: {
    marginBottom: Spacing.md,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: 8,
  },
  emptyIconBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  emptyDesc: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  footerInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(220, 233, 255, 0.6)',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  footerInfoText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    flex: 1,
    lineHeight: 16,
  },
  pressed: {
    opacity: 0.7,
  },
});
