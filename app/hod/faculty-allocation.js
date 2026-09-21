import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
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
  setHODFacultyAllocation,
  getCurriculumCourses,
  getCourseFacultyHandlers,
  getAvailableFacultyCandidates,
} from '../../constants/demoData';

export default function HODFacultyAllocationScreen() {
  const router = useRouter();
  const context = getAcademicContext();
  const activeSection = context.section || 'CSE-C';
  const currentAllocations = getHODFacultyAllocations();
  const courses = getCurriculumCourses();
  const candidates = getAvailableFacultyCandidates();

  const [allocations, setAllocationsState] = useState(currentAllocations);
  const [activeCourseCode, setActiveCourseCode] = useState(courses[0]?.code || null);

  const handleSelectFaculty = (courseCode, faculty) => {
    const updated = setHODFacultyAllocation(courseCode, {
      facultyId: faculty.id,
      facultyName: faculty.name,
      designation: faculty.designation,
      status: 'Assigned',
      assignedAt: new Date().toISOString(),
    });
    setAllocationsState({ ...updated });
  };

  const assignedCount = Object.keys(allocations).length;

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <HODHeader
        title="HOD Faculty Allocation"
        showBack={true}
        activeCohort={`${context.year || 'III'} / ${context.semester || 'V'} / ${activeSection}`}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Authority Header */}
        <View style={styles.topCard}>
          <View style={styles.badgeRow}>
            <View style={styles.decisionBadge}>
              <MaterialIcons name="how-to-reg" size={14} color="#FFFFFF" />
              <Text style={styles.decisionBadgeText}>FINAL BINDING ALLOCATION</Text>
            </View>
            <View style={styles.assignedCounter}>
              <Text style={styles.counterText}>{assignedCount}/{courses.length} Assigned</Text>
            </View>
          </View>
          <Text style={styles.cardHeading}>Course-to-Faculty Allocation Desk</Text>
          <Text style={styles.cardDesc}>
            Approve AC subject recommendations or override with alternate faculty. All assignments locked here become binding constraints for the timetable engine.
          </Text>
        </View>

        {/* Course Cards */}
        {courses.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialIcons name="assignment-late" size={36} color={Colors.outlineVariant} />
            <Text style={styles.emptyTitle}>No courses available for allocation</Text>
            <Text style={styles.emptySub}>
              Curriculum courses have not been registered by the Academic Coordinator yet.
            </Text>
          </View>
        ) : (
          <View style={styles.courseList}>
            {courses.map((c) => {
              const currentAssignment = allocations[c.code];
              const isAssigned = !!currentAssignment;
              const handlers = getCourseFacultyHandlers(c.code) || [];
              const handledNames = handlers.map((h) => h.name || h.facultyName);
              const courseType = c.category || c.type || 'THEORY';
              const periods = c.periods || c.periodsPerWeek || 0;

              return (
                <View key={c.code} style={styles.allocationCard}>
                  {/* Course Details Header */}
                  <View style={styles.allocHeader}>
                    <View style={styles.allocHeaderLeft}>
                      <Text style={styles.allocCode}>{c.code}</Text>
                      <View
                        style={[
                          styles.catBadge,
                          courseType === 'THEORY'
                            ? styles.catTheory
                            : courseType === 'LAB'
                            ? styles.catLab
                            : styles.catElective,
                        ]}
                      >
                        <Text style={styles.catBadgeText}>{courseType}</Text>
                      </View>
                      <Text style={styles.periodsBadge}>{periods} Periods</Text>
                    </View>
                    <View
                      style={[
                        styles.statusChip,
                        isAssigned ? styles.statusChipGreen : styles.statusChipAmber,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusChipText,
                          isAssigned ? styles.statusChipGreenText : styles.statusChipAmberText,
                        ]}
                      >
                        {isAssigned ? 'Assigned' : 'Pending HOD'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.allocName}>{c.name}</Text>

                  {/* Handled by (AC Input) */}
                  <View style={styles.handledByRow}>
                    <Text style={styles.handledByLabel}>AC Subject Pool:</Text>
                    <Text style={styles.handledByVal}>
                      {handledNames.length > 0 ? handledNames.join(' • ') : 'No AC pool input'}
                    </Text>
                  </View>

                  {/* Current HOD Assignment */}
                  <View style={styles.assignedBox}>
                    <Text style={styles.assignedBoxLabel}>HOD FINAL ASSIGNMENT:</Text>
                    {isAssigned ? (
                      <View style={styles.assignedSuccessRow}>
                        <MaterialIcons name="check-circle" size={16} color="#059669" />
                        <Text style={styles.assignedSuccessText}>
                          {currentAssignment.facultyName} ({currentAssignment.facultyId})
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.unassignedText}>[ Select Faculty Below ]</Text>
                    )}
                  </View>

                  {/* Faculty Selection Pills */}
                  <Text style={styles.selectFacultyLabel}>Select or Override Faculty:</Text>
                  <View style={styles.facultyChipsContainer}>
                    {candidates.length === 0 ? (
                      <Text style={styles.emptyCandidatesText}>No eligible faculty candidates available</Text>
                    ) : (
                      candidates.map((faculty) => {
                        const isSelected = currentAssignment?.facultyId === faculty.id;
                        const isAcRec = handledNames.some((name) =>
                          name.includes(faculty.name.split(' ').slice(-1)[0])
                        );

                        return (
                          <Pressable
                            key={faculty.id}
                            style={[
                              styles.facultyChip,
                              isSelected && styles.facultyChipSelected,
                            ]}
                            onPress={() => handleSelectFaculty(c.code, faculty)}
                          >
                            <View style={styles.chipTop}>
                              <Text style={[styles.chipName, isSelected && styles.chipNameSelected]}>
                                {faculty.name}
                              </Text>
                              {isAcRec && (
                                <View style={styles.acRecDot}>
                                  <Text style={styles.acRecDotText}>AC</Text>
                                </View>
                              )}
                            </View>
                            <Text style={styles.chipMeta}>
                              {faculty.designation} • Load: {faculty.currentLoad || 0}/{faculty.maxLoad || 16}
                            </Text>
                          </Pressable>
                        );
                      })
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Footer Action Card */}
        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>Audit Allocation Matrix</Text>
          <Text style={styles.footerDesc}>
            Inspect the comprehensive allocation matrix and verify workload compliance prior to timetable synthesis.
          </Text>
          <PrimaryButton
            title="Proceed to Allocation Review"
            icon="verified"
            iconRight="arrow-forward"
            onPress={() => router.push('/hod/allocation-review')}
            style={styles.proceedBtn}
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
  topCard: {
    backgroundColor: '#0F2942',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  decisionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  decisionBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  assignedCounter: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  cardHeading: {
    ...Typography.titleMedium,
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 17,
    marginBottom: 4,
  },
  cardDesc: {
    ...Typography.bodySmall,
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 16,
  },
  courseList: {
    gap: 12,
    marginBottom: Spacing.md,
  },
  allocationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.sm,
  },
  allocHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  allocHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  allocCode: {
    ...Typography.titleMedium,
    color: '#0F2942',
    fontWeight: '900',
    fontSize: 15,
  },
  catBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  catBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  catTheory: {
    backgroundColor: '#EFF6FF',
    color: '#2563EB',
  },
  catLab: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
  },
  catElective: {
    backgroundColor: '#ECFDF5',
    color: '#059669',
  },
  periodsBadge: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
  },
  statusChip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusChipGreen: {
    backgroundColor: '#ECFDF5',
  },
  statusChipGreenText: {
    color: '#059669',
    fontSize: 9,
    fontWeight: '800',
  },
  statusChipAmber: {
    backgroundColor: '#FFFBEB',
  },
  statusChipAmberText: {
    color: '#D97706',
    fontSize: 9,
    fontWeight: '800',
  },
  allocName: {
    ...Typography.titleSmall,
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 8,
  },
  handledByRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 4,
    gap: 6,
    marginBottom: 8,
  },
  handledByLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  handledByVal: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    flex: 1,
    fontWeight: '600',
  },
  assignedBox: {
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  assignedBoxLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0F2942',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  assignedSuccessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  assignedSuccessText: {
    ...Typography.bodyMedium,
    color: '#059669',
    fontWeight: '800',
    fontSize: 12,
  },
  unassignedText: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: '700',
  },
  selectFacultyLabel: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontWeight: '700',
    fontSize: 10,
    marginBottom: 6,
  },
  facultyChipsContainer: {
    gap: 6,
  },
  facultyChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.md,
    padding: 8,
  },
  facultyChipSelected: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  chipTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipName: {
    ...Typography.bodyMedium,
    color: '#0F2942',
    fontWeight: '700',
    fontSize: 12,
  },
  chipNameSelected: {
    color: '#0284C7',
    fontWeight: '800',
  },
  acRecDot: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  acRecDotText: {
    color: '#2563EB',
    fontSize: 8,
    fontWeight: '800',
  },
  chipMeta: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
    marginTop: 2,
  },
  footerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.sm,
  },
  footerTitle: {
    ...Typography.titleSmall,
    color: '#0F2942',
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 2,
  },
  footerDesc: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    marginBottom: 12,
  },
  proceedBtn: {
    backgroundColor: '#0F2942',
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
    marginBottom: Spacing.lg,
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
  emptyCandidatesText: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
    padding: Spacing.sm,
  },
});
