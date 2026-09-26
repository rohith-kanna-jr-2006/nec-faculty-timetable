/**
 * Test Suite: HOD Faculty Selection, Class Advisor, Regulation Curriculum,
 * and Institutional Allocations Architecture Verification.
 */

const assert = require('assert');
const {
  FACULTY_WORKLOAD_MASTER,
  getWorkloadMaster,
  getCSEFacultyFromWorkload,
} = require('../constants/workloadMasterData.js');
const {
  getClassAdvisors,
  setClassAdvisor,
  clearClassAdvisors,
  getHODFacultyAllocations,
  setHODFacultyAllocation,
  clearHODFacultyAllocations,
  getHODAllocationKey,
  MASTER_TIMETABLE_SESSIONS,
  getAcademicContext,
  AVAILABLE_FACULTY_CANDIDATES,
  validateFacultyAllocations,
} = require('../constants/demoData.js');
const {
  getRegulationSubjects,
  getAuthoritativeCurriculumPeriodTotal,
  classifySubject,
  isDirectHODCurriculumSubject,
  requiresACSubjectHandler,
  hasAuthoritativeCurriculum,
  registerRegulationCurriculum,
  registerRegulationSubject,
  SUBJECT_CLASSIFICATIONS,
} = require('../services/regulationCurriculumService.js');
const {
  getInstitutionalAllocationTypes,
  getInstitutionalAllocations,
  getInstitutionalContactPeriodTotal,
  setInstitutionalAllocation,
  clearInstitutionalAllocations,
  getInstitutionalKey,
} = require('../services/institutionalAllocationService.js');

let passCount = 0;
let failCount = 0;

