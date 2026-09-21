import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import {
  getFacultyWorkloadById,
  validateWorkloadRecord,
} from '../../constants/workloadMasterData';

export default function FacultyWorkloadDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const faculty = useMemo(() => {
    return getFacultyWorkloadById(id);
  }, [id]);

  if (!faculty) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.onPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Faculty Record Not Found</Text>
        </View>
        <View style={styles.notFoundContainer}>
          <MaterialIcons name="error-outline" size={48} color={Colors.error} />
          <Text style={styles.notFoundTitle}>Record Not Found</Text>
          <Text style={styles.notFoundSub}>No workload profile found for faculty ID: {id}</Text>
          <TouchableOpacity style={styles.returnBtn} onPress={() => router.back()}>
            <Text style={styles.returnBtnText}>Return to Master Register</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const validation = validateWorkloadRecord(faculty);
  const isMatched = faculty.status === 'MATCHED';
  const isIncomplete = faculty.status === 'INCOMPLETE SOURCE DATA';
  const isReviewRequired = faculty.status === 'REVIEW REQUIRED';

  // Helper to get role badge style & icon
  const getRoleBadgeConfig = (role = '') => {
    const rLower = role.toLowerCase();
    if (rLower.includes('hod')) {
      return { bg: '#001428', text: '#ffffff', label: 'HOD', icon: 'security' };
    }
    if (rLower.includes('academic coordinator')) {
      return { bg: '#002e1d', text: '#85f8c4', label: 'ACADEMIC COORDINATOR', icon: 'verified-user' };
    }
    if (rLower.includes('class advisor')) {
      return { bg: '#dbe1ff', text: '#00174b', label: 'CLASS ADVISOR', icon: 'supervised-user-circle' };
    }
    if (rLower.includes('proctor')) {
      return { bg: '#eff4ff', text: '#0051d5', label: 'PROCTOR', icon: 'visibility' };
    }
    if (rLower.includes('placement')) {
      return { bg: '#fef3c7', text: '#92400e', label: 'PLACEMENT', icon: 'work' };
    }
    if (rLower.includes('timetable')) {
      return { bg: '#f0fdf4', text: '#166534', label: 'TIMETABLE', icon: 'schedule' };
    }
    if (rLower.includes('nba') || rLower.includes('naac') || rLower.includes('iqac')) {
      return { bg: '#fae8ff', text: '#86198f', label: 'ACCREDITATION', icon: 'military-tech' };
    }
    if (rLower.includes('pcd')) {
      return { bg: '#e0e7ff', text: '#3730a3', label: 'PCD CLUB', icon: 'groups' };
    }
    if (rLower.includes('incharge') || rLower.includes('i/c')) {
      return { bg: '#fee2e2', text: '#991b1b', label: 'INCHARGE', icon: 'manage-accounts' };
    }
    return { bg: Colors.surfaceContainerHighest, text: Colors.onSurface, label: 'COORDINATOR', icon: 'star-outline' };
  };

  // Render Teaching Sub-Section
  const renderTeachingSubSection = (title, items, iconName) => {
    if (!items || items.length === 0) return null;

    return (
      <View style={styles.subCategoryBlock}>
        <View style={styles.subCategoryHeader}>
          <MaterialIcons name={iconName} size={16} color={Colors.secondary} />
          <Text style={styles.subCategoryTitle}>{title} ({items.length})</Text>
        </View>

        {items.map((item, idx) => (
          <View key={idx} style={styles.teachingCard}>
            <View style={styles.teachingCardTop}>
              <View style={styles.teachingCategoryBadge}>
                <Text style={styles.teachingCategoryBadgeText}>{item.category.toUpperCase()}</Text>
              </View>

              <View
                style={[
                  styles.courseCodeBadge,
                  !item.courseCode && styles.courseCodeMissingBadge,
                ]}
              >
                <Text
                  style={[
                    styles.courseCodeBadgeText,
                    !item.courseCode && styles.courseCodeMissingText,
                  ]}
                >
                  {item.courseCode || 'N/A (GENERAL)'}
                </Text>
              </View>

              <View style={styles.hoursBadge}>
                <MaterialIcons name="schedule" size={12} color={Colors.secondary} />
                <Text style={styles.hoursBadgeText}>{item.hours} Hours</Text>
              </View>
            </View>

            <Text style={styles.courseName}>{item.courseName}</Text>

            <View style={styles.allocationRow}>
              <MaterialIcons name="school" size={14} color={Colors.onSurfaceVariant} />
              <Text style={styles.allocationText}>
                Academic Context: <Text style={styles.allocationHighlight}>{item.allocation || 'General Allocation'}</Text>
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.onPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerSubtitle}>FACULTY WORKLOAD PROFILE</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>{faculty.facultyName}</Text>
        </View>
        <View style={styles.facultyIdBadge}>
          <Text style={styles.facultyIdBadgeText}>{faculty.facultyId}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Faculty Executive Header Card */}
        <View style={styles.profileHeroCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {faculty.facultyName.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s*/i, '').charAt(0)}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{faculty.facultyName}</Text>
            <Text style={styles.profileDesignation}>{faculty.designation}</Text>
            <Text style={styles.profileDept}>Department of Computer Science & Engineering</Text>
          </View>

          <View
            style={[
              styles.heroStatusBadge,
              isMatched && styles.heroStatusMatched,
              isIncomplete && styles.heroStatusIncomplete,
              isReviewRequired && styles.heroStatusReview,
            ]}
          >
            <MaterialIcons
              name={isMatched ? 'check-circle' : isIncomplete ? 'help-outline' : 'error'}
              size={14}
              color={
                isMatched
                  ? Colors.successForest
                  : isIncomplete
                  ? Colors.warningAmber
                  : Colors.error
              }
            />
            <Text
              style={[
                styles.heroStatusText,
                isMatched && styles.heroStatusTextMatched,
                isIncomplete && styles.heroStatusTextIncomplete,
                isReviewRequired && styles.heroStatusTextReview,
              ]}
            >
              {faculty.status}
            </Text>
          </View>
        </View>

        {/* Summary Cards Row */}
        <View style={styles.summaryCardsRow}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardHeader}>
              <MaterialIcons name="menu-book" size={16} color={Colors.secondary} />
              <Text style={styles.summaryCardLabel}>TEACHING</Text>
            </View>
            <Text style={styles.summaryCardValue}>{faculty.teachingHours}</Text>
            <Text style={styles.summaryCardUnit}>Hours / Week</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryCardHeader}>
              <MaterialIcons name="stars" size={16} color={Colors.onTertiaryContainer} />
              <Text style={styles.summaryCardLabel}>RESPONSIBILITY</Text>
            </View>
            <Text style={styles.summaryCardValue}>{faculty.responsibilityHours}</Text>
            <Text style={styles.summaryCardUnit}>Hours / Week</Text>
          </View>

          <View style={[styles.summaryCard, styles.summaryCardHighlight]}>
            <View style={styles.summaryCardHeader}>
              <MaterialIcons name="functions" size={16} color={Colors.onSecondaryFixed} />
              <Text style={styles.summaryCardLabelHighlight}>TOTAL LOAD</Text>
            </View>
            <Text style={styles.summaryCardValueHighlight}>{faculty.calculatedTotalHours}</Text>
            <Text style={styles.summaryCardUnitHighlight}>
              {faculty.sourceTotalHours !== null ? `Source: ${faculty.sourceTotalHours}h` : 'Source: N/A'}
            </Text>
          </View>
        </View>

        {/* Source vs Calculated Total Card */}
        <View style={styles.auditCard}>
          <View style={styles.auditCardHeader}>
            <MaterialIcons name="balance" size={18} color={Colors.onSurface} />
            <Text style={styles.auditCardTitle}>SOURCE VS CALCULATED TOTAL AUDIT</Text>
          </View>

          <View style={styles.auditComparisonRow}>
            <View style={styles.auditSide}>
              <Text style={styles.auditLabel}>Source Supplied Total</Text>
              <Text style={styles.auditNumber}>
                {faculty.sourceTotalHours !== null ? `${faculty.sourceTotalHours} Hours` : 'NOT SPECIFIED'}
              </Text>
              <Text style={styles.auditHint}>From original workload master</Text>
            </View>

            <View style={styles.auditDivider}>
              <MaterialIcons
                name={isMatched ? 'check' : isIncomplete ? 'remove' : 'close'}
                size={20}
                color={
                  isMatched
                    ? Colors.successForest
                    : isIncomplete
                    ? Colors.warningAmber
                    : Colors.error
                }
              />
            </View>

            <View style={styles.auditSide}>
              <Text style={styles.auditLabel}>Calculated Total</Text>
              <Text style={styles.auditNumber}>{faculty.calculatedTotalHours} Hours</Text>
              <Text style={styles.auditHint}>
                {faculty.teachingHours}h Teaching + {faculty.responsibilityHours}h Resp.
              </Text>
            </View>
          </View>

          {faculty.discrepancyNote && (
            <View style={styles.auditNoteContainer}>
              <MaterialIcons name="info-outline" size={16} color={Colors.onSurfaceVariant} />
              <Text style={styles.auditNoteText}>{faculty.discrepancyNote}</Text>
            </View>
          )}
        </View>

        {/* TEACHING ALLOCATION SECTION */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="school" size={20} color={Colors.primary} />
            <Text style={styles.sectionHeading}>TEACHING ALLOCATION</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{faculty.teachingHours}h Total</Text>
            </View>
          </View>

          {/* Subsections: UG Theory 1, UG Theory 2, Lab 1, Lab 2, PG, Others */}
          {faculty.teaching.ugTheory1.length === 0 &&
          faculty.teaching.ugTheory2.length === 0 &&
          faculty.teaching.lab1.length === 0 &&
          faculty.teaching.lab2.length === 0 &&
          faculty.teaching.pg.length === 0 &&
          faculty.teaching.others.length === 0 ? (
            <View style={styles.emptySubsection}>
              <Text style={styles.emptySubsectionText}>No teaching allocations recorded in source.</Text>
            </View>
          ) : (
            <>
              {renderTeachingSubSection('UG THEORY 1', faculty.teaching.ugTheory1, 'auto-stories')}
              {renderTeachingSubSection('UG THEORY 2', faculty.teaching.ugTheory2, 'menu-book')}
              {renderTeachingSubSection('LABORATORY 1', faculty.teaching.lab1, 'biotech')}
              {renderTeachingSubSection('LABORATORY 2', faculty.teaching.lab2, 'science')}
              {renderTeachingSubSection('POST GRADUATE (PG)', faculty.teaching.pg, 'psychology')}
              {renderTeachingSubSection('OTHERS / PBL / SKILL DEV', faculty.teaching.others, 'extension')}
            </>
          )}
        </View>

        {/* RESPONSIBILITIES SECTION */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="workspace-premium" size={20} color={Colors.primary} />
            <Text style={styles.sectionHeading}>RESPONSIBILITIES</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{faculty.responsibilityHours}h Total</Text>
            </View>
          </View>

          {faculty.responsibilities.length === 0 ? (
            <View style={styles.emptySubsection}>
              <Text style={styles.emptySubsectionText}>No administrative responsibilities assigned in source.</Text>
            </View>
          ) : (
            faculty.responsibilities.map((resp, idx) => {
              const badge = getRoleBadgeConfig(resp.role);
              return (
                <View key={idx} style={styles.respCard}>
                  <View style={styles.respTopRow}>
                    <View style={[styles.roleBadge, { backgroundColor: badge.bg }]}>
                      <MaterialIcons name={badge.icon} size={12} color={badge.text} />
                      <Text style={[styles.roleBadgeText, { color: badge.text }]}>
                        {badge.label}
                      </Text>
                    </View>

                    <View style={styles.hoursBadge}>
                      <MaterialIcons name="schedule" size={12} color={Colors.secondary} />
                      <Text style={styles.hoursBadgeText}>{resp.hours} Hours</Text>
                    </View>
                  </View>

                  <Text style={styles.respRoleName}>{resp.role}</Text>

                  {resp.allocation ? (
                    <View style={styles.allocationRow}>
                      <MaterialIcons name="tune" size={14} color={Colors.onSurfaceVariant} />
                      <Text style={styles.allocationText}>
                        Scope / Allocation: <Text style={styles.allocationHighlight}>{resp.allocation}</Text>
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.allocationRow}>
                      <MaterialIcons name="apartment" size={14} color={Colors.onSurfaceVariant} />
                      <Text style={styles.allocationText}>Scope: Department / Institutional Level</Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>

        {/* Institutional Master Notice */}
        <View style={styles.footerNote}>
          <MaterialIcons name="verified" size={16} color={Colors.secondary} />
          <Text style={styles.footerNoteText}>
            This record belongs to the Faculty Workload Master Register. It informs academic coordinators and HOD allocation without modifying TimetableSession data.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.margin,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryContainer,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onPrimaryContainer,
    letterSpacing: 0.5,
    fontFamily: Typography.labelMono.fontFamily,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onPrimary,
  },
  facultyIdBadge: {
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.onPrimaryContainer,
  },
  facultyIdBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onPrimary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.margin,
    paddingBottom: Spacing.xxl * 2,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onSurface,
    marginTop: Spacing.md,
  },
  notFoundSub: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  returnBtn: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  returnBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.onSecondary,
  },
  profileHeroCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  profileAvatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.onPrimary,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.onSurface,
    textAlign: 'center',
  },
  profileDesignation: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondary,
    marginTop: 2,
  },
  profileDept: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  heroStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  heroStatusMatched: {
    backgroundColor: Colors.successBg,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  heroStatusIncomplete: {
    backgroundColor: Colors.warningBg,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  heroStatusReview: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  heroStatusText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Typography.labelMono.fontFamily,
  },
  heroStatusTextMatched: {
    color: Colors.successForest,
  },
  heroStatusTextIncomplete: {
    color: Colors.warningAmber,
  },
  heroStatusTextReview: {
    color: Colors.error,
  },
  summaryCardsRow: {
    flexDirection: 'row',
    gap: Spacing.xs + 4,
    marginBottom: Spacing.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    alignItems: 'center',
    ...Shadows.sm,
  },
  summaryCardHighlight: {
    backgroundColor: Colors.secondaryFixed,
    borderColor: Colors.secondaryFixedDim,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  summaryCardLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  summaryCardLabelHighlight: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSecondaryFixed,
    fontFamily: Typography.labelMono.fontFamily,
  },
  summaryCardValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  summaryCardValueHighlight: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.secondary,
  },
  summaryCardUnit: {
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  summaryCardUnitHighlight: {
    fontSize: 9,
    color: Colors.onSecondaryFixedVariant,
    fontWeight: '600',
    marginTop: 2,
  },
  auditCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  auditCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainer,
    paddingBottom: Spacing.xs,
  },
  auditCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onSurface,
    fontFamily: Typography.labelMono.fontFamily,
  },
  auditComparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  auditSide: {
    flex: 1,
    alignItems: 'center',
  },
  auditDivider: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  auditLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    marginBottom: 2,
  },
  auditNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  auditHint: {
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    textAlign: 'center',
  },
  auditNoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  auditNoteText: {
    flex: 1,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  sectionContainer: {
    marginBottom: Spacing.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.3,
  },
  countBadge: {
    marginLeft: 'auto',
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  emptySubsection: {
    padding: Spacing.md,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  emptySubsectionText: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  subCategoryBlock: {
    marginBottom: Spacing.sm,
  },
  subCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
    paddingLeft: 2,
  },
  subCategoryTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 0.5,
    fontFamily: Typography.labelMono.fontFamily,
  },
  teachingCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    marginBottom: Spacing.xs + 2,
    ...Shadows.sm,
  },
  teachingCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
    gap: 6,
  },
  teachingCategoryBadge: {
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  teachingCategoryBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  courseCodeBadge: {
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  courseCodeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onPrimary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  courseCodeMissingBadge: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  courseCodeMissingText: {
    color: Colors.onSurfaceVariant,
  },
  hoursBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryFixed,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 3,
    marginLeft: 'auto',
  },
  hoursBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onSecondaryFixedVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  courseName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
    marginBottom: Spacing.xs,
  },
  allocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  allocationText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  allocationHighlight: {
    fontWeight: '700',
    color: Colors.onSurface,
  },
  respCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    marginBottom: Spacing.xs + 2,
    ...Shadows.sm,
  },
  respTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: Typography.labelMono.fontFamily,
  },
  respRoleName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
    marginBottom: Spacing.xs,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
  },
  footerNoteText: {
    flex: 1,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    lineHeight: 16,
  },
});
