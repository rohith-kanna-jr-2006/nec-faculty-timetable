import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import StitchLogo from './StitchLogo';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

export default function AppHeader({
  title = 'NEC Timetable',
  subtitle = 'Faculty Workload',
  showProfile = true,
  showBack = false,
  badgeText = 'FACULTY',
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
      <View style={styles.contentRow}>
        <View style={styles.leftGroup}>
          {showBack ? (
            <Pressable
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
              onPress={() => router.back()}
              accessibilityLabel="Go back"
            >
              <MaterialIcons name="arrow-back" size={24} color={Colors.primary} />
            </Pressable>
          ) : (
            <Pressable onPress={() => router.push('/(faculty)/dashboard')}>
              <StitchLogo size={36} />
            </Pressable>
          )}

          <View style={styles.titleGroup}>
            <View style={styles.titleRow}>
              <Text style={styles.mainTitle} numberOfLines={1}>
                {title}
              </Text>
              {badgeText ? (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>{badgeText}</Text>
                </View>
              ) : null}
            </View>
            {subtitle ? (
              <Text style={styles.subtitleText} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        {showProfile && (
          <Pressable
            style={({ pressed }) => [styles.avatarButton, pressed && styles.pressed]}
            onPress={() => router.push('/(faculty)/profile')}
            accessibilityLabel="Faculty Profile"
          >
            <View style={styles.avatarInner}>
              <MaterialIcons name="person" size={18} color={Colors.onPrimary} />
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'rgba(248, 249, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerHigh,
    paddingHorizontal: Spacing.margin,
    paddingBottom: 12,
    ...Shadows.sm,
    zIndex: 50,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
    marginRight: 8,
  },
  titleGroup: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.2,
  },
  headerBadge: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.sm,
  },
  headerBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  subtitleText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  avatarButton: {
    padding: 2,
  },
  avatarInner: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
