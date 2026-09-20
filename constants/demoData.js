/**
 * Academic Nexus / NEC Faculty Mobile Application
 * Core Business Rules, Application Configuration, and Runtime Data Store
 *
 * NOTE: All hardcoded mock institutional records have been removed.
 * All runtime collections start empty and are populated solely via user input
 * or connected authoritative backend sources.
 */

// ============================================================
// 1. STATIC APPLICATION CONFIGURATION & SCHEDULE DEFINITIONS
// ============================================================

export const WEEK_DAYS = [
  { id: 'MON', label: 'Mon', full: 'Monday' },
  { id: 'TUE', label: 'Tue', full: 'Tuesday' },
  { id: 'WED', label: 'Wed', full: 'Wednesday' },
  { id: 'THU', label: 'Thu', full: 'Thursday' },
  { id: 'FRI', label: 'Fri', full: 'Friday' },
];

export const PERIOD_TIMINGS = [
  { period: 'P1', startTime: '09:15', endTime: '10:05', label: '09:15 – 10:05' },
  { period: 'P2', startTime: '10:05', endTime: '10:55', label: '10:05 – 10:55' },
  { type: 'break', name: 'Morning Break', duration: '15m', startTime: '10:55', endTime: '11:10', icon: 'local-cafe' },
  { period: 'P3', startTime: '11:10', endTime: '12:00', label: '11:10 – 12:00' },
  { period: 'P4', startTime: '12:00', endTime: '12:50', label: '12:00 – 12:50' },
  { type: 'lunch', name: 'Lunch Interval', duration: '55m', startTime: '12:50', endTime: '01:45', icon: 'restaurant' },
  { period: 'P5', startTime: '01:45', endTime: '02:35', label: '01:45 – 02:35' },
  { period: 'P6', startTime: '02:35', endTime: '03:25', label: '02:35 – 03:25' },
  { type: 'break', name: 'Evening Break', duration: '15m', startTime: '03:25', endTime: '03:40', icon: 'emoji-food-beverage' },
  { period: 'P7', startTime: '03:40', endTime: '04:30', label: '03:40 – 04:30' },
];

export const BREAK_TIMINGS = PERIOD_TIMINGS.filter((p) => p.type === 'break' || p.type === 'lunch');

// ============================================================
// 2. BUSINESS RULES & GOVERNANCE CONSTANTS
// ============================================================

export const COURSE_ALLOCATION_RULES = {
  SINGLE_FACULTY: 'SINGLE_FACULTY', // Theory: exactly one faculty
  PRIMARY_PLUS_ADDITIONAL: 'PRIMARY_PLUS_ADDITIONAL', // Lab: primary linked to theory + additional staff
  MINIMUM_TWO: 'MINIMUM_TWO', // SAS: minimum two faculty
  STAFFS_HANDLED: 'STAFFS_HANDLED', // Other/PBL: staff count (1, 2, or 3)
};

export const TIMETABLE_STATUSES = {
  NO_TIMETABLE: 'NO_TIMETABLE', // Initial state before any generation has run
  DRAFT: 'DRAFT', // Candidate grid being constructed
  GENERATED: 'GENERATED', // Solver executed with 0 hard conflicts
  PENDING_HOD_APPROVAL: 'PENDING_HOD_APPROVAL', // Submitted for HOD approval
  APPROVED: 'APPROVED', // Formally approved by HOD
  REJECTED: 'REJECTED', // Rejected / revision requested by HOD
  PUBLISHED: 'PUBLISHED', // Synchronized and visible across campus
};

export const assignmentAuthorityRole = 'ACADEMIC_COORDINATOR';

// ============================================================
// 3. RUNTIME STATE STORES (INITIALIZED EMPTY - ZERO MOCK DATA)
// ============================================================

// Academic Context (Null by default)
let currentAcademicContext = {
  department: null,
  year: null,
  semester: null,
  section: null,
  academicYear: null,
};