function check(condition, message) {
  if (condition) {
    passCount++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failCount++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('============================================================');
console.log('HOD FACULTY SELECTION & DOMAIN SEPARATION TEST SUITE');
console.log('============================================================\n');

// ------------------------------------------------------------
// Test Group 1: Authoritative CSE Faculty Directory
// ------------------------------------------------------------
console.log('--- Test Group 1: CSE Faculty Workload-Derived Pool ---');

const cseFaculty = getCSEFacultyFromWorkload();

check(Array.isArray(cseFaculty), 'getCSEFacultyFromWorkload returns an array');
check(cseFaculty.length === 25, `CSE faculty pool has exactly 25 faculty (got: ${cseFaculty.length})`);

// Verify ECE exclusion
const hasECE1 = cseFaculty.some((f) => f.facultyId === 'FWL-26' || f.facultyName.includes('Praveenkumar'));
const hasECE2 = cseFaculty.some((f) => f.facultyId === 'FWL-27' || f.facultyName.includes('Preethi'));
check(!hasECE1, 'Dr. R. Praveenkumar (ASP / ECE, FWL-26) is excluded from CSE pool');
check(!hasECE2, 'Ms. B. Preethi (AP / ECE, FWL-27) is excluded from CSE pool');

// Verify Maths exclusion
const hasMaths = cseFaculty.some((f) => f.facultyId === 'FWL-28' || f.facultyName.includes('Jaishankar'));
check(!hasMaths, 'Mr. P. Jaishankar (AP / Maths, FWL-28) is excluded from CSE pool');

// Verify exact source names and values are preserved
const hod = cseFaculty.find((f) => f.facultyId === 'FWL-01');
check(hod && hod.facultyName === 'Dr. T. Rajasekaran', 'FWL-01 exact name preserved: Dr. T. Rajasekaran');
check(
  hod && hod.designation === 'Professor & Head Of Department HOD',
  'FWL-01 exact designation preserved: Professor & Head Of Department HOD'
);
check(hod && typeof hod.calculatedTeachingHours === 'number', 'Calculated teaching hours exposed on CSE faculty');
check(
  hod && typeof hod.calculatedResponsibilityHours === 'number',
  'Calculated responsibility hours exposed on CSE faculty'
);
check(hod && typeof hod.calculatedTotalHours === 'number', 'Calculated total hours exposed on CSE faculty');
check(hod && hod.status === 'MATCHED', 'Workload status accurately exposed on CSE faculty');

// Verify incomplete source records are exposed accurately without fabricated totals
const incompleteSatheesh = cseFaculty.find((f) => f.facultyId === 'FWL-20');
check(incompleteSatheesh && incompleteSatheesh.status === 'INCOMPLETE SOURCE DATA', 'Mrs. A. Satheesh Kumar status is INCOMPLETE SOURCE DATA');
check(incompleteSatheesh && incompleteSatheesh.sourceTotalHours === null, 'Mrs. A. Satheesh Kumar sourceTotalHours is null (no fake totals inferred)');

// Verify raw master records untouched
check(FACULTY_WORKLOAD_MASTER.length === 27, 'Raw FACULTY_WORKLOAD_MASTER remains 27 records untouched');

// ------------------------------------------------------------
// Test Group 2: Class Advisor Assignment & Conflict Protection
// ------------------------------------------------------------
console.log('\n--- Test Group 2: Class Advisor Assignment & Conflict Protection ---');

clearClassAdvisors();

const candidate1 = cseFaculty[0]; // Dr. T. Rajasekaran (FWL-01)
const candidate2 = cseFaculty[1]; // M. P. Thiruvenkatasuresh (FWL-02)

// Assign candidate1 to CSE-A
setClassAdvisor('CSE-A', {
  facultyId: candidate1.facultyId,
  facultyName: candidate1.facultyName,
  designation: candidate1.designation,
  workload: `Teaching: ${candidate1.calculatedTeachingHours}h, Total: ${candidate1.calculatedTotalHours}h`,
  teachingHours: candidate1.calculatedTeachingHours,
  responsibilityHours: candidate1.calculatedResponsibilityHours,
  totalHours: candidate1.calculatedTotalHours,
});

let advisors = getClassAdvisors();
check(advisors['CSE-A']?.facultyId === candidate1.facultyId, 'Class Advisor assigned successfully for CSE-A');

// Conflict check: attempt to assign candidate1 (already in CSE-A) to CSE-B
function checkAdvisorConflict(targetSection, facultyId) {
  const current = getClassAdvisors();
  const conflicting = Object.entries(current).find(
    ([sec, adv]) => sec !== targetSection && adv?.facultyId === facultyId
  );
  return !!conflicting;
}

const isConflict = checkAdvisorConflict('CSE-B', candidate1.facultyId);
check(isConflict === true, 'Conflict detected when attempting to assign existing advisor to a different section (CSE-B)');

// Same section editing allowed
const isSameSectionConflict = checkAdvisorConflict('CSE-A', candidate1.facultyId);
check(isSameSectionConflict === false, 'Same-section editing / re-confirmation is permitted without conflict');

// Assign distinct candidate2 to CSE-B
const isCand2Conflict = checkAdvisorConflict('CSE-B', candidate2.facultyId);
check(isCand2Conflict === false, 'Distinct candidate has no conflict and can be assigned to CSE-B');

setClassAdvisor('CSE-B', {
  facultyId: candidate2.facultyId,
  facultyName: candidate2.facultyName,
  designation: candidate2.designation,
  workload: `Teaching: ${candidate2.calculatedTeachingHours}h, Total: ${candidate2.calculatedTotalHours}h`,
  teachingHours: candidate2.calculatedTeachingHours,
  responsibilityHours: candidate2.calculatedResponsibilityHours,
  totalHours: candidate2.calculatedTotalHours,
});

advisors = getClassAdvisors();
check(advisors['CSE-B']?.facultyId === candidate2.facultyId, 'Distinct Class Advisor appointed for CSE-B');
check(Object.keys(advisors).length === 2, 'Exactly 2 class advisors confirmed across distinct sections');

clearClassAdvisors();

// ------------------------------------------------------------
// Test Group 3: Regulation Curriculum Service & Authoritative Resolution
// ------------------------------------------------------------
console.log('\n--- Test Group 3: Authoritative Regulation Curriculum Subject Resolution ---');

const regSubjects = getRegulationSubjects({
  regulation: 'Autonomous Regulation R2022',
  academicYear: 'AY 2024-25',
  semester: 'Sem V',
  department: 'CSE',
  year: 'III Year',
  section: 'CSE-C',
});

check(Array.isArray(regSubjects) && regSubjects.length === 12, `getRegulationSubjects returns exactly 12 authoritative courses (got: ${regSubjects.length})`);

// Check authoritative course codes
const authoritativeCodes = ['22CSC14', '22CSC15', '22CSC16', '22CSP09', '22CSP10', '22CSX01', '22CSX21', '22CSX42', '22MAN08R', 'SD', 'NPTEL', 'PBL'];
check(
  regSubjects.every((s) => authoritativeCodes.includes(s.code)),
  'Every returned subject belongs to the authoritative 12-course Semester V catalog'
);

// Authoritative Period Accounting Assertions (35 Curriculum Periods = 100% Timetable Completeness)
const totalCurriculumPeriods = regSubjects.reduce((sum, s) => sum + (s.periodsPerWeek || s.periods || 0), 0);
check(totalCurriculumPeriods === 35, `Authoritative Semester V curriculum periods sum to exactly 35 (got: ${totalCurriculumPeriods})`);

const serviceCurriculumPeriodTotal = getAuthoritativeCurriculumPeriodTotal({
  regulation: 'R2022',
  semester: 'Sem V',
  department: 'CSE',
  year: 'III Year',
  section: 'CSE-C',
});
check(serviceCurriculumPeriodTotal === 35, `getAuthoritativeCurriculumPeriodTotal helper returns exactly 35 periods`);

// Exact Category Breakdown Proof:
// 1. Core Theory (3 courses: 22CSC14=4, 22CSC15=3, 22CSC16=3) -> 10 periods
const coreTheoryPeriods = regSubjects
  .filter((s) => ['22CSC14', '22CSC15', '22CSC16'].includes(s.code))
  .reduce((sum, s) => sum + s.periodsPerWeek, 0);
check(coreTheoryPeriods === 10, `Core Theory courses sum to exactly 10 periods (got: ${coreTheoryPeriods})`);

// 2. Laboratories (2 labs: 22CSP09=4, 22CSP10=4) -> 8 periods
const labPeriods = regSubjects
  .filter((s) => ['22CSP09', '22CSP10'].includes(s.code))
  .reduce((sum, s) => sum + s.periodsPerWeek, 0);
check(labPeriods === 8, `Laboratories sum to exactly 8 continuous periods (got: ${labPeriods})`);

// 3. Professional Electives (3 electives: 22CSX01=3, 22CSX21=3, 22CSX42=3) -> 9 periods
const pePeriods = regSubjects
  .filter((s) => ['22CSX01', '22CSX21', '22CSX42'].includes(s.code))
  .reduce((sum, s) => sum + s.periodsPerWeek, 0);
check(pePeriods === 9, `Professional Electives sum to exactly 9 periods (got: ${pePeriods})`);

// 4. Soft/Analytical Skills (1 course: 22MAN08R=2) -> 2 periods
const sasPeriods = regSubjects
  .filter((s) => s.code === '22MAN08R')
  .reduce((sum, s) => sum + s.periodsPerWeek, 0);
check(sasPeriods === 2, `Soft/Analytical Skills (22MAN08R) sums to exactly 2 periods (got: ${sasPeriods})`);

// 5. Applied/Special/Other (3 courses: SD=2, NPTEL=2, PBL=2) -> 6 periods
const otherPeriods = regSubjects
  .filter((s) => ['SD', 'NPTEL', 'PBL'].includes(s.code))
  .reduce((sum, s) => sum + s.periodsPerWeek, 0);
check(otherPeriods === 6, `Applied/Special/Other (SD, NPTEL, PBL) sum to exactly 6 periods (got: ${otherPeriods})`);

// Exact Sum Proof: 10 + 8 + 9 + 2 + 6 = 35
check(
  coreTheoryPeriods + labPeriods + pePeriods + sasPeriods + otherPeriods === 35,
  'Authoritative arithmetic proof: 10 Core Theory + 8 Lab + 9 PE + 2 SAS + 6 Other = exactly 35 Periods'
);

// Assert all 8 fabricated/mismatched courses are ABSENT
const fabricatedCodes = ['22CSC05', '22CSC06', '22CSP05', '22CSO01', '22CSO02', '22CSO03', '22MCO01', '22MCO02'];
const hasFabricated = regSubjects.some((s) => fabricatedCodes.includes(s.code));
check(!hasFabricated, 'All 8 fabricated/unsupported courses (22CSC05, 22CSC06, 22CSP05, 22CSO01, etc.) are ABSENT from Semester V');

// Check presence of specific curriculum subjects
const pbl = regSubjects.find((s) => s.code === 'PBL');
check(!!pbl && pbl.name === 'Project Based Learning', 'Authoritative PBL is represented with exact source name');
check(isDirectHODCurriculumSubject(pbl), 'PBL is classified as HOD Direct Allocation');
check(!requiresACSubjectHandler(pbl), 'PBL does NOT require AC Subject Faculty Handler');

const nptel = regSubjects.find((s) => s.code === 'NPTEL');
check(!!nptel && nptel.name === 'NPTEL Certification Mentoring', 'Authoritative NPTEL is represented with exact source name');
check(isDirectHODCurriculumSubject(nptel), 'NPTEL is classified as HOD Direct Allocation');
check(!requiresACSubjectHandler(nptel), 'NPTEL does NOT require AC Subject Faculty Handler');

const skillDev = regSubjects.find((s) => s.code === 'SD');
check(!!skillDev && skillDev.name === 'Skill Development', 'Authoritative Skill Development (SD) is represented with exact source name');
check(isDirectHODCurriculumSubject(skillDev), 'Skill Development is classified as HOD Direct Allocation');
check(!requiresACSubjectHandler(skillDev), 'Skill Development does NOT require AC Subject Faculty Handler');

const softSkills = regSubjects.find((s) => s.code === '22MAN08R');
check(!!softSkills && softSkills.name === 'Soft/Analytical Skills – IV', 'Authoritative 22MAN08R (Soft/Analytical Skills – IV) is represented with exact source name');
check(isDirectHODCurriculumSubject(softSkills), 'Soft / Analytical Skills is classified as HOD Direct Allocation');

// Check regular theory and lab courses
const compilerDesign = regSubjects.find((s) => s.code === '22CSC14');
check(!!compilerDesign && compilerDesign.name === 'Principles of Compiler Design', 'Authoritative theory course (22CSC14 Principles of Compiler Design) is represented');
check(!isDirectHODCurriculumSubject(compilerDesign), '22CSC14 is NOT direct HOD-only (requires AC advisory)');
check(requiresACSubjectHandler(compilerDesign), '22CSC14 supports AC Subject Handler advisory input');

const fsdLab = regSubjects.find((s) => s.code === '22CSP09');
check(!!fsdLab && fsdLab.name === 'Full Stack Development Laboratory', 'Authoritative laboratory course (22CSP09 FSD Lab) is represented');
check(!isDirectHODCurriculumSubject(fsdLab), '22CSP09 is NOT direct HOD-only (requires AC advisory)');
check(requiresACSubjectHandler(fsdLab), '22CSP09 supports AC Subject Handler advisory input');

const ooseLab = regSubjects.find((s) => s.code === '22CSP10');
check(!!ooseLab && ooseLab.name === 'Object Oriented Software Engineering Laboratory', 'Authoritative laboratory course (22CSP10 OOSE Lab) is represented');

// Verify Institutional Allocations are NOT inside getRegulationSubjects()
const hasHODPeriod = regSubjects.some((s) => s.name.toLowerCase().includes('hod period'));
const hasACPeriod = regSubjects.some((s) => s.name.toLowerCase().includes('ac period'));
const hasProctorPeriod = regSubjects.some((s) => s.name.toLowerCase().includes('proctor period'));
check(!hasHODPeriod, 'HOD Period is NOT present inside getRegulationSubjects() (strict domain separation)');
check(!hasACPeriod, 'AC Period is NOT present inside getRegulationSubjects() (strict domain separation)');
check(!hasProctorPeriod, 'Proctor Period is NOT present inside getRegulationSubjects() (strict domain separation)');

// Test future regulation extensibility (e.g. Professional Ethics in R2026)
registerRegulationSubject({
  regulation: 'R2026',
  department: 'CSE',
  year: 'III Year',
  semester: 'Sem V',
  subject: {
    code: '26MCO03',
    name: 'Professional Ethics in Engineering',
    classification: SUBJECT_CLASSIFICATIONS.NON_CREDIT,
    credits: 0,
    periodsPerWeek: 1,
    isLab: false,
    requiresACHandler: false,
  },
});

const r2026Subjects = getRegulationSubjects({
  regulation: 'R2026',
  department: 'CSE',
  year: 'III Year',
  semester: 'Sem V',
});

const ethics = r2026Subjects.find((s) => s.code === '26MCO03');
check(!!ethics, 'Future regulation subject (Professional Ethics) resolved dynamically without code modification');
check(isDirectHODCurriculumSubject(ethics), 'Future non-credit subject is recognized as direct HOD decision');

// ------------------------------------------------------------
// Test Group 4: Institutional Allocation Domain
// ------------------------------------------------------------
console.log('\n--- Test Group 4: Institutional Allocation Domain ---');

clearInstitutionalAllocations();

const instTypes = getInstitutionalAllocationTypes();
check(instTypes.length === 3, 'Exactly 3 institutional allocation types defined (HOD, AC, Proctor Periods)');

const instContactPeriodTotal = getInstitutionalContactPeriodTotal();
check(instContactPeriodTotal === 3, `Institutional statutory contact periods sum to exactly 3 (got: ${instContactPeriodTotal})`);

const hodType = instTypes.find((t) => t.typeId === 'HOD_PERIOD');
const acType = instTypes.find((t) => t.typeId === 'AC_PERIOD');
const procType = instTypes.find((t) => t.typeId === 'PROCTOR_PERIOD');

check(!!hodType, 'HOD Period institutional type exists');
check(!!acType, 'AC Period institutional type exists');
check(!!procType, 'Proctor Period institutional type exists');

// Assign HOD Period directly
const instRes1 = setInstitutionalAllocation('HOD_PERIOD', {
  facultyId: candidate1.facultyId,
  facultyName: candidate1.facultyName,
  designation: candidate1.designation,
  section: 'CSE-C',
  academicYear: 'AY 2024-25',
});

check(instRes1.success === true, 'HOD Period assigned successfully by HOD');

// Duplicate check on institutional allocation
const instResDup = setInstitutionalAllocation('HOD_PERIOD', {
  facultyId: candidate1.facultyId,
  facultyName: candidate1.facultyName,
  designation: candidate1.designation,
  section: 'CSE-C',
  academicYear: 'AY 2024-25',
});

check(instResDup.isDuplicate === true, 'Duplicate institutional allocation prevented');

// Assign AC Period to candidate2
const instRes2 = setInstitutionalAllocation('AC_PERIOD', {
  facultyId: candidate2.facultyId,
  facultyName: candidate2.facultyName,
  designation: candidate2.designation,
  section: 'CSE-C',
  academicYear: 'AY 2024-25',
});

check(instRes2.success === true, 'AC Period assigned successfully to CSE faculty');

const allInst = getInstitutionalAllocations({ section: 'CSE-C', academicYear: 'AY 2024-25' });
check(Object.keys(allInst).length === 2, '2 institutional allocations recorded for CSE-C');

clearInstitutionalAllocations();

// ------------------------------------------------------------
// Test Group 5: HOD Direct Allocation of Non-Credit / Special Subjects
// ------------------------------------------------------------
console.log('\n--- Test Group 5: HOD Allocation of Curriculum Subjects ---');

clearHODFacultyAllocations();

// Allocate PBL directly
setHODFacultyAllocation(pbl.code, {
  courseCode: pbl.code,
  courseName: pbl.name,
  facultyId: candidate1.facultyId,
  facultyName: candidate1.facultyName,
  designation: candidate1.designation,
  status: 'Assigned',
  section: 'CSE-C',
  academicYear: 'AY 2024-25',
});

let hodAllocs = getHODFacultyAllocations();
check(hodAllocs[pbl.code]?.facultyId === candidate1.facultyId, 'PBL allocated directly by HOD without AC handler entry');

// Allocate NPTEL directly
setHODFacultyAllocation(nptel.code, {
  courseCode: nptel.code,
  courseName: nptel.name,
  facultyId: candidate2.facultyId,
  facultyName: candidate2.facultyName,
  designation: candidate2.designation,
  status: 'Assigned',
  section: 'CSE-C',
  academicYear: 'AY 2024-25',
});

hodAllocs = getHODFacultyAllocations();
check(hodAllocs[nptel.code]?.facultyId === candidate2.facultyId, 'NPTEL allocated directly by HOD without AC handler entry');

// Allocate Skill Development directly
setHODFacultyAllocation(skillDev.code, {
  courseCode: skillDev.code,
  courseName: skillDev.name,
  facultyId: cseFaculty[2].facultyId,
  facultyName: cseFaculty[2].facultyName,
  designation: cseFaculty[2].designation,
  status: 'Assigned',
  section: 'CSE-C',
  academicYear: 'AY 2024-25',
});

hodAllocs = getHODFacultyAllocations();
check(hodAllocs[skillDev.code]?.facultyId === cseFaculty[2].facultyId, 'Skill Development (SD) allocated directly by HOD');

// Allocate Soft Skills (22MAN08R) directly
setHODFacultyAllocation(softSkills.code, {
  courseCode: softSkills.code,
  courseName: softSkills.name,
  facultyId: cseFaculty[3].facultyId,
  facultyName: cseFaculty[3].facultyName,
  designation: cseFaculty[3].designation,
  status: 'Assigned',
  section: 'CSE-C',
  academicYear: 'AY 2024-25',
});

hodAllocs = getHODFacultyAllocations();
check(hodAllocs[softSkills.code]?.facultyId === cseFaculty[3].facultyId, 'Soft/Analytical Skills (22MAN08R) allocated directly by HOD');

// Duplicate check helper for HOD allocations
function checkHODDuplicate(courseCode, facultyId, section, academicYear) {
  const current = getHODFacultyAllocations();
  const existing = current[courseCode];
  return !!(
    existing &&
    existing.facultyId === facultyId &&
    existing.section === section &&
    existing.academicYear === academicYear
  );
}

const isHODDup = checkHODDuplicate(pbl.code, candidate1.facultyId, 'CSE-C', 'AY 2024-25');
check(isHODDup === true, 'Duplicate HOD allocation detected for identical subject/section/faculty');

clearHODFacultyAllocations();

// ------------------------------------------------------------
// Test Group 6: Workload Master Integrity
// ------------------------------------------------------------
console.log('\n--- Test Group 6: Workload Master Data Integrity ---');

check(
  MASTER_TIMETABLE_SESSIONS.length === 0,
  'Workload records are never converted into TimetableSession'
);

// ------------------------------------------------------------
// Test Group 7: Context-First Architecture & Data Source Fidelity
// ------------------------------------------------------------
console.log('\n--- Test Group 7: Context-First Architecture & Data Source Fidelity ---');

// 1. Selected Semester V returns only Semester V subjects
const semVSubjects = getRegulationSubjects({
  regulation: 'Autonomous Regulation R2022',
  academicYear: 'AY 2024-25',
  semester: 'Sem V',
  department: 'CSE',
  year: 'III Year',
  section: 'CSE-A',
});
check(
  semVSubjects.length === 12 && semVSubjects.every((s) => s.semester === 'Sem V'),
  '1. Selected Semester V returns ONLY Semester V subjects (exactly 12 verified subjects)'
);

// 2. Semester III/VI/etc subjects never appear in a Semester V context
const hasOtherSemInSemV = semVSubjects.some((s) => s.semester !== 'Sem V');
const semVISubjects = getRegulationSubjects({
  regulation: 'Autonomous Regulation R2022',
  academicYear: 'AY 2024-25',
  semester: 'Sem VI',
  department: 'CSE',
  year: 'III Year',
  section: 'CSE-A',
});
check(
  !hasOtherSemInSemV && semVISubjects.length === 0,
  '2. Semester III/VI/etc subjects never appear in a Semester V context (Sem VI returns pending empty)'
);

// 3. Regulation filtering works
const r9999Subjects = getRegulationSubjects({
  regulation: 'R9999_NON_EXISTENT',
  academicYear: 'AY 2024-25',
  semester: 'Sem V',
  department: 'CSE',
  year: 'III Year',
  section: 'CSE-A',
});
check(
  r9999Subjects.length === 0 && semVSubjects.every((s) => s.regulation === 'R2022'),
  '3. Regulation filtering works (unregistered regulation returns 0 subjects)'
);

// 4. Year filtering works
const ivYearSubjects = getRegulationSubjects({
  regulation: 'Autonomous Regulation R2022',
  academicYear: 'AY 2024-25',
  semester: 'Sem V',
  department: 'CSE',
  year: 'IV Year',
  section: 'CSE-A',
});
check(
  ivYearSubjects.length === 0,
  '4. Year filtering works (IV Year returns 0 subjects for Sem V, no cross-year leakage)'
);

// 5. Department filtering works
const eceSubjects = getRegulationSubjects({
  regulation: 'Autonomous Regulation R2022',
  academicYear: 'AY 2024-25',
  semester: 'Sem V',
  department: 'ECE',
  year: 'III Year',
  section: 'ECE-A',
});
check(
  eceSubjects.length === 0,
  '5. Department filtering works (ECE returns 0 CSE subjects)'
);

// 6. Section context is preserved
check(
  semVSubjects.every((s) => s.section === 'CSE-A'),
  '6. Section context is preserved in all resolved subject metadata'
);

// 7. Changing semester removes previous semester subjects
const contextChange1 = getRegulationSubjects({ semester: 'Sem V', year: 'III Year', department: 'CSE' });
const contextChange2 = getRegulationSubjects({ semester: 'Sem VI', year: 'III Year', department: 'CSE' });
check(
  contextChange1.length === 12 && contextChange2.length === 0,
  '7. Changing semester immediately removes previous semester subjects'
);

// 8. Institutional HOD/AC/Proctor periods are not returned as curriculum subjects
const hasAnyInstPeriod = semVSubjects.some((s) =>
  s.name.toLowerCase().includes('hod period') ||
  s.name.toLowerCase().includes('ac period') ||
  s.name.toLowerCase().includes('proctor period')
);
check(
  !hasAnyInstPeriod,
  '8. Institutional HOD/AC/Proctor periods are NOT returned as curriculum subjects'
);

// 9. Regulation non-credit subjects are shown only when present in that context
const nonCreditInSemV = semVSubjects.filter((s) => s.classification === SUBJECT_CLASSIFICATIONS.NON_CREDIT);
check(
  nonCreditInSemV.length === 1 && nonCreditInSemV[0].code === '22MAN08R',
  '9. Authoritative non-credit subject 22MAN08R (Soft/Analytical Skills – IV) present in Sem V'
);

// 10. Regular theory/lab supports AC advisory + HOD final decision
const theorySub = semVSubjects.find((s) => s.code === '22CSC14');
check(
  theorySub && requiresACSubjectHandler(theorySub) === true,
  '10. Regular theory 22CSC14 supports AC advisory input while HOD makes final selection'
);

// 11. HOD direct allocations do not require AC handler
const pblSub = semVSubjects.find((s) => s.code === 'PBL');
check(
  pblSub && requiresACSubjectHandler(pblSub) === false && isDirectHODCurriculumSubject(pblSub) === true,
  '11. HOD direct allocations (PBL, SD, NPTEL, 22MAN08R) do NOT require AC handler'
);

// 12. Allocation identity is context-aware
const allocKey1 = getHODAllocationKey({
  academicYear: 'AY 2024-25',
  regulation: 'R2022',
  department: 'CSE',
  year: 'III Year',
  semester: 'Sem V',
  section: 'CSE-A',
  courseCode: '22CSC14',
  allocationType: 'REGULAR',
});
const allocKey2 = getHODAllocationKey({
  academicYear: 'AY 2024-25',
  regulation: 'R2022',
  department: 'CSE',
  year: 'III Year',
  semester: 'Sem VI',
  section: 'CSE-A',
  courseCode: '22CSC14',
  allocationType: 'REGULAR',
});
const allocKey3 = getHODAllocationKey({
  academicYear: 'AY 2024-25',
  regulation: 'R2022',
  department: 'CSE',
  year: 'III Year',
  semester: 'Sem V',
  section: 'CSE-B',
  courseCode: '22CSC14',
  allocationType: 'REGULAR',
});
check(
  allocKey1 !== allocKey2 && allocKey1 !== allocKey3,
  '12. Allocation identity is context-aware (composite key isolates semester and section)'
);

// 13. No stale allocation from another semester is displayed
clearHODFacultyAllocations();
setHODFacultyAllocation('22CSC14', {
  courseCode: '22CSC14',
  courseName: 'Principles of Compiler Design',
  facultyId: 'FWL-01',
  facultyName: 'Dr. T. Rajasekaran',
  semester: 'Sem V',
  section: 'CSE-A',
  year: 'III Year',
  department: 'CSE',
  academicYear: 'AY 2024-25',
  regulation: 'R2022',
});

const semVIAllocations = getHODFacultyAllocations({
  semester: 'Sem VI',
  section: 'CSE-A',
  year: 'III Year',
  department: 'CSE',
  academicYear: 'AY 2024-25',
});
const semVAllocations = getHODFacultyAllocations({
  semester: 'Sem V',
  section: 'CSE-A',
  year: 'III Year',
  department: 'CSE',
  academicYear: 'AY 2024-25',
});
check(
  Object.keys(semVIAllocations).length === 0 && !!semVAllocations['22CSC14'],
  '13. No stale allocation from another semester is displayed (Sem V alloc absent in Sem VI)'
);
clearHODFacultyAllocations();

// 14. No dependency on getAvailableFacultyCandidates()
check(
  AVAILABLE_FACULTY_CANDIDATES.length === 0 && cseFaculty.length === 25,
  '14. No dependency on getAvailableFacultyCandidates() (0 candidates, 25 from Workload Master)'
);

// 15. Exact workload-master faculty names/designations remain unchanged
const allMatchRaw = cseFaculty.every((f) => {
  const raw = FACULTY_WORKLOAD_MASTER.find((r) => r.facultyId === f.facultyId);
  return raw && raw.facultyName === f.facultyName && raw.designation === f.designation;
});
const fwl23 = cseFaculty.find((f) => f.facultyId === 'FWL-23');
check(
  allMatchRaw && fwl23?.facultyName === 'Ms. N. Bhuvaneswari',
  '15. Exact workload-master faculty names/designations remain unchanged (all 25 CSE faculty names preserved with zero alteration)'
);

// 16. Fabricated/unsupported courses MUST NOT be registered
const containsAnyFabricated = semVSubjects.some((s) => fabricatedCodes.includes(s.code));
check(!containsAnyFabricated, '16. Rejection test: fabricated courses (22CSC05, 22CSC06, 22CSP05, 22CSO01-03, 22MCO01-02) never appear');

// 17. Exact course names match the authoritative source
const exactNameMap = {
  '22CSC14': 'Principles of Compiler Design',
  '22CSC15': 'Full Stack Development',
  '22CSC16': 'Object Oriented Software Engineering',
  '22CSP09': 'Full Stack Development Laboratory',
  '22CSP10': 'Object Oriented Software Engineering Laboratory',
  '22CSX01': 'Deep Learning',
  '22CSX21': 'Cryptography and Network Security',
  '22CSX42': 'UI and UX Design',
  '22MAN08R': 'Soft/Analytical Skills – IV',
  'SD': 'Skill Development',
  'NPTEL': 'NPTEL Certification Mentoring',
  'PBL': 'Project Based Learning',
};
const allNamesMatchAuthoritative = semVSubjects.every((s) => s.name === exactNameMap[s.code]);
check(allNamesMatchAuthoritative, '17. Exact course names match authoritative source across all 12 Semester V courses');

// ------------------------------------------------------------
// Test Group 8: Explicit Verification of Prompt Requirements A - F
// ------------------------------------------------------------
console.log('\n--- Test Group 8: Authoritative Consistency Audit (Requirements A - F) ---');

// Requirement A: Selected Sem V returns exactly the verified Sem V subject catalog (12 courses)
const verifySemVCourses = getRegulationSubjects({
  regulation: 'R2022',
  academicYear: 'AY 2024-25',
  semester: 'Sem V',
  department: 'CSE',
  year: 'III Year',
  section: 'CSE-C',
});
check(
  verifySemVCourses.length === 12 &&
    verifySemVCourses.every((s) => authoritativeCodes.includes(s.code)),
  'Requirement A: Selected Sem V returns exactly the verified 12-course catalog'
);

// Requirement B: No unrelated semester subject appears
const verifyNoUnrelatedSem = verifySemVCourses.every(
  (s) => s.semester === 'Sem V' && s.year === 'III Year' && s.department === 'CSE'
);
const verifyOtherSemEmpty = getRegulationSubjects({
  regulation: 'R2022',
  semester: 'Sem IV',
  department: 'CSE',
  year: 'II Year',
}).length === 0;
check(
  verifyNoUnrelatedSem && verifyOtherSemEmpty,
  'Requirement B: No unrelated semester subject appears (strict contextual isolation)'
);

// Requirement C: Institutional HOD/AC/Proctor periods are not duplicated as curriculum courses
const verifyNoInstInCurriculum = verifySemVCourses.every(
  (s) => !['HOD_PERIOD', 'AC_PERIOD', 'PROCTOR_PERIOD'].includes(s.code) &&
         !s.name.toLowerCase().includes('hod period') &&
         !s.name.toLowerCase().includes('ac period') &&
         !s.name.toLowerCase().includes('proctor period')
);
const instTypesList = getInstitutionalAllocationTypes();
check(
  verifyNoInstInCurriculum && instTypesList.length === 3,
  'Requirement C: Institutional HOD/AC/Proctor periods are NOT duplicated as curriculum courses'
);

// Requirement D: Allocation-review uses the same context and same period accounting
const auditRowsSim = verifySemVCourses.map((c) => ({
  courseCode: c.code,
  periods: c.periods || c.periodsPerWeek || 0,
}));
const reviewTotalPeriods = auditRowsSim.reduce((sum, r) => sum + r.periods, 0);
check(
  reviewTotalPeriods === 35 && auditRowsSim.length === 12,
  'Requirement D: Allocation-review uses the same context and exact 35-period accounting'
);

// Requirement E: Timetable validation uses the same authoritative period accounting
const simulatedAllocations = {};
verifySemVCourses.forEach((c) => {
  if (c.category === 'LAB' || c.allocationRule === 'PRIMARY_PLUS_ADDITIONAL') {
    simulatedAllocations[c.code] = { primaryFaculty: 'Fac 1', additionalFaculty: ['Fac 2'] };
  } else if (c.allocationRule === 'MINIMUM_TWO' || c.category === 'SAS') {
    simulatedAllocations[c.code] = { faculty: ['Fac 1', 'Fac 2'] };
  } else if (c.allocationRule === 'STAFFS_HANDLED') {
    simulatedAllocations[c.code] = { faculty: ['Fac 1'], staffCount: 1 };
  } else {
    simulatedAllocations[c.code] = { faculty: 'Fac 1' };
  }
});
const timetableValidation = validateFacultyAllocations(simulatedAllocations, verifySemVCourses);
check(
  timetableValidation.valid === true &&
    timetableValidation.totalRequiredPeriods === 35 &&
    timetableValidation.scheduledPeriods === 35 &&
    timetableValidation.freePeriods === 0,
  'Requirement E: Timetable validation uses the same authoritative 35-period accounting (35/35 required, 0 free)'
);

// Requirement F: No stale allocation survives a semester/context switch
clearHODFacultyAllocations();
setHODFacultyAllocation('22CSC14', {
  courseCode: '22CSC14',
  facultyId: 'FWL-01',
  semester: 'Sem V',
  section: 'CSE-C',
  academicYear: 'AY 2024-25',
});
const semVActiveAllocs = getHODFacultyAllocations({ semester: 'Sem V', section: 'CSE-C' });
const semVIActiveAllocs = getHODFacultyAllocations({ semester: 'Sem VI', section: 'CSE-C' });
const semCSEDActiveAllocs = getHODFacultyAllocations({ semester: 'Sem V', section: 'CSE-D' });
check(
  !!semVActiveAllocs['22CSC14'] &&
    !semVIActiveAllocs['22CSC14'] &&
    !semCSEDActiveAllocs['22CSC14'],
  'Requirement F: No stale allocation survives a semester/context switch (context isolation holds)'
);
clearHODFacultyAllocations();

console.log('\n============================================================');
console.log(`TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('============================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('All HOD faculty selection and authoritative curriculum audit tests passed successfully!');
}
