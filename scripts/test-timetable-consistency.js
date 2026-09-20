/**
 * Test Suite: Timetable Model & Data Consistency Tests
 * Verifies single source of truth, session identity across views, zero conflicts,
 * lab continuity, and HOD approval lifecycle.
 */

const {
  MASTER_TIMETABLE_SESSIONS,
  getFacultyTimetable,
  getClassTimetable,
  getPublishedClassTimetable,
  getTimetableVersion,
  updateTimetableVersionStatus,
  validateFacultyAllocations,
  INITIAL_FACULTY_ALLOCATIONS,
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
console.log('TIMETABLE DATA CONSISTENCY TESTS');
console.log('============================================================\n');

// 1. Single Master Timetable Session Model Check
console.log('Test 1: Single Master Timetable Session Model Conformance');
const requiredFields = [
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

let allFieldsPresent = true;
MASTER_TIMETABLE_SESSIONS.forEach((s) => {
  requiredFields.forEach((f) => {
    if (s[f] === undefined) {
      allFieldsPresent = false;
      console.error(`Session ${s.id} is missing field: ${f}`);
    }
  });
});
assert(allFieldsPresent, 'All 32 master sessions contain all required TimetableSession fields');

// 2. View Reference Test: Faculty View and Class View reference SAME session IDs
console.log('\nTest 2: Dual Views from Single Master Dataset (Identity Check)');
const navamaniSessions = getFacultyTimetable('CSE-FAC-042');
const csecSessions = getClassTimetable({ section: 'CSE-C' });

assert(navamaniSessions.length === 6, `Faculty Ms. C. Navamani has exactly 6 teaching sessions (found ${navamaniSessions.length})`);
assert(csecSessions.length === 29, `Class CSE-C has exactly 29 session entries representing 35 periods (found ${csecSessions.length})`);

// Check shared session: WED P4 (UI/UX Design in CSE-C)
const facultyWedP4 = navamaniSessions.find((s) => s.day === 'WED' && s.period === 'P4');
const classWedP4 = csecSessions.find((s) => s.day === 'WED' && s.period === 'P4');

assert(!!facultyWedP4 && !!classWedP4, 'Session WED-P4 exists in both Faculty and Class views');
assert(facultyWedP4.id === classWedP4.id, `Both views share the EXACT session ID (${facultyWedP4?.id} === ${classWedP4?.id})`);
assert(facultyWedP4.courseCode === classWedP4.courseCode, 'Both views share identical courseCode (22CSX42)');
assert(facultyWedP4.room === classWedP4.room, 'Both views share identical room (CSE-204)');
assert(facultyWedP4.startTime === classWedP4.startTime && facultyWedP4.endTime === classWedP4.endTime, 'Both views share identical timings (12:00 – 12:50)');

// 3. Zero Conflict Tests
console.log('\nTest 3: Zero Conflict Constraints (Hard Rules)');
const facultySlots = {};
let facultyConflict = 0;

MASTER_TIMETABLE_SESSIONS.forEach((s) => {
  const key = `${s.facultyId}_${s.day}_${s.period}`;
  if (facultySlots[key]) {
    facultyConflict++;
    console.error(`Double booking for faculty ${s.facultyId}: ${s.id} vs ${facultySlots[key].id}`);
  }
  facultySlots[key] = s;
});
assert(facultyConflict === 0, 'Zero faculty double-booking conflicts across all 32 sessions');

const classSlots = {};
let classConflict = 0;
MASTER_TIMETABLE_SESSIONS.forEach((s) => {
  const key = `${s.section}_${s.day}_${s.period}`;
  if (classSlots[key]) {
    classConflict++;
    console.error(`Class collision for section ${s.section}: ${s.id} vs ${classSlots[key].id}`);
  }
  classSlots[key] = s;
});
assert(classConflict === 0, 'Zero class period collisions across all 32 sessions');

// 4. Lab Continuity Test
console.log('\nTest 4: Laboratory 4-Period Continuity');
const fsdLab = csecSessions.find((s) => s.courseCode === '22CSP09');
const ooseLab = csecSessions.find((s) => s.courseCode === '22CSP10');

assert(fsdLab && fsdLab.spanCount === 4 && fsdLab.isSpan === true, 'FSD Lab (22CSP09) spans continuous 4 periods (P1-P4 on Tuesday)');
assert(ooseLab && ooseLab.spanCount === 4 && ooseLab.isSpan === true, 'OOSE Lab (22CSP10) spans continuous 4 periods (P1-P4 on Thursday)');

// 5. Total Periods Scheduled Test
console.log('\nTest 5: Weekly Period Accounting (35/35 Periods for CSE-C)');
const totalPeriodsCSEC = csecSessions.reduce((sum, s) => sum + (s.spanCount || 1), 0);
assert(totalPeriodsCSEC === 35, `Total weekly periods for CSE-C equals exactly 35 (counted: ${totalPeriodsCSEC})`);

// 6. Pre-flight Allocation Validation
console.log('\nTest 6: Faculty Allocation Validation Engine');
const validationResult = validateFacultyAllocations(INITIAL_FACULTY_ALLOCATIONS);
assert(validationResult.valid === true, 'Initial faculty allocations pass 100% of allocation rules');
assert(validationResult.errors.length === 0, 'Zero allocation rule violations');
assert(validationResult.totalRequiredPeriods === 35, 'Total required periods calculated as 35');

// 7. HOD Approval State Lifecycle Test
console.log('\nTest 7: HOD Approval Workflow Lifecycle');
updateTimetableVersionStatus('PENDING_HOD_APPROVAL');
const pendingVersion = getTimetableVersion();
assert(pendingVersion.status === 'PENDING_HOD_APPROVAL', 'Initial state is PENDING_HOD_APPROVAL');

const publishedBefore = getPublishedClassTimetable({ section: 'CSE-C' });
assert(publishedBefore.isApproved === false, 'Class Timetable is NOT published while PENDING_HOD_APPROVAL');
assert(publishedBefore.sessions.length === 0, 'Public class timetable exposes 0 sessions when unapproved');

// HOD Rejection branch
updateTimetableVersionStatus('REJECTED', { rejectionReason: 'Re-align lab slot with staff availability' });
const rejectedVersion = getTimetableVersion();
assert(rejectedVersion.status === 'REJECTED', 'Status successfully transitions to REJECTED');
assert(rejectedVersion.rejectionReason === 'Re-align lab slot with staff availability', 'Rejection reason properly recorded');

// Resubmit for approval
updateTimetableVersionStatus('PENDING_HOD_APPROVAL');
assert(getTimetableVersion().status === 'PENDING_HOD_APPROVAL', 'Status successfully transitions back to PENDING_HOD_APPROVAL');

// HOD Approval
updateTimetableVersionStatus('APPROVED', { approvedBy: 'Dr. S. K. Nandha (HOD / CSE)' });
const approvedVersion = getTimetableVersion();
assert(approvedVersion.status === 'APPROVED', 'Status successfully transitions to APPROVED');
assert(approvedVersion.approvedBy === 'Dr. S. K. Nandha (HOD / CSE)', 'ApprovedBy matches HOD identity');

// Publish
updateTimetableVersionStatus('PUBLISHED');
const publishedVersion = getTimetableVersion();
assert(publishedVersion.status === 'PUBLISHED', 'Status successfully transitions to PUBLISHED');

const publishedAfter = getPublishedClassTimetable({ section: 'CSE-C' });
assert(publishedAfter.isApproved === true, 'Class Timetable is accessible when PUBLISHED');
assert(publishedAfter.sessions.length === 29, 'Public class timetable exposes full 29 session entries');

console.log('\n============================================================');
console.log(`SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('============================================================\n');

if (failCount > 0) {
  process.exit(1);
}