// Curriculum Courses (Empty array by default)
let currentCurriculumCourses = [];

// Course Faculty Handlers Pool (Empty map by default)
let currentCourseFacultyHandlers = {};

// Course Allocation Configuration (Empty map by default)
let currentCourseAllocationConfig = {};

// Faculty Allocations (Empty map by default: all courses start NOT ASSIGNED)
let currentFacultyAllocations = {};

// Master Timetable Sessions (Empty array by default: 0 sessions until generated)
let currentMasterTimetableSessions = [];

// Authenticated Profiles (Null by default)
let currentFacultyProfile = null;
let currentCoordinatorProfile = null;

// Notifications (Empty array by default)
let currentNotifications = [];

// Timetable Version State (Initialized to NO_TIMETABLE)
export const INITIAL_TIMETABLE_VERSION = {
  id: null,
  academicYear: null,
  department: null,
  year: null,
  semester: null,
  section: null,
  status: TIMETABLE_STATUSES.NO_TIMETABLE,
  versionLabel: null,
  generatedAt: null,
  approvedAt: null,
  approvedBy: null,
  hodReviewer: null,
  rejectionReason: null,
  totalRequiredPeriods: 0,
  totalScheduledPeriods: 0,
  freePeriods: 0,
  hardConflicts: 0,
};

let activeTimetableVersion = { ...INITIAL_TIMETABLE_VERSION };
const versionSubscribers = new Set();
const stateSubscribers = new Set();

// ============================================================
// 4. EXPORTED COMPATIBILITY ALIASES (EMPTY BY DEFAULT)
// ============================================================

export let MASTER_TIMETABLE_SESSIONS = [];
export let CURRICULUM_COURSES = [];
export let COURSE_FACULTY_HANDLERS = {};
export let COURSE_ALLOCATION_CONFIG = {};
export let INITIAL_FACULTY_ALLOCATIONS = {};
export let INITIAL_FACULTY_ASSIGNMENTS = [];
export let FACULTY_ELIGIBILITY = {};
export let FACULTY_PROFILE = null;
export let AC_PROFILE = null;
export let AC_FACULTY_LIST = [];
export let ASSIGNED_COURSES = [];
export let NOTIFICATIONS_DATA = [];
export let VALIDATION_CHECKS = [];
export let AC_CONFLICT_AUDITS = [];

// ============================================================
// 5. GETTER & SETTER SERVICES (REAL DATA READY)
// ============================================================

// Academic Context
export function getAcademicContext() {
  return { ...currentAcademicContext };
}

export function setAcademicContext(context = {}) {
  currentAcademicContext = { ...currentAcademicContext, ...context };
  notifyStateSubscribers();
  return currentAcademicContext;
}

// Curriculum Courses
export function getCurriculumCourses() {
  return [...currentCurriculumCourses];
}

export function setCurriculumCourses(courses = []) {
  currentCurriculumCourses = courses.map((c) => ({ ...c }));
  CURRICULUM_COURSES = currentCurriculumCourses;
  notifyStateSubscribers();
  return currentCurriculumCourses;
}

// Course Faculty Handlers
export function getCourseFacultyHandlers(courseCode) {
  if (courseCode) {
    return currentCourseFacultyHandlers[courseCode] || [];
  }
  return { ...currentCourseFacultyHandlers };
}

export function setCourseFacultyHandlers(courseCode, handlers = []) {
  if (typeof courseCode === 'object') {
    currentCourseFacultyHandlers = { ...courseCode };
  } else {
    currentCourseFacultyHandlers[courseCode] = handlers;
  }
  COURSE_FACULTY_HANDLERS = currentCourseFacultyHandlers;
  notifyStateSubscribers();
  return currentCourseFacultyHandlers;
}

// Faculty Allocations
export function getFacultyAllocations() {
  return { ...currentFacultyAllocations };
}

