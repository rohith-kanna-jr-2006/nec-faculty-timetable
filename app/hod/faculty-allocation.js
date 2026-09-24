import React, { useState, useEffect, useMemo } from 'react';
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
  getCourseFacultyHandlers,
  subscribeState,
} from '../../constants/demoData';
import { getCSEFacultyFromWorkload } from '../../constants/workloadMasterData';
import {
  getRegulationSubjects,
  isDirectHODCurriculumSubject,
  requiresACSubjectHandler,
  hasAuthoritativeCurriculum,
  normalizeSemester,
  normalizeYear,
  normalizeRegulationKey,
  SUBJECT_CLASSIFICATIONS,
} from '../../services/regulationCurriculumService';
import {
  getInstitutionalAllocationTypes,
  getInstitutionalAllocations,
  setInstitutionalAllocation,
  getInstitutionalKey,
} from '../../services/institutionalAllocationService';

export default function HODFacultyAllocationScreen() {
  const router = useRouter();

  // 1. Context-First: Load Active Academic Context
  const [academicContext, setAcademicContextState] = useState(getAcademicContext());
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'REGULAR' | 'SPECIAL' | 'INSTITUTIONAL'
  const [noticeMessage, setNoticeMessage] = useState(null);
  const [noticeType, setNoticeType] = useState(null);

  // Authoritative candidate pool: CSE faculty strictly from Faculty Workload Master
  const candidates = getCSEFacultyFromWorkload();

  // Normalize Active Context
  const activeDepartment = String(academicContext.department || 'CSE').toUpperCase();
  const activeYear = academicContext.year || 'III Year';
  const activeSemester = academicContext.semester || 'Sem V';
  const activeSection = academicContext.section || 'CSE-C';
  const activeAcademicYear = academicContext.academicYear || 'AY 2024-25';
  const activeRegulation = academicContext.regulation || 'Autonomous Regulation R2022';
  const normReg = normalizeRegulationKey(activeRegulation);
  const normSem = normalizeSemester(activeSemester);
  const normYr = normalizeYear(activeYear);

  const isContextSelected = Boolean(academicContext.semester && academicContext.section);

  // 2. State synchronization on context or allocation change
  const [allocationsVersion, setAllocationsVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeState(() => {
      const updatedContext = getAcademicContext();
      setAcademicContextState(updatedContext);
      setAllocationsVersion((v) => v + 1);
    });
    return unsubscribe;
  }, []);

  // 3. Context-Aware Curriculum Resolution:
  // Re-resolves immediately on any context change.
  // NEVER renders subjects from another semester.
  const curriculumSubjects = useMemo(() => {
    if (!academicContext.semester) {
      return [];
    }
    return getRegulationSubjects({
      regulation: normReg,
      academicYear: activeAcademicYear,
      semester: normSem,
      department: activeDepartment,
      year: normYr,
      section: activeSection,
    });
  }, [normReg, activeAcademicYear, normSem, activeDepartment, normYr, activeSection]);

  // Context-Filtered HOD Allocations:
  // Strictly bound to the selected semester and section.
  const contextAllocations = useMemo(() => {
    return getHODFacultyAllocations({
      academicYear: activeAcademicYear,
      regulation: normReg,
      department: activeDepartment,
      year: normYr,
      semester: normSem,
      section: activeSection,
    });
  }, [activeAcademicYear, normReg, activeDepartment, normYr, normSem, activeSection, allocationsVersion]);

  // Institutional Allocations:
  // Bound to the selected class section and academic year.
  const institutionalAllocations = useMemo(() => {
    return getInstitutionalAllocations({
      section: activeSection,
      academicYear: activeAcademicYear,
    });
  }, [activeSection, activeAcademicYear, allocationsVersion]);

  // Domain 2: Institutional Allocation Types (HOD, AC, Proctor Periods)
  const institutionalTypes = getInstitutionalAllocationTypes();

  // Separate Curriculum Subjects:
  // Section 1: Regular Courses (Theory & Lab)
  const regularSubjects = useMemo(
    () => curriculumSubjects.filter((s) => !isDirectHODCurriculumSubject(s)),
    [curriculumSubjects]
  );

  // Section 2: Non-Credit / Special Subjects
  const specialSubjects = useMemo(
    () => curriculumSubjects.filter((s) => isDirectHODCurriculumSubject(s)),
    [curriculumSubjects]
  );

  // Filter for Active Tab
  let displayedCurriculumSubjects = [];
  if (activeTab === 'ALL') {
    displayedCurriculumSubjects = curriculumSubjects;
  } else if (activeTab === 'REGULAR') {
    displayedCurriculumSubjects = regularSubjects;
  } else if (activeTab === 'SPECIAL') {
    displayedCurriculumSubjects = specialSubjects;
  }

  const showRegularSection = activeTab === 'ALL' || activeTab === 'REGULAR';
  const showSpecialSection = activeTab === 'ALL' || activeTab === 'SPECIAL';
  const showInstitutionalSection = activeTab === 'ALL' || activeTab === 'INSTITUTIONAL';

  // Sub-slot state for multi-faculty controls
  const [labSlotMap, setLabSlotMap] = useState({}); // { [code]: 'PRIMARY' | 'ADDITIONAL' }
  const [sasSlotMap, setSasSlotMap] = useState({}); // { [code]: 0 | 1 }
  const [specialSlotMap, setSpecialSlotMap] = useState({}); // { [code]: 0 | 1 | 2 }
  const [specialStaffCounts, setSpecialStaffCounts] = useState({}); // { [code]: 1 | 2 | 3 }

  // Exact completion status per course type
  const isCourseFullyAssigned = (s, alloc) => {
    if (!alloc) return false;
    if (s.classification === SUBJECT_CLASSIFICATIONS.LABORATORY || s.category === 'LAB') {
      const hasPrimary = Boolean(alloc.primaryFacultyId || alloc.primaryFaculty);
      const hasAdd = Boolean(
        (alloc.additionalFacultyIds && alloc.additionalFacultyIds.length > 0) ||
        (alloc.additionalFaculty && alloc.additionalFaculty.length > 0)
      );
      return hasPrimary && hasAdd;
    }
    if (s.classification === SUBJECT_CLASSIFICATIONS.NON_CREDIT || s.code === '22MAN08R') {
      const list = alloc.facultyIds || alloc.facultyNames || (Array.isArray(alloc.faculty) ? alloc.faculty : []);
      return list.filter(Boolean).length >= 2;
    }
    if (s.classification === SUBJECT_CLASSIFICATIONS.OTHER || s.classification === SUBJECT_CLASSIFICATIONS.SPECIAL) {
      const req = alloc.staffCount || 1;
      const list = alloc.facultyIds || alloc.facultyNames || (Array.isArray(alloc.faculty) ? alloc.faculty : (alloc.facultyName ? [alloc.facultyName] : []));
      return list.filter(Boolean).length >= req;
    }
    // Theory
    return Boolean(alloc.facultyId || alloc.faculty || alloc.facultyName);
  };

  // Metrics
  const assignedCurriculumCount = curriculumSubjects.filter((s) =>
    isCourseFullyAssigned(s, contextAllocations[s.code])
  ).length;

  const assignedInstCount = institutionalTypes.filter((t) => {
    const key = getInstitutionalKey(t.typeId, activeSection, activeAcademicYear);
    return !!institutionalAllocations[key];
  }).length;

  const totalItemsCount = curriculumSubjects.length + institutionalTypes.length;
  const totalAssignedCount = assignedCurriculumCount + assignedInstCount;
  const curriculumTotalPeriods = curriculumSubjects.reduce(
    (sum, s) => sum + (s.periodsPerWeek || s.periods || 0),
    0
  );

  // Check if Authoritative Curriculum is registered for this context
  const isAuthoritativeConfigured = hasAuthoritativeCurriculum({
    regulation: normReg,
    department: activeDepartment,
    year: normYr,
    semester: normSem,
  });

  // 1. THEORY: Exactly one final faculty (AC handler is advisory only)
  const handleSelectTheoryFaculty = (subject, faculty) => {
    setNoticeMessage(null);
    setNoticeType(null);

    const workloadDisplay =
      faculty.status === 'INCOMPLETE SOURCE DATA'
        ? 'Incomplete source data'
        : `Teaching: ${faculty.calculatedTeachingHours}h, Resp: ${faculty.calculatedResponsibilityHours}h, Total: ${faculty.calculatedTotalHours}h`;

    // Teaching workload warning (non-blocking)
    if (faculty.calculatedTeachingHours + (subject.periodsPerWeek || 0) > 16) {
      setNoticeType('warning');
      setNoticeMessage(
        `Workload Notice: Assigning ${subject.name} (+${subject.periodsPerWeek}h) brings ${faculty.facultyName}'s teaching load to ${faculty.calculatedTeachingHours + subject.periodsPerWeek} hrs.`
      );
    } else {
      setNoticeType('success');
      setNoticeMessage(`Confirmed: ${subject.name} assigned to ${faculty.facultyName}.`);
    }

    setHODFacultyAllocation(subject.code, {
      courseCode: subject.code,
      courseName: subject.name,
      facultyId: faculty.facultyId,
      facultyName: faculty.facultyName,
      faculty: faculty.facultyName,
      designation: faculty.designation,
      status: 'Assigned',
      academicYear: activeAcademicYear,
      regulation: normReg,
      department: activeDepartment,
      year: normYr,
      semester: normSem,
      section: activeSection,
      classification: subject.classification,
      category: subject.category,
      allocationRule: 'SINGLE_FACULTY',
      isDirectHOD: isDirectHODCurriculumSubject(subject),
      workload: workloadDisplay,
      teachingHours: faculty.calculatedTeachingHours,
      responsibilityHours: faculty.calculatedResponsibilityHours,
      totalHours: faculty.calculatedTotalHours,
      facultyStatus: faculty.status,
      assignedAt: new Date().toISOString(),
    });

    setAllocationsVersion((v) => v + 1);
  };

  // 2. LABORATORY: Primary required, additional supported, no duplicates
  const handleSelectLabFaculty = (subject, slotType, faculty) => {
    setNoticeMessage(null);
    setNoticeType(null);
    const existing = contextAllocations[subject.code] || {};

    if (slotType === 'PRIMARY') {
      const additionalIds = existing.additionalFacultyIds || [];
      if (additionalIds.includes(faculty.facultyId)) {
        Alert.alert(
          'Duplicate Faculty Rejected',
          `${faculty.facultyName} is already assigned as Additional Faculty for ${subject.code}. The same faculty cannot be assigned as both Primary and Additional.`
        );
        return;
      }

      const hasAdditional = additionalIds.length > 0;
      setHODFacultyAllocation(subject.code, {
        ...existing,
        courseCode: subject.code,
        courseName: subject.name,
        primaryFacultyId: faculty.facultyId,
        primaryFacultyName: faculty.facultyName,
        primaryFaculty: faculty.facultyName,
        faculty: faculty.facultyName,
        status: hasAdditional ? 'Assigned' : 'Needs Additional Staff',
        academicYear: activeAcademicYear,
        regulation: normReg,
        department: activeDepartment,
        year: normYr,
        semester: normSem,
        section: activeSection,
        classification: subject.classification,
        category: 'LAB',
        allocationRule: 'PRIMARY_PLUS_ADDITIONAL',
        assignedAt: new Date().toISOString(),
      });
      setNoticeType('success');
      setNoticeMessage(`Primary Guide for ${subject.code} set to ${faculty.facultyName}.`);
    } else {
      if (existing.primaryFacultyId === faculty.facultyId) {
        Alert.alert(
          'Duplicate Faculty Rejected',
          `${faculty.facultyName} is already assigned as Primary Guide for ${subject.code}. The same faculty cannot be assigned as both Primary and Additional.`
        );
        return;
      }

      const hasPrimary = Boolean(existing.primaryFacultyId);
      setHODFacultyAllocation(subject.code, {
        ...existing,
        courseCode: subject.code,
        courseName: subject.name,
        additionalFacultyIds: [faculty.facultyId],
        additionalFacultyNames: [faculty.facultyName],
        additionalFaculty: [faculty.facultyName],
        status: hasPrimary ? 'Assigned' : 'Needs Primary Faculty',
        academicYear: activeAcademicYear,
        regulation: normReg,
        department: activeDepartment,
        year: normYr,
        semester: normSem,
        section: activeSection,
        classification: subject.classification,
        category: 'LAB',
        allocationRule: 'PRIMARY_PLUS_ADDITIONAL',
        assignedAt: new Date().toISOString(),
      });
      setNoticeType('success');
      setNoticeMessage(`Additional Staff for ${subject.code} set to ${faculty.facultyName}.`);
    }
    setAllocationsVersion((v) => v + 1);
  };

  // 3. NON_CREDIT (SAS 22MAN08R): Minimum TWO faculty, no duplicates
  const handleSelectSASFaculty = (subject, slotIdx, faculty) => {
    setNoticeMessage(null);
    setNoticeType(null);
    const existing = contextAllocations[subject.code] || {};
    const currentIds = [...(existing.facultyIds || [null, null])];
    const currentNames = [...(existing.facultyNames || [null, null])];

    const otherIdx = slotIdx === 0 ? 1 : 0;
    if (currentIds[otherIdx] === faculty.facultyId) {
      Alert.alert(
        'Duplicate Faculty Rejected',
        `${faculty.facultyName} is already selected for Slot ${otherIdx + 1} of ${subject.name}. Soft/Analytical Skills requires a minimum of two distinct faculty.`
      );
      return;
    }

    currentIds[slotIdx] = faculty.facultyId;
    currentNames[slotIdx] = faculty.facultyName;
    const isComplete = Boolean(currentIds[0] && currentIds[1]);

    setHODFacultyAllocation(subject.code, {
      ...existing,
      courseCode: subject.code,
      courseName: subject.name,
      facultyIds: currentIds,
      facultyNames: currentNames,
      faculty: currentNames.filter(Boolean),
      faculty1: currentNames[0] || null,
      faculty2: currentNames[1] || null,
      status: isComplete ? 'Assigned' : 'Needs 2nd Faculty',
      academicYear: activeAcademicYear,
      regulation: normReg,
      department: activeDepartment,
      year: normYr,
      semester: normSem,
      section: activeSection,
      classification: subject.classification,
      category: 'NON_CREDIT',
      allocationRule: 'MINIMUM_TWO',
      isDirectHOD: true,
      assignedAt: new Date().toISOString(),
    });
    setNoticeType(isComplete ? 'success' : 'warning');
    setNoticeMessage(
      isComplete
        ? `Confirmed dual faculty for ${subject.name}: ${currentNames.join(' & ')}.`
        : `Selected Faculty ${slotIdx + 1}: ${faculty.facultyName}. Assign Faculty ${otherIdx + 1} to fulfill minimum two requirement.`
    );
    setAllocationsVersion((v) => v + 1);
  };

  // 4. SPECIAL / OTHER (SD, NPTEL, PBL): Support 1/2/3 staff, no duplicates
  const handleSetSpecialStaffCount = (subject, count) => {
    const existing = contextAllocations[subject.code] || {};
    const currentIds = (existing.facultyIds || []).slice(0, count);
    const currentNames = (existing.facultyNames || []).slice(0, count);
    while (currentIds.length < count) {
      currentIds.push(null);
      currentNames.push(null);
    }
    const isComplete = currentIds.filter(Boolean).length === count;

    setHODFacultyAllocation(subject.code, {
      ...existing,
      courseCode: subject.code,
      courseName: subject.name,
      staffCount: count,
      facultyIds: currentIds,
      facultyNames: currentNames,
      faculty: currentNames.filter(Boolean),
      status: isComplete ? 'Assigned' : 'Pending',
      academicYear: activeAcademicYear,
      regulation: normReg,
      department: activeDepartment,
      year: normYr,
      semester: normSem,
      section: activeSection,
      classification: subject.classification,
      category: subject.category,
      allocationRule: 'STAFFS_HANDLED',
      isDirectHOD: true,
      assignedAt: new Date().toISOString(),
    });
    setAllocationsVersion((v) => v + 1);
  };

  const handleSelectSpecialFaculty = (subject, slotIdx, faculty) => {
    setNoticeMessage(null);
    setNoticeType(null);
    const existing = contextAllocations[subject.code] || {};
    const reqCount = specialStaffCounts[subject.code] || existing.staffCount || 1;
    const currentIds = [...(existing.facultyIds || Array(reqCount).fill(null))];
    const currentNames = [...(existing.facultyNames || Array(reqCount).fill(null))];

    // Ensure array is size reqCount
    while (currentIds.length < reqCount) currentIds.push(null);
    while (currentNames.length < reqCount) currentNames.push(null);

    // Duplicate check across other slots of this subject
    const dupIdx = currentIds.findIndex((id, idx) => idx !== slotIdx && id === faculty.facultyId);
    if (dupIdx >= 0) {
      Alert.alert(
        'Duplicate Faculty Rejected',
        `${faculty.facultyName} is already assigned to Staff Slot ${dupIdx + 1} for ${subject.name}. Duplicate faculty within the same course is not permitted.`
      );
      return;
    }

    currentIds[slotIdx] = faculty.facultyId;
    currentNames[slotIdx] = faculty.facultyName;
    const filledCount = currentIds.filter(Boolean).length;
    const isComplete = filledCount === reqCount;

    setHODFacultyAllocation(subject.code, {
      ...existing,
      courseCode: subject.code,
      courseName: subject.name,
      staffCount: reqCount,
      facultyIds: currentIds,
      facultyNames: currentNames,
      faculty: currentNames.filter(Boolean),
      status: isComplete ? 'Assigned' : 'Pending',
      academicYear: activeAcademicYear,
      regulation: normReg,
      department: activeDepartment,
      year: normYr,
      semester: normSem,
      section: activeSection,
      classification: subject.classification,
      category: subject.category,
      allocationRule: 'STAFFS_HANDLED',
      isDirectHOD: true,
      assignedAt: new Date().toISOString(),
    });
    setNoticeType(isComplete ? 'success' : 'warning');
    setNoticeMessage(
      isComplete
        ? `Confirmed ${reqCount} staff for ${subject.name}: ${currentNames.join(', ')}.`
        : `Staff slot ${slotIdx + 1} set to ${faculty.facultyName} (${filledCount}/${reqCount} assigned).`
    );
    setAllocationsVersion((v) => v + 1);
  };

  // 5. INSTITUTIONAL: HOD, AC, Proctor direct allocation
  const handleSelectInstitutionalFaculty = (allocType, faculty) => {
    setNoticeMessage(null);
    setNoticeType(null);

    const res = setInstitutionalAllocation(allocType.typeId, {
      facultyId: faculty.facultyId,
      facultyName: faculty.facultyName,
      designation: faculty.designation,
      section: activeSection,
      academicYear: activeAcademicYear,
      year: normYr,
      hours: allocType.defaultHours,
    });

    if (res.isDuplicate) {
      setNoticeType('error');
      setNoticeMessage(res.message);
      Alert.alert('Duplicate Allocation Prevented', res.message);
      return;
    }

    setAllocationsVersion((v) => v + 1);
    setNoticeType('success');
    setNoticeMessage(`Confirmed institutional role: ${allocType.name} assigned to ${faculty.facultyName}.`);
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <HODHeader
        title="HOD Faculty Allocation"
        showBack={true}
        activeCohort={`${normYr} / ${normSem} / ${activeSection}`}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================================ */}
        {/* CONTEXT-FIRST PROMINENT SCOPE BAR                            */}
        {/* ============================================================ */}
        <View style={styles.contextHeroCard}>
          <View style={styles.contextTopRow}>
            <View style={styles.contextPill}>
              <MaterialIcons name="tune" size={12} color="#FFFFFF" />
              <Text style={styles.contextPillText}>ACTIVE ACADEMIC CONTEXT</Text>
            </View>
            <Pressable
              style={styles.switchContextBtn}
              onPress={() => router.push('/hod/context')}
            >
              <MaterialIcons name="swap-horiz" size={14} color="#38BDF8" />
              <Text style={styles.switchContextBtnText}>Switch Scope</Text>
            </Pressable>
          </View>

          <Text style={styles.contextHeading}>
            {activeDepartment} • {normYr} • {normSem} • Section {activeSection.replace('CSE-', '')}
          </Text>

          <View style={styles.contextChipsRow}>
            <View style={styles.scopeChip}>
              <Text style={styles.scopeChipLabel}>AY:</Text>
              <Text style={styles.scopeChipVal}>{activeAcademicYear}</Text>
            </View>
            <View style={styles.scopeChip}>
              <Text style={styles.scopeChipLabel}>Reg:</Text>
              <Text style={styles.scopeChipVal}>{normReg}</Text>
            </View>
            <View style={styles.scopeChip}>
              <Text style={styles.scopeChipLabel}>Dept:</Text>
              <Text style={styles.scopeChipVal}>{activeDepartment}</Text>
            </View>
            <View style={styles.scopeChip}>
              <Text style={styles.scopeChipLabel}>Class:</Text>
              <Text style={styles.scopeChipVal}>{activeSection}</Text>
            </View>
          </View>

          <View style={styles.bindingRuleBox}>
            <MaterialIcons name="verified" size={14} color="#38BDF8" />
            <Text style={styles.bindingRuleText}>
              All faculty assignments below are strictly bound to {normSem} ({activeSection}).
            </Text>
          </View>
        </View>

        {/* Action Notice Banner */}
        {noticeMessage && (
          <View
            style={[
              styles.noticeBox,
              noticeType === 'success' ? styles.noticeSuccess : styles.noticeError,
            ]}
          >
            <MaterialIcons
              name={noticeType === 'success' ? 'check-circle' : 'error-outline'}
              size={16}
              color={noticeType === 'success' ? '#059669' : '#DC2626'}
            />
            <Text
              style={[
                styles.noticeText,
                noticeType === 'success' ? styles.noticeTextSuccess : styles.noticeTextError,
              ]}
            >
              {noticeMessage}
            </Text>
          </View>
        )}

        {/* Counter Summary Card */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryTextCol}>
            <Text style={styles.summaryTitle}>Allocation Progress</Text>
            <Text style={styles.summarySub}>
              {curriculumSubjects.length} Curriculum Subjects ({curriculumTotalPeriods} Periods) • {institutionalTypes.length} Institutional Roles
            </Text>
          </View>
          <View style={styles.assignedBadge}>
            <Text style={styles.assignedBadgeText}>
              {totalAssignedCount}/{totalItemsCount} Assigned
            </Text>
          </View>
        </View>

        {/* Domain Navigation Tabs */}
        <View style={styles.tabsRow}>
          <Pressable
            style={[styles.tabBtn, activeTab === 'ALL' && styles.tabBtnActive]}
            onPress={() => setActiveTab('ALL')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'ALL' && styles.tabBtnTextActive]}>
              All ({totalItemsCount})
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, activeTab === 'REGULAR' && styles.tabBtnActive]}
            onPress={() => setActiveTab('REGULAR')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'REGULAR' && styles.tabBtnTextActive]}>
              Section 1: Regular ({regularSubjects.length})
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, activeTab === 'SPECIAL' && styles.tabBtnActive]}
            onPress={() => setActiveTab('SPECIAL')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'SPECIAL' && styles.tabBtnTextActive]}>
              Section 2: Non-Credit ({specialSubjects.length})
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, activeTab === 'INSTITUTIONAL' && styles.tabBtnActive]}
            onPress={() => setActiveTab('INSTITUTIONAL')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'INSTITUTIONAL' && styles.tabBtnTextActive]}>
              Section 3: Institutional ({institutionalTypes.length})
            </Text>
          </Pressable>
        </View>

        {/* ============================================================ */}
        {/* PENDING AUTHORITATIVE DATA BANNER                            */}
        {/* ============================================================ */}
        {!isAuthoritativeConfigured && curriculumSubjects.length === 0 && (
          <View style={styles.pendingCurriculumCard}>
            <MaterialIcons name="info-outline" size={24} color="#D97706" />
            <Text style={styles.pendingTitle}>Authoritative Curriculum Data Pending</Text>
            <Text style={styles.pendingSub}>
              Official regulation syllabus for {activeDepartment} • {normYr} • {normSem} ({normReg}) has not been registered in the curriculum master. No placeholder subjects are fabricated.
            </Text>
            <Pressable
              style={styles.switchScopeActionBtn}
              onPress={() => router.push('/hod/context')}
            >
              <Text style={styles.switchScopeActionBtnText}>Switch to Configured Semester (e.g. Sem V)</Text>
            </Pressable>
          </View>
        )}

        {/* ============================================================ */}
        {/* SECTION 1: REGULAR CURRICULUM COURSES (THEORY & LAB)          */}
        {/* ============================================================ */}
        {showRegularSection && regularSubjects.length > 0 && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <MaterialIcons name="menu-book" size={16} color={Colors.primary} />
              <Text style={styles.sectionHeaderTitle}>
                SECTION 1 — REGULAR CURRICULUM COURSES ({normSem})
              </Text>
            </View>
            <Text style={styles.sectionSubDesc}>
              AC Subject Handler recommendations are displayed as advisory input. HOD selects the final binding faculty from the CSE Workload Master.
            </Text>

            <View style={styles.courseList}>
              {regularSubjects.map((s) => {
                const currentAssignment = contextAllocations[s.code];
                const isAssigned = !!currentAssignment;
                const handlers = getCourseFacultyHandlers(s.code) || [];
                const handledNames = handlers.map((h) => h.name || h.facultyName);

                return (
                  <View key={s.code} style={styles.allocationCard}>
                    {/* Header Row */}
                    <View style={styles.allocHeader}>
                      <View style={styles.allocHeaderLeft}>
                        <Text style={styles.allocCode}>{s.code}</Text>
                        <View
                          style={[
                            styles.catBadge,
                            s.classification === SUBJECT_CLASSIFICATIONS.LABORATORY
                              ? styles.catLab
                              : styles.catTheory,
                          ]}
                        >
                          <Text style={styles.catBadgeText}>
                            {s.classification === SUBJECT_CLASSIFICATIONS.LABORATORY ? 'LAB' : 'THEORY'}
                          </Text>
                        </View>
                        <Text style={styles.periodsBadge}>{s.periodsPerWeek} Periods</Text>
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

                    <Text style={styles.allocName}>{s.name}</Text>

                    {/* Scope Context Tag */}
                    <View style={styles.scopeMetaRow}>
                      <Text style={styles.scopeMetaText}>
                        {normReg} • {activeAcademicYear} • {normYr} • {normSem} • Sec: {activeSection}
                      </Text>
                    </View>

                    {/* AC Advisory Pool Input */}
                    <View style={styles.handledByRow}>
                      <Text style={styles.handledByLabel}>AC Advisory Pool:</Text>
                      <Text style={styles.handledByVal}>
                        {handledNames.length > 0 ? handledNames.join(' • ') : 'No AC advisory input'}
                      </Text>
                    </View>

                    {/* Current HOD Assignment */}
                    <View style={styles.assignedBox}>
                      <Text style={styles.assignedBoxLabel}>CURRENT HOD ASSIGNMENT:</Text>
                      {isAssigned ? (
                        <View style={styles.assignedSuccessRow}>
                          <MaterialIcons name="check-circle" size={15} color="#059669" />
                          <Text style={styles.assignedSuccessText}>
                            {currentAssignment.facultyName} ({currentAssignment.facultyId})
                          </Text>
                        </View>
                      ) : (
                        <Text style={styles.unassignedText}>[ Select Eligible CSE Faculty Below ]</Text>
                      )}
                    </View>

                    {/* CSE Faculty Selection Options */}
                    <Text style={styles.selectFacultyLabel}>Select or Override Final Faculty:</Text>
                    <View style={styles.facultyChipsContainer}>
                      {candidates.map((faculty) => {
                        const isSelected = currentAssignment?.facultyId === faculty.facultyId;
                        const isAcRec = handledNames.some((name) =>
                          name.includes(faculty.facultyName.split(' ').slice(-1)[0])
                        );
                        const isIncomplete = faculty.status === 'INCOMPLETE SOURCE DATA';

                        return (
                          <Pressable
                            key={faculty.facultyId}
                            style={[
                              styles.facultyChip,
                              isSelected && styles.facultyChipSelected,
                            ]}
                            onPress={() => handleSelectCurriculumFaculty(s, faculty)}
                          >
                            <View style={styles.chipTop}>
                              <Text style={[styles.chipName, isSelected && styles.chipNameSelected]}>
                                {faculty.facultyName}
                              </Text>
                              <View style={styles.chipBadgesRow}>
                                {isAcRec && (
                                  <View style={styles.acRecDot}>
                                    <Text style={styles.acRecDotText}>AC Advisory Rec</Text>
                                  </View>
                                )}
                                {isIncomplete && (
                                  <View style={styles.incompleteDot}>
                                    <Text style={styles.incompleteDotText}>Incomplete Source</Text>
                                  </View>
                                )}
                              </View>
                            </View>
                            <Text style={styles.chipDesig}>
                              {faculty.designation} • ID: {faculty.facultyId}
                            </Text>
                            <Text style={styles.chipMeta}>
                              {isIncomplete
                                ? `Teaching: ${faculty.calculatedTeachingHours} hrs • Resp: ${faculty.calculatedResponsibilityHours} hrs • Total: Incomplete`
                                : `Teaching: ${faculty.calculatedTeachingHours} hrs • Resp: ${faculty.calculatedResponsibilityHours} hrs • Total: ${faculty.calculatedTotalHours} hrs`}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* SECTION 2: REGULATION NON-CREDIT / OTHER / SPECIAL SUBJECTS   */}
        {/* ============================================================ */}
        {showSpecialSection && specialSubjects.length > 0 && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <MaterialIcons name="stars" size={16} color="#7C3AED" />
              <Text style={styles.sectionHeaderTitle}>
                SECTION 2 — REGULATION NON-CREDIT & SPECIAL SUBJECTS ({normSem})
              </Text>
            </View>
            <Text style={styles.sectionSubDesc}>
              Regulation-defined non-credit, PBL, and special subjects. HOD holds sole statutory authority; AC Subject Handler entries are NOT required.
            </Text>

            <View style={styles.courseList}>
              {specialSubjects.map((s) => {
                const currentAssignment = contextAllocations[s.code];
                const isAssigned = !!currentAssignment;

                return (
                  <View key={s.code} style={styles.allocationCard}>
                    {/* Header Row */}
                    <View style={styles.allocHeader}>
                      <View style={styles.allocHeaderLeft}>
                        <Text style={styles.allocCode}>{s.code}</Text>
                        <View
                          style={[
                            styles.catBadge,
                            s.classification === SUBJECT_CLASSIFICATIONS.NON_CREDIT
                              ? styles.catNonCredit
                              : styles.catSpecial,
                          ]}
                        >
                          <Text style={styles.catBadgeText}>
                            {s.classification === SUBJECT_CLASSIFICATIONS.NON_CREDIT ? 'NON-CREDIT' : 'SPECIAL / OTHER'}
                          </Text>
                        </View>
                        <Text style={styles.periodsBadge}>{s.periodsPerWeek} Periods</Text>
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

                    <Text style={styles.allocName}>{s.name}</Text>

                    <View style={styles.scopeMetaRow}>
                      <Text style={styles.scopeMetaText}>
                        {normReg} • {activeAcademicYear} • {normYr} • {normSem} • Sec: {activeSection}
                      </Text>
                    </View>

                    <View style={styles.directHODRow}>
                      <MaterialIcons name="gavel" size={13} color="#0369A1" />
                      <Text style={styles.directHODText}>
                        HOD Direct Statutory Allocation • AC Subject Handler Not Mandatory
                      </Text>
                    </View>

                    {/* Current HOD Assignment */}
                    <View style={styles.assignedBox}>
                      <Text style={styles.assignedBoxLabel}>CURRENT HOD ASSIGNMENT:</Text>
                      {isAssigned ? (
                        <View style={styles.assignedSuccessRow}>
                          <MaterialIcons name="check-circle" size={15} color="#059669" />
                          <Text style={styles.assignedSuccessText}>
                            {currentAssignment.facultyName} ({currentAssignment.facultyId})
                          </Text>
                        </View>
                      ) : (
                        <Text style={styles.unassignedText}>[ Select Faculty Directly Below ]</Text>
                      )}
                    </View>

                    {/* CSE Faculty Selection Options */}
                    <Text style={styles.selectFacultyLabel}>Select Faculty from CSE Workload Master:</Text>
                    <View style={styles.facultyChipsContainer}>
                      {candidates.map((faculty) => {
                        const isSelected = currentAssignment?.facultyId === faculty.facultyId;
                        const isIncomplete = faculty.status === 'INCOMPLETE SOURCE DATA';

                        return (
                          <Pressable
                            key={faculty.facultyId}
                            style={[
                              styles.facultyChip,
                              isSelected && styles.facultyChipSelected,
                            ]}
                            onPress={() => handleSelectCurriculumFaculty(s, faculty)}
                          >
                            <View style={styles.chipTop}>
                              <Text style={[styles.chipName, isSelected && styles.chipNameSelected]}>
                                {faculty.facultyName}
                              </Text>
                              {isIncomplete && (
                                <View style={styles.incompleteDot}>
                                  <Text style={styles.incompleteDotText}>Incomplete Source</Text>
                                </View>
                              )}
                            </View>
                            <Text style={styles.chipDesig}>
                              {faculty.designation} • ID: {faculty.facultyId}
                            </Text>
                            <Text style={styles.chipMeta}>
                              {isIncomplete
                                ? `Teaching: ${faculty.calculatedTeachingHours} hrs • Resp: ${faculty.calculatedResponsibilityHours} hrs • Total: Incomplete`
                                : `Teaching: ${faculty.calculatedTeachingHours} hrs • Resp: ${faculty.calculatedResponsibilityHours} hrs • Total: ${faculty.calculatedTotalHours} hrs`}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* SECTION 3: INSTITUTIONAL ADMINISTRATIVE ALLOCATIONS          */}
        {/* ============================================================ */}
        {showInstitutionalSection && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <MaterialIcons name="domain" size={16} color="#0F2942" />
              <Text style={styles.sectionHeaderTitle}>
                SECTION 3 — INSTITUTIONAL ALLOCATIONS (SEPARATE FROM CURRICULUM)
              </Text>
            </View>
            <Text style={styles.sectionSubDesc}>
              Administrative and statutory contact periods (HOD, AC, Proctor Periods). These are institutional allocations, NOT semester curriculum courses.
            </Text>

            <View style={styles.courseList}>
              {institutionalTypes.map((t) => {
                const instKey = getInstitutionalKey(t.typeId, activeSection, activeAcademicYear);
                const currentInstAssignment = institutionalAllocations[instKey];
                const isInstAssigned = !!currentInstAssignment;

                return (
                  <View key={t.typeId} style={styles.allocationCard}>
                    {/* Header Row */}
                    <View style={styles.allocHeader}>
                      <View style={styles.allocHeaderLeft}>
                        <Text style={styles.allocCode}>{t.shortCode}</Text>
                        <View style={[styles.catBadge, styles.catInstitutional]}>
                          <Text style={styles.catBadgeText}>INSTITUTIONAL</Text>
                        </View>
                        <Text style={styles.periodsBadge}>{t.defaultHours} Period</Text>
                      </View>
                      <View
                        style={[
                          styles.statusChip,
                          isInstAssigned ? styles.statusChipGreen : styles.statusChipAmber,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusChipText,
                            isInstAssigned ? styles.statusChipGreenText : styles.statusChipAmberText,
                          ]}
                        >
                          {isInstAssigned ? 'Assigned' : 'Pending HOD'}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.allocName}>{t.name}</Text>
                    <Text style={styles.instDesc}>{t.description}</Text>

                    <View style={styles.scopeMetaRow}>
                      <Text style={styles.scopeMetaText}>
                        Statutory Period • {activeAcademicYear} • {normYr} • Section: {activeSection}
                      </Text>
                    </View>

                    <View style={styles.directHODRow}>
                      <MaterialIcons name="verified-user" size={13} color="#0369A1" />
                      <Text style={styles.directHODText}>
                        Direct HOD Decision • Never routed through AC Handler pool
                      </Text>
                    </View>

                    {/* Current HOD Assignment */}
                    <View style={styles.assignedBox}>
                      <Text style={styles.assignedBoxLabel}>CURRENT HOD ASSIGNMENT:</Text>
                      {isInstAssigned ? (
                        <View style={styles.assignedSuccessRow}>
                          <MaterialIcons name="check-circle" size={15} color="#059669" />
                          <Text style={styles.assignedSuccessText}>
                            {currentInstAssignment.facultyName} ({currentInstAssignment.facultyId})
                          </Text>
                        </View>
                      ) : (
                        <Text style={styles.unassignedText}>[ Select Faculty for Institutional Period ]</Text>
                      )}
                    </View>

                    {/* CSE Faculty Selection Options */}
                    <Text style={styles.selectFacultyLabel}>Select CSE Faculty for Institutional Period:</Text>
                    <View style={styles.facultyChipsContainer}>
                      {candidates.map((faculty) => {
                        const isSelected = currentInstAssignment?.facultyId === faculty.facultyId;
                        const isIncomplete = faculty.status === 'INCOMPLETE SOURCE DATA';

                        return (
                          <Pressable
                            key={faculty.facultyId}
                            style={[
                              styles.facultyChip,
                              isSelected && styles.facultyChipSelected,
                            ]}
                            onPress={() => handleSelectInstitutionalFaculty(t, faculty)}
                          >
                            <View style={styles.chipTop}>
                              <Text style={[styles.chipName, isSelected && styles.chipNameSelected]}>
                                {faculty.facultyName}
                              </Text>
                              {isIncomplete && (
                                <View style={styles.incompleteDot}>
                                  <Text style={styles.incompleteDotText}>Incomplete Source</Text>
                                </View>
                              )}
                            </View>
                            <Text style={styles.chipDesig}>
                              {faculty.designation} • ID: {faculty.facultyId}
                            </Text>
                            <Text style={styles.chipMeta}>
                              {isIncomplete
                                ? `Teaching: ${faculty.calculatedTeachingHours} hrs • Resp: ${faculty.calculatedResponsibilityHours} hrs • Total: Incomplete`
                                : `Teaching: ${faculty.calculatedTeachingHours} hrs • Resp: ${faculty.calculatedResponsibilityHours} hrs • Total: ${faculty.calculatedTotalHours} hrs`}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Footer Audit Card */}
        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>Audit Allocation Matrix</Text>
          <Text style={styles.footerDesc}>
            Review the authoritative allocation matrix for {normSem} ({activeSection}) prior to timetable synthesis.
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
  contextHeroCard: {
    backgroundColor: '#0F2942',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  contextTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  contextPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  contextPillText: {
    ...Typography.labelSmall,
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  switchContextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  switchContextBtnText: {
    ...Typography.labelSmall,
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
  },
  contextHeading: {
    ...Typography.titleMedium,
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 8,
  },
  contextChipsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  scopeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  scopeChipLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
  },
  scopeChipVal: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  bindingRuleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  bindingRuleText: {
    ...Typography.bodySmall,
    color: '#7DD3FC',
    fontSize: 10,
    fontWeight: '600',
    flex: 1,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    marginBottom: Spacing.sm,
  },
  summaryTextCol: {
    flex: 1,
  },
  summaryTitle: {
    ...Typography.titleSmall,
    color: '#0F2942',
    fontWeight: '700',
    fontSize: 13,
  },
  summarySub: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
  },
  assignedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  assignedBadgeText: {
    color: '#059669',
    fontWeight: '800',
    fontSize: 10,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: BorderRadius.md,
    marginBottom: 10,
  },
  noticeSuccess: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  noticeError: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  noticeText: {
    ...Typography.bodySmall,
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  noticeTextSuccess: {
    color: '#065F46',
  },
  noticeTextError: {
    color: '#991B1B',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
  },
  tabBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  tabBtnActive: {
    backgroundColor: '#0F2942',
    borderColor: '#0F2942',
  },
  tabBtnText: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  pendingCurriculumCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: 6,
  },
  pendingTitle: {
    ...Typography.titleSmall,
    color: '#92400E',
    fontWeight: '800',
    fontSize: 14,
    textAlign: 'center',
  },
  pendingSub: {
    ...Typography.bodySmall,
    color: '#B45309',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  switchScopeActionBtn: {
    backgroundColor: '#D97706',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    marginTop: 4,
  },
  switchScopeActionBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionBlock: {
    marginBottom: Spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  sectionHeaderTitle: {
    ...Typography.labelSmall,
    color: '#0F2942',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionSubDesc: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
    marginBottom: Spacing.sm,
    lineHeight: 14,
  },
  courseList: {
    gap: Spacing.md,
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
    ...Typography.titleSmall,
    color: '#0F2942',
    fontWeight: '800',
    fontSize: 13,
  },
  catBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  catTheory: {
    backgroundColor: '#EFF6FF',
  },
  catLab: {
    backgroundColor: '#FEF3C7',
  },
  catNonCredit: {
    backgroundColor: '#F3E8FF',
  },
  catSpecial: {
    backgroundColor: '#E0F2FE',
  },
  catInstitutional: {
    backgroundColor: '#F1F5F9',
  },
  catBadgeText: {
    ...Typography.labelSmall,
    color: Colors.onSurface,
    fontSize: 9,
    fontWeight: '700',
  },
  periodsBadge: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
  },
  statusChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  statusChipGreen: {
    backgroundColor: '#ECFDF5',
  },
  statusChipAmber: {
    backgroundColor: '#FFFBEB',
  },
  statusChipText: {
    fontSize: 9,
    fontWeight: '800',
  },
  statusChipGreenText: {
    color: '#059669',
  },
  statusChipAmberText: {
    color: '#D97706',
  },
  allocName: {
    ...Typography.titleSmall,
    color: '#0F2942',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
  },
  instDesc: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 4,
  },
  scopeMetaRow: {
    marginBottom: 6,
  },
  scopeMetaText: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
    fontStyle: 'italic',
  },
  directHODRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginBottom: 8,
  },
  directHODText: {
    ...Typography.labelSmall,
    color: '#0369A1',
    fontSize: 10,
    fontWeight: '700',
    flex: 1,
  },
  handledByRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginBottom: 8,
  },
  handledByLabel: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
    fontWeight: '700',
  },
  handledByVal: {
    ...Typography.bodySmall,
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '600',
    flex: 1,
  },
  assignedBox: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    marginBottom: 8,
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
  chipBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  incompleteDot: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  incompleteDotText: {
    color: '#DC2626',
    fontSize: 8,
    fontWeight: '800',
  },
  chipDesig: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
    marginTop: 1,
  },
  chipMeta: {
    ...Typography.bodySmall,
    color: '#475569',
    fontSize: 9.5,
    marginTop: 2,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
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
});
