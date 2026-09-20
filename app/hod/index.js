import React, { useState, useEffect } from 'react';
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
import PrimaryButton from '../../components/PrimaryButton';
import {
  getHODProfile,
  getAcademicContext,
  getTimetableVersion,
  getClassAdvisors,
  getHODFacultyAllocations,
  subscribeState,
} from '../../constants/demoData';

export default function HODDashboardScreen() {
  const router = useRouter();
  const [hodProfile, setHodProfile] = useState(getHODProfile());
  const [academicContext, setAcademicContextState] = useState(getAcademicContext());
  const [timetableVersion, setTimetableVersionState] = useState(getTimetableVersion());
  const [advisors, setAdvisors] = useState(getClassAdvisors());
  const [allocations, setAllocations] = useState(getHODFacultyAllocations());

  useEffect(() => {
    const unsubscribe = subscribeState(() => {
      setHodProfile(getHODProfile());
      setAcademicContextState(getAcademicContext());
      setTimetableVersionState(getTimetableVersion());
      setAdvisors(getClassAdvisors());
      setAllocations(getHODFacultyAllocations());
    });
    return unsubscribe;
  }, []);

  const activeCohort = `${academicContext.year || 'III Year'} • ${academicContext.semester || 'Sem V'} • ${academicContext.section || 'CSE-C'}`;
  const advisorCount = Object.keys(advisors || {}).length;
  const isApproved = timetableVersion.status === 'APPROVED' || timetableVersion.status === 'PUBLISHED';

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <HODHeader title="Executive Desk" activeCohort={academicContext.section ? `${academicContext.year || 'III'} / ${academicContext.semester || 'V'} / ${academicContext.section}` : 'III / V / CSE-C'} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Executive Profile Card */}
        <View style={styles.executiveCard}>
          <View style={styles.executiveTopRow}>
            <View style={styles.executiveBadge}>
              <View style={styles.livePulseDot} />
              <Text style={styles.executiveBadgeText}>Head of Department Desk</Text>
            </View>
            <View style={styles.ayBadge}>
              <Text style={styles.ayBadgeText}>AY 2024-25 ODD</Text>
            </View>
          </View>

          <View style={styles.executiveMainRow}>
            <View style={styles.executiveAvatar}>
              <Text style={styles.executiveAvatarText}>{hodProfile?.initials || 'SK'}</Text>
            </View>
            <View style={styles.executiveInfoCol}>
              <Text style={styles.executiveName}>{hodProfile?.name || 'Dr. S. Karthik, M.E., Ph.D.'}</Text>
              <Text style={styles.executiveDesignation}>
                {hodProfile?.designation || 'Professor & Head of Department'}
              </Text>
              <View style={styles.authorityRow}>
                <MaterialIcons name="verified" size={14} color="#0284C7" />
                <Text style={styles.authorityText}>Level 01 Statutory Clearance • Dept. of CSE</Text>
              </View>
            </View>
          </View>

          <Pressable
            style={styles.contextChangeBar}
            onPress={() => router.push('/hod/context')}
          >
            <View style={styles.contextBarLeft}>
              <MaterialIcons name="tune" size={16} color="#0F2942" />
              <Text style={styles.contextBarLabel}>Active Scope:</Text>
              <Text style={styles.contextBarValue}>{activeCohort}</Text>
            </View>
            <View style={styles.contextBarRight}>
              <Text style={styles.changeScopeText}>Change Scope</Text>
              <MaterialIcons name="chevron-right" size={16} color="#0F2942" />
            </View>
          </Pressable>
        </View>

        {/* Bento Status Grid */}
        <View style={styles.bentoGrid}>
          {/* Bento 1: Class Advisors */}
          <Pressable
            style={styles.bentoCard}
            onPress={() => router.push('/hod/class-advisor')}
          >
            <View style={styles.bentoTop}>
              <MaterialIcons name="school" size={20} color="#0284C7" />
              <View style={styles.bentoPillGreen}>
                <Text style={styles.bentoPillGreenText}>Sole Authority</Text>
              </View>
            </View>
            <Text style={styles.bentoVal}>{advisorCount} / 4</Text>
            <Text style={styles.bentoTitle}>Class Advisors</Text>
            <Text style={styles.bentoSub}>Sections A, B, C, D designated</Text>
          </Pressable>

          {/* Bento 2: AC Course Input */}
          <Pressable
            style={styles.bentoCard}
            onPress={() => router.push('/hod/faculty-input')}
          >
            <View style={styles.bentoTop}>
              <MaterialIcons name="input" size={20} color="#2563EB" />
              <View style={styles.bentoPillBlue}>
                <Text style={styles.bentoPillBlueText}>AC Input</Text>
              </View>
            </View>
            <Text style={styles.bentoVal}>12 Courses</Text>
            <Text style={styles.bentoTitle}>Subject Handlers</Text>
            <Text style={styles.bentoSub}>Advisory pool submitted by AC</Text>
          </Pressable>

          {/* Bento 3: Faculty Allocation */}
          <Pressable
            style={styles.bentoCard}
            onPress={() => router.push('/hod/faculty-allocation')}
          >
            <View style={styles.bentoTop}>
              <MaterialIcons name="how-to-reg" size={20} color="#D97706" />
              <View style={styles.bentoPillAmber}>
                <Text style={styles.bentoPillAmberText}>HOD Decision</Text>
              </View>
            </View>
            <Text style={styles.bentoVal}>12 / 12</Text>
            <Text style={styles.bentoTitle}>Allocations</Text>
            <Text style={styles.bentoSub}>Binding faculty assignment</Text>
          </Pressable>

          {/* Bento 4: Timetable Approval */}
          <Pressable
            style={styles.bentoCard}
            onPress={() => router.push('/hod/approval')}
          >
            <View style={styles.bentoTop}>
              <MaterialIcons name="gavel" size={20} color={isApproved ? '#10B981' : '#DC2626'} />
              <View style={isApproved ? styles.bentoPillGreen : styles.bentoPillRed}>
                <Text style={isApproved ? styles.bentoPillGreenText : styles.bentoPillRedText}>
                  {isApproved ? 'Ratified' : 'Pending HOD'}
                </Text>
              </View>
            </View>
            <Text style={styles.bentoVal}>{isApproved ? 'Approved' : '35/35 P'}</Text>
            <Text style={styles.bentoTitle}>Timetable Status</Text>
            <Text style={styles.bentoSub}>0 Conflicts • CSE-C Grid</Text>
          </Pressable>
        </View>

        {/* Primary Call to Action: Timetable Review */}
        <View style={styles.actionHeroCard}>
          <View style={styles.heroBadgeRow}>
            <View style={styles.ratificationBadge}>
              <MaterialIcons name="rate-review" size={14} color="#FFFFFF" />
              <Text style={styles.ratificationBadgeText}>STATUTORY RATIFICATION QUEUE</Text>
            </View>
            <Text style={styles.versionLabel}>Version 4.2 Draft</Text>
          </View>

          <Text style={styles.heroTitle}>CSE-C Timetable Sanction</Text>
          <Text style={styles.heroDesc}>
            Academic Coordinator submitted the compiled 35-period weekly timetable matrix for III Year CSE-C. Inspect distribution and issue formal executive order.
          </Text>

          <View style={styles.heroBtnRow}>
            <PrimaryButton
              title="Review Full Timetable"
              icon="grid-on"
              iconRight="arrow-forward"
              onPress={() => router.push('/hod/timetable-review')}
              style={styles.heroBtnPrimary}
            />
            <Pressable
              style={styles.heroBtnSecondary}
              onPress={() => router.push('/hod/approval')}
            >
              <MaterialIcons name="gavel" size={16} color="#0F2942" />
              <Text style={styles.heroBtnSecondaryText}>Go to Approval Desk</Text>
            </Pressable>
          </View>
        </View>

        {/* Urgent Executive Decision Queue */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Executive Decision Queue</Text>
            <View style={styles.pendingChip}>
              <Text style={styles.pendingChipText}>3 ACTIONS PENDING</Text>
            </View>
          </View>

          {/* Action 1 */}
          <Pressable
            style={styles.queueItem}
            onPress={() => router.push('/hod/class-advisor')}
          >
            <View style={[styles.queueIconBox, { backgroundColor: '#E0F2FE' }]}>
              <MaterialIcons name="school" size={20} color="#0284C7" />
            </View>
            <View style={styles.queueContent}>
              <View style={styles.queueTitleRow}>
                <Text style={styles.queueTitle}>Class Advisor Ratification</Text>
                <Text style={styles.queueTagHigh}>DECISION REQ</Text>
              </View>
              <Text style={styles.queueSub}>Review & designate Class Advisor for III Year CSE-C</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={Colors.outlineVariant} />
          </Pressable>

          {/* Action 2 */}
          <Pressable
            style={styles.queueItem}
            onPress={() => router.push('/hod/faculty-input')}
          >
            <View style={[styles.queueIconBox, { backgroundColor: '#EFF6FF' }]}>
              <MaterialIcons name="menu-book" size={20} color="#2563EB" />
            </View>
            <View style={styles.queueContent}>
              <View style={styles.queueTitleRow}>
                <Text style={styles.queueTitle}>AC Subject Handlers Pool</Text>
                <Text style={styles.queueTagInfo}>INPUT AUDIT</Text>
              </View>
              <Text style={styles.queueSub}>Audit faculty recommendations supplied by Academic Coordinator</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={Colors.outlineVariant} />
          </Pressable>

          {/* Action 3 */}
          <Pressable
            style={styles.queueItem}
            onPress={() => router.push('/hod/allocation-review')}
          >
            <View style={[styles.queueIconBox, { backgroundColor: '#FEF3C7' }]}>
              <MaterialIcons name="verified" size={20} color="#D97706" />
            </View>
            <View style={styles.queueContent}>
              <View style={styles.queueTitleRow}>
                <Text style={styles.queueTitle}>Faculty Allocation Pre-Audit</Text>
                <Text style={styles.queueTagAlert}>COMPLIANCE</Text>
              </View>
              <Text style={styles.queueSub}>Verify 12 course allocations against workload thresholds</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={Colors.outlineVariant} />
          </Pressable>
        </View>

        {/* Departmental Section Progress Tracker */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Department Section Coverage</Text>
          <Text style={styles.sectionSubText}>Autonomous Regulation R2022 • Odd Semester</Text>

          <View style={styles.cohortStatusCard}>
            <View style={styles.cohortRow}>
              <View style={styles.cohortLeft}>
                <Text style={styles.cohortName}>III Year CSE-A</Text>
                <Text style={styles.advisorName}>Advisor: Dr. K. Senthil Kumar</Text>
              </View>
              <View style={styles.statusBadgeGreen}>
                <Text style={styles.statusBadgeGreenText}>Approved</Text>
              </View>
            </View>

            <View style={styles.cohortRow}>
              <View style={styles.cohortLeft}>
                <Text style={styles.cohortName}>III Year CSE-B</Text>
                <Text style={styles.advisorName}>Advisor: Dr. M. Kavitha</Text>
              </View>
              <View style={styles.statusBadgeAmber}>
                <Text style={styles.statusBadgeAmberText}>Solver In-Progress</Text>
              </View>
            </View>

            <View style={[styles.cohortRow, styles.cohortRowHighlight]}>
              <View style={styles.cohortLeft}>
                <Text style={[styles.cohortName, { color: '#0F2942', fontWeight: '800' }]}>
                  III Year CSE-C (Active)
                </Text>
                <Text style={styles.advisorName}>Advisor: Ms. C. Navamani</Text>
              </View>
              <View style={styles.statusBadgeBlue}>
                <Text style={styles.statusBadgeBlueText}>Pending HOD Review</Text>
              </View>
            </View>

            <View style={styles.cohortRow}>
              <View style={styles.cohortLeft}>
                <Text style={styles.cohortName}>III Year CSE-D</Text>
                <Text style={styles.advisorName}>Advisor: Mr. P. Vignesh</Text>
              </View>
              <View style={styles.statusBadgeGray}>
                <Text style={styles.statusBadgeGrayText}>Input Configured</Text>
              </View>
            </View>
          </View>
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
  executiveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.sm,
    marginBottom: Spacing.md,
  },
  executiveTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  executiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F2942',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  executiveBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  ayBadge: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  ayBadgeText: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontWeight: '700',
    fontSize: 10,
  },
  executiveMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  executiveAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0F2942',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  executiveAvatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
  },
  executiveInfoCol: {
    flex: 1,
  },
  executiveName: {
    ...Typography.titleMedium,
    color: '#0F2942',
    fontWeight: '900',
    fontSize: 16,
  },
  executiveDesignation: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    fontSize: 12,
    marginTop: 1,
  },
  authorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  authorityText: {
    ...Typography.labelSmall,
    color: '#0284C7',
    fontSize: 11,
    fontWeight: '700',
  },
  contextChangeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  contextBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  contextBarLabel: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontWeight: '700',
    fontSize: 11,
  },
  contextBarValue: {
    ...Typography.bodySmall,
    color: '#0F2942',
    fontWeight: '800',
    fontSize: 12,
  },
  contextBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  changeScopeText: {
    ...Typography.labelSmall,
    color: '#0F2942',
    fontWeight: '700',
    fontSize: 11,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: Spacing.md,
  },
  bentoCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.sm,
  },
  bentoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bentoPillGreen: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bentoPillGreenText: {
    color: '#059669',
    fontSize: 9,
    fontWeight: '800',
  },
  bentoPillBlue: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bentoPillBlueText: {
    color: '#2563EB',
    fontSize: 9,
    fontWeight: '800',
  },
  bentoPillAmber: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bentoPillAmberText: {
    color: '#D97706',
    fontSize: 9,
    fontWeight: '800',
  },
  bentoPillRed: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bentoPillRedText: {
    color: '#DC2626',
    fontSize: 9,
    fontWeight: '800',
  },
  bentoVal: {
    ...Typography.titleLarge,
    color: '#0F2942',
    fontWeight: '900',
    fontSize: 18,
  },
  bentoTitle: {
    ...Typography.labelSmall,
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 12,
    marginTop: 2,
  },
  bentoSub: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
    marginTop: 2,
  },
  actionHeroCard: {
    backgroundColor: '#0F2942',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  ratificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  versionLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    ...Typography.titleLarge,
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 4,
  },
  heroDesc: {
    ...Typography.bodySmall,
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  heroBtnRow: {
    gap: 8,
  },
  heroBtnPrimary: {
    backgroundColor: '#2563EB',
  },
  heroBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  heroBtnSecondaryText: {
    ...Typography.labelMedium,
    color: '#0F2942',
    fontWeight: '800',
  },
  sectionContainer: {
    marginBottom: Spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    color: '#0F2942',
    fontWeight: '800',
    fontSize: 15,
  },
  sectionSubText: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    marginBottom: 8,
  },
  pendingChip: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  pendingChipText: {
    color: '#DC2626',
    fontSize: 9,
    fontWeight: '800',
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    marginBottom: 8,
    gap: 12,
  },
  queueIconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  queueContent: {
    flex: 1,
  },
  queueTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  queueTitle: {
    ...Typography.bodyMedium,
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  queueTagHigh: {
    backgroundColor: '#FEF2F2',
    color: '#DC2626',
    fontSize: 8,
    fontWeight: '800',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  queueTagInfo: {
    backgroundColor: '#EFF6FF',
    color: '#2563EB',
    fontSize: 8,
    fontWeight: '800',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  queueTagAlert: {
    backgroundColor: '#FFFBEB',
    color: '#D97706',
    fontSize: 8,
    fontWeight: '800',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  queueSub: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
  },
  cohortStatusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    overflow: 'hidden',
  },
  cohortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  cohortRowHighlight: {
    backgroundColor: '#F0F9FF',
  },
  cohortLeft: {
    flex: 1,
  },
  cohortName: {
    ...Typography.bodyMedium,
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  advisorName: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    marginTop: 1,
  },
  statusBadgeGreen: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusBadgeGreenText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '700',
  },
  statusBadgeAmber: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusBadgeAmberText: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: '700',
  },
  statusBadgeBlue: {
    backgroundColor: '#0F2942',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusBadgeBlueText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  statusBadgeGray: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusBadgeGrayText: {
    color: Colors.onSurfaceVariant,
    fontSize: 10,
    fontWeight: '700',
  },
});