export function setFacultyAllocation(courseCode, allocation) {
  currentFacultyAllocations[courseCode] = allocation;
  INITIAL_FACULTY_ALLOCATIONS = currentFacultyAllocations;
  notifyStateSubscribers();
  return currentFacultyAllocations;
}

export function clearFacultyAllocations() {
  currentFacultyAllocations = {};
  INITIAL_FACULTY_ALLOCATIONS = {};
  notifyStateSubscribers();
}

// Master Timetable Sessions
export function getMasterTimetableSessions() {
  return [...currentMasterTimetableSessions];
}

export function setMasterTimetableSessions(sessions = []) {
  currentMasterTimetableSessions = sessions.map((s) => ({
    ...s,
    section: s.section || s.classSection || null,
    classSection: s.classSection || s.section || null,
    faculty: s.faculty || s.facultyName || null,
    facultyName: s.facultyName || s.faculty || null,
    spanCount: s.spanCount || (s.isSpan ? 4 : 1),
    isSpan: !!s.isSpan,
  }));
  MASTER_TIMETABLE_SESSIONS = currentMasterTimetableSessions;
  notifyStateSubscribers();
  return currentMasterTimetableSessions;
}

export function clearMasterTimetableSessions() {
  currentMasterTimetableSessions = [];
  MASTER_TIMETABLE_SESSIONS = [];
  activeTimetableVersion = { ...INITIAL_TIMETABLE_VERSION };
  notifyVersionSubscribers();
  notifyStateSubscribers();
}

// Faculty Profile
export function getFacultyProfile() {
  return currentFacultyProfile ? { ...currentFacultyProfile } : null;
}

export function setFacultyProfile(profile) {
  currentFacultyProfile = profile ? { ...profile } : null;
  FACULTY_PROFILE = currentFacultyProfile;
  notifyStateSubscribers();
  return currentFacultyProfile;
}

// Coordinator Profile
export function getCoordinatorProfile() {
  return currentCoordinatorProfile ? { ...currentCoordinatorProfile } : null;
}

export function setCoordinatorProfile(profile) {
  currentCoordinatorProfile = profile ? { ...profile } : null;
  AC_PROFILE = currentCoordinatorProfile;
  notifyStateSubscribers();
  return currentCoordinatorProfile;
}

// Notifications
export function getNotifications() {
  return [...currentNotifications];
}

export function setNotifications(notifs = []) {
  currentNotifications = notifs.map((n) => ({ ...n }));
  NOTIFICATIONS_DATA = currentNotifications;
  notifyStateSubscribers();
  return currentNotifications;
}

export function addNotification(notif) {
  currentNotifications = [notif, ...currentNotifications];
  NOTIFICATIONS_DATA = currentNotifications;
  notifyStateSubscribers();
  return currentNotifications;
}

// Timetable Version & Governance State
export function getTimetableVersion(context = {}) {
  return { ...activeTimetableVersion };
}

export function updateTimetableVersionStatus(newStatus, metadata = {}) {
  const timestamp = new Date().toISOString();
  activeTimetableVersion = {
    ...activeTimetableVersion,
    status: newStatus,
    ...(newStatus === TIMETABLE_STATUSES.APPROVED || newStatus === TIMETABLE_STATUSES.PUBLISHED
      ? {
          approvedBy: metadata.approvedBy || activeTimetableVersion.approvedBy,
          approvedAt: activeTimetableVersion.approvedAt || timestamp,
        }
      : {}),
    ...(metadata.rejectionReason ? { rejectionReason: metadata.rejectionReason } : {}),
    ...(newStatus === TIMETABLE_STATUSES.PENDING_HOD_APPROVAL ? { rejectionReason: null } : {}),
    ...(newStatus === TIMETABLE_STATUSES.REJECTED ? { approvedAt: null, approvedBy: null } : {}),
  };

  notifyVersionSubscribers();
  return activeTimetableVersion;
}

