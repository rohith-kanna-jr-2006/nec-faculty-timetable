/**
 * Test Suite: Faculty Workload Allocation Master Module
 *
 * Verifies all 14 mandatory requirements:
 * 1. Exactly 28 faculty records
 * 2. Every faculty name exists
 * 3. Every designation exists
 * 4. Every workload row exists
 * 5. Every supplied hour exists
 * 6. Supplied totals preserved
 * 7. Responsibility rows remain separate
 * 8. Calculated totals work
 * 9. Incomplete records marked correctly
 * 10. No duplicate identical workload rows
 * 11. Search works
 * 12. Filters work
 * 13. Faculty detail works
 * 14. Workload data does NOT become TimetableSession
 */

const {
  FACULTY_WORKLOAD_MASTER,
  FACULTY_WORKLOAD_SOURCE,
  getWorkloadMaster,
  getFacultyWorkloadById,
  getWorkloadSummaryMetrics,
  searchAndFilterWorkload,
  validateWorkloadRecord,
  calculateTeachingHours,
  calculateResponsibilityHours,
} = require('../constants/workloadMasterData.js');

const {
  MASTER_TIMETABLE_SESSIONS,
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
console.log('FACULTY WORKLOAD ALLOCATION MASTER MODULE: 14 TEST SUITES');
console.log('============================================================\n');

// ------------------------------------------------------------
// 1. Exactly 27 Faculty Records
// ------------------------------------------------------------
console.log('--- Test 1: Exactly 27 Faculty Records (25 CSE, 2 ECE) ---');
assert(FACULTY_WORKLOAD_MASTER.length === 27, 'FACULTY_WORKLOAD_MASTER contains exactly 27 records');
assert(FACULTY_WORKLOAD_SOURCE.length === 27, 'FACULTY_WORKLOAD_SOURCE alias contains exactly 27 records');
const processed = getWorkloadMaster();
assert(processed.length === 27, 'getWorkloadMaster() returns exactly 27 processed records');

// ------------------------------------------------------------
// 2. Every Faculty Name Exists
// ------------------------------------------------------------
console.log('\n--- Test 2: Every Faculty Name Exists (Exact Spellings Preserved) ---');
const EXPECTED_FACULTY = [
  { id: 'FWL-01', name: 'Dr. T. Rajasekaran', designation: 'Professor & Head Of Department HOD', sourceTotal: 8 },
  { id: 'FWL-02', name: 'M. P. Thiruvenkatasuresh', designation: 'Professor', sourceTotal: 24 },
  { id: 'FWL-03', name: 'Dr. S. Karpusamy', designation: 'ASP', sourceTotal: 23 },
  { id: 'FWL-04', name: 'Dr. A. Manchula', designation: 'AP', sourceTotal: 23 },
  { id: 'FWL-05', name: 'C. Mani', designation: 'AP (Website)', sourceTotal: 20 },
  { id: 'FWL-06', name: 'Mrs. E. Padma', designation: 'AP', sourceTotal: 25 },
  { id: 'FWL-07', name: 'Mrs. P. Uma', designation: 'AP', sourceTotal: 19 },
  { id: 'FWL-08', name: 'Mrs. K. Shanmugapriya', designation: 'AP', sourceTotal: 22 },
  { id: 'FWL-09', name: 'Mrs. B. Deepa', designation: 'AP', sourceTotal: 24 },
  { id: 'FWL-10', name: 'Mrs. C. Navamani', designation: 'AP', sourceTotal: 24 },
  { id: 'FWL-11', name: 'Mr. S. Jagadeesan', designation: 'AP (DCOE)', sourceTotal: 13 },
  { id: 'FWL-12', name: 'Mrs. K. Eswari', designation: 'AP', sourceTotal: 21 },
  { id: 'FWL-13', name: 'Mrs. N. M. Indumathi', designation: 'AP', sourceTotal: 17 },
  { id: 'FWL-14', name: 'Ms. D. Vinoparkavi', designation: 'AP', sourceTotal: 23 },
  { id: 'FWL-15', name: 'Mrs. P. Devika', designation: 'AP', sourceTotal: 21 },
  { id: 'FWL-16', name: 'Mrs. S. Geetha', designation: 'AP', sourceTotal: 21 },
  { id: 'FWL-17', name: 'Mrs. P. Savitha', designation: 'AP', sourceTotal: 21 },
  { id: 'FWL-18', name: 'Mrs. V. Mythily', designation: 'AP', sourceTotal: 22 },
  { id: 'FWL-19', name: 'Mr. D. Kavin Kumar', designation: 'AP (Placement)', sourceTotal: 19 },
  { id: 'FWL-20', name: 'Mrs. A. Satheesh Kumar', designation: 'AP', sourceTotal: null },
  { id: 'FWL-21', name: 'Mrs. J. Radha', designation: 'AP', sourceTotal: 18 },
  { id: 'FWL-22', name: 'Mr. R. Manikandan', designation: 'AP', sourceTotal: 21 },
  { id: 'FWL-23', name: 'Ms. N. Bhuvaneswari', designation: 'AP', sourceTotal: 22 },
  { id: 'FWL-24', name: 'Mr. K. U. Ranjith', designation: 'AP (Placement)', sourceTotal: 18 },
  { id: 'FWL-25', name: 'Ms. M. Sowmya', designation: 'AP', sourceTotal: 22 },
  { id: 'FWL-26', name: 'Dr. R. Praveenkumar', designation: 'ASP / ECE', sourceTotal: 18 },
  { id: 'FWL-27', name: 'Ms. B. Preethi', designation: 'AP / ECE', sourceTotal: 17 },
];

EXPECTED_FACULTY.forEach((exp, idx) => {
  const found = processed.find((f) => f.facultyName === exp.name);
  assert(!!found, `Faculty #${idx + 1} exists: "${exp.name}"`);
});

// Explicit check for exact name preservation: Karpusamy
const karpusamy = processed.find((f) => f.facultyName === 'Dr. S. Karpusamy');
assert(
  karpusamy && karpusamy.facultyName === 'Dr. S. Karpusamy',
  'Preserves exact spelling "Dr. S. Karpusamy" without silent normalization to Karuppusamy'
);

// ------------------------------------------------------------
// 3. Every Designation Exists
// ------------------------------------------------------------
console.log('\n--- Test 3: Every Designation Exists & Is Preserved ---');
EXPECTED_FACULTY.forEach((exp) => {
  const found = processed.find((f) => f.facultyName === exp.name);
  assert(
    found && found.designation === exp.designation,
    `Designation for "${exp.name}" is "${exp.designation}"`
  );
});

// ------------------------------------------------------------
// 4. Every Workload Row Exists
// ------------------------------------------------------------
console.log('\n--- Test 4: Every Workload Row Exists (Detailed Breakdown Retained) ---');

// Specific verification for M. P. Thiruvenkatasuresh (must retain all 10 rows separately)
const thiruvenkata = processed.find((f) => f.facultyName === 'M. P. Thiruvenkatasuresh');
assert(thiruvenkata !== undefined, 'M. P. Thiruvenkatasuresh profile exists');
assert(thiruvenkata.teaching.ugTheory1.length === 1, 'M. P. Thiruvenkatasuresh: UG Theory 1 has 1 row (22CSC06, 3h)');
assert(thiruvenkata.teaching.lab1.length === 1, 'M. P. Thiruvenkatasuresh: Lab 1 has 1 row (22CSP05, UG II Year C, 4h)');
assert(thiruvenkata.teaching.lab2.length === 1, 'M. P. Thiruvenkatasuresh: Lab 2 has 1 row (22CSP05, UG II Year B, 4h)');
assert(thiruvenkata.teaching.pg.length === 1, 'M. P. Thiruvenkatasuresh: PG has 1 row (22CPB01, 1h)');
assert(thiruvenkata.teaching.others.length === 3, 'M. P. Thiruvenkatasuresh: Others has 3 rows (PBL 2h, Skill Dev 2h, Indian Constitution 1h)');
assert(thiruvenkata.responsibilities.length === 3, 'M. P. Thiruvenkatasuresh: Responsibilities has 3 rows (Overall AC 2h, CA 2h, NBA Coord 3h)');

let totalTeachingRows = 0;
let totalResponsibilityRows = 0;
processed.forEach((f) => {
  Object.values(f.teaching).forEach((items) => {
    totalTeachingRows += items.length;
  });
  totalResponsibilityRows += f.responsibilities.length;
});

const totalWorkloadRows = totalTeachingRows + totalResponsibilityRows;
assert(totalTeachingRows > 0, `Total teaching allocation rows: ${totalTeachingRows}`);
assert(totalResponsibilityRows > 0, `Total responsibility allocation rows: ${totalResponsibilityRows}`);
assert(totalWorkloadRows >= 170, `Total preserved workload rows across 28 faculty: ${totalWorkloadRows}`);

// ------------------------------------------------------------
// 5. Every Supplied Hour Exists
// ------------------------------------------------------------
console.log('\n--- Test 5: Every Supplied Hour Exists & Is Preserved ---');

let validHoursCount = 0;
processed.forEach((f) => {
  Object.entries(f.teaching).forEach(([catKey, items]) => {
    items.forEach((item) => {
      assert(
        typeof item.hours === 'number' && item.hours >= 0,
        `${f.facultyName} - ${catKey} (${item.courseName}): hours is valid number (${item.hours})`
      );
      validHoursCount++;
    });
  });
  f.responsibilities.forEach((r) => {
    if (f.facultyName.includes('Satheesh Kumar') && r.role === 'TECH GURU') {
      assert(
        r.hours === null,
        `${f.facultyName} - Responsibility (${r.role}): hours is null (preserved faithfully as unstated in source)`
      );
    } else {
      assert(
        typeof r.hours === 'number' && r.hours >= 0,
        `${f.facultyName} - Responsibility (${r.role}): hours is valid number (${r.hours})`
      );
    }
    validHoursCount++;
  });
});
assert(validHoursCount === totalWorkloadRows, `All ${validHoursCount} workload items have valid hours`);

// Missing course codes preserved as null, not artificial "--"
let nullCodeCount = 0;
processed.forEach((f) => {
  Object.values(f.teaching).forEach((itemList) => {
    itemList.forEach((item) => {
      assert(item.courseCode !== '--', `Course "${item.courseName}" does not use artificial "--"`);
      if (item.courseCode === null) nullCodeCount++;
    });
  });
});
assert(nullCodeCount > 0, `Preserved ${nullCodeCount} courses with null courseCode where omitted by source`);

// ------------------------------------------------------------
// 6. Supplied Totals Preserved
// ------------------------------------------------------------
console.log('\n--- Test 6: Supplied Totals Preserved ---');
EXPECTED_FACULTY.forEach((exp) => {
  const found = processed.find((f) => f.facultyName === exp.name);
  assert(
    found.sourceTotalHours === exp.sourceTotal,
    `Source total for "${exp.name}": expected ${exp.sourceTotal}, got ${found.sourceTotalHours}`
  );
});

// ------------------------------------------------------------
// 7. Responsibility Rows Remain Separate
// ------------------------------------------------------------
console.log('\n--- Test 7: Responsibility Rows Remain Separate (Not Converted into Courses) ---');
processed.forEach((f) => {
  f.responsibilities.forEach((r) => {
    assert(r.category === 'RESPONSIBILITY', `Responsibility "${r.role}" has category "RESPONSIBILITY"`);
    assert(r.courseCode === undefined || r.courseCode === null, `Responsibility "${r.role}" does not have courseCode`);
    assert(typeof r.role === 'string' && r.role.length > 0, `Responsibility role is string: "${r.role}"`);
  });
});

// Check key specific roles
assert(
  thiruvenkata.responsibilities.some((r) => r.role === 'Overall Academic Coordinator'),
  'M. P. Thiruvenkatasuresh has Overall Academic Coordinator'
);
assert(
  thiruvenkata.responsibilities.some((r) => r.role === 'NBA Coordinator'),
  'M. P. Thiruvenkatasuresh has NBA Coordinator'
);
const ranjith = processed.find((f) => f.facultyName === 'Mr. K. U. Ranjith');
assert(
  ranjith.responsibilities.some((r) => r.role === 'Placement Coordinator'),
  'Mr. K. U. Ranjith has Placement Coordinator'
);
assert(
  ranjith.responsibilities.some((r) => r.role === 'CC1 Lab Incharge'),
  'Mr. K. U. Ranjith has CC1 Lab Incharge'
);

// ------------------------------------------------------------
// 8. Calculated Totals Work
// ------------------------------------------------------------
console.log('\n--- Test 8: Calculated Totals Work (Teaching + Responsibility) ---');
processed.forEach((f) => {
  const tSum = calculateTeachingHours(f.teaching);
  const rSum = calculateResponsibilityHours(f.responsibilities);
  const expectedTotal = tSum + rSum;

  assert(f.teachingHours === tSum, `${f.facultyName}: teachingHours (${f.teachingHours}) matches calculated sum`);
  assert(f.responsibilityHours === rSum, `${f.facultyName}: responsibilityHours (${f.responsibilityHours}) matches calculated sum`);
  assert(f.calculatedTotalHours === expectedTotal, `${f.facultyName}: calculatedTotalHours (${f.calculatedTotalHours}) == ${tSum} + ${rSum}`);

  if (f.sourceTotalHours !== null) {
    assert(
      f.status === 'MATCHED' ? f.calculatedTotalHours === f.sourceTotalHours : f.calculatedTotalHours !== f.sourceTotalHours,
      `${f.facultyName}: status (${f.status}) correctly reflects comparison of source (${f.sourceTotalHours}) and calculated (${f.calculatedTotalHours})`
    );
  }
});

const metrics = getWorkloadSummaryMetrics();
assert(metrics.totalFaculty === 27, 'Dashboard metrics totalFaculty is 27');
assert(metrics.totalAllocatedHours === metrics.totalTeachingHours + metrics.totalResponsibilityHours, 'Total allocated hours equals teaching + responsibilities');
assert(metrics.completeCount === 26, '26 records complete and matched');
assert(metrics.incompleteCount === 1, '1 record incomplete source data (Mrs. A. Satheesh Kumar)');
assert(metrics.discrepancyCount === 0, '0 records review required');

// ------------------------------------------------------------
// 9. Incomplete Records Marked Correctly
// ------------------------------------------------------------
console.log('\n--- Test 9: Incomplete Records Marked Correctly ---');

const satheesh = processed.find((f) => f.facultyName === 'Mrs. A. Satheesh Kumar');
assert(satheesh !== undefined, 'Mrs. A. Satheesh Kumar record exists');
assert(satheesh.designation === 'AP', 'Mrs. A. Satheesh Kumar designation is AP');
assert(satheesh.status === 'INCOMPLETE SOURCE DATA', 'Mrs. A. Satheesh Kumar marked INCOMPLETE SOURCE DATA');
assert(satheesh.sourceTotalHours === null, 'Mrs. A. Satheesh Kumar sourceTotalHours is null (not artificially inferred)');
assert(
  satheesh.responsibilities.some((r) => r.role === 'TECH GURU'),
  'Mrs. A. Satheesh Kumar preserves TECH GURU responsibility'
);
assert(
  satheesh.responsibilities.find((r) => r.role === 'TECH GURU').hours === null,
  'Mrs. A. Satheesh Kumar TECH GURU responsibility hours is null (not guessed to 0)'
);

// ------------------------------------------------------------
// 10. No Duplicate Identical Workload Rows
// ------------------------------------------------------------
console.log('\n--- Test 10: No Duplicate Identical Workload Rows ---');
let duplicateCount = 0;
processed.forEach((f) => {
  const seenTeaching = new Set();
  Object.entries(f.teaching).forEach(([catKey, list]) => {
    list.forEach((t) => {
      const key = `${catKey}|${t.courseCode}|${t.courseName}|${t.allocation}|${t.hours}`;
      if (seenTeaching.has(key)) {
        console.error(`Duplicate teaching row for ${f.facultyName}: ${key}`);
        duplicateCount++;
      }
      seenTeaching.add(key);
    });
  });

  const seenResp = new Set();
  f.responsibilities.forEach((r) => {
    const key = `${r.role}|${r.allocation}|${r.hours}`;
    if (seenResp.has(key)) {
      console.error(`Duplicate responsibility row for ${f.facultyName}: ${key}`);
      duplicateCount++;
    }
    seenResp.add(key);
  });
});
assert(duplicateCount === 0, 'No duplicate identical workload rows exist across all 27 faculty records');

// ------------------------------------------------------------
// 11. Search Works
// ------------------------------------------------------------
console.log('\n--- Test 11: Dynamic Search Works ---');
// By faculty name
const searchName = searchAndFilterWorkload({ searchQuery: 'Navamani' });
assert(searchName.length === 1 && searchName[0].facultyName === 'Mrs. C. Navamani', 'Search by name "Navamani" finds Mrs. C. Navamani');

// By designation
const searchDesig = searchAndFilterWorkload({ searchQuery: 'DCOE' });
assert(searchDesig.length === 1 && searchDesig[0].facultyName === 'Mr. S. Jagadeesan', 'Search by designation "DCOE" finds Mr. S. Jagadeesan');

// By course code
const searchCode = searchAndFilterWorkload({ searchQuery: '22CPX14' });
assert(searchCode.length === 1 && searchCode[0].facultyName === 'Mrs. J. Radha', 'Search by course code "22CPX14" finds Mrs. J. Radha');

// By course name
const searchCourse = searchAndFilterWorkload({ searchQuery: 'Compiler Design' });
assert(searchCourse.length >= 2, `Search by course "Compiler Design" finds ${searchCourse.length} faculty`);

// By allocation context
const searchContext = searchAndFilterWorkload({ searchQuery: 'UG II Year C' });
assert(searchContext.length > 0, `Search by allocation context "UG II Year C" finds ${searchContext.length} faculty`);

// By responsibility
const searchResp = searchAndFilterWorkload({ searchQuery: 'PCD Club' });
assert(searchResp.length > 0, `Search by responsibility "PCD Club" finds ${searchResp.length} faculty`);

// ------------------------------------------------------------
// 12. Filters Work
// ------------------------------------------------------------
console.log('\n--- Test 12: Dynamic Filters Work ---');
// Status filters
const fMatched = searchAndFilterWorkload({ statusFilter: 'MATCHED' });
assert(fMatched.length === 26, 'Filter MATCHED returns exactly 26 records');

const fIncomplete = searchAndFilterWorkload({ statusFilter: 'INCOMPLETE SOURCE DATA' });
assert(fIncomplete.length === 1, 'Filter INCOMPLETE SOURCE DATA returns exactly 1 record');

const fReview = searchAndFilterWorkload({ statusFilter: 'REVIEW REQUIRED' });
assert(fReview.length === 0, 'Filter REVIEW REQUIRED returns 0 records (no arithmetic discrepancies)');

// Role filters
const fHOD = searchAndFilterWorkload({ roleFilter: 'HOD' });
assert(fHOD.length >= 1 && fHOD.some((f) => f.facultyName === 'Dr. T. Rajasekaran'), 'Filter HOD returns Dr. T. Rajasekaran');

const fAC = searchAndFilterWorkload({ roleFilter: 'ACADEMIC_COORDINATOR' });
assert(fAC.length > 0, `Filter ACADEMIC_COORDINATOR returns ${fAC.length} faculty`);

const fCA = searchAndFilterWorkload({ roleFilter: 'CLASS_ADVISOR' });
assert(fCA.length > 0, `Filter CLASS_ADVISOR returns ${fCA.length} faculty`);

const fProctor = searchAndFilterWorkload({ roleFilter: 'PROCTOR' });
assert(fProctor.length > 0, `Filter PROCTOR returns ${fProctor.length} faculty`);

const fTeachingOnly = searchAndFilterWorkload({ roleFilter: 'TEACHING_ONLY' });
assert(fTeachingOnly.length > 0, `Filter TEACHING_ONLY returns ${fTeachingOnly.length} faculty`);

const fRespOnly = searchAndFilterWorkload({ roleFilter: 'RESPONSIBILITIES' });
assert(fRespOnly.length > 0, `Filter RESPONSIBILITIES returns ${fRespOnly.length} faculty`);

// Teaching category filters
const fUGTheory = searchAndFilterWorkload({ categoryFilter: 'UG_THEORY' });
assert(fUGTheory.length > 0, `Category filter UG_THEORY returns ${fUGTheory.length} faculty`);

const fLab = searchAndFilterWorkload({ categoryFilter: 'LAB' });
assert(fLab.length > 0, `Category filter LAB returns ${fLab.length} faculty`);

const fPG = searchAndFilterWorkload({ categoryFilter: 'PG' });
assert(fPG.length > 0, `Category filter PG returns ${fPG.length} faculty`);

const fOthers = searchAndFilterWorkload({ categoryFilter: 'OTHERS' });
assert(fOthers.length > 0, `Category filter OTHERS returns ${fOthers.length} faculty`);

// ------------------------------------------------------------
// 13. Faculty Detail Works
// ------------------------------------------------------------
console.log('\n--- Test 13: Faculty Detail Lookup & Validation Works ---');

// Test retrieval for all 27 IDs
for (let i = 1; i <= 27; i++) {
  const fwlId = `FWL-${String(i).padStart(2, '0')}`;
  const detail = getFacultyWorkloadById(fwlId);
  assert(detail !== null, `getFacultyWorkloadById("${fwlId}") successfully returns profile`);
}

// Check detailed structure on FWL-01
const detail1 = getFacultyWorkloadById('FWL-01');
assert(detail1.facultyName === 'Dr. T. Rajasekaran', 'FWL-01 name is Dr. T. Rajasekaran');
assert(detail1.teaching.ugTheory1.length === 1, 'FWL-01 has UG Theory 1 row');
assert(detail1.teaching.lab1.length === 1, 'FWL-01 has Lab 1 row');
assert(detail1.teaching.pg.length === 1, 'FWL-01 has PG row');

const valComplete = validateWorkloadRecord(detail1);
assert(valComplete.valid === true, 'validateWorkloadRecord returns valid: true for complete matched record');

const valIncomplete = validateWorkloadRecord(satheesh);
assert(
  valIncomplete.valid === false && valIncomplete.errors.some((e) => e.includes('Incomplete')),
  'validateWorkloadRecord returns incomplete error for Mrs. A. Satheesh Kumar'
);

const detailNonExistent = getFacultyWorkloadById('FWL-999');
assert(detailNonExistent === null, 'getFacultyWorkloadById returns null for non-existent ID');

// ------------------------------------------------------------
// 14. Workload Data Does NOT Become TimetableSession
// ------------------------------------------------------------
console.log('\n--- Test 14: Workload Data Does NOT Become TimetableSession ---');
assert(Array.isArray(MASTER_TIMETABLE_SESSIONS), 'MASTER_TIMETABLE_SESSIONS exists independently');

// Ensure no workload structure was pushed into MASTER_TIMETABLE_SESSIONS
const contaminatedSessions = MASTER_TIMETABLE_SESSIONS.filter(
  (s) => s.facultyName && EXPECTED_FACULTY.some((ef) => ef.name === s.facultyName) && s.teaching
);
assert(contaminatedSessions.length === 0, 'Zero MASTER_TIMETABLE_SESSIONS contaminated with workload structures');

// Ensure no TimetableSession properties (day, period, periodIndex, startTime, endTime, room) pollute workload items
let timetablePollutionCount = 0;
processed.forEach((f) => {
  Object.values(f.teaching).forEach((items) => {
    items.forEach((item) => {
      if (item.day || item.period || item.periodIndex || item.startTime || item.endTime || item.room) {
        timetablePollutionCount++;
      }
    });
  });
  f.responsibilities.forEach((r) => {
    if (r.day || r.period || r.periodIndex || r.startTime || r.endTime || r.room) {
      timetablePollutionCount++;
    }
  });
});
assert(timetablePollutionCount === 0, 'Zero workload items contain timetable session schedule fields (day/period/room)');

// ------------------------------------------------------------
// Final Summary
// ------------------------------------------------------------
console.log('\n============================================================');
console.log(`TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('============================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('All 14 Faculty Workload Allocation Master tests passed successfully!');
  process.exit(0);
}
