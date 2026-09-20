import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import StitchLogo from './StitchLogo';
import { getHODNotifications } from '../constants/demoData';

export default function HODHeader({
  title = 'Executive Desk',
  showBack = false,
  activeCohort = 'III / V / CSE-C',
  showActions = true,
}) {
  const router = useRouter();
  const unreadCount = getHODNotifications().filter((n) => !n.read).length;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        {/* Left: Back button or Logo */}
        <View style={styles.leftCol}>
          {showBack ? (
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              accessibilityLabel="Go back"
            >
              <MaterialIcons name="arrow-back" size={22} color={Colors.primary} />
            </Pressable>
          ) : (
            <View style={styles.logoWrapper}>
              <StitchLogo size={28} />
            </View>
          )}

          <View style={styles.titleWrapper}>
            <View style={styles.subBrandRow}>
              <Text style={styles.subBrand}>NANDHA ENGG COLLEGE • CSE</Text>
              <View style={styles.l1Badge}>
                <Text style={styles.l1BadgeText}>L1 HOD</Text>
              </View>
            </View>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>{title}</Text>
              {activeCohort ? (
                <View style={styles.cohortBadge}>
                  <Text style={styles.cohortText}>{activeCohort}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* Right Action Icons */}
        {showActions && (
          <View style={styles.rightActions}>
            <Pressable
              onPress={() => router.push('/hod/notifications')}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              accessibilityLabel="HOD Notifications"
            >
              <MaterialIcons name="notifications-none" size={22} color={Colors.primary} />
              {unreadCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </Pressable>

            <Pressable
              onPress={() => router.push('/hod/profile')}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              accessibilityLabel="HOD Profile"
            >
              <MaterialIcons name="account-circle" size={24} color={Colors.secondary} />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    paddingHorizontal: Spacing.margin,
    paddingTop: 8,
    paddingBottom: 10,
    zIndex: 10,
    ...Shadows.sm,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  logoWrapper: {
    marginRight: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceVariant,
    marginRight: 6,
    position: 'relative',
  },
  pressed: {
    opacity: 0.7,
  },
  titleWrapper: {
    flex: 1,
  },
  subBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subBrand: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.5,
    fontWeight: '700',
    fontSize: 10,
  },
  l1Badge: {
    backgroundColor: '#0F2942',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  l1BadgeText: {
    color: '#E8EDF5',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    flexWrap: 'wrap',
    gap: 8,
  },
  titleText: {
    ...Typography.titleMedium,
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 17,
  },
  cohortBadge: {
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  cohortText: {
    ...Typography.labelSmall,
    color: Colors.onSecondaryContainer,
    fontWeight: '700',
    fontSize: 11,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: Colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  notifBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