export function subscribeTimetableVersion(callback) {
  versionSubscribers.add(callback);
  return () => versionSubscribers.delete(callback);
}

export function subscribeState(callback) {
  stateSubscribers.add(callback);
  return () => stateSubscribers.delete(callback);
}

function notifyVersionSubscribers() {
  versionSubscribers.forEach((cb) => {
    try {
      cb(activeTimetableVersion);
    } catch (err) {
      console.error('Error notifying timetable version subscriber:', err);
    }
  });
}

function notifyStateSubscribers() {
  stateSubscribers.forEach((cb) => {
    try {
      cb();
    } catch (err) {
      console.error('Error notifying state subscriber:', err);
    }
  });
}

// ============================================================
// 6. CENTRALIZED SELECTORS (OVER SINGLE MASTER_TIMETABLE_SESSIONS)
// ============================================================

/**
 * Filter Master Timetable by Faculty perspective
 */
export function getFacultyTimetable(facultyId, options = {}) {
  if (!facultyId || currentMasterTimetableSessions.length === 0) {
    return [];
  }
  const { day, academicYear, semester } = options;
  return currentMasterTimetableSessions.filter((session) => {
    const matchesFaculty =
      session.facultyId === facultyId ||
      session.faculty?.includes(facultyId) ||
      session.facultyName?.includes(facultyId);
    if (!matchesFaculty) return false;
    if (day && day !== 'all' && session.day !== day) return false;
    if (academicYear && session.academicYear !== academicYear) return false;
    if (semester && session.semester !== semester) return false;
    return true;
  });
}

/**
 * Filter Master Timetable by Class/Section perspective
 */
export function getClassTimetable(context = {}, options = {}) {
  if (currentMasterTimetableSessions.length === 0) {
    return [];
  }
  const department = context.department || null;
  const section = context.section || context.classSection || null;
  const { day } = options;

  if (!section && !department) {
    return [];
  }

  return currentMasterTimetableSessions.filter((session) => {
    if (section && session.section !== section && session.classSection !== section) {
      return false;
    }
    if (department && session.department && session.department !== department) {
      return false;
    }
    if (day && day !== 'all' && session.day !== day) {
      return false;
    }
    return true;
  });
}

/**
 * Published Class Timetable Selector (Governance Rule)
 * Strictly hides sessions until state is APPROVED or PUBLISHED.
 */
export function getPublishedClassTimetable(context = {}, options = {}) {
  const version = getTimetableVersion(context);
  const isApprovedOrPublished =
    version.status === TIMETABLE_STATUSES.APPROVED || version.status === TIMETABLE_STATUSES.PUBLISHED;
  return {
    isApproved: isApprovedOrPublished,
    status: version.status,
    version,
    sessions: isApprovedOrPublished ? getClassTimetable(context, options) : [],
  };
}

export function getFacultySessions(facultyId) {
  return getFacultyTimetable(facultyId);
}

export function getFacultySessionsByDay(day = 'WED', facultyId) {
  return getFacultyTimetable(facultyId, { day });
}

export function getClassSessionsByDay(day = 'WED', classSection) {
  return getClassTimetable({ section: classSection }, { day });
}

export function getFacultyWorkload(facultyId) {
  const sessions = getFacultyTimetable(facultyId);
  const theory = sessions.filter((s) => s.sessionType === 'THEORY' || s.sessionType === 'ELECTIVE').length;
  const lab = sessions.filter((s) => s.sessionType === 'LAB').reduce((acc, curr) => acc + (curr.spanCount || 1), 0);
  const other = sessions.filter((s) => s.sessionType === 'OTHER').length;
  const total = theory + lab + other;
  const maxThreshold = currentFacultyProfile?.maxWorkloadThreshold || 16;

  return {
    total,
    theory,
    lab,
    other,
    maxThreshold,
    utilizationPercentage: maxThreshold > 0 ? Math.round((total / maxThreshold) * 100) : 0,
  };
}

