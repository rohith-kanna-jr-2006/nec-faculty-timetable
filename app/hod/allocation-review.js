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
import PrimaryButton from '../../components/PrimaryButton';
import {
  getAcademicContext,
  getHODFacultyAllocations,
  getCurriculumCourses,
  getCourseFacultyHandlers,
} from '../../constants/demoData';

export default function AllocationReviewScreen() {
  const router = useRouter();
  const context = getAcademicContext();
  const activeSection = context.section || 'CSE-C';
  const allocations = getHODFacultyAllocations();
  const courses = getCurriculumCourses();

  const auditRows = courses.map((c) => {
    const handlers = getCourseFacultyHandlers(c.code) || [];
    const handlerNames = handlers.map((h) => h.name || h.facultyName).join(', ');
    const assigned = allocations[c.code];
    return {
      courseCode: c.code,
      courseName: c.name,
      section: activeSection,
      periods: c.periods || c.periodsPerWeek || 0,
      acInput: handlerNames || 'No AC recommendation',
      hodAssigned: assigned?.facultyName || 'Pending Allocation',
      status: assigned ? 'Assigned' : 'Needs Review',
    };
  });

  const totalPeriods = auditRows.reduce((sum, r) => sum + r.periods, 0);
  const assignedCount = auditRows.filter((r) => r.status === 'Assigned').length;
  const needsReviewCount = auditRows.filter((r) => r.status === 'Needs Review' || r.status === 'Pending').length;

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <HODHeader
        title="Allocation Review"
        showBack={true}
        activeCohort={`${context.year || 'III'} / ${context.semester || 'V'} / ${activeSection}`}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pre-Ratification Audit Banner */}
        <View style={styles.auditBanner}>
          <View style={styles.auditBannerTop}>
            <View style={styles.auditBadge}>
              <MaterialIcons name="fact-check" size={14} color="#FFFFFF" />
              <Text style={styles.auditBadgeText}>PRE-RATIFICATION COMPLIANCE AUDIT</Text>
            </View>
            <Text style={styles.sectionBadge}>{activeSection}</Text>
          </View>
          <Text style={styles.auditTitle}>Allocation Verification Matrix</Text>
          <Text style={styles.auditSub}>
            Audit AC recommendations against binding HOD allocations. Verify workload thresholds, lab co-guides, and elective quotas prior to class timetable review.
          </Text>

          {/* Mini Stats Bar */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{assignedCount}/{auditRows.length}</Text>
              <Text style={styles.statLabel}>Assigned</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{totalPeriods} P</Text>
              <Text style={styles.statLabel}>Weekly Load</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: needsReviewCount > 0 ? '#FBBF24' : '#34D399' }]}>
                {needsReviewCount}
              </Text>
              <Text style={styles.statLabel}>Need Review</Text>
            </View>
          </View>
        </View>

        {/* Structured Audit Table / Cards */}
        <View style={styles.tableCard}>
          <Text style={styles.tableHeader}>COURSE ALLOCATION AUDIT ROSTER</Text>

          <View style={styles.tableList}>
            {auditRows.length === 0 ? (
              <View style={styles.emptyCard}>
                <MaterialIcons name="fact-check" size={36} color={Colors.outlineVariant} />
                <Text style={styles.emptyTitle}>No Faculty Allocations Available</Text>
                <Text style={styles.emptySub}>
                  No course allocations have been recorded for this cohort yet.
                </Text>
                <Pressable
                  style={styles.emptyActionBtn}
                  onPress={() => router.push('/hod/faculty-allocation')}
                >
                  <Text style={styles.emptyActionText}>Configure Allocation</Text>
                  <MaterialIcons name="arrow-forward" size={14} color="#0F2942" />
                </Pressable>
              </View>
            ) : (
              auditRows.map((row) => (
                <View key={row.courseCode} style={styles.rowCard}>
                  <View style={styles.rowTop}>
                    <View style={styles.rowCodeBox}>
                      <Text style={styles.rowCode}>{row.courseCode}</Text>
                      <Text style={styles.rowName}>{row.courseName}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        row.status === 'Assigned'
                          ? styles.statusAssigned
                          : row.status === 'Needs Review'
                          ? styles.statusReview
                          : styles.statusConflict,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          row.status === 'Assigned'
                            ? styles.statusAssignedText
                            : row.status === 'Needs Review'
                            ? styles.statusReviewText
                            : styles.statusConflictText,
                        ]}
                      >
                        {row.status}
                      </Text>
                    </View>
                  </View>

                  {/* Comparison Grid */}
                  <View style={styles.compareGrid}>
                    <View style={styles.compareCol}>
                      <Text style={styles.compareLabel}>AC INPUT RECOMMENDATION</Text>
                      <Text style={styles.acInputText}>{row.acInput}</Text>
                    </View>
                    <View style={styles.compareCol}>
                      <Text style={styles.compareLabel}>HOD BINDING ALLOCATION</Text>
                      <Text style={styles.hodAssignedText}>{row.hodAssigned}</Text>
                    </View>
                  </View>

                  {/* Footer metadata */}
                  <View style={styles.rowFooter}>
                    <Text style={styles.rowMetaText}>
                      Section {row.section} • {row.periods} Periods/Wk
                    </Text>
                    {row.status !== 'Assigned' && (
                      <Pressable
                        onPress={() => router.push('/hod/faculty-allocation')}
                        style={styles.fixBtn}
                      >
                        <Text style={styles.fixBtnText}>Assign Now</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Primary Action Button */}
        <View style={styles.actionCard}>
          <Text style={styles.actionCardTitle}>Proceed to Timetable Review</Text>
          <Text style={styles.actionCardDesc}>
            All binding allocations are locked. Inspect the synthesized 35-period weekly timetable matrix.
          </Text>
          <PrimaryButton
            title="Inspect Class Timetable"
            icon="table-chart"
            iconRight="arrow-forward"
            onPress={() => router.push('/hod/timetable-review')}
            style={styles.inspectBtn}
          />
        </View>
      </ScrollView>

      <HODBottomNav activeTab="allocations" />
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
  auditBanner: {
    backgroundColor: '#0F2942',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  auditBannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  auditBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  auditBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: '800',
  },
  auditTitle: {
    ...Typography.titleMedium,
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 17,
    marginBottom: 4,
  },
  auditSub: {
    ...Typography.bodySmall,
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BorderRadius.md,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statVal: {
    ...Typography.titleMedium,
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  statLabel: {
    ...Typography.labelSmall,
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.sm,
    marginBottom: Spacing.md,
  },
  tableHeader: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  tableList: {
    gap: 10,
  },
  rowCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  rowCode: {
    ...Typography.titleSmall,
    color: '#0F2942',
    fontWeight: '900',
    fontSize: 13,
  },
  rowName: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusAssigned: {
    backgroundColor: '#ECFDF5',
  },
  statusAssignedText: {
    color: '#059669',
    fontSize: 9,
    fontWeight: '800',
  },
  statusReview: {
    backgroundColor: '#FFFBEB',
  },
  statusReviewText: {
    color: '#D97706',
    fontSize: 9,
    fontWeight: '800',
  },
  statusConflict: {
    backgroundColor: '#FEF2F2',
  },
  statusConflictText: {
    color: '#DC2626',
    fontSize: 9,
    fontWeight: '800',
  },
  compareGrid: {
    gap: 6,
    marginBottom: 8,
  },
  compareCol: {
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  compareLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 2,
  },
  acInputText: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
  },
  hodAssignedText: {
    fontSize: 11,
    color: '#0F2942',
    fontWeight: '700',
  },
  rowFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 6,
  },
  rowMetaText: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  fixBtn: {
    backgroundColor: '#0F2942',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  fixBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.sm,
  },
  actionCardTitle: {
    ...Typography.titleSmall,
    color: '#0F2942',
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 2,
  },
  actionCardDesc: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    marginBottom: 12,
  },
  inspectBtn: {
    backgroundColor: '#2563EB',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderStyle: 'dashed',
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  emptyTitle: {
    ...Typography.titleMedium,
    color: Colors.primary,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySub: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceVariant,
  },
  emptyActionText: {
    ...Typography.labelMedium,
    color: '#0F2942',
    fontWeight: '700',
  },
});
