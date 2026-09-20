import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import StitchLogo from './StitchLogo';

export default function ACHeader({ title = 'Dashboard', showBack = false, activeCohort = 'III / V / CSE-C' }) {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        {/* Left branding and title */}
        <View style={styles.leftCol}>
          {showBack ? (
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
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
            <Text style={styles.subBrand}>NANDHA ENGG COLLEGE - CSE</Text>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>{title}</Text>
              {activeCohort && (
                <View style={styles.cohortBadge}>
                  <Text style={styles.cohortText}>{activeCohort}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Right Action: Switch to Faculty view */}
        <Pressable
          onPress={() => router.replace('/(faculty)/dashboard')}
          style={({ pressed }) => [styles.switchBtn, pressed && styles.pressed]}
          accessibilityLabel="Switch to Faculty Portal"
        >
          <MaterialIcons name="swap-horiz" size={16} color={Colors.secondary} />
          <Text style={styles.switchBtnText}>Faculty View</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerHigh,
    paddingHorizontal: Spacing.margin,
    paddingVertical: 10,
    ...Shadows.sm,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  logoWrapper: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  titleWrapper: {
    flex: 1,
    minWidth: 0,
  },
  subBrand: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.2,
  },
  cohortBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: BorderRadius.xs,
  },
  cohortText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  switchBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary,
  },
});