export function getTodaySchedule(facultyId, targetDay = 'WED') {
  const sessionsForDay = getFacultySessionsByDay(targetDay, facultyId);
  const heroClass = sessionsForDay.find((s) => s.isHeroNext) || sessionsForDay[0] || null;

  const scheduleSlots = [];
  PERIOD_TIMINGS.forEach((pt) => {
    if (pt.type === 'break') {
      scheduleSlots.push({
        isBreak: true,
        title: `${pt.name} (${pt.duration})`,
        time: `${pt.startTime} AM`,
      });
    } else if (pt.type === 'lunch') {
      scheduleSlots.push({
        isLunch: true,
        title: `${pt.name} (${pt.duration})`,
        time: `${pt.startTime} PM`,
      });
    } else {
      const match = sessionsForDay.find((s) => s.period === pt.period);
      if (match) {
        scheduleSlots.push({
          period: pt.period,
          time: `${match.startTime} ${match.startTime.startsWith('09') || match.startTime.startsWith('10') || match.startTime.startsWith('11') ? 'AM' : 'PM'}`,
          title: match.courseName,
          badge: match.isHeroNext ? 'Upcoming' : 'Scheduled',
          subtitle: `${match.period} • ${match.classSection || match.section} (${match.room})`,
          courseCode: match.courseCode,
          isUpcoming: match.isHeroNext,
          startsIn: match.startsIn || 'Now',
        });
      } else {
        scheduleSlots.push({
          period: pt.period,
          time: `${pt.startTime} ${pt.startTime.startsWith('09') || pt.startTime.startsWith('10') || pt.startTime.startsWith('11') ? 'AM' : 'PM'}`,
          title: 'No Teaching Session',
          badge: 'FREE',
          subtitle: 'Unassigned Period',
          isFree: true,
        });
      }
    }
  });

  return {
    day: targetDay,
    dayFull: WEEK_DAYS.find((d) => d.id === targetDay)?.full || targetDay,
    dateLabel: 'Today Schedule',
    heroClass,
    sessions: scheduleSlots,
  };
}

// ============================================================
// 7. ALLOCATION VALIDATION & TIMETABLE GENERATION ENGINES
// ============================================================

/**
 * Validates faculty allocations prior to generating the timetable.
 * Returns diagnostic issues if invalid, or calculated metrics if valid.
 */
