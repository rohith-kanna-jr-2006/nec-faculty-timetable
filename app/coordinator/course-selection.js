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
import { CURRICULUM_COURSES } from '../../constants/demoData';
import ACHeader from '../../components/ACHeader';
import ACBottomNav from '../../components/ACBottomNav';
import PrimaryButton from '../../components/PrimaryButton';

export default function CourseSelectionScreen() {
  const router = useRouter();

  // Academic context state
  const [selectedYear, setSelectedYear] = useState('III Year');
  const [selectedSemester, setSelectedSemester] = useState('Sem V');
  const [selectedSection, setSelectedSection] = useState('C');

  // Filter groups from CURRICULUM_COURSES
  const theoryCourses = CURRICULUM_COURSES.filter((c) => c.category === 'THEORY');
  const labCourses = CURRICULUM_COURSES.filter((c) => c.category === 'LAB');
  const electiveCourses = CURRICULUM_COURSES.filter((c) => c.category === 'ELECTIVE');
  const otherCourses = CURRICULUM_COURSES.filter((c) => c.category === 'OTHER');

  const totalPeriods = CURRICULUM_COURSES.reduce((acc, c) => acc + c.periodsPerWeek, 0);

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <ACHeader title="Configure" showBack={true} activeCohort="III / V / CSE-C" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Progression Card */}
        <View style={styles.progressionCard}>
          <View style={styles.progressionLeft}>
            <Text style={styles.progressionTag}>WORKFLOW PROGRESSION</Text>
            <View style={styles.stepTitleRow}>
              <Text style={styles.stepNumber}>Step 1 of 4</Text>
              <Text style={styles.stepName}>• Class & Course Setup</Text>
            </View>
          </View>
          <View style={styles.progressionBadge}>
            <View style={styles.pulsingDot} />
            <Text style={styles.progressionBadgeText}>25% Done</Text>
          </View>
        </View>

        {/* Academic Target Node Selector Card */}
        <View style={styles.targetNodeCard}>
          <View style={styles.targetNodeTop}>
            <View style={styles.targetNodeHeader}>
              <MaterialIcons name="account-tree" size={20} color={Colors.secondary} />
              <Text style={styles.targetNodeTitle}>Academic Target Node</Text>
            </View>
            <View style={styles.regulationBadge}>
              <Text style={styles.regulationBadgeText}>R2022 AUTO</Text>
            </View>
          </View>

          {/* Department Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>DEPARTMENT</Text>
            <View style={styles.deptRow}>
              <View style={styles.deptLeft}>
                <MaterialIcons name="school" size={18} color={Colors.primary} />
                <Text style={styles.deptName}>Computer Science & Engineering</Text>
              </View>
              <View style={styles.deptCodeChip}>
                <Text style={styles.deptCodeText}>CSE</Text>
              </View>
            </View>
          </View>

          {/* Academic Year Selection */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>ACADEMIC YEAR</Text>
              <Text style={styles.ayLabelText}>AY 2024–25</Text>
            </View>
            <View style={styles.segmentedRow}>
              {['I Year', 'II Year', 'III Year', 'IV Year'].map((year) => {
                const isSelected = selectedYear === year;
                return (
                  <Pressable
                    key={year}
                    onPress={() => setSelectedYear(year)}
                    style={[
                      styles.segmentBtn,
                      isSelected ? styles.segmentBtnActive : styles.segmentBtnInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        isSelected ? styles.segmentTextActive : styles.segmentTextInactive,
                      ]}
                    >
                      {year}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Semester and Target Section Grid */}
          <View style={styles.dualFieldRow}>
            {/* Semester */}
            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>SEMESTER</Text>
              <View style={styles.segmentedRow}>
                {['Sem V', 'Sem VI'].map((sem) => {
                  const isSelected = selectedSemester === sem;
                  return (
                    <Pressable
                      key={sem}
                      onPress={() => setSelectedSemester(sem)}
                      style={[
                        styles.segmentBtn,
                        isSelected ? styles.segmentBtnActiveSecondary : styles.segmentBtnInactive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          isSelected ? styles.segmentTextActive : styles.segmentTextInactive,
                        ]}
                      >
                        {sem}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Target Section */}
            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>TARGET SECTION</Text>
              <View style={styles.segmentedRow}>
                {['A', 'B', 'C', 'D'].map((sec) => {
                  const isSelected = selectedSection === sec;
                  return (
                    <Pressable
                      key={sec}
                      onPress={() => setSelectedSection(sec)}
                      style={[
                        styles.segmentBtn,
                        isSelected ? styles.segmentBtnActive : styles.segmentBtnInactive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          isSelected ? styles.segmentTextActive : styles.segmentTextInactive,
                        ]}
                      >
                        {sec}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Assigned Class In-Charge */}
          <View style={styles.inChargeRow}>
            <View style={styles.inChargeLeft}>
              <MaterialIcons name="verified-user" size={18} color={Colors.secondary} />
              <Text style={styles.inChargeLabel}>Assigned Class In-Charge</Text>
            </View>
            <View style={styles.inChargeBadge}>
              <Text style={styles.inChargeBadgeText}>Advisor: Mr. R. Manikandan</Text>
            </View>
          </View>
        </View>

        {/* Official Curriculum Banner */}
        <View style={styles.curriculumLockBanner}>
          <View style={styles.curriculumBannerTop}>
            <View style={styles.curriculumBannerLeft}>
              <MaterialIcons name="lock" size={20} color={Colors.secondary} />
              <Text style={styles.curriculumBannerTitle}>Official Curriculum • Locked & Loaded</Text>
            </View>
            <View style={styles.verifiedChip}>
              <Text style={styles.verifiedChipText}>AUTO VERIFIED</Text>
            </View>
          </View>
          <Text style={styles.curriculumBannerDesc}>
            Automatically loaded for <Text style={styles.boldDark}>III Year – V Semester</Text> under{' '}
            <Text style={styles.boldDark}>R2022 Autonomous Regulations</Text>. Course matrix and period
            quotas are system-locked. Class Advisors proceed directly to faculty allocation.
          </Text>
        </View>

        {/* Curriculum Structure Overview Header */}
        <View style={styles.structureSummaryCard}>
          <View>
            <View style={styles.structureTitleRow}>
              <MaterialIcons name="verified" size={18} color={Colors.secondary} />
              <Text style={styles.structureTitle}>Curriculum Structure</Text>
            </View>
            <View style={styles.structureSubRow}>
              <Text style={styles.structureSubCount}>12 Courses Total</Text>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.structureSubPeriods}>{totalPeriods} / 35 Periods Req.</Text>
            </View>
          </View>
          <View style={styles.readOnlyBadge}>
            <MaterialIcons name="lock-clock" size={16} color={Colors.secondary} />
            <Text style={styles.readOnlyBadgeText}>READ-ONLY</Text>
          </View>
        </View>

        {/* Category 1: THEORY */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryTitleRow}>
              <View style={[styles.categoryDot, { backgroundColor: Colors.secondary }]} />
              <Text style={styles.categoryTitle}>THEORY</Text>
            </View>
            <View style={styles.categoryMetaBadge}>
              <Text style={styles.categoryMetaText}>3 Courses • 10 Periods</Text>
            </View>
          </View>
          <View style={styles.courseCardsCol}>
            {theoryCourses.map((course) => (
              <View key={course.code} style={styles.courseCard}>
                <View style={styles.courseCardTop}>
                  <Text style={styles.courseCode}>{course.code}</Text>
                  <View style={styles.periodTag}>
                    <Text style={styles.periodTagText}>{course.periodsPerWeek} P / Wk</Text>
                  </View>
                </View>
                <Text style={styles.courseName}>{course.name}</Text>
                <View style={styles.courseMetaTag}>
                  <Text style={styles.courseMetaTagText}>{course.categoryLabel}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Category 2: LABORATORY / PRACTICAL */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryTitleRow}>
              <View style={[styles.categoryDot, { backgroundColor: Colors.onTertiaryContainer }]} />
              <Text style={styles.categoryTitle}>LABORATORY / PRACTICAL</Text>
            </View>
            <View style={styles.categoryMetaBadge}>
              <Text style={styles.categoryMetaText}>2 Labs • 8 Continuous P</Text>
            </View>
          </View>
          <View style={styles.courseCardsCol}>
            {labCourses.map((course) => (
              <View key={course.code} style={styles.courseCard}>
                <View style={styles.courseCardTop}>
                  <Text style={styles.courseCode}>{course.code}</Text>
                  <View style={[styles.periodTag, { backgroundColor: Colors.surfaceContainer }]}>
                    <Text style={[styles.periodTagText, { color: Colors.onTertiaryContainer }]}>
                      {course.periodsPerWeek} Cont. Periods
                    </Text>
                  </View>
                </View>
                <Text style={styles.courseName}>{course.name}</Text>
                <View style={styles.courseMetaTag}>
                  <Text style={styles.courseMetaTagText}>{course.categoryLabel} • Dual Faculty</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Category 3: ELECTIVES */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryTitleRow}>
              <View style={[styles.categoryDot, { backgroundColor: Colors.secondaryContainer }]} />
              <Text style={styles.categoryTitle}>ELECTIVE</Text>
            </View>
            <View style={styles.categoryMetaBadge}>
              <Text style={styles.categoryMetaText}>3 Courses • 9 Periods</Text>
            </View>
          </View>
          <View style={styles.courseCardsCol}>
            {electiveCourses.map((course) => (
              <View key={course.code} style={styles.courseCard}>
                <View style={styles.courseCardTop}>
                  <Text style={styles.courseCode}>{course.code}</Text>
                  <View style={styles.periodTag}>
                    <Text style={styles.periodTagText}>{course.periodsPerWeek} P / Wk</Text>
                  </View>
                </View>
                <Text style={styles.courseName}>{course.name}</Text>
                <View style={styles.courseMetaTag}>
                  <Text style={styles.courseMetaTagText}>{course.categoryLabel}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Category 4: OTHER COURSES */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryTitleRow}>
              <View style={[styles.categoryDot, { backgroundColor: Colors.outline }]} />
              <Text style={styles.categoryTitle}>OTHER COURSE / APPLIED</Text>
            </View>
            <View style={styles.categoryMetaBadge}>
              <Text style={styles.categoryMetaText}>4 Courses • 8 Periods</Text>
            </View>
          </View>
          <View style={styles.courseCardsCol}>
            {otherCourses.map((course) => (
              <View key={course.code} style={styles.courseCard}>
                <View style={styles.courseCardTop}>
                  <Text style={styles.courseCode}>{course.code}</Text>
                  <View style={styles.periodTag}>
                    <Text style={styles.periodTagText}>{course.periodsPerWeek} P / Wk</Text>
                  </View>
                </View>
                <Text style={styles.courseName}>{course.name}</Text>
                <View style={styles.courseMetaTag}>
                  <Text style={styles.courseMetaTagText}>{course.categoryLabel}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Workload Quota Bar */}
        <View style={styles.quotaCard}>
          <View style={styles.quotaHeader}>
            <Text style={styles.quotaTitle}>Curriculum Workload Quota</Text>
            <Text style={styles.quotaStatus}>100% Target Met (35/35)</Text>
          </View>
          <View style={styles.quotaBar}>
            <View style={[styles.quotaSeg, { width: '28.57%', backgroundColor: Colors.secondary }]} />
            <View style={[styles.quotaSeg, { width: '22.85%', backgroundColor: Colors.onTertiaryContainer }]} />
            <View style={[styles.quotaSeg, { width: '25.71%', backgroundColor: Colors.secondaryContainer }]} />
            <View style={[styles.quotaSeg, { width: '22.85%', backgroundColor: Colors.outline }]} />
          </View>
          <View style={styles.quotaLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.secondary }]} />
              <Text style={styles.legendText}>Theory (10)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.onTertiaryContainer }]} />
              <Text style={styles.legendText}>Labs (8)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.secondaryContainer }]} />
              <Text style={styles.legendText}>Electives (9)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.outline }]} />
              <Text style={styles.legendText}>Others (8)</Text>
            </View>
          </View>
        </View>

        {/* Bottom Proceed CTA */}
        <View style={styles.proceedCard}>
          <View style={styles.proceedInfoRow}>
            <View>
              <Text style={styles.proceedLabel}>CURRICULUM VERIFIED</Text>
              <Text style={styles.proceedDesc}>All 12 courses automatically loaded from curriculum</Text>
            </View>
            <View style={styles.lockedBadge}>
              <MaterialIcons name="check-circle" size={15} color={Colors.onTertiaryContainer} />
              <Text style={styles.lockedBadgeText}>LOCKED</Text>
            </View>
          </View>

          <PrimaryButton
            title="Proceed to Faculty Allocation"
            iconRight="arrow-forward"
            onPress={() => router.push('/coordinator/faculty-assignment')}
            style={styles.proceedBtn}
          />
        </View>
      </ScrollView>

      <ACBottomNav activeTab="configure" />
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
  progressionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  progressionLeft: {
    gap: 3,
  },
  progressionTag: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
    letterSpacing: 0.5,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
  },
  stepName: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    fontWeight: '500',
  },
  progressionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  pulsingDot: {
    width: 7,
    height: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
  },
  progressionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  targetNodeCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  targetNodeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  targetNodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  targetNodeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  regulationBadge: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  regulationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  fieldGroup: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ayLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  deptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
  },
  deptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deptName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  deptCodeChip: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  deptCodeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onPrimary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLow,
    padding: 3,
    borderRadius: BorderRadius.lg,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  segmentBtnActiveSecondary: {
    backgroundColor: Colors.secondary,
    ...Shadows.sm,
  },
  segmentBtnInactive: {
    backgroundColor: 'transparent',
  },
  segmentText: {
    fontSize: 11,
    fontFamily: Typography.labelMono.fontFamily,
  },
  segmentTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  segmentTextInactive: {
    color: Colors.onSurfaceVariant,
    fontWeight: '500',
  },
  dualFieldRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  halfCol: {
    flex: 1,
    gap: 4,
  },
  inChargeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
  },
  inChargeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inChargeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  inChargeBadge: {
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  inChargeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onSecondaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  curriculumLockBanner: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
    ...Shadows.sm,
  },
  curriculumBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  curriculumBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  curriculumBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  verifiedChip: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: BorderRadius.xs,
  },
  verifiedChipText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: Typography.labelMono.fontFamily,
  },
  curriculumBannerDesc: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 17,
  },
  boldDark: {
    fontWeight: '700',
    color: Colors.primary,
  },
  structureSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  structureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  structureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  structureSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  structureSubCount: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  bullet: {
    fontSize: 10,
    color: Colors.outlineVariant,
  },
  structureSubPeriods: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onTertiaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  readOnlyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
  },
  readOnlyBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  categorySection: {
    gap: 6,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  categoryMetaBadge: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  categoryMetaText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  courseCardsCol: {
    gap: 6,
  },
  courseCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerLow,
    gap: 4,
    ...Shadows.sm,
  },
  courseCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  courseCode: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  periodTag: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  periodTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  courseName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  courseMetaTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: BorderRadius.xs,
  },
  courseMetaTagText: {
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  quotaCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: 8,
    ...Shadows.sm,
  },
  quotaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quotaTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  quotaStatus: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onTertiaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  quotaBar: {
    flexDirection: 'row',
    height: 10,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  quotaSeg: {
    height: '100%',
  },
  quotaLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
  },
  legendText: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  proceedCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: 10,
    ...Shadows.md,
  },
  proceedInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  proceedLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  proceedDesc: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 1,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  lockedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.onTertiaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  proceedBtn: {
    width: '100%',
  },
});
