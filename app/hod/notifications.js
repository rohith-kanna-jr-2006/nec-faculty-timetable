import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import HODHeader from '../../components/HODHeader';
import HODBottomNav from '../../components/HODBottomNav';
import {
  getHODNotifications,
  markHODNotificationRead,
} from '../../constants/demoData';

export default function HODNotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(getHODNotifications());
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Alerts' },
    { id: 'HIGH', label: 'High Priority' },
    { id: 'TIMETABLE_REVIEW', label: 'Timetable' },
    { id: 'CLASS_ADVISOR', label: 'Advisor' },
  ];

  const handleNotificationPress = (notif) => {
    markHODNotificationRead(notif.id);
    setNotifications(getHODNotifications());
    if (notif.route) {
      router.push(notif.route);
    }
  };

  const handleMarkAllRead = () => {
    notifications.forEach((n) => markHODNotificationRead(n.id));
    setNotifications(getHODNotifications());
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'HIGH') return n.priority === 'HIGH';
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <HODHeader title="Executive Alerts" showBack={true} showActions={false} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View style={styles.summaryBadge}>
              <MaterialIcons name="notifications-active" size={14} color="#FFFFFF" />
              <Text style={styles.summaryBadgeText}>EXECUTIVE ACTION CENTER</Text>
            </View>
            {unreadCount > 0 && (
              <Pressable onPress={handleMarkAllRead}>
                <Text style={styles.markAllReadText}>Mark all read</Text>
              </Pressable>
            )}
          </View>

          <Text style={styles.summaryTitle}>Department Governance Stream</Text>
          <Text style={styles.summaryDesc}>
            Real-time feed of Academic Coordinator timetable submissions, faculty workload threshold alerts, and Class Advisor decrees.
          </Text>

          <View style={styles.unreadRow}>
            <View style={styles.unreadDot} />
            <Text style={styles.unreadText}>{unreadCount} Pending Executive Actions</Text>
          </View>
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {filters.map((f) => {
            const isSelected = activeFilter === f.id;
            return (
              <Pressable
                key={f.id}
                style={[styles.filterPill, isSelected && styles.filterPillActive]}
                onPress={() => setActiveFilter(f.id)}
              >
                <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Notification Cards List */}
        <View style={styles.notifList}>
          {filteredNotifications.map((notif) => {
            const isUnread = !notif.read;

            return (
              <Pressable
                key={notif.id}
                style={[styles.notifCard, isUnread && styles.notifCardUnread]}
                onPress={() => handleNotificationPress(notif)}
              >
                <View style={styles.cardTop}>
                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.typeBadge,
                        notif.priority === 'HIGH' ? styles.badgeRed : styles.badgeBlue,
                      ]}
                    >
                      <Text
                        style={[
                          styles.typeBadgeText,
                          notif.priority === 'HIGH' ? styles.badgeRedText : styles.badgeBlueText,
                        ]}
                      >
                        {notif.badge}
                      </Text>
                    </View>
                    <Text style={styles.timeText}>{notif.timestamp}</Text>
                  </View>
                  {isUnread && <View style={styles.unreadIndicator} />}
                </View>

                <Text style={[styles.notifTitle, isUnread && styles.notifTitleUnread]}>
                  {notif.title}
                </Text>
                <Text style={styles.notifMessage}>{notif.message}</Text>

                <View style={styles.actionPromptRow}>
                  <Text style={styles.actionPromptText}>Tap to review & take action</Text>
                  <MaterialIcons name="arrow-forward" size={14} color="#0284C7" />
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <HODBottomNav activeTab="dashboard" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  summaryCard: {
    backgroundColor: '#0F2942',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  summaryBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  markAllReadText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  summaryTitle: {
    ...Typography.titleMedium,
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 17,
    marginBottom: 4,
  },
  summaryDesc: {
    ...Typography.bodySmall,
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 10,
  },
  unreadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  filtersRow: {
    gap: 8,
    paddingBottom: Spacing.md,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  filterPillActive: {
    backgroundColor: '#0F2942',
    borderColor: '#0F2942',
  },
  filterText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  notifList: {
    gap: 10,
  },
  notifCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.sm,
  },
  notifCardUnread: {
    borderColor: '#BAE6FD',
    backgroundColor: '#F0F9FF',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  badgeRed: {
    backgroundColor: '#FEF2F2',
  },
  badgeRedText: {
    color: '#DC2626',
    fontSize: 8,
    fontWeight: '800',
  },
  badgeBlue: {
    backgroundColor: '#EFF6FF',
  },
  badgeBlueText: {
    color: '#2563EB',
    fontSize: 8,
    fontWeight: '800',
  },
  timeText: {
    fontSize: 10,
    color: '#64748B',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0284C7',
  },
  notifTitle: {
    ...Typography.bodyMedium,
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 4,
  },
  notifTitleUnread: {
    color: '#0F2942',
    fontWeight: '800',
  },
  notifMessage: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 8,
  },
  actionPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionPromptText: {
    fontSize: 10,
    color: '#0284C7',
    fontWeight: '700',
  },
});
