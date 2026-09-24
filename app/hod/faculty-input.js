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
  getCourseFacultyHandlers,
} from '../../constants/demoData';
import { getRegulationSubjects } from '../../services/regulationCurriculumService';

export default function CourseFacultyInputScreen() {
  const router = useRouter();
  const context = getAcademicContext();
  const activeSection = context.section || 'CSE-C';
  const allocations = getHODFacultyAllocations(context);
  const courses = getRegulationSubjects(context);

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <HODHeader
        title="AC Course Faculty Input"
        showBack={true}
        activeCohort={`${context.year || 'III'} / ${context.semester || 'V'} / ${activeSection}`}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Authority Role Distinction Banner */}
        <View style={styles.roleDistinctionCard}>
          <View style={styles.roleTagRow}>
            <View style={styles.acInputTag}>
              <MaterialIcons name="input" size={12} color="#FFFFFF" />
              <Text style={styles.acInputTagText}>AC ADVISORY INPUT</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={14} color="#94A3B8" />
            <View style={styles.hodDecisionTag}>
              <MaterialIcons name="gavel" size={12} color="#FFFFFF" />
              <Text style={styles.hodDecisionTagText}>HOD BINDING DECISION</Text>
            </View>
          </View>
          <Text style={styles.roleHeading}>Course Faculty Input Audit Desk</Text>
          <Text style={styles.roleDesc}>
            The Academic Coordinator supplies syllabus prerequisites and recommended subject-handled faculty. This is operational input; final allocation authority rests solely with the Head of Department.
          </Text>
        </View>

        {/* Course Cards List */}
        {courses.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialIcons name="menu-book" size={36} color={Colors.outlineVariant} />
            <Text style={styles.emptyTitle}>No course faculty input available</Text>
            <Text style={styles.emptySub}>
              The Academic Coordinator has not registered curriculum courses or subject handlers yet for this cohort.
            </Text>
          </View>
        ) : (
          <View style={styles.courseList}>
            {courses.map((course) => {
              const assigned = allocations[course.code];
              const handlers = getCourseFacultyHandlers(course.code);

              return (
                <View key={course.code} style={styles.courseCard}>
                  {/* Course Header */}
                  <View style={styles.courseHeader}>
                    <View style={styles.codeRow}>
                      <Text style={styles.courseCode}>{course.code}</Text>
                      <View
                        style={[
                          styles.categoryPill,
                          course.category === 'THEORY'
                            ? styles.catTheory
                            : course.category === 'LAB'
                            ? styles.catLab
                            : styles.catElective,
                        ]}
                      >
                        <Text style={styles.categoryPillText}>{course.category}</Text>
                      </View>
                      <Text style={styles.periodsTag}>
                        {course.periods || course.periodsPerWeek || 0} Periods/Wk
                      </Text>
                    </View>
                    <Text style={styles.courseName}>{course.name}</Text>
                  </View>

                  {/* Section A: AC Input / Recommended Faculty */}
                  <View style={styles.sectionBlock}>
                    <View style={styles.blockTitleRow}>
                      <MaterialIcons name="group" size={15} color="#2563EB" />
                      <Text style={styles.blockTitleAC}>AC SUBJECT HANDLED FACULTY INPUT</Text>
                    </View>

                    {handlers.length === 0 ? (
                      <View style={styles.emptyHandlersBox}>
                        <Text style={styles.emptyHandlersText}>
                          No subject handled faculty recommendations recorded for this course.
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.recommendedPool}>
                        {handlers.map((fac) => (
                          <View key={fac.id || fac.facultyId} style={styles.recItem}>
                            <View style={styles.recLeft}>
                              <Text style={styles.recName}>{fac.name || fac.facultyName}</Text>
                              <Text style={styles.recMeta}>
                                {fac.role || fac.designation || 'Faculty'}
                                {fac.experience || fac.exp ? ` • ${fac.experience || fac.exp}` : ''}
                              </Text>
                            </View>
                            <Text style={styles.recId}>{fac.id || fac.facultyId}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {course.acInputNotes && (
                      <View style={styles.acNotesBox}>
                        <Text style={styles.acNotesLabel}>AC Note:</Text>
                        <Text style={styles.acNotesText}>{course.acInputNotes}</Text>
                      </View>
                    )}
                  </View>

                  {/* Section B: HOD Binding Decision State */}
                  <View style={styles.sectionBlockDecision}>
                    <View style={styles.blockTitleRow}>
                      <MaterialIcons name="how-to-reg" size={15} color="#0F2942" />
                      <Text style={styles.blockTitleHOD}>HOD ASSIGNED FACULTY</Text>
                    </View>

                    {assigned ? (
                      <View style={styles.assignedBox}>
                        <MaterialIcons name="check-circle" size={18} color="#059669" />
                        <View style={styles.assignedInfo}>
                          <Text style={styles.assignedFacultyName}>{assigned.facultyName}</Text>
                          <Text style={styles.assignedMeta}>
                            {assigned.facultyId} • Binding HOD Order
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.pendingBox}>
                        <MaterialIcons name="hourglass-empty" size={16} color="#D97706" />
                        <Text style={styles.pendingText}>
                          Pending Final HOD Allocation Decision
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Action Button: Proceed to Allocation */}
        <View style={styles.footerActionCard}>
          <Text style={styles.footerActionTitle}>Ready to Assign Course Load?</Text>
          <Text style={styles.footerActionDesc}>
            Proceed to the binding faculty allocation screen to confirm or modify AC recommendations.
          </Text>
          <PrimaryButton
            title="Proceed to HOD Faculty Allocation"
            icon="how-to-reg"
            iconRight="arrow-forward"
            onPress={() => router.push('/hod/faculty-allocation')}
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
  roleDistinctionCard: {
    backgroundColor: '#0F2942',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  roleTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  acInputTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  acInputTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  hodDecisionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  hodDecisionTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  roleHeading: {
    ...Typography.titleMedium,
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 17,
    marginBottom: 4,
  },
  roleDesc: {
    ...Typography.bodySmall,
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 16,
  },
  courseList: {
    gap: 12,
    marginBottom: Spacing.lg,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  courseHeader: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    paddingBottom: 8,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  courseCode: {
    ...Typography.titleMedium,
    color: '#0F2942',
    fontWeight: '900',
    fontSize: 15,
  },
  categoryPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryPillText: {
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
  periodsTag: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
    marginLeft: 'auto',
  },
  courseName: {
    ...Typography.titleSmall,
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  sectionBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.md,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  blockTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  blockTitleAC: {
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  recommendedPool: {
    gap: 6,
  },
  recItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recLeft: {
    flex: 1,
  },
  recName: {
    ...Typography.bodyMedium,
    color: '#0F2942',
    fontWeight: '700',
    fontSize: 12,
  },
  recMeta: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
  },
  recId: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  acNotesBox: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 4,
  },
  acNotesLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  acNotesText: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    flex: 1,
    fontStyle: 'italic',
  },
  sectionBlockDecision: {
    backgroundColor: '#F1F5F9',
    borderRadius: BorderRadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  blockTitleHOD: {
    color: '#0F2942',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  assignedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 4,
  },
  assignedInfo: {
    flex: 1,
  },
  assignedFacultyName: {
    ...Typography.bodyMedium,
    color: '#059669',
    fontWeight: '800',
    fontSize: 13,
  },
  assignedMeta: {
    ...Typography.bodySmall,
    color: '#065F46',
    fontSize: 10,
  },
  pendingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  pendingText: {
    ...Typography.bodySmall,
    color: '#D97706',
    fontSize: 11,
    fontWeight: '700',
  },
  footerActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.sm,
  },
  footerActionTitle: {
    ...Typography.titleSmall,
    color: '#0F2942',
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 2,
  },
  footerActionDesc: {
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
  emptyHandlersBox: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  emptyHandlersText: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
    fontSize: 12,
  },
});
