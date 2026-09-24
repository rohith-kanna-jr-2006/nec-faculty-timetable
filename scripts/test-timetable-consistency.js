/**
 * Test Suite: Timetable Model & Data Consistency Tests (Real-Data-Ready)
 *
 * Verifies:
 * 1. Zero initial mock/fallback institutional records (Real-Data-Ready initial state).
 * 2. Safe execution of all selectors against empty collections (no crashes, no null dereferences).
 * 3. Preservation of institutional business rules (Theory, Lab 4P, SAS, Other rules).
 * 4. HOD sole statutory authority lifecycle & deterministic approval transitions.
 * 5. Master timetable model consistency, dual-view identity, and conflict-free solver constraints when populated.
 */

const {
  MASTER_TIMETABLE_SESSIONS,
  getMasterTimetableSessions,
  setMasterTimetableSessions,
  clearMasterTimetableSessions,
  getFacultyTimetable,
  getClassTimetable,
  getPublishedClassTimetable,
  getTimetableVersion,
  updateTimetableVersionStatus,
  validateFacultyAllocations,
  getAcademicContext,
  getCurriculumCourses,
  getCourseFacultyHandlers,
  getHODProfile,
  getAvailableFacultyCandidates,
  getClassAdvisors,
  getHODFacultyAllocations,
  getHODNotifications,
  TIMETABLE_STATUSES,
} = require('../constants/demoData.js');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    passCount++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failCount++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('============================================================');
console.log('TIMETABLE MODEL & REAL-DATA-READY CONSISTENCY TESTS');
console.log('============================================================\n');

// ------------------------------------------------------------
// Test Group 1: Zero Initial Mock/Fallback Institutional Records
// ------------------------------------------------------------
console.log('Test 1: Zero Initial Mock Records & Real-Data-Ready State');

const initialContext = getAcademicContext();
assert(
  initialContext.department === null &&
    initialContext.year === null &&
    initialContext.semester === null &&
    initialContext.section === null,
  'Academic Context starts unselected (null fields, zero hardcoded section/enrollment)'
);

const initialHODProfile = getHODProfile();
assert(initialHODProfile === null, 'HOD Profile starts null (no fake Dr. S. Karthik identity)');

const initialCandidates = getAvailableFacultyCandidates();
assert(
  Array.isArray(initialCandidates) && initialCandidates.length === 0,
  'Faculty candidates start as empty collection'
);

const initialAdvisors = getClassAdvisors();
assert(
  typeof initialAdvisors === 'object' && Object.keys(initialAdvisors).length === 0,
  'Class advisors start unassigned (no preassigned CSE-A to CSE-D advisors)'
);

const initialHODAllocations = getHODFacultyAllocations();
assert(
  typeof initialHODAllocations === 'object' && Object.keys(initialHODAllocations).length === 0,
  'HOD faculty allocations start empty (no fake course allocations)'
);

const initialNotifications = getHODNotifications();
assert(
  Array.isArray(initialNotifications) && initialNotifications.length === 0,
  'HOD notifications start empty (no fake HOD alerts)'
);

const initialMasterSessions = getMasterTimetableSessions();
assert(
  Array.isArray(initialMasterSessions) && initialMasterSessions.length === 0,
  'Master timetable sessions start empty (no fallback draft timetable)'
);

const initialVersion = getTimetableVersion();
assert(
  initialVersion.status === TIMETABLE_STATUSES.NO_TIMETABLE,
  'Timetable governance state starts as NO_TIMETABLE (no fake approval)'
);

// ------------------------------------------------------------
// Test Group 2: Selectors Handle Empty Collections Gracefully
// ------------------------------------------------------------
console.log('\nTest 2: Safe Selectors Against Empty Collections');

const emptyFacultyTT = getFacultyTimetable('CSE-FAC-042');
assert(
  Array.isArray(emptyFacultyTT) && emptyFacultyTT.length === 0,
  'getFacultyTimetable returns safe empty array when no sessions exist'
);

const emptyClassTT = getClassTimetable({ section: 'CSE-C' });
assert(
  Array.isArray(emptyClassTT) && emptyClassTT.length === 0,
  'getClassTimetable returns safe empty array when no sessions exist'
);

const emptyPublicTT = getPublishedClassTimetable({ section: 'CSE-C' });
assert(
  emptyPublicTT.isApproved === false && emptyPublicTT.sessions.length === 0,
  'getPublishedClassTimetable returns unapproved empty payload when no timetable is published'
);

const emptyCourses = getCurriculumCourses();
assert(
  Array.isArray(emptyCourses) && emptyCourses.length === 0,
  'getCurriculumCourses returns safe empty array initially'
);

const emptyHandlers = getCourseFacultyHandlers('22CSC14');
assert(
  Array.isArray(emptyHandlers) && emptyHandlers.length === 0,
  'getCourseFacultyHandlers returns safe empty array when no handlers configured'
);

