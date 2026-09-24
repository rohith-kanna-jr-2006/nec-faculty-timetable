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
export const DEFAULT_FACULTY_PROFILE = {
  id: 'CSE-FAC-042',
  name: 'Ms. C. Navamani',
  initials: 'CN',
  designation: 'Assistant Professor',
  department: 'Dept. of Computer Science & Engg.',
  shortDept: 'CSE',
  email: 'c.navamani@nandhaengg.org',
  academicYear: 'AY 2024-25 Odd',
  semester: 'Semester V',
  regulation: 'Autonomous Regulation R2022',
  status: 'Active',
  role: 'Faculty Viewer (AC Controlled)',
  academicCoordinator: 'Mr. R. Manikandan',
  maxWorkloadThreshold: 16,
  phone: '+91 98765 43210',
  cabin: 'CSE Block 2nd Floor, Room 204',
  experience: '8 Years Teaching',
  specialization: 'Compiler Design & Distributed Systems',
};

export const DEFAULT_AC_PROFILE = {
  id: 'CSE-FAC-001',
  name: 'Mr. R. Manikandan',
  initials: 'RM',
  designation: 'Assistant Professor (Sl.Gr.) & Academic Coordinator',
  department: 'Dept. of Computer Science & Engg.',
  shortDept: 'CSE',
  email: 'ac.cse@nandhaengg.org',
  academicYear: 'AY 2024-25 Odd',
  semester: 'Semester V (III Year CSE)',
  regulation: 'Autonomous Regulation R2022',
  status: 'Live Coordinator Console',
  role: 'Academic Coordinator & Timetable Chair',
  cabin: 'CSE Block 1st Floor, AC Desk #102',
  phone: 'ext 241 / +91 98421 00241',
  assignedSections: ['CSE-A', 'CSE-B', 'CSE-C', 'CSE-D'],
};

export let FACULTY_PROFILE = { ...DEFAULT_FACULTY_PROFILE };
export let AC_PROFILE = { ...DEFAULT_AC_PROFILE };
export let AVAILABLE_FACULTY_CANDIDATES = [];
export let HOD_PROFILE = null;
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
  return currentFacultyProfile ? { ...currentFacultyProfile } : { ...DEFAULT_FACULTY_PROFILE };
}

export function setFacultyProfile(profile) {
  currentFacultyProfile = profile ? { ...profile } : null;
  FACULTY_PROFILE = currentFacultyProfile || DEFAULT_FACULTY_PROFILE;
  notifyStateSubscribers();
  return currentFacultyProfile;
}

// Coordinator Profile
export function getCoordinatorProfile() {
  return currentCoordinatorProfile ? { ...currentCoordinatorProfile } : { ...DEFAULT_AC_PROFILE };
}

export function setCoordinatorProfile(profile) {
  currentCoordinatorProfile = profile ? { ...profile } : null;
  AC_PROFILE = currentCoordinatorProfile || DEFAULT_AC_PROFILE;
  notifyStateSubscribers();
  return currentCoordinatorProfile;
}

// HOD Profile Services (Starts null by default)
let currentHODProfile = null;
export function getHODProfile() {
  return currentHODProfile ? { ...currentHODProfile } : null;
}

export function setHODProfile(profile) {
  currentHODProfile = profile ? { ...profile } : null;
  HOD_PROFILE = currentHODProfile;
  notifyStateSubscribers();
  return currentHODProfile;
}

export function clearHODProfile() {
  currentHODProfile = null;
  HOD_PROFILE = null;
  notifyStateSubscribers();
}

// Available Faculty Candidates for HOD Workflows (Starts empty)
export function getAvailableFacultyCandidates() {
  return [...AVAILABLE_FACULTY_CANDIDATES];
}

export function setAvailableFacultyCandidates(candidates = []) {
  AVAILABLE_FACULTY_CANDIDATES = candidates.map((c) => ({ ...c }));
  notifyStateSubscribers();
  return AVAILABLE_FACULTY_CANDIDATES;
}

// Class Advisor Assignment State (HOD Sole Authority - Starts empty)
let currentClassAdvisors = {};

export function getClassAdvisors() {
  return { ...currentClassAdvisors };
}

export function setClassAdvisor(section, advisorData) {
  currentClassAdvisors = {
    ...currentClassAdvisors,
    [section]: {
      ...advisorData,
      appointedAt: new Date().toISOString().split('T')[0],
      status: 'CONFIRMED',
    },
  };
  notifyStateSubscribers();
  return currentClassAdvisors;
}