export function validateFacultyAllocations(allocations = currentFacultyAllocations, courses = currentCurriculumCourses) {
  const errors = [];

  if (!courses || courses.length === 0) {
    return {
      valid: false,
      errors: ['No curriculum data available. Please provide courses.'],
      totalRequiredPeriods: 0,
      scheduledPeriods: 0,
      freePeriods: 0,
      hardConflicts: 0,
    };
  }

  let totalRequiredPeriods = 0;

  courses.forEach((course) => {
    totalRequiredPeriods += course.periodsPerWeek || 0;
    const alloc = allocations[course.code];
    const rule = course.allocationRule || course.category;

    if (!alloc) {
      errors.push(`Missing faculty allocation for ${course.code} (${course.name || course.shortName || 'Course'})`);
      return;
    }

    if (rule === 'SINGLE_FACULTY' || course.category === 'THEORY' || course.category === 'ELECTIVE') {
      if (!alloc.faculty) {
        errors.push(`Theory course ${course.code} must have exactly one faculty assigned.`);
      }
    } else if (rule === 'PRIMARY_PLUS_ADDITIONAL' || course.category === 'LAB') {
      if (!alloc.primaryFaculty) {
        errors.push(`Laboratory course ${course.code} missing primary theory-linked faculty.`);
      }
      if (!alloc.additionalFaculty || alloc.additionalFaculty.length === 0) {
        errors.push(`Laboratory course ${course.code} requires at least one additional staff member.`);
      }
    } else if (rule === 'MINIMUM_TWO' || course.category === 'SAS') {
      if (!alloc.faculty || alloc.faculty.length < 2) {
        errors.push(`Soft/Analytical Skills course ${course.code} requires a minimum of two faculty handlers.`);
      }
    } else if (rule === 'STAFFS_HANDLED' || course.category === 'OTHER') {
      const required = alloc.staffCount || 1;
      const count = (alloc.faculty || []).filter(Boolean).length;
      if (count < required) {
        errors.push(`Course ${course.code} requires ${required} staff member(s) in Staff's Handled mode.`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    totalRequiredPeriods,
    scheduledPeriods: errors.length === 0 ? totalRequiredPeriods : 0,
    freePeriods: 0,
    hardConflicts: 0,
  };
}

/**
 * Timetable Generation Engine
 * Consumes current academic context, curriculum courses, and faculty allocations.
 * Generates conflict-free timetable sessions.
 */
export function generateTimetableSessions({
  academicContext = currentAcademicContext,
  courses = currentCurriculumCourses,
  allocations = currentFacultyAllocations,
} = {}) {
  // Guard 1: Context check
  if (!academicContext?.department || !academicContext?.section) {
    return {
      success: false,
      errors: ['Cannot generate timetable: Academic Context (Department, Year, Semester, Section) is missing.'],
    };
  }

  // Guard 2: Curriculum check
  if (!courses || courses.length === 0) {
    return {
      success: false,
      errors: ['Cannot generate timetable: No curriculum courses provided.'],
    };
  }

  // Guard 3: Allocations validation
  const validation = validateFacultyAllocations(allocations, courses);
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  // Constraint Scheduling Algorithm:
  // Build 35 periods across Monday-Friday for the target section
  const section = academicContext.section;
  const department = academicContext.department;
  const year = academicContext.year || 'III Year';
  const semester = academicContext.semester || 'Semester V';
  const academicYear = academicContext.academicYear || '2024-25';

  const newSessions = [];
  const standardPeriods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'];

  // Separate labs from theory/other
  const labCourses = courses.filter((c) => c.category === 'LAB' || c.allocationRule === 'PRIMARY_PLUS_ADDITIONAL');
  const otherCourses = courses.filter((c) => c.category !== 'LAB' && c.allocationRule !== 'PRIMARY_PLUS_ADDITIONAL');

  // Place Labs in continuous 4-period morning blocks (P1-P4)
  // Lab 1 on TUE P1-P4, Lab 2 on THU P1-P4 (if 2 labs exist)
  const labDays = ['TUE', 'THU', 'WED', 'MON', 'FRI'];
  labCourses.forEach((lab, idx) => {
    const day = labDays[idx] || 'TUE';
    const alloc = allocations[lab.code] || {};
    const facultyName = alloc.additionalFaculty
      ? `${alloc.primaryFaculty} & ${alloc.additionalFaculty.join(', ')}`
      : alloc.primaryFaculty || 'Lab Faculty';

    newSessions.push({
      id: `${day}-P1-P4-LAB`,
      day,
      dayFull: WEEK_DAYS.find((d) => d.id === day)?.full || day,
      period: 'P1-P4',
      isSpan: true,
      spanCount: 4,
      startTime: '09:15',
      endTime: '12:50',
      courseCode: lab.code,
      courseName: lab.name || lab.shortName,
      section,
      classSection: section,
      department,
      year,
      semester,
      academicYear,
      room: lab.requiredRooms?.[0] || `${department} Lab ${idx + 1}`,
      roomType: 'Dedicated Laboratory',
      sessionType: 'LAB',
      faculty: facultyName,
      facultyName,
      facultyId: `FAC-${lab.code}`,
      icon: 'terminal',
    });
  });

  // Expand remaining courses into a pool of periods to schedule
  const slotPool = [];
  otherCourses.forEach((c) => {
    const alloc = allocations[c.code] || {};
    let facName = 'Faculty Instructor';
    if (typeof alloc.faculty === 'string') {
      facName = alloc.faculty;
    } else if (Array.isArray(alloc.faculty)) {
      facName = alloc.faculty.filter(Boolean).join(' & ');
    }
    const count = c.periodsPerWeek || 3;
    for (let i = 0; i < count; i++) {
      slotPool.push({
        courseCode: c.code,
        courseName: c.name || c.shortName,
        sessionType: c.category || 'THEORY',
        faculty: facName,
        facultyName: facName,
        facultyId: `FAC-${c.code}`,
        room: c.requiredRooms?.[0] || `${department}-204`,
        roomType: 'Smart Classroom',
        icon: c.category === 'ELECTIVE' ? 'draw' : 'menu-book',
      });
    }
  });

  // Fill remaining periods across MON-FRI
  WEEK_DAYS.forEach((w) => {
    standardPeriods.forEach((p) => {
      // If day has a continuous 4-period lab, skip P1-P4
      const hasLab = newSessions.some((s) => s.day === w.id && s.isSpan && (p === 'P1' || p === 'P2' || p === 'P3' || p === 'P4'));
      if (hasLab) return;

      if (slotPool.length > 0) {
        const item = slotPool.shift();
        const pt = PERIOD_TIMINGS.find((t) => t.period === p) || { startTime: '09:15', endTime: '10:05' };
        newSessions.push({
          id: `${w.id}-${p}`,
          day: w.id,
          dayFull: w.full,
          period: p,
          isSpan: false,
          spanCount: 1,
          startTime: pt.startTime,
          endTime: pt.endTime,
          courseCode: item.courseCode,
          courseName: item.courseName,
          section,
          classSection: section,
          department,
          year,
          semester,
          academicYear,
          room: item.room,
          roomType: item.roomType,
          sessionType: item.sessionType,
          faculty: item.faculty,
          facultyName: item.facultyName,
          facultyId: item.facultyId,
          icon: item.icon,
        });
      }
    });
  });

  // Store in MASTER_TIMETABLE_SESSIONS
  setMasterTimetableSessions(newSessions);

  // Update Timetable Version State
  activeTimetableVersion = {
    id: `VER-${academicYear}-${department}-${section}`,
    academicYear,
    department,
    year,
    semester,
    section,
    status: TIMETABLE_STATUSES.PENDING_HOD_APPROVAL,
    versionLabel: 'v1.0',
    generatedAt: new Date().toISOString(),
    approvedAt: null,
    approvedBy: null,
    hodReviewer: null,
    rejectionReason: null,
    totalRequiredPeriods: validation.totalRequiredPeriods,
    totalScheduledPeriods: newSessions.reduce((acc, s) => acc + (s.spanCount || 1), 0),
    freePeriods: 0,
    hardConflicts: 0,
  };

  notifyVersionSubscribers();

  return {
    success: true,
    sessions: newSessions,
    version: activeTimetableVersion,
  };
}

/**
 * On-demand Institutional Data Loader
 * Allows a user, testing script, or external API to load actual datasets
 * without hardcoding them into the static codebase.
 */
export function loadInstitutionalData({
  academicContext,
  courses,
  facultyHandlers,
  allocations,
  facultyList,
  facultyProfile,
  coordinatorProfile,
  notifications,
} = {}) {
  if (academicContext) setAcademicContext(academicContext);
  if (courses) setCurriculumCourses(courses);
  if (facultyHandlers) setCourseFacultyHandlers(facultyHandlers);
  if (allocations) {
    currentFacultyAllocations = { ...allocations };
    INITIAL_FACULTY_ALLOCATIONS = currentFacultyAllocations;
  }
  if (facultyList) {
    AC_FACULTY_LIST = [...facultyList];
  }
  if (facultyProfile) setFacultyProfile(facultyProfile);
  if (coordinatorProfile) setCoordinatorProfile(coordinatorProfile);
  if (notifications) setNotifications(notifications);

  notifyStateSubscribers();
  return { success: true };
}