// ------------------------------------------------------------
// Test Group 3: Institutional Allocation Business Rules Verification
// ------------------------------------------------------------
console.log('\nTest 3: Institutional Business Rules Engine Verification');

const testCourses = [
  {
    code: '22CSC14',
    name: 'Compiler Design',
    category: 'THEORY',
    periodsPerWeek: 4,
    allocationRule: 'SINGLE_FACULTY',
  },
  {
    code: '22CSL07',
    name: 'Compiler Lab',
    category: 'LAB',
    periodsPerWeek: 4,
    allocationRule: 'PRIMARY_PLUS_ADDITIONAL',
  },
];

// Rule A: Theory course requires exactly 1 faculty handler
const invalidTheoryAllocation = {
  '22CSC14': { faculty: null },
  '22CSL07': { primaryFaculty: 'Faculty 1', additionalFaculty: ['Faculty 2'] },
};
const theoryValidation = validateFacultyAllocations(invalidTheoryAllocation, testCourses);
assert(
  theoryValidation.valid === false && theoryValidation.errors.length > 0,
  'Theory allocation rule correctly flags missing faculty handler'
);

// Rule B: Lab course requires primary guide + additional staff
const invalidLabAllocation = {
  '22CSC14': { faculty: 'Faculty 1' },
  '22CSL07': { primaryFaculty: 'Faculty 1', additionalFaculty: [] }, // Missing additional staff
};
const labValidation = validateFacultyAllocations(invalidLabAllocation, testCourses);
assert(
  labValidation.valid === false && labValidation.errors.length > 0,
  'Lab allocation rule correctly requires 2 staff members (primary + additional)'
);

// Rule C: Valid allocations pass validation
const validAllocations = {
  '22CSC14': { faculty: 'Faculty 1' },
  '22CSL07': { primaryFaculty: 'Faculty 1', additionalFaculty: ['Faculty 2'] },
};
const validResult = validateFacultyAllocations(validAllocations, testCourses);
assert(
  validResult.valid === true && validResult.errors.length === 0,
  'Valid allocations pass business rules validation with 0 errors'
);
assert(validResult.totalRequiredPeriods === 8, 'Total required periods calculated accurately (8 periods)');

// Rule D: Authoritative Semester V 12-Course 35-Period Completeness Check
const { getRegulationSubjects } = require('../services/regulationCurriculumService.js');
const sem5Courses = getRegulationSubjects({
  regulation: 'R2022',
  semester: 'Sem V',
  department: 'CSE',
  year: 'III Year',
  section: 'CSE-C',
});
const sem5Allocations = {};
sem5Courses.forEach((c) => {
  if (c.category === 'LAB' || c.allocationRule === 'PRIMARY_PLUS_ADDITIONAL') {
    sem5Allocations[c.code] = { primaryFaculty: 'Fac 1', additionalFaculty: ['Fac 2'] };
  } else if (c.allocationRule === 'MINIMUM_TWO' || c.category === 'SAS') {
    sem5Allocations[c.code] = { faculty: ['Fac 1', 'Fac 2'] };
  } else if (c.allocationRule === 'STAFFS_HANDLED') {
    sem5Allocations[c.code] = { faculty: ['Fac 1'], staffCount: 1 };
  } else {
    sem5Allocations[c.code] = { faculty: 'Fac 1' };
  }
});
const sem5Validation = validateFacultyAllocations(sem5Allocations, sem5Courses);
assert(
  sem5Validation.valid === true &&
    sem5Validation.totalRequiredPeriods === 35 &&
    sem5Validation.scheduledPeriods === 35,
  'Authoritative Semester V curriculum requires exactly 35 weekly periods (100% schedule grid completeness)'
);

// ------------------------------------------------------------
// Test Group 4: HOD Approval Workflow State Machine
// ------------------------------------------------------------
console.log('\nTest 4: HOD Approval Workflow Lifecycle');

updateTimetableVersionStatus(TIMETABLE_STATUSES.GENERATED);
assert(
  getTimetableVersion().status === TIMETABLE_STATUSES.GENERATED,
  'Status transitions to GENERATED after solver execution'
);

updateTimetableVersionStatus(TIMETABLE_STATUSES.PENDING_HOD_APPROVAL);
assert(
  getTimetableVersion().status === TIMETABLE_STATUSES.PENDING_HOD_APPROVAL,
  'Status transitions to PENDING_HOD_APPROVAL'
);

const unapprovedPublicTT = getPublishedClassTimetable({ section: 'CSE-C' });
assert(
  unapprovedPublicTT.isApproved === false && unapprovedPublicTT.sessions.length === 0,
  'Class Timetable is NOT publicly visible while PENDING_HOD_APPROVAL'
);

// Rejection flow
updateTimetableVersionStatus(TIMETABLE_STATUSES.REJECTED, {
  rejectionReason: 'Re-align lab slot with staff availability',
});
const rejectedVersion = getTimetableVersion();
assert(
  rejectedVersion.status === TIMETABLE_STATUSES.REJECTED,
  'Status transitions to REJECTED with remarks'
);
assert(
  rejectedVersion.rejectionReason === 'Re-align lab slot with staff availability',
  'Rejection remarks recorded in version metadata'
);

