import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import {
  CURRICULUM_COURSES,
  COURSE_FACULTY_HANDLERS,
  COURSE_ALLOCATION_CONFIG,
  INITIAL_FACULTY_ALLOCATIONS,
  assignmentAuthorityRole,
} from '../../constants/demoData';
import ACHeader from '../../components/ACHeader';
import ACBottomNav from '../../components/ACBottomNav';
import PrimaryButton from '../../components/PrimaryButton';

export default function FacultyAssignmentScreen() {
  const router = useRouter();

  // Active filter category: 'all' | 'THEORY' | 'LAB' | 'SAS' | 'OTHER'
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Allocation State per course code adhering to the authoritative allocation model
  const [allocations, setAllocations] = useState(INITIAL_FACULTY_ALLOCATIONS);

  // Modal state for selecting faculty
  // modalConfig: { courseCode, slotType: 'THEORY' | 'LAB_ADDITIONAL' | 'SAS' | 'OTHER', slotIndex?: number }
  const [modalConfig, setModalConfig] = useState(null);

  // Helper to compute status for each course according to rules:
  // Statuses: 'ASSIGNED' | 'PARTIALLY ASSIGNED' | 'NOT ASSIGNED' | 'INVALID'
  const getCourseAllocationStatus = (courseCode, currentAllocations = allocations) => {
    const config = COURSE_ALLOCATION_CONFIG[courseCode];
    const alloc = currentAllocations[courseCode];
    if (!config || !alloc) return 'NOT ASSIGNED';

    if (config.allocationRule === 'SINGLE_FACULTY') {
      // RULE A - THEORY: Exactly one faculty
      if (!alloc.faculty) return 'NOT ASSIGNED';
      const available = COURSE_FACULTY_HANDLERS[courseCode] || [];
      if (!available.includes(alloc.faculty)) return 'INVALID';
      return 'ASSIGNED';
    }

    if (config.allocationRule === 'PRIMARY_PLUS_ADDITIONAL') {
      // RULE B - LAB: Primary faculty (linked from theory) + at least one additional staff
      // Primary faculty must exist and additional staff must exist and cannot duplicate primary or each other
      const primary = alloc.primaryFaculty;
      const additional = alloc.additionalFaculty || [];

      if (!primary && additional.length === 0) return 'NOT ASSIGNED';
      if (!primary && additional.length > 0) return 'INVALID';
      if (primary && additional.length === 0) return 'PARTIALLY ASSIGNED';

      // Check if any additional is unselected (empty string)
      const validAdditional = additional.filter((f) => f && f.trim().length > 0);
      if (validAdditional.length === 0) return 'PARTIALLY ASSIGNED';

      // Check duplicate between primary and additional
      if (validAdditional.includes(primary)) return 'INVALID';

      // Check duplicate among additionals
      const uniqueAdditional = new Set(validAdditional);
      if (uniqueAdditional.size !== validAdditional.length) return 'INVALID';

      return 'ASSIGNED';
    }

    if (config.allocationRule === 'MINIMUM_TWO') {
      // RULE C - SAS: Minimum two faculty required, no duplicate
      const facultyList = (alloc.faculty || []).filter((f) => f && f.trim().length > 0);
      if (facultyList.length === 0) return 'NOT ASSIGNED';
      if (facultyList.length < 2) return 'PARTIALLY ASSIGNED';

      // Check duplicates
      const unique = new Set(facultyList);
      if (unique.size !== facultyList.length) return 'INVALID';

      return 'ASSIGNED';
    }

    if (config.allocationRule === 'STAFFS_HANDLED') {
      // RULE D - OTHER: Staff count is 1, 2, or 3. Exactly that many distinct faculty selected.
      const targetCount = alloc.staffCount || 1;
      const facultyList = (alloc.faculty || []).slice(0, targetCount);
      const selectedNonEmpty = facultyList.filter((f) => f && f.trim().length > 0);

      if (selectedNonEmpty.length === 0) return 'NOT ASSIGNED';
      if (selectedNonEmpty.length < targetCount) return 'PARTIALLY ASSIGNED';

      // Check duplicate
      const unique = new Set(selectedNonEmpty);
      if (unique.size !== targetCount) return 'INVALID';

      return 'ASSIGNED';
    }

    return 'NOT ASSIGNED';
  };

  // Status Chip Style & Colors helper
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'ASSIGNED':
        return {
          label: 'ASSIGNED',
          badgeStyle: styles.statusBadgeAssigned,
          dotStyle: styles.statusDotAssigned,
          textStyle: styles.statusTextAssigned,
        };
      case 'PARTIALLY ASSIGNED':
        return {
          label: 'PARTIALLY ASSIGNED',
          badgeStyle: styles.statusBadgePartial,
          dotStyle: styles.statusDotPartial,
          textStyle: styles.statusTextPartial,
        };
      case 'INVALID':
        return {
          label: 'INVALID',
          badgeStyle: styles.statusBadgeInvalid,
          dotStyle: styles.statusDotInvalid,
          textStyle: styles.statusTextInvalid,
        };
      case 'NOT ASSIGNED':
      default:
        return {
          label: 'NOT ASSIGNED',
          badgeStyle: styles.statusBadgeUnassigned,
          dotStyle: styles.statusDotUnassigned,
          textStyle: styles.statusTextUnassigned,
        };
    }
  };

  // Handlers for Theory Allocation
  const handleSelectTheoryFaculty = (courseCode, facultyName) => {
    setAllocations((prev) => {
      const next = { ...prev };
      next[courseCode] = { faculty: facultyName };

      // Rule B automatic linkage: If this theory course is linked to a lab, update lab's primary faculty!
      Object.keys(COURSE_ALLOCATION_CONFIG).forEach((code) => {
        const conf = COURSE_ALLOCATION_CONFIG[code];
        if (conf.linkedTheoryCourse === courseCode) {
          const currentLab = next[code] || { primaryFaculty: null, additionalFaculty: [] };
          // If the new primary faculty happens to be in additionalFaculty, remove it to avoid immediate duplicate
          const filteredAdditionals = (currentLab.additionalFaculty || []).filter((f) => f !== facultyName);
          next[code] = {
            ...currentLab,
            primaryFaculty: facultyName,
            additionalFaculty: filteredAdditionals.length > 0 ? filteredAdditionals : (currentLab.additionalFaculty?.length ? filteredAdditionals : []),
          };
        }
      });

      return next;
    });
    setModalConfig(null);
  };

  // Handlers for Lab Allocation
  const handleSelectLabAdditionalFaculty = (courseCode, slotIndex, facultyName) => {
    setAllocations((prev) => {
      const labAlloc = prev[courseCode] || { primaryFaculty: null, additionalFaculty: [] };
      const newAdditionals = [...(labAlloc.additionalFaculty || [])];
      newAdditionals[slotIndex] = facultyName;
      return {
        ...prev,
        [courseCode]: {
          ...labAlloc,
          additionalFaculty: newAdditionals,
        },
      };
    });
    setModalConfig(null);
  };

  const handleAddLabStaff = (courseCode) => {
    setAllocations((prev) => {
      const labAlloc = prev[courseCode] || { primaryFaculty: null, additionalFaculty: [] };
      return {
        ...prev,
        [courseCode]: {
          ...labAlloc,
          additionalFaculty: [...(labAlloc.additionalFaculty || []), ''],
        },
      };
    });
  };

  const handleRemoveLabStaff = (courseCode, slotIndex) => {
    setAllocations((prev) => {
      const labAlloc = prev[courseCode];
      if (!labAlloc) return prev;
      const newAdditionals = (labAlloc.additionalFaculty || []).filter((_, i) => i !== slotIndex);
      return {
        ...prev,
        [courseCode]: {
          ...labAlloc,
          additionalFaculty: newAdditionals,
        },
      };
    });
  };

  // Handlers for SAS Allocation
  const handleSelectSASFaculty = (courseCode, slotIndex, facultyName) => {
    setAllocations((prev) => {
      const sasAlloc = prev[courseCode] || { faculty: [] };
      const currentList = [...(sasAlloc.faculty || [])];
      currentList[slotIndex] = facultyName;
      return {
        ...prev,
        [courseCode]: {
          ...sasAlloc,
          faculty: currentList,
        },
      };
    });
    setModalConfig(null);
  };

  const handleAddSASFaculty = (courseCode) => {
    setAllocations((prev) => {
      const sasAlloc = prev[courseCode] || { faculty: [] };
      return {
        ...prev,
        [courseCode]: {
          ...sasAlloc,
          faculty: [...(sasAlloc.faculty || []), ''],
        },
      };
    });
  };

  const handleRemoveSASFaculty = (courseCode, slotIndex) => {
    setAllocations((prev) => {
      const sasAlloc = prev[courseCode];
      if (!sasAlloc) return prev;
      // Keep at least 2 slots structure if desired, or remove
      const newList = (sasAlloc.faculty || []).filter((_, i) => i !== slotIndex);
      return {
        ...prev,
        [courseCode]: {
          ...sasAlloc,
          faculty: newList.length >= 2 ? newList : (newList.length === 1 ? [...newList, ''] : ['', '']),
        },
      };
    });
  };

  // Handlers for Other (Staff's Handled mode) Allocation
  const handleSelectStaffCount = (courseCode, count) => {
    setAllocations((prev) => {
      const current = prev[courseCode] || { staffCount: 1, faculty: [] };
      const currentFaculty = [...(current.faculty || [])];
      // Adjust length to match count
      while (currentFaculty.length < count) {
        currentFaculty.push('');
      }
      return {
        ...prev,
        [courseCode]: {
          staffCount: count,
          faculty: currentFaculty.slice(0, count),
        },
      };
    });
  };

  const handleSelectOtherFaculty = (courseCode, slotIndex, facultyName) => {
    setAllocations((prev) => {
      const current = prev[courseCode] || { staffCount: 1, faculty: [] };
      const currentFaculty = [...(current.faculty || [])];
      currentFaculty[slotIndex] = facultyName;
      return {
        ...prev,
        [courseCode]: {
          ...current,
          faculty: currentFaculty,
        },
      };
    });
    setModalConfig(null);
  };

  // Pre-flight assignment validation
  const validateAssignments = () => {
    const invalidList = [];
    const unassignedList = [];

    CURRICULUM_COURSES.forEach((course) => {
      const status = getCourseAllocationStatus(course.code);
      if (status === 'NOT ASSIGNED' || status === 'PARTIALLY ASSIGNED') {
        unassignedList.push(`${course.code} (${course.shortName || course.name})`);
      } else if (status === 'INVALID') {
        invalidList.push(`${course.code} (${course.shortName || course.name})`);
      }
    });

    if (unassignedList.length > 0) {
      Alert.alert(
        'Incomplete Allocations',
        `The following courses must be fully assigned before proceeding:\n\n• ${unassignedList.join('\n• ')}`
      );
      return false;
    }

    if (invalidList.length > 0) {
      Alert.alert(
        'Invalid Faculty Allocations',
        `Please resolve conflicts or duplicate faculty for:\n\n• ${invalidList.join('\n• ')}`
      );
      return false;
    }

    return true;
  };

  const handleProceedToSolver = () => {
    if (validateAssignments()) {
      router.push('/coordinator/optimization');
    }
  };

  // Filter courses for display
  const displayedCourses = CURRICULUM_COURSES.filter((course) => {
    if (selectedCategory === 'all') return true;
    const config = COURSE_ALLOCATION_CONFIG[course.code];
    if (selectedCategory === 'THEORY') return config?.courseType === 'THEORY';
    if (selectedCategory === 'LAB') return config?.courseType === 'LAB';
    if (selectedCategory === 'SAS') return config?.courseType === 'SAS';
    if (selectedCategory === 'OTHER') return config?.courseType === 'OTHER';
    return true;
  });

  // Category counts
  const totalAssignedCount = CURRICULUM_COURSES.filter(
    (c) => getCourseAllocationStatus(c.code) === 'ASSIGNED'
  ).length;

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <ACHeader title="Faculty Allocation" showBack={true} activeCohort="III / V / CSE-C" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Progression Card */}
        <View style={styles.progressionCard}>
          <View style={styles.progressionTopRow}>
            <Text style={styles.progressionTag}>CONFIGURATION PIPELINE</Text>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>Step 2 of 4</Text>
            </View>
          </View>
          <View style={styles.progressionTitleRow}>
            <Text style={styles.progressionTitle}>Faculty Allocation & Review</Text>
            <View style={styles.activeDot} />
          </View>
          <View style={styles.stepBarRow}>
            <View style={[styles.stepBarSeg, styles.stepBarActive]} />
            <View style={[styles.stepBarSeg, styles.stepBarActive]} />
            <View style={styles.stepBarSeg} />
            <View style={styles.stepBarSeg} />
          </View>
        </View>

        {/* Informational Callout Notice */}
        <View style={styles.noticeBanner}>
          <MaterialIcons name="info" size={20} color={Colors.secondary} style={styles.noticeIcon} />
          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>Course-Level Faculty Handlers</Text>
            <Text style={styles.noticeDesc}>
              Available faculty options are drawn strictly from the master Course-Level Faculty Handlers pool.
              Selected academic section (Section C) determines curriculum requirements without altering master handler lists.
            </Text>
            <Text style={styles.authorityTag}>
              Assignment Authority: {assignmentAuthorityRole} (Authoritative Pool)
            </Text>
          </View>
        </View>

        {/* Academic Cohort Metric Card */}
        <View style={styles.cohortMetricCard}>
          <View style={styles.cohortTopRow}>
            <View>
              <Text style={styles.cohortMetaLabel}>ACADEMIC COHORT TARGET</Text>
              <View style={styles.sectionsRow}>
                <Text style={styles.cohortTitle}>III Year • Sem V</Text>
                <View style={styles.sectionBadge}><Text style={styles.sectionBadgeText}>SEC A</Text></View>
                <View style={styles.sectionBadge}><Text style={styles.sectionBadgeText}>SEC B</Text></View>
                <View style={[styles.sectionBadge, styles.sectionActiveBadge]}>
                  <Text style={styles.sectionActiveBadgeText}>SEC C</Text>
                </View>
                <View style={styles.sectionBadge}><Text style={styles.sectionBadgeText}>SEC D</Text></View>
              </View>
            </View>
            <View style={styles.cohortRight}>
              <Text style={styles.totalLoadNum}>140 P</Text>
              <Text style={styles.totalLoadSub}>35 P × 4 SEC</Text>
            </View>
          </View>

          <View style={styles.categoryCountGrid}>
            <View style={styles.countBox}>
              <Text style={styles.countLabel}>THEORY</Text>
              <Text style={styles.countNum}>6</Text>
            </View>
            <View style={styles.countBox}>
              <Text style={styles.countLabel}>LABS</Text>
              <Text style={styles.countNum}>2</Text>
            </View>
            <View style={styles.countBox}>
              <Text style={styles.countLabel}>SAS</Text>
              <Text style={styles.countNum}>1</Text>
            </View>
            <View style={styles.countBox}>
              <Text style={styles.countLabel}>OTHER</Text>
              <Text style={styles.countNum}>3</Text>
            </View>
          </View>
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillRow}
        >
          {[
            { id: 'all', label: 'All', count: 12 },
            { id: 'THEORY', label: 'Theory', count: 6 },
            { id: 'LAB', label: 'Laboratory', count: 2 },
            { id: 'SAS', label: 'SAS', count: 1 },
            { id: 'OTHER', label: 'Other', count: 3 },
          ].map((pill) => {
            const isActive = selectedCategory === pill.id;
            return (
              <Pressable
                key={pill.id}
                onPress={() => setSelectedCategory(pill.id)}
                style={[
                  styles.filterPill,
                  isActive ? styles.filterPillActive : styles.filterPillInactive,
                ]}
              >
                <Text
                  style={[
                    styles.filterPillLabel,
                    isActive ? styles.filterPillLabelActive : styles.filterPillLabelInactive,
                  ]}
                >
                  {pill.label}
                </Text>
                <View
                  style={[
                    styles.filterPillCount,
                    isActive ? styles.filterPillCountActive : styles.filterPillCountInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterPillCountText,
                      isActive ? styles.filterPillCountTextActive : styles.filterPillCountTextInactive,
                    ]}
                  >
                    {pill.count}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Course Allocation Cards Container */}
        <View style={styles.courseCardsContainer}>
          {displayedCourses.map((course) => {
            const config = COURSE_ALLOCATION_CONFIG[course.code] || {
              courseType: 'THEORY',
              allocationRule: 'SINGLE_FACULTY',
            };
            const alloc = allocations[course.code] || {};
            const status = getCourseAllocationStatus(course.code);
            const statusDisplay = getStatusDisplay(status);
            const facultyHandlers = COURSE_FACULTY_HANDLERS[course.code] || [];

            return (
              <View key={course.code} style={styles.courseAssignCard}>
                {/* Top Row: Meta Badges + Course Title + Periods */}
                <View style={styles.courseAssignTop}>
                  <View style={styles.courseMetaLeft}>
                    <View style={styles.badgeRow}>
                      <View style={styles.codeBadge}>
                        <Text style={styles.codeBadgeText}>{course.code}</Text>
                      </View>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{config.courseType}</Text>
                      </View>
                      <View style={styles.ruleBadge}>
                        <Text style={styles.ruleBadgeText}>
                          {config.allocationRule === 'SINGLE_FACULTY' && 'RULE A: SINGLE FACULTY'}
                          {config.allocationRule === 'PRIMARY_PLUS_ADDITIONAL' && 'RULE B: THEORY-LINKED LAB'}
                          {config.allocationRule === 'MINIMUM_TWO' && 'RULE C: MINIMUM 2 FACULTY'}
                          {config.allocationRule === 'STAFFS_HANDLED' && "RULE D: STAFF'S HANDLED"}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.courseAssignTitle}>{course.name}</Text>
                  </View>
                  <View style={styles.periodBox}>
                    <Text style={styles.periodBoxText}>
                      {course.periodsPerWeek} {course.isSpan ? 'Cont. P' : 'P/Wk'}
                    </Text>
                  </View>
                </View>

                {/* Course Handlers Pool Preview */}
                <View style={styles.poolPreviewRow}>
                  <Text style={styles.poolPreviewLabel}>FACULTY HANDLERS POOL:</Text>
                  <Text style={styles.poolPreviewText} numberOfLines={1}>
                    {facultyHandlers.join(', ')}
                  </Text>
                </View>

                {/* Allocation Box tailored per Rule */}
                <View style={styles.sectionAssignBox}>
                  <View style={styles.sectionAssignHeader}>
                    <Text style={styles.sectionAssignLabel}>ALLOCATION (SECTION C)</Text>
                    <View style={[styles.statusChip, statusDisplay.badgeStyle]}>
                      <View style={[styles.statusDot, statusDisplay.dotStyle]} />
                      <Text style={[styles.statusChipText, statusDisplay.textStyle]}>
                        {statusDisplay.label}
                      </Text>
                    </View>
                  </View>

                  {/* ----------------- RULE A: THEORY ----------------- */}
                  {config.allocationRule === 'SINGLE_FACULTY' && (
                    <View style={styles.ruleAContainer}>
                      <Text style={styles.inputLabel}>SELECT EXACTLY ONE FACULTY</Text>
                      <Pressable
                        style={({ pressed }) => [
                          styles.facultySelectBtn,
                          pressed && styles.selectPressed,
                        ]}
                        onPress={() =>
                          setModalConfig({
                            courseCode: course.code,
                            slotType: 'THEORY',
                          })
                        }
                      >
                        <View style={styles.facultySelectLeft}>
                          <MaterialIcons name="person" size={18} color={Colors.secondary} />
                          <View style={styles.facultyNameCol}>
                            <Text
                              style={[
                                styles.facultyNameText,
                                !alloc.faculty && styles.placeholderText,
                              ]}
                            >
                              {alloc.faculty || 'Select Faculty Handler...'}
                            </Text>
                            <Text style={styles.facultySubText}>Designated Course Instructor</Text>
                          </View>
                        </View>
                        <MaterialIcons name="arrow-drop-down" size={24} color={Colors.onSurfaceVariant} />
                      </Pressable>
                    </View>
                  )}

                  {/* ----------------- RULE B: LABORATORY ----------------- */}
                  {config.allocationRule === 'PRIMARY_PLUS_ADDITIONAL' && (
                    <View style={styles.ruleBContainer}>
                      {/* Primary Faculty (Linked to Theory) */}
                      <View style={styles.labPrimaryBox}>
                        <View style={styles.labPrimaryTop}>
                          <Text style={styles.inputLabel}>PRIMARY FACULTY (LINKED FROM THEORY)</Text>
                          <View style={styles.linkedBadge}>
                            <MaterialIcons name="link" size={12} color={Colors.secondary} />
                            <Text style={styles.linkedBadgeText}>
                              Linked: {config.linkedTheoryCourse}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.primaryFacultyDisplay}>
                          <MaterialIcons name="verified-user" size={18} color={Colors.secondary} />
                          <View style={styles.facultyNameCol}>
                            <Text style={styles.primaryFacultyName}>
                              {alloc.primaryFaculty || 'No Theory Faculty Selected Yet'}
                            </Text>
                            <Text style={styles.facultySubText}>
                              Auto-assigned from theory instructor for {config.linkedTheoryCourse}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Additional Staff Section */}
                      <View style={styles.additionalStaffSection}>
                        <View style={styles.additionalStaffHeader}>
                          <Text style={styles.inputLabel}>ADDITIONAL STAFF (LAB ASSISTANTS)</Text>
                          <Text style={styles.reqSubLabel}>At least 1 required</Text>
                        </View>

                        {(alloc.additionalFaculty || []).map((staffName, idx) => (
                          <View key={`lab-add-${idx}`} style={styles.additionalStaffRow}>
                            <Pressable
                              style={({ pressed }) => [
                                styles.facultySelectBtn,
                                styles.staffSelectFlex,
                                pressed && styles.selectPressed,
                              ]}
                              onPress={() =>
                                setModalConfig({
                                  courseCode: course.code,
                                  slotType: 'LAB_ADDITIONAL',
                                  slotIndex: idx,
                                })
                              }
                            >
                              <View style={styles.facultySelectLeft}>
                                <MaterialIcons name="person-add" size={18} color={Colors.secondary} />
                                <View style={styles.facultyNameCol}>
                                  <Text
                                    style={[
                                      styles.facultyNameText,
                                      !staffName && styles.placeholderText,
                                    ]}
                                  >
                                    {staffName || `Select Additional Staff ${idx + 1}...`}
                                  </Text>
                                  <Text style={styles.facultySubText}>
                                    Assistant #{idx + 1} (Excludes primary)
                                  </Text>
                                </View>
                              </View>
                              <MaterialIcons name="arrow-drop-down" size={24} color={Colors.onSurfaceVariant} />
                            </Pressable>

                            {/* Remove button if more than 1 additional staff */}
                            {(alloc.additionalFaculty?.length || 0) > 1 && (
                              <Pressable
                                style={styles.removeBtn}
                                onPress={() => handleRemoveLabStaff(course.code, idx)}
                              >
                                <MaterialIcons name="delete-outline" size={20} color={Colors.error} />
                              </Pressable>
                            )}
                          </View>
                        ))}

                        {/* Button: + Add Additional Staff */}
                        <Pressable
                          style={styles.addStaffActionBtn}
                          onPress={() => handleAddLabStaff(course.code)}
                        >
                          <MaterialIcons name="add-circle-outline" size={16} color={Colors.secondary} />
                          <Text style={styles.addStaffActionText}>+ Add Additional Staff</Text>
                        </Pressable>
                      </View>
                    </View>
                  )}

                  {/* ----------------- RULE C: SAS ----------------- */}
                  {config.allocationRule === 'MINIMUM_TWO' && (
                    <View style={styles.ruleCContainer}>
                      <View style={styles.additionalStaffHeader}>
                        <Text style={styles.inputLabel}>SEMESTER V SAS FACULTY (MINIMUM 2 REQUIRED)</Text>
                        <Text style={styles.reqSubLabel}>
                          {(alloc.faculty || []).filter((f) => f).length >= 2 ? 'Meets Rule' : 'Min 2 Required'}
                        </Text>
                      </View>

                      {(alloc.faculty || []).map((facName, idx) => (
                        <View key={`sas-slot-${idx}`} style={styles.additionalStaffRow}>
                          <Pressable
                            style={({ pressed }) => [
                              styles.facultySelectBtn,
                              styles.staffSelectFlex,
                              pressed && styles.selectPressed,
                            ]}
                            onPress={() =>
                              setModalConfig({
                                courseCode: course.code,
                                slotType: 'SAS',
                                slotIndex: idx,
                              })
                            }
                          >
                            <View style={styles.facultySelectLeft}>
                              <MaterialIcons name="record-voice-over" size={18} color={Colors.secondary} />
                              <View style={styles.facultyNameCol}>
                                <Text
                                  style={[
                                    styles.facultyNameText,
                                    !facName && styles.placeholderText,
                                  ]}
                                >
                                  {facName || `Select SAS Faculty ${idx + 1}...`}
                                </Text>
                                <Text style={styles.facultySubText}>
                                  SAS Mentor {idx + 1}
                                </Text>
                              </View>
                            </View>
                            <MaterialIcons name="arrow-drop-down" size={24} color={Colors.onSurfaceVariant} />
                          </Pressable>

                          {/* Only allow removing if current count > 2 */}
                          {(alloc.faculty?.length || 0) > 2 && (
                            <Pressable
                              style={styles.removeBtn}
                              onPress={() => handleRemoveSASFaculty(course.code, idx)}
                            >
                              <MaterialIcons name="delete-outline" size={20} color={Colors.error} />
                            </Pressable>
                          )}
                        </View>
                      ))}

                      {/* Button: + Add Faculty */}
                      <Pressable
                        style={styles.addStaffActionBtn}
                        onPress={() => handleAddSASFaculty(course.code)}
                      >
                        <MaterialIcons name="add-circle-outline" size={16} color={Colors.secondary} />
                        <Text style={styles.addStaffActionText}>+ Add SAS Faculty</Text>
                      </Pressable>
                    </View>
                  )}

                  {/* ----------------- RULE D: OTHER SUBJECT (STAFF'S HANDLED) ----------------- */}
                  {config.allocationRule === 'STAFFS_HANDLED' && (
                    <View style={styles.ruleDContainer}>
                      <Text style={styles.inputLabel}>STAFF'S HANDLED MODE</Text>

                      {/* Staff Count Options: One Staff | Two Staff | Three Staff */}
                      <View style={styles.staffCountRow}>
                        {[1, 2, 3].map((countVal) => {
                          const isCountSelected = (alloc.staffCount || 1) === countVal;
                          const labels = { 1: 'One Staff', 2: 'Two Staff', 3: 'Three Staff' };
                          return (
                            <Pressable
                              key={countVal}
                              style={[
                                styles.staffCountRadio,
                                isCountSelected && styles.staffCountRadioSelected,
                              ]}
                              onPress={() => handleSelectStaffCount(course.code, countVal)}
                            >
                              <MaterialIcons
                                name={isCountSelected ? 'radio-button-checked' : 'radio-button-unchecked'}
                                size={16}
                                color={isCountSelected ? Colors.secondary : Colors.onSurfaceVariant}
                              />
                              <Text
                                style={[
                                  styles.staffCountRadioText,
                                  isCountSelected && styles.staffCountRadioTextSelected,
                                ]}
                              >
                                {labels[countVal]}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>

                      {/* Dynamically Render inputs based on staff count */}
                      <View style={styles.dynamicStaffInputs}>
                        {Array.from({ length: alloc.staffCount || 1 }).map((_, idx) => {
                          const staffName = (alloc.faculty || [])[idx] || '';
                          return (
                            <View key={`other-staff-${idx}`} style={styles.singleStaffRow}>
                              <Pressable
                                style={({ pressed }) => [
                                  styles.facultySelectBtn,
                                  pressed && styles.selectPressed,
                                ]}
                                onPress={() =>
                                  setModalConfig({
                                    courseCode: course.code,
                                    slotType: 'OTHER',
                                    slotIndex: idx,
                                  })
                                }
                              >
                                <View style={styles.facultySelectLeft}>
                                  <MaterialIcons name="person" size={18} color={Colors.secondary} />
                                  <View style={styles.facultyNameCol}>
                                    <Text
                                      style={[
                                        styles.facultyNameText,
                                        !staffName && styles.placeholderText,
                                      ]}
                                    >
                                      {staffName || `Staff ${idx + 1}: [ Select Faculty ]`}
                                    </Text>
                                    <Text style={styles.facultySubText}>
                                      Staff {idx + 1} of {alloc.staffCount || 1}
                                    </Text>
                                  </View>
                                </View>
                                <MaterialIcons name="arrow-drop-down" size={24} color={Colors.onSurfaceVariant} />
                              </Pressable>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Bottom Pre-Flight & Proceed Card */}
        <View style={styles.preflightCard}>
          <View style={styles.preflightHeader}>
            <View style={styles.preflightLeft}>
              <MaterialIcons
                name={totalAssignedCount === 12 ? 'check-circle' : 'pending-actions'}
                size={20}
                color={totalAssignedCount === 12 ? Colors.onTertiaryContainer : Colors.secondary}
              />
              <Text style={styles.preflightTitle}>
                {totalAssignedCount === 12 ? 'Allocation Rules Verified' : 'Allocation Incomplete'}
              </Text>
            </View>
            <View
              style={[
                styles.preflightBadge,
                totalAssignedCount === 12 ? styles.preflightBadgeGreen : styles.preflightBadgePending,
              ]}
            >
              <Text style={styles.preflightBadgeText}>{totalAssignedCount}/12 ASSIGNED</Text>
            </View>
          </View>
          <Text style={styles.preflightDesc}>
            {totalAssignedCount === 12
              ? 'All 12 courses satisfy course-level rules (Theory solo, Lab dual-lock with theory primary, SAS min-2, Other Staff’s Handled). Ready for solver scheduling.'
              : 'Please ensure all courses have a valid ASSIGNED status adhering to their respective allocation rules before launching the solver.'}
          </Text>

          <PrimaryButton
            title="Validate & Run Optimization Solver"
            icon="tune"
            iconRight="arrow-forward"
            onPress={handleProceedToSolver}
            style={styles.solverLaunchBtn}
          />
        </View>
      </ScrollView>

      {/* Eligible Faculty Selection Modal */}
      <Modal
        visible={!!modalConfig}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalConfig(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalSub}>AUTHORITATIVE HANDLER POOL</Text>
                <Text style={styles.modalTitle}>
                  {modalConfig?.courseCode} • {COURSE_ALLOCATION_CONFIG[modalConfig?.courseCode]?.name}
                </Text>
              </View>
              <Pressable
                onPress={() => setModalConfig(null)}
                style={styles.modalCloseBtn}
              >
                <MaterialIcons name="close" size={20} color={Colors.onSurface} />
              </Pressable>
            </View>

            <Text style={styles.modalHelpText}>
              Select from the course's authoritative faculty handlers pool. Already assigned faculty are filtered to prevent duplicates.
            </Text>

            <ScrollView style={styles.modalList} contentContainerStyle={styles.modalListContent}>
              {(() => {
                if (!modalConfig) return null;
                const pool = COURSE_FACULTY_HANDLERS[modalConfig.courseCode] || [];
                const courseAlloc = allocations[modalConfig.courseCode] || {};

                // Determine which faculty members are currently selected in this course
                let currentlySelected = null;
                let excludedNames = [];

                if (modalConfig.slotType === 'THEORY') {
                  currentlySelected = courseAlloc.faculty;
                } else if (modalConfig.slotType === 'LAB_ADDITIONAL') {
                  currentlySelected = (courseAlloc.additionalFaculty || [])[modalConfig.slotIndex];
                  // Exclude primary faculty and other additional staff
                  const otherAdditionals = (courseAlloc.additionalFaculty || []).filter(
                    (_, i) => i !== modalConfig.slotIndex
                  );
                  excludedNames = [courseAlloc.primaryFaculty, ...otherAdditionals].filter(Boolean);
                } else if (modalConfig.slotType === 'SAS') {
                  currentlySelected = (courseAlloc.faculty || [])[modalConfig.slotIndex];
                  // Exclude other SAS faculty
                  excludedNames = (courseAlloc.faculty || []).filter(
                    (_, i) => i !== modalConfig.slotIndex
                  ).filter(Boolean);
                } else if (modalConfig.slotType === 'OTHER') {
                  currentlySelected = (courseAlloc.faculty || [])[modalConfig.slotIndex];
                  // Exclude other staff selected in this subject
                  excludedNames = (courseAlloc.faculty || []).filter(
                    (_, i) => i !== modalConfig.slotIndex
                  ).filter(Boolean);
                }

                return pool.map((facultyName, i) => {
                  const isSelected = currentlySelected === facultyName;
                  const isExcluded = excludedNames.includes(facultyName);

                  return (
                    <Pressable
                      key={`pool-fac-${i}-${facultyName}`}
                      disabled={isExcluded}
                      style={[
                        styles.facultyOptionItem,
                        isSelected && styles.facultyOptionSelected,
                        isExcluded && styles.facultyOptionDisabled,
                      ]}
                      onPress={() => {
                        if (modalConfig.slotType === 'THEORY') {
                          handleSelectTheoryFaculty(modalConfig.courseCode, facultyName);
                        } else if (modalConfig.slotType === 'LAB_ADDITIONAL') {
                          handleSelectLabAdditionalFaculty(
                            modalConfig.courseCode,
                            modalConfig.slotIndex,
                            facultyName
                          );
                        } else if (modalConfig.slotType === 'SAS') {
                          handleSelectSASFaculty(
                            modalConfig.courseCode,
                            modalConfig.slotIndex,
                            facultyName
                          );
                        } else if (modalConfig.slotType === 'OTHER') {
                          handleSelectOtherFaculty(
                            modalConfig.courseCode,
                            modalConfig.slotIndex,
                            facultyName
                          );
                        }
                      }}
                    >
                      <View style={styles.optionLeft}>
                        <View
                          style={[
                            styles.optionAvatar,
                            isSelected && styles.optionAvatarSelected,
                            isExcluded && styles.optionAvatarDisabled,
                          ]}
                        >
                          <MaterialIcons
                            name="person"
                            size={18}
                            color={isSelected ? '#ffffff' : (isExcluded ? Colors.outline : Colors.secondary)}
                          />
                        </View>
                        <View style={styles.optionInfo}>
                          <Text
                            style={[
                              styles.optionName,
                              isSelected && styles.optionNameSelected,
                              isExcluded && styles.optionNameDisabled,
                            ]}
                          >
                            {facultyName}
                          </Text>
                          <Text style={styles.optionRole}>
                            {isExcluded
                              ? 'Already Selected in this Allocation'
                              : 'Authoritative Course Handler'}
                          </Text>
                        </View>
                      </View>
                      {isSelected && (
                        <MaterialIcons name="check-circle" size={20} color={Colors.secondary} />
                      )}
                      {isExcluded && (
                        <MaterialIcons name="block" size={18} color={Colors.outline} />
                      )}
                    </Pressable>
                  );
                });
              })()}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: 8,
    ...Shadows.sm,
  },
  progressionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressionTag: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
    letterSpacing: 0.6,
  },
  stepBadge: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  stepBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  progressionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
  },
  stepBarRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  stepBarSeg: {
    flex: 1,
    height: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  stepBarActive: {
    backgroundColor: Colors.secondary,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(219, 225, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(0, 81, 213, 0.15)',
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  noticeIcon: {
    marginTop: 2,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  noticeDesc: {
    fontSize: 11,
    color: Colors.onSurface,
    lineHeight: 16,
    marginTop: 2,
  },
  authorityTag: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
    marginTop: 6,
  },
  cohortMetricCard: {
    backgroundColor: Colors.surfaceContainerLow,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  cohortTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cohortMetaLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  sectionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
    flexWrap: 'wrap',
  },
  cohortTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 4,
  },
  sectionBadge: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: BorderRadius.xs,
  },
  sectionBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  sectionActiveBadge: {
    backgroundColor: Colors.primary,
  },
  sectionActiveBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: Typography.labelMono.fontFamily,
  },
  cohortRight: {
    alignItems: 'flex-end',
  },
  totalLoadNum: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  totalLoadSub: {
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  categoryCountGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  countBox: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    padding: 8,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  countLabel: {
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  countNum: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 1,
  },
  filterPillRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  filterPillInactive: {
    backgroundColor: Colors.surfaceContainerLowest,
  },
  filterPillLabel: {
    fontSize: 12,
    fontFamily: Typography.labelMono.fontFamily,
  },
  filterPillLabelActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  filterPillLabelInactive: {
    color: Colors.onSurfaceVariant,
    fontWeight: '500',
  },
  filterPillCount: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
  },
  filterPillCountActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  filterPillCountInactive: {
    backgroundColor: Colors.surfaceContainer,
  },
  filterPillCountText: {
    fontSize: 9,
    fontFamily: Typography.labelMono.fontFamily,
    fontWeight: '700',
  },
  filterPillCountTextActive: {
    color: '#ffffff',
  },
  filterPillCountTextInactive: {
    color: Colors.onSurfaceVariant,
  },
  courseCardsContainer: {
    gap: Spacing.sm,
  },
  courseAssignCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  courseAssignTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  courseMetaLeft: {
    flex: 1,
    minWidth: 0,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  codeBadge: {
    backgroundColor: 'rgba(219, 225, 255, 0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  codeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  categoryBadge: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  ruleBadge: {
    backgroundColor: 'rgba(33, 161, 115, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  ruleBadgeText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: Colors.onTertiaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  courseAssignTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  periodBox: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
  },
  periodBoxText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  poolPreviewRow: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  poolPreviewLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  poolPreviewText: {
    flex: 1,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  sectionAssignBox: {
    backgroundColor: Colors.surfaceContainerLow,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  sectionAssignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionAssignLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
  },
  statusChipText: {
    fontSize: 8.5,
    fontWeight: '700',
    fontFamily: Typography.labelMono.fontFamily,
  },
  statusBadgeAssigned: {
    backgroundColor: 'rgba(33, 161, 115, 0.15)',
  },
  statusDotAssigned: {
    backgroundColor: Colors.onTertiaryContainer,
  },
  statusTextAssigned: {
    color: Colors.onTertiaryContainer,
  },
  statusBadgePartial: {
    backgroundColor: 'rgba(235, 140, 0, 0.15)',
  },
  statusDotPartial: {
    backgroundColor: '#eb8c00',
  },
  statusTextPartial: {
    color: '#b06500',
  },
  statusBadgeInvalid: {
    backgroundColor: 'rgba(186, 26, 26, 0.15)',
  },
  statusDotInvalid: {
    backgroundColor: Colors.error,
  },
  statusTextInvalid: {
    color: Colors.error,
  },
  statusBadgeUnassigned: {
    backgroundColor: 'rgba(116, 119, 126, 0.15)',
  },
  statusDotUnassigned: {
    backgroundColor: Colors.outline,
  },
  statusTextUnassigned: {
    color: Colors.onSurfaceVariant,
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
    marginBottom: 4,
  },
  facultySelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLowest,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
  },
  selectPressed: {
    opacity: 0.8,
  },
  facultySelectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  facultyNameCol: {
    flex: 1,
    minWidth: 0,
  },
  facultyNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  placeholderText: {
    color: Colors.outline,
    fontWeight: '500',
  },
  facultySubText: {
    fontSize: 9.5,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  ruleAContainer: {
    gap: 2,
  },
  ruleBContainer: {
    gap: 8,
  },
  labPrimaryBox: {
    backgroundColor: 'rgba(219, 225, 255, 0.35)',
    padding: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 81, 213, 0.15)',
  },
  labPrimaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  linkedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.surfaceContainerLowest,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  linkedBadgeText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  primaryFacultyDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryFacultyName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondary,
  },
  additionalStaffSection: {
    gap: 6,
  },
  additionalStaffHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reqSubLabel: {
    fontSize: 8.5,
    fontWeight: '600',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  additionalStaffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  staffSelectFlex: {
    flex: 1,
  },
  removeBtn: {
    padding: 6,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
  },
  addStaffActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(0, 81, 213, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 81, 213, 0.2)',
    borderStyle: 'dashed',
    marginTop: 2,
  },
  addStaffActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
  },
  ruleCContainer: {
    gap: 6,
  },
  ruleDContainer: {
    gap: 6,
  },
  staffCountRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 2,
  },
  staffCountRadio: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceContainerLowest,
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
  },
  staffCountRadioSelected: {
    borderColor: Colors.secondary,
    backgroundColor: 'rgba(219, 225, 255, 0.35)',
  },
  staffCountRadioText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  staffCountRadioTextSelected: {
    color: Colors.secondary,
    fontWeight: '700',
  },
  dynamicStaffInputs: {
    gap: 6,
    marginTop: 2,
  },
  singleStaffRow: {
    gap: 2,
  },
  preflightCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: 8,
    ...Shadows.md,
  },
  preflightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preflightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  preflightTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  preflightBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  preflightBadgeGreen: {
    backgroundColor: Colors.tertiaryFixed,
  },
  preflightBadgePending: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  preflightBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onTertiaryFixed,
    fontFamily: Typography.labelMono.fontFamily,
  },
  preflightDesc: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    lineHeight: 15,
  },
  solverLaunchBtn: {
    width: '100%',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 20, 40, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    maxHeight: '80%',
    gap: Spacing.sm,
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  modalTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  modalSub: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 1,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalHelpText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    lineHeight: 16,
  },
  modalList: {
    marginTop: 4,
  },
  modalListContent: {
    gap: 6,
    paddingBottom: Spacing.lg,
  },
  facultyOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow,
    padding: 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  facultyOptionSelected: {
    backgroundColor: 'rgba(219, 225, 255, 0.5)',
    borderColor: Colors.secondary,
  },
  facultyOptionDisabled: {
    opacity: 0.4,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  optionAvatar: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionAvatarSelected: {
    backgroundColor: Colors.secondary,
  },
  optionAvatarDisabled: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  optionInfo: {
    flex: 1,
    minWidth: 0,
  },
  optionName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  optionNameSelected: {
    color: Colors.secondary,
  },
  optionNameDisabled: {
    color: Colors.outline,
  },
  optionRole: {
    fontSize: 10.5,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
});
