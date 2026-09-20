import React from 'react';
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
import { AC_PROFILE, assignmentAuthorityRole } from '../../constants/demoData';
import ACHeader from '../../components/ACHeader';
import ACBottomNav from '../../components/ACBottomNav';
import PrimaryButton from '../../components/PrimaryButton';

export default function ACDashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <ACHeader title="Dashboard" activeCohort="III / V / CSE-C" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Coordinator Desk & Cohort Header */}
        <View style={styles.deskCard}>
          <View style={styles.deskTopRow}>
            <View style={styles.deskLiveBadge}>
              <View style={styles.livePulseDot} />
              <Text style={styles.deskBadgeText}>Academic Coordinator Desk</Text>
            </View>
            <View style={styles.ayBadge}>
              <Text style={styles.ayBadgeText}>AY 2024-25 ODD</Text>
            </View>
          </View>

          <View style={styles.deskMainRow}>
            <View style={styles.deskInfoCol}>
              <Text style={styles.coordinatorName}>{AC_PROFILE?.name || 'Academic Coordinator'}</Text>
              <View style={styles.cohortSubRow}>
                <MaterialIcons name="school" size={15} color={Colors.secondary} />
                <Text style={styles.cohortSubText}>
                  III Year • Sem V • <Text style={styles.boldText}>CSE-C</Text> • 64 Students
                </Text>
              </View>
            </View>

            <View style={styles.matrixLoadBox}>
              <Text style={styles.matrixLoadLabel}>MATRIX LOAD</Text>
              <Text style={styles.matrixLoadVal}>35/35 P</Text>
            </View>
          </View>

          {/* Prototype Authority Note */}
          <View style={styles.authorityNoteRow}>
            <MaterialIcons name="security" size={14} color={Colors.onSurfaceVariant} />
            <Text style={styles.authorityNoteText}>
              Current Assignment Authority: {assignmentAuthorityRole} (Temporary Prototype Mode)
            </Text>
          </View>
        </View>

        {/* Section 2: Engine Readiness Alert Banner */}
        <View style={styles.alertBanner}>
          <View style={styles.alertIconBox}>
            <MaterialIcons name="tune" size={20} color={Colors.onSecondaryContainer} />
          </View>
          <View style={styles.alertContentCol}>
            <View style={styles.alertTitleRow}>
              <Text style={styles.alertTitle}>Configured • Pending Generation</Text>
              <View style={styles.readyBadge}>
                <Text style={styles.readyBadgeText}>Ready for Optimization</Text>
              </View>
            </View>
            <Text style={styles.alertDesc}>
              All baseline slot constraints, syllabus matrices, and faculty quotas are locked.
            </Text>
          </View>
        </View>

        {/* Section 3: Primary CTA: Launch Engine */}
        <View style={styles.engineCtaCard}>
          <View style={styles.engineTopRow}>
            <View style={styles.solverBadge}>
              <MaterialIcons name="bolt" size={14} color={Colors.inversePrimary} />
              <Text style={styles.solverBadgeText}>Automated Solver v4.2</Text>
            </View>
            <View style={styles.heuristicBadge}>
              <Text style={styles.heuristicText}>Heuristic Mode</Text>
            </View>
          </View>

          <Text style={styles.engineTitle}>Generate CSE-C Schedule</Text>
          <Text style={styles.engineSubtitle}>
            Launch conflict-free constraint optimization engine for CSE-C with active lab rules.
          </Text>

          <PrimaryButton
            title="Start Timetable Generation"
            icon="auto-fix-high"
            iconRight="arrow-forward"
            onPress={() => router.push('/coordinator/course-selection')}
            style={styles.engineBtn}
            textStyle={styles.engineBtnText}
          />
        </View>

        {/* Section 4: Quick Stats Bento 2x2 Grid */}
        <View style={styles.bentoGrid}>
          {/* Bento Item 1: Courses */}
          <View style={styles.bentoCard}>
            <View style={styles.bentoTopRow}>
              <MaterialIcons name="menu-book" size={20} color={Colors.secondary} />
              <View style={styles.bentoBadge}>
                <Text style={styles.bentoBadgeText}>12 Active</Text>
              </View>
            </View>
            <View>
              <Text style={styles.bentoVal}>12 Courses</Text>
              <Text style={styles.bentoDesc}>3 Th • 2 Lab • 3 Elec • 4 Oth</Text>
            </View>
          </View>

          {/* Bento Item 2: Faculty */}
          <View style={styles.bentoCard}>
            <View style={styles.bentoTopRow}>
              <MaterialIcons name="groups" size={20} color={Colors.secondary} />
              <View style={styles.bentoBadge}>
                <Text style={styles.bentoBadgeText}>100% Filled</Text>
              </View>
            </View>
            <View>
              <Text style={styles.bentoVal}>10 Faculty</Text>
              <Text style={styles.bentoDesc}>Zero unassigned roles</Text>
            </View>
          </View>

          {/* Bento Item 3: Total Periods */}
          <View style={styles.bentoCard}>
            <View style={styles.bentoTopRow}>
              <MaterialIcons name="calendar-view-week" size={20} color={Colors.secondary} />
              <View style={styles.bentoBadge}>
                <Text style={styles.bentoBadgeText}>Weekly</Text>
              </View>
            </View>
            <View>
              <Text style={styles.bentoVal}>35 Periods</Text>
              <Text style={styles.bentoDesc}>19 Th • 8 Lab • 8 Oth</Text>
            </View>
          </View>

          {/* Bento Item 4: Conflicts */}
          <View style={styles.bentoCard}>
            <View style={styles.bentoTopRow}>
              <MaterialIcons name="check-circle" size={20} color={Colors.onTertiaryContainer} />
              <View style={[styles.bentoBadge, styles.bentoBadgeGreen]}>
                <Text style={styles.bentoBadgeGreenText}>Strict 4P Pass</Text>
              </View>
            </View>
            <View>
              <Text style={styles.bentoVal}>0 Conflicts</Text>
              <Text style={styles.bentoDesc}>Engine verified clean</Text>
            </View>
          </View>
        </View>

        {/* Section 5: Operational Controls Quick Nav */}
        <View style={styles.navSectionCard}>
          <View style={styles.navSectionHeader}>
            <Text style={styles.navSectionTitle}>Operational Controls</Text>
            <Text style={styles.navSectionSub}>CSE-C CONFIGURATION</Text>
          </View>

          {/* Link 1: View Current Timetable */}
          <Pressable
            style={({ pressed }) => [styles.navRowItem, pressed && styles.rowPressed]}
            onPress={() => router.push('/(faculty)/weekly-timetable')}
          >
            <View style={styles.navRowLeft}>
              <View style={styles.navRowIconBox}>
                <MaterialIcons name="grid-on" size={18} color={Colors.secondary} />
              </View>
              <View style={styles.navRowTextCol}>
                <View style={styles.navRowTitleRow}>
                  <Text style={styles.navRowTitle}>View Current Timetable</Text>
                  <View style={styles.draftBadge}>
                    <Text style={styles.draftBadgeText}>Draft v1.0</Text>
                  </View>
                </View>
                <Text style={styles.navRowDesc}>Inspect tentative period distribution</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={Colors.outlineVariant} />
          </Pressable>

          {/* Link 2: Course Configuration */}
          <Pressable
            style={({ pressed }) => [styles.navRowItem, pressed && styles.rowPressed]}
            onPress={() => router.push('/coordinator/course-selection')}
          >
            <View style={styles.navRowLeft}>
              <View style={styles.navRowIconBox}>
                <MaterialIcons name="library-books" size={18} color={Colors.secondary} />
              </View>
              <View style={styles.navRowTextCol}>
                <View style={styles.navRowTitleRow}>
                  <Text style={styles.navRowTitle}>Course Configuration</Text>
                  <View style={styles.activePill}>
                    <Text style={styles.activePillText}>12 Active</Text>
                  </View>
                </View>
                <Text style={styles.navRowDesc}>Syllabus credits, elective tracks & codes</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={Colors.outlineVariant} />
          </Pressable>

          {/* Link 3: Faculty Assignments */}
          <Pressable
            style={({ pressed }) => [styles.navRowItem, pressed && styles.rowPressed]}
            onPress={() => router.push('/coordinator/faculty-assignment')}
          >
            <View style={styles.navRowLeft}>
              <View style={styles.navRowIconBox}>
                <MaterialIcons name="assignment-ind" size={18} color={Colors.secondary} />
              </View>
              <View style={styles.navRowTextCol}>
                <View style={styles.navRowTitleRow}>
                  <Text style={styles.navRowTitle}>Faculty Assignments</Text>
                  <View style={styles.filledBadge}>
                    <Text style={styles.filledBadgeText}>All Filled</Text>
                  </View>
                </View>
                <Text style={styles.navRowDesc}>Workload thresholds & designated guides</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={Colors.outlineVariant} />
          </Pressable>

          {/* Link 4: Conflict Simulation */}
          <Pressable
            style={({ pressed }) => [styles.navRowItem, pressed && styles.rowPressed]}
            onPress={() => router.push('/coordinator/conflict')}
          >
            <View style={styles.navRowLeft}>
              <View style={styles.navRowIconBox}>
                <MaterialIcons name="warning" size={18} color={Colors.error} />
              </View>
              <View style={styles.navRowTextCol}>
                <View style={styles.navRowTitleRow}>
                  <Text style={styles.navRowTitle}>Conflict & Regenerate Tool</Text>
                  <View style={styles.alertBadgeSmall}>
                    <Text style={styles.alertBadgeSmallText}>Inspect</Text>
                  </View>
                </View>
                <Text style={styles.navRowDesc}>Simulate faculty collisions & swap heuristics</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={Colors.outlineVariant} />
          </Pressable>
        </View>

        {/* Section 6: Activity & Department Notes Feed */}
        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <View style={styles.activityHeaderLeft}>
              <MaterialIcons name="history-edu" size={18} color={Colors.primary} />
              <Text style={styles.activityTitle}>Activity & Department Notes</Text>
            </View>
            <Text style={styles.liveSyncText}>Live Sync</Text>
          </View>

          <View style={styles.activityFeed}>
            {/* Item 1 */}
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: Colors.tertiaryFixed }]}>
                <MaterialIcons name="domain" size={14} color={Colors.onTertiaryFixed} />
              </View>
              <View style={styles.activityItemContent}>
                <View style={styles.activityItemTop}>
                  <Text style={styles.activityItemHeading}>FSD Lab allocated to Labs Block II</Text>
                  <Text style={styles.activityItemTime}>10m ago</Text>
                </View>
                <Text style={styles.activityItemSub}>
                  Room CSE Lab 2 booked for Batch 1 & 2 continuous session.
                </Text>
              </View>
            </View>

            {/* Item 2 */}
            <Pressable
              style={styles.activityItemAlert}
              onPress={() => router.push('/coordinator/conflict')}
            >
              <View style={[styles.activityDot, { backgroundColor: Colors.errorContainer }]}>
                <MaterialIcons name="warning" size={14} color={Colors.onErrorContainer} />
              </View>
              <View style={styles.activityItemContent}>
                <View style={styles.activityItemTop}>
                  <Text style={styles.activityAlertHeading}>Faculty Overlap Advisory</Text>
                  <Text style={styles.activityItemTime}>34m ago</Text>
                </View>
                <Text style={styles.activityAlertSub}>
                  Ms. K. Shanmugapriya occupied on Wed P3 with CSE-A. Tap to resolve.
                </Text>
              </View>
            </Pressable>

            {/* Item 3 */}
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: Colors.secondaryFixed }]}>
                <MaterialIcons name="sync-alt" size={14} color={Colors.onSecondaryFixed} />
              </View>
              <View style={styles.activityItemContent}>
                <View style={styles.activityItemTop}>
                  <Text style={styles.activityItemHeading}>Department Sync Completed</Text>
                  <Text style={styles.activityItemTime}>1h ago</Text>
                </View>
                <Text style={styles.activityItemSub}>
                  Shared computing labs synchronized with Mechanical & IT master timetables.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <ACBottomNav activeTab="dashboard" />
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
    padding: Spacing.margin,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  deskCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  deskTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  deskLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  livePulseDot: {
    width: 9,
    height: 9,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.onTertiaryContainer,
  },
  deskBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  ayBadge: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  ayBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  deskMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  deskInfoCol: {
    flex: 1,
    minWidth: 0,
  },
  coordinatorName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  cohortSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  cohortSubText: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  boldText: {
    fontWeight: '700',
    color: Colors.primary,
  },
  matrixLoadBox: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.lg,
    alignItems: 'flex-end',
  },
  matrixLoadLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  matrixLoadVal: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
    marginTop: 1,
  },
  authorityNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerHigh,
  },
  authorityNoteText: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  alertBanner: {
    backgroundColor: Colors.secondaryFixed,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  alertIconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertContentCol: {
    flex: 1,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.onSecondaryFixed,
  },
  readyBadge: {
    backgroundColor: Colors.tertiaryFixed,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  readyBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onTertiaryFixed,
    fontFamily: Typography.labelMono.fontFamily,
  },
  alertDesc: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 3,
    lineHeight: 16,
  },
  engineCtaCard: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  engineTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  solverBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  solverBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.inversePrimary,
    fontFamily: Typography.labelMono.fontFamily,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heuristicBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  heuristicText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primaryFixed,
    fontFamily: Typography.labelMono.fontFamily,
  },
  engineTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.onPrimary,
    letterSpacing: -0.2,
  },
  engineSubtitle: {
    fontSize: 12,
    color: Colors.onPrimaryContainer,
    marginTop: 3,
    marginBottom: Spacing.md,
    lineHeight: 17,
  },
  engineBtn: {
    backgroundColor: Colors.secondaryContainer,
  },
  engineBtnText: {
    color: Colors.onSecondaryContainer,
    fontWeight: '700',
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  bentoCard: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    justifyContent: 'space-between',
    minHeight: 96,
    ...Shadows.sm,
  },
  bentoTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bentoBadge: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  bentoBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  bentoBadgeGreen: {
    backgroundColor: Colors.tertiaryFixed,
  },
  bentoBadgeGreenText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onTertiaryFixed,
    fontFamily: Typography.labelMono.fontFamily,
  },
  bentoVal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  bentoDesc: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  navSectionCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    gap: 6,
    ...Shadows.sm,
  },
  navSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  navSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  navSectionSub: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  navRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow,
    padding: 10,
    borderRadius: BorderRadius.lg,
  },
  rowPressed: {
    opacity: 0.8,
  },
  navRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  navRowIconBox: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navRowTextCol: {
    flex: 1,
    minWidth: 0,
  },
  navRowTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navRowTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  draftBadge: {
    backgroundColor: Colors.secondaryFixed,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  draftBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSecondaryFixed,
    fontFamily: Typography.labelMono.fontFamily,
  },
  activePill: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  filledBadge: {
    backgroundColor: Colors.tertiaryFixed,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  filledBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onTertiaryFixed,
    fontFamily: Typography.labelMono.fontFamily,
  },
  alertBadgeSmall: {
    backgroundColor: Colors.errorContainer,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  alertBadgeSmallText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onErrorContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  navRowDesc: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  activityCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  activityHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  liveSyncText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  activityFeed: {
    gap: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.surfaceContainerLow,
    padding: 10,
    borderRadius: BorderRadius.lg,
  },
  activityItemAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(255, 218, 214, 0.4)',
    padding: 10,
    borderRadius: BorderRadius.lg,
  },
  activityDot: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  activityItemContent: {
    flex: 1,
    minWidth: 0,
  },
  activityItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  activityItemHeading: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  activityAlertHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.error,
  },
  activityItemTime: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  activityItemSub: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    lineHeight: 15,
  },
  activityAlertSub: {
    fontSize: 11,
    color: Colors.onErrorContainer,
    marginTop: 2,
    lineHeight: 15,
  },
});