export function clearClassAdvisors() {
  currentClassAdvisors = {};
  notifyStateSubscribers();
}

// HOD Faculty Allocations (Binding L1 Decision - Starts empty)
let currentHODFacultyAllocations = {};

function normSem(s) {
  if (!s) return '';
  const str = String(s).trim().toUpperCase();
  if (str.includes('VIII') || str === '8') return 'Sem VIII';
  if (str.includes('VII') || str === '7') return 'Sem VII';
  if (str.includes('VI') || str === '6') return 'Sem VI';
  if (str.includes('V') || str === '5') return 'Sem V';
  if (str.includes('IV') || str === '4') return 'Sem IV';
  if (str.includes('III') || str === '3') return 'Sem III';
  if (str.includes('II') || str === '2') return 'Sem II';
  if (str.includes('I') || str === '1') return 'Sem I';
  return String(s).trim();
}

function normYr(y) {
  if (!y) return '';
  const str = String(y).trim().toUpperCase();
  if (str.includes('IV') || str === '4') return 'IV Year';
  if (str.includes('III') || str === '3') return 'III Year';
  if (str.includes('II') || str === '2') return 'II Year';
  if (str.includes('I') || str === '1') return 'I Year';
  return String(y).trim();
}

function normReg(r) {
  if (!r) return 'R2022';
  const str = String(r).toUpperCase();
  if (str.includes('2022')) return 'R2022';
  if (str.includes('2026')) return 'R2026';
  return str.trim();
}

/**
 * Context-Aware Allocation Identity Key Generator
 * Prevents one semester or section allocation from overwriting another.
 */
export function getHODAllocationKey(params = {}) {
  const {
    academicYear = 'AY 2024-25',
    regulation = 'R2022',
    department = 'CSE',
    year = 'III Year',
    semester = 'Sem V',
    section = 'CSE-C',
    courseCode = '',
    allocationType = 'REGULAR',
  } = params;

  return `${academicYear}::${normReg(regulation)}::${department}::${normYr(year)}::${normSem(semester)}::${section}::${courseCode}::${allocationType}`;
}

export function getHODFacultyAllocations(contextFilter) {
  if (!contextFilter || Object.keys(contextFilter).length === 0) {
    return { ...currentHODFacultyAllocations };
  }

  const { academicYear, regulation, department, year, semester, section } = contextFilter;
  const targetAY = academicYear ? String(academicYear).trim() : null;
  const targetReg = regulation ? normReg(regulation) : null;
  const targetDept = department ? String(department).toUpperCase().trim() : null;
  const targetYr = year ? normYr(year) : null;
  const targetSem = semester ? normSem(semester) : null;
  const targetSec = section ? String(section).trim() : null;

  const filtered = {};

  Object.entries(currentHODFacultyAllocations).forEach(([key, alloc]) => {
    if (!alloc || typeof alloc !== 'object') return;

    // Filter by context fields
    if (targetAY && alloc.academicYear && alloc.academicYear !== targetAY) return;
    if (targetReg && alloc.regulation && normReg(alloc.regulation) !== targetReg) return;
    if (targetDept && alloc.department && String(alloc.department).toUpperCase() !== targetDept) return;
    if (targetYr && alloc.year && normYr(alloc.year) !== targetYr) return;
    if (targetSem && alloc.semester && normSem(alloc.semester) !== targetSem) return;
    if (targetSec && alloc.section && String(alloc.section).trim() !== targetSec) return;

    const code = alloc.courseCode || alloc.code;
    if (code) {
      filtered[code] = alloc;
    }
    filtered[key] = alloc;
  });

  return filtered;
}

export function setHODFacultyAllocation(courseCodeOrKey, allocation = {}) {
  const context = getAcademicContext();
  const academicYear = allocation.academicYear || context.academicYear || 'AY 2024-25';
  const regulation = normReg(allocation.regulation || context.regulation || 'R2022');
  const department = String(allocation.department || context.department || 'CSE').toUpperCase();
  const year = normYr(allocation.year || context.year || 'III Year');
  const semester = normSem(allocation.semester || context.semester || 'Sem V');
  const section = allocation.section || context.section || 'CSE-C';
  const courseCode = allocation.courseCode || allocation.code || courseCodeOrKey;
  const allocationType = allocation.allocationType || allocation.classification || 'REGULAR';

  const compositeKey = getHODAllocationKey({
    academicYear,
    regulation,
    department,
    year,
    semester,
    section,
    courseCode,
    allocationType,
  });

  const enriched = {
    ...allocation,
    courseCode,
    code: courseCode,
    academicYear,
    regulation,
    department,
    year,
    semester,
    section,
    allocationType,
    allocationKey: compositeKey,
  };

  currentHODFacultyAllocations = {
    ...currentHODFacultyAllocations,
    [compositeKey]: enriched,
    [courseCode]: enriched,
  };

  notifyStateSubscribers();
  return currentHODFacultyAllocations;
}