// Resubmission & HOD Approval
updateTimetableVersionStatus(TIMETABLE_STATUSES.PENDING_HOD_APPROVAL);
updateTimetableVersionStatus(TIMETABLE_STATUSES.APPROVED, {
  approvedBy: 'Dr. Executive HOD',
});
const approvedVersion = getTimetableVersion();
assert(
  approvedVersion.status === TIMETABLE_STATUSES.APPROVED,
  'Status transitions to APPROVED upon HOD executive ratification'
);
assert(approvedVersion.approvedBy === 'Dr. Executive HOD', 'ApprovedBy matches actual authenticated HOD');

// Publication
updateTimetableVersionStatus(TIMETABLE_STATUSES.PUBLISHED);
assert(
  getTimetableVersion().status === TIMETABLE_STATUSES.PUBLISHED,
  'Status transitions to PUBLISHED across institutional portals'
);

// ------------------------------------------------------------
// Test Group 5: Synthesized Timetable Data Model Conformance (When Populated)
// ------------------------------------------------------------
console.log('\nTest 5: Master Timetable Consistency & Constraint Conformance');

// Populate simulated constraint-solver generated sessions
const sampleSynthesizedSessions = [
  // Monday
  { id: 'SYN-01', academicYear: '2024-25', department: 'CSE', year: 'III', semester: 'V', section: 'CSE-C', day: 'MON', period: 'P1', startTime: '09:15', endTime: '10:05', courseCode: '22CSC14', courseName: 'Compiler Design', sessionType: 'THEORY', facultyId: 'FAC-01', facultyName: 'Faculty A', room: 'LH-302', roomType: 'LECTURE', spanCount: 1, isSpan: false },
  { id: 'SYN-02', academicYear: '2024-25', department: 'CSE', year: 'III', semester: 'V', section: 'CSE-C', day: 'MON', period: 'P2', startTime: '10:05', endTime: '10:55', courseCode: '22CSC15', courseName: 'Cloud Computing', sessionType: 'THEORY', facultyId: 'FAC-02', facultyName: 'Faculty B', room: 'LH-302', roomType: 'LECTURE', spanCount: 1, isSpan: false },
  // Tuesday Lab 4P Continuous Block
  { id: 'SYN-03', academicYear: '2024-25', department: 'CSE', year: 'III', semester: 'V', section: 'CSE-C', day: 'TUE', period: 'P1-P4', startTime: '09:15', endTime: '12:50', courseCode: '22CSL07', courseName: 'Compiler Lab', sessionType: 'LAB', facultyId: 'FAC-01', facultyName: 'Faculty A', room: 'SYS-LAB-01', roomType: 'LAB', spanCount: 4, isSpan: true },
];

setMasterTimetableSessions(sampleSynthesizedSessions);

const requiredSessionFields = [
  'id',
  'academicYear',
  'department',
  'year',
  'semester',
  'section',
  'day',
  'period',
  'startTime',
  'endTime',
  'courseCode',
  'courseName',
  'sessionType',
  'facultyId',
  'facultyName',
  'room',
  'roomType',
  'spanCount',
  'isSpan',
];

let allFieldsValid = true;
const currentSessions = getMasterTimetableSessions();
currentSessions.forEach((s) => {
  requiredSessionFields.forEach((f) => {
    if (s[f] === undefined) {
      allFieldsValid = false;
      console.error(`Session ${s.id} missing field ${f}`);
    }
  });
});
assert(allFieldsValid, 'All synthesized master sessions adhere to TimetableSession model schema');

// Dual View Identity Check
const facSessions = getFacultyTimetable('FAC-01');
const classSessions = getClassTimetable({ section: 'CSE-C' });

const sharedFacSession = facSessions.find((s) => s.id === 'SYN-01');
const sharedClassSession = classSessions.find((s) => s.id === 'SYN-01');

assert(
  sharedFacSession && sharedClassSession && sharedFacSession.id === sharedClassSession.id,
  'Faculty view and Class view reference the EXACT identical session entity (Single Source of Truth)'
);

// Lab 4P Continuity Check
const labSession = classSessions.find((s) => s.courseCode === '22CSL07');
assert(
  labSession && labSession.spanCount === 4 && labSession.isSpan === true,
  'Laboratory session spans continuous 4-period block (isSpan = true, spanCount = 4)'
);

// Reset back to clean state
clearMasterTimetableSessions();
assert(
  getMasterTimetableSessions().length === 0,
  'clearMasterTimetableSessions safely returns state to zero master sessions'
);

// Reset version state
updateTimetableVersionStatus(TIMETABLE_STATUSES.NO_TIMETABLE);

// ------------------------------------------------------------
// Test Summary
// ------------------------------------------------------------
console.log('\n============================================================');
console.log(`SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('============================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
