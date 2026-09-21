import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import StitchLogo from '../components/StitchLogo';
import PrimaryButton from '../components/PrimaryButton';

export default function AppEntry() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Institutional Branding Container */}
        <View style={styles.brandBox}>
          <View style={styles.logoWrapper}>
            <StitchLogo size={72} />
          </View>

          <View style={styles.tagBadge}>
            <Text style={styles.tagBadgeText}>AUTONOMOUS INSTITUTION • AFFILIATED TO ANNA UNIVERSITY</Text>
          </View>

          <Text style={styles.institutionName}>NANDHA ENGINEERING COLLEGE</Text>
          <Text style={styles.portalSubtitle}>Faculty Timetable Orchestration Suite</Text>
        </View>

        {/* Live Academic Context Card */}
        <View style={styles.contextCard}>
          <View style={styles.contextRow}>
            <View style={styles.statusIndicator}>
              <View style={styles.pulseDot} />
              <Text style={styles.statusText}>ODD SEMESTER 2024-25</Text>
            </View>
            <Text style={styles.weekTag}>WEEK 11 (ACTIVE)</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.contextInfoRow}>
            <Text style={styles.contextLabel}>Department of Computer Science & Engineering</Text>
            <Text style={styles.regulationTag}>R2022 REGULATION</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <PrimaryButton
            title="Launch Faculty Portal"
            iconRight="arrow-forward"
            onPress={() => router.replace('/(auth)/login')}
            style={styles.launchBtn}
          />
          <PrimaryButton
            title="Quick Enter Demo (Faculty)"
            variant="outline"
            icon="speed"
            onPress={() => router.replace('/(faculty)/dashboard')}
            style={styles.demoBtn}
          />
          <PrimaryButton
            title="Academic Coordinator (AC) Console"
            variant="subtle"
            icon="admin-panel-settings"
            onPress={() => router.replace('/coordinator')}
            style={styles.acBtn}
          />
          <PrimaryButton
            title="Head of Department (HOD) Portal"
            variant="subtle"
            icon="security"
            iconRight="arrow-forward"
            onPress={() => router.replace('/hod/login')}
            style={styles.hodBtn}
          />
          <PrimaryButton
            title="Faculty Workload Master Register"
            variant="outline"
            icon="assignment-ind"
            iconRight="arrow-forward"
            onPress={() => router.push('/workload')}
            style={styles.workloadBtn}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Autonomous Regulations 2022 • ERP Support: ext 241</Text>
        <Text style={styles.footerSubText}>IT Cell Timetable Management Framework</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.margin,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: Spacing.xl,
  },
  brandBox: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoWrapper: {
    padding: 12,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
    marginBottom: Spacing.md,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: BorderRadius.sm,
    marginBottom: 8,
  },
  tagBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  institutionName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 4,
  },
  portalSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  contextCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.onTertiaryContainer,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onSurface,
    fontFamily: Typography.labelMono.fontFamily,
  },
  weekTag: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surfaceContainerHigh,
    marginVertical: 10,
  },
  contextInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  contextLabel: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    flex: 1,
  },
  regulationTag: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    fontFamily: Typography.labelMono.fontFamily,
  },
  actionsContainer: {
    width: '100%',
    maxWidth: 360,
    gap: 10,
  },
  launchBtn: {
    width: '100%',
  },
  demoBtn: {
    width: '100%',
  },
  acBtn: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHigh,
  },
  hodBtn: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#0F2942',
    backgroundColor: '#F8FAFC',
  },
  workloadBtn: {
    width: '100%',
    borderColor: Colors.secondary,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.sm,
  },
  footerText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  footerSubText: {
    fontSize: 9,
    color: Colors.outline,
    letterSpacing: 0.5,
    marginTop: 2,
    textTransform: 'uppercase',
  },
});