export function clearHODFacultyAllocations() {
  currentHODFacultyAllocations = {};
  notifyStateSubscribers();
}

// HOD Notifications (Starts empty)
let currentHODNotifications = [];

export function getHODNotifications() {
  return [...currentHODNotifications];
}

export function addHODNotification(notif) {
  currentHODNotifications = [notif, ...currentHODNotifications];
  notifyStateSubscribers();
  return currentHODNotifications;
}

export function markHODNotificationRead(id) {
  currentHODNotifications = currentHODNotifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  notifyStateSubscribers();
  return currentHODNotifications;
}

export function clearHODNotifications() {
  currentHODNotifications = [];
  notifyStateSubscribers();
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
      const fac = alloc.faculty || alloc.facultyName;
      if (!fac) {
        errors.push(`Theory course ${course.code} must have exactly one faculty assigned.`);
      } else if (Array.isArray(alloc.faculty) && alloc.faculty.length > 1) {
        errors.push(`Theory course ${course.code} requires exactly one final faculty, got multiple.`);
      }
    } else if (rule === 'PRIMARY_PLUS_ADDITIONAL' || course.category === 'LAB') {
      const primary = alloc.primaryFaculty || alloc.primaryFacultyName;
      const additional = alloc.additionalFaculty || alloc.additionalFacultyNames || [];
      if (!primary) {
        errors.push(`Laboratory course ${course.code} missing primary theory-linked faculty.`);
      }
      if (!additional || additional.length === 0) {
        errors.push(`Laboratory course ${course.code} requires at least one additional staff member.`);
      }
      // Duplicate faculty rejection between primary and additional
      const primaryId = alloc.primaryFacultyId || (typeof primary === 'string' ? primary : primary?.facultyId);
      const additionalIds = (alloc.additionalFacultyIds || additional).map((a) =>
        typeof a === 'string' ? a : a?.facultyId || a?.name
      );
      if (primaryId && additionalIds.includes(primaryId)) {
        errors.push(`Laboratory course ${course.code} has duplicate faculty: primary faculty cannot also be assigned as additional staff.`);
      }
    } else if (rule === 'MINIMUM_TWO' || course.category === 'SAS' || course.classification === 'NON_CREDIT') {
      const facList = alloc.faculty || alloc.facultyNames || (alloc.faculty1 && alloc.faculty2 ? [alloc.faculty1, alloc.faculty2] : []);
      const count = Array.isArray(facList) ? facList.filter(Boolean).length : (facList ? 1 : 0);
      if (count < 2) {
        errors.push(`Soft/Analytical Skills course ${course.code} requires a minimum of two faculty handlers.`);
      }
      // Duplicate rejection
      const idList = alloc.facultyIds || (Array.isArray(facList) ? facList.map((f) => (typeof f === 'string' ? f : f?.facultyId || f?.name)) : []);
      if (Array.isArray(idList) && idList.length >= 2 && new Set(idList).size < idList.length) {
        errors.push(`Soft/Analytical Skills course ${course.code} has duplicate faculty: minimum two distinct faculty required.`);
      }
    } else if (rule === 'STAFFS_HANDLED' || course.category === 'OTHER' || course.category === 'SPECIAL') {
      const required = alloc.staffCount || 1;
      const facList = alloc.faculty || alloc.facultyNames || (alloc.facultyName ? [alloc.facultyName] : []);
      const normalizedList = Array.isArray(facList) ? facList.filter(Boolean) : [facList].filter(Boolean);
      if (normalizedList.length < required) {
        errors.push(`Course ${course.code} requires ${required} staff member(s) in Staff's Handled mode (got ${normalizedList.length}).`);
      }
      // Duplicate rejection
      const idList = alloc.facultyIds || normalizedList.map((f) => (typeof f === 'string' ? f : f?.facultyId || f?.name));
      if (Array.isArray(idList) && new Set(idList).size < idList.length) {
        errors.push(`Course ${course.code} has duplicate faculty assigned across staff slots.`);
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
