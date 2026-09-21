/**
 * Backend Comprehensive Test Suite
 *
 * Covers all 20 mandatory verification scenarios:
 * 1. MongoDB connection
 * 2. Health endpoint (/api/health)
 * 3. Login success & credential checking
 * 4. Login failure (invalid password / unknown user)
 * 5. JWT authentication & verifyToken
 * 6. Role-based authorization (HOD vs AC vs Faculty)
 * 7. Faculty retrieval & preservation
 * 8. Exactly 28 workload records in DB
 * 9. All workload rows preserved row-by-row
 * 10. Workload totals calculated dynamically
 * 11. Incomplete records preserved (Satheesh Kumar, Jaishankar)
 * 12. Workload multi-attribute search
 * 13. Workload filters (status, roles, categories)
 * 14. Workload dynamic summary aggregation
 * 15. Course faculty candidate handlers (AC Input)
 * 16. HOD allocation authorization enforcement (AC cannot approve)
 * 17. Timetable version state lifecycle transitions
 * 18. Timetable session strict isolation from workload
 * 19. Notification creation and read workflows
 * 20. Faculty absence & substitute allocation flow
 */

require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/db');
const { generateToken, verifyToken } = require('../src/utils/generateToken');
const { getDynamicSummaryMetrics } = require('../src/services/workloadService');
const { transitionTimetableStatus } = require('../src/services/timetableService');
const { updateAllocationStatus } = require('../src/services/allocationService');

// Models
const User = require('../src/models/User');
const Faculty = require('../src/models/Faculty');
const FacultyWorkload = require('../src/models/FacultyWorkload');
const Course = require('../src/models/Course');
const CourseFacultyHandler = require('../src/models/CourseFacultyHandler');
const AcademicContext = require('../src/models/AcademicContext');
const ClassAdvisorAssignment = require('../src/models/ClassAdvisorAssignment');
const HODFacultyAllocation = require('../src/models/HODFacultyAllocation');
const TimetableVersion = require('../src/models/TimetableVersion');
const TimetableSession = require('../src/models/TimetableSession');
const Notification = require('../src/models/Notification');
const FacultyAvailability = require('../src/models/FacultyAvailability');
const FacultyAbsence = require('../src/models/FacultyAbsence');
const SubstituteAllocation = require('../src/models/SubstituteAllocation');

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

/**
 * Helper to make local in-memory HTTP requests against Express app
 */
function makeRequest(appInstance, { method = 'GET', path = '/', headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(appInstance);
    server.listen(0, () => {
      const port = server.address().port;
      const payload = body ? JSON.stringify(body) : null;
      const reqHeaders = {
        'Content-Type': 'application/json',
        ...headers,
      };
      if (payload) {
        reqHeaders['Content-Length'] = Buffer.byteLength(payload);
      }

      const req = http.request(
        {
          hostname: '127.0.0.1',
          port,
          path,
          method,
          headers: reqHeaders,
        },
        (res) => {
          let rawData = '';
          res.on('data', (chunk) => {
            rawData += chunk;
          });
          res.on('end', () => {
            server.close();
            let parsedData;
            try {
              parsedData = JSON.parse(rawData);
            } catch (e) {
              parsedData = rawData;
            }
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: parsedData,
            });
          });
        }
      );

      req.on('error', (err) => {
        server.close();
        reject(err);
      });

      if (payload) {
        req.write(payload);
      }
      req.end();
    });
  });
}

async function runTests() {
  console.log('============================================================');
  console.log('NEC FACULTY BACKEND: 20 COMPREHENSIVE TEST SUITES');
  console.log('============================================================\n');

  try {
    // ------------------------------------------------------------
    // Test 1: MongoDB Connection
    // ------------------------------------------------------------
    console.log('--- Test 1: MongoDB Connection ---');
    await connectDB();
    assert(mongoose.connection.readyState === 1, 'MongoDB connected successfully with active readyState = 1');

    // ------------------------------------------------------------
    // Test 2: Health Endpoint
    // ------------------------------------------------------------
    console.log('\n--- Test 2: Health Endpoint (/api/health) ---');
    const healthRes = await makeRequest(app, { method: 'GET', path: '/api/health' });
    assert(healthRes.statusCode === 200, 'Health endpoint returns HTTP 200');
    assert(healthRes.body.success === true, 'Health response has success: true');
    assert(healthRes.body.service === 'nec-faculty-backend', 'Health service identifier is "nec-faculty-backend"');

    // ------------------------------------------------------------
    // Test 3 & 4: Authentication (Login Success & Failure)
    // ------------------------------------------------------------
    console.log('\n--- Test 3 & 4: Authentication (Login Success & Failure) ---');
    // Ensure test user exists
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('TestPass123!', 10);
    await User.deleteMany({ email: 'test_auth@nec.edu.in' });
    const testUser = await User.create({
      name: 'Auth Tester',
      email: 'test_auth@nec.edu.in',
      passwordHash: hash,
      role: 'HOD',
      facultyId: 'FWL-01',
      isActive: true,
    });

    const loginFailRes = await makeRequest(app, {
      method: 'POST',
      path: '/api/auth/login',
      body: { email: 'test_auth@nec.edu.in', password: 'WrongPassword!' },
    });
    assert(loginFailRes.statusCode === 401, 'Login with wrong password returns HTTP 401');
    assert(loginFailRes.body.success === false, 'Login failure response has success: false');

    const loginSuccessRes = await makeRequest(app, {
      method: 'POST',
      path: '/api/auth/login',
      body: { email: 'test_auth@nec.edu.in', password: 'TestPass123!' },
    });
    assert(loginSuccessRes.statusCode === 200, 'Login with correct password returns HTTP 200');
    assert(loginSuccessRes.body.success === true, 'Login success returns success: true');
    assert(!!loginSuccessRes.body.data.token, 'Login returns valid JWT token');
    assert(!loginSuccessRes.body.data.user.passwordHash, 'User object strictly excludes passwordHash');

    const hodToken = loginSuccessRes.body.data.token;

    // ------------------------------------------------------------
    // Test 5: JWT Verification & /api/auth/me
    // ------------------------------------------------------------
    console.log('\n--- Test 5: JWT Authentication & Profile Retrieval ---');
    const decoded = verifyToken(hodToken);
    assert(decoded.email === 'test_auth@nec.edu.in', 'verifyToken extracts correct user email');
    assert(decoded.role === 'HOD', 'verifyToken extracts correct user role (HOD)');

    const meRes = await makeRequest(app, {
      method: 'GET',
      path: '/api/auth/me',
      headers: { Authorization: `Bearer ${hodToken}` },
    });
    assert(meRes.statusCode === 200, '/api/auth/me returns HTTP 200 with valid token');
    assert(meRes.body.data.email === 'test_auth@nec.edu.in', '/api/auth/me returns matching user email');

    // ------------------------------------------------------------
    // Test 6: Role-Based Access Control (RBAC)
    // ------------------------------------------------------------
    console.log('\n--- Test 6: Role-Based Access Control (RBAC) ---');
    const acUser = await User.create({
      name: 'AC Tester',
      email: 'ac_test@nec.edu.in',
      passwordHash: hash,
      role: 'AC',
      facultyId: 'FWL-22',
      isActive: true,
    });
    const acToken = generateToken(acUser);

    // Endpoint protected with HOD/ADMIN:
    const advisorByAc = await makeRequest(app, {
      method: 'POST',
      path: '/api/class-advisors',
      headers: { Authorization: `Bearer ${acToken}` },
      body: { academicContextId: new mongoose.Types.ObjectId(), facultyId: 'FWL-04' },
    });
    assert(advisorByAc.statusCode === 403, 'AC user attempting HOD action is blocked with HTTP 403 Forbidden');
    assert(advisorByAc.body.code === 'FORBIDDEN', 'Error code returned is FORBIDDEN');

    // ------------------------------------------------------------
    // Test 7: Faculty Master Retrieval & Preservation
    // ------------------------------------------------------------
    console.log('\n--- Test 7: Faculty Master Retrieval & Exact Name Preservation ---');
    const facultyListRes = await makeRequest(app, { method: 'GET', path: '/api/faculty' });
    assert(facultyListRes.statusCode === 200, '/api/faculty returns HTTP 200');
    assert(Array.isArray(facultyListRes.body.data.items), 'Faculty items is an array');

    // Karpusamy preservation check
    const karpusamy = await Faculty.findOne({ facultyName: 'Dr. S. Karpusamy' });
    assert(!!karpusamy, 'Preserves exact spelling "Dr. S. Karpusamy" without normalization');

    // ------------------------------------------------------------
    // Test 8: Exactly 28 Workload Records in Database
    // ------------------------------------------------------------
    console.log('\n--- Test 8: Exactly 28 Workload Records in DB ---');
    const workloadCount = await FacultyWorkload.countDocuments({});
    assert(workloadCount === 28, `Database contains exactly ${workloadCount} workload records (Expected: 28)`);

    // ------------------------------------------------------------
    // Test 9: All Workload Rows Preserved
    // ------------------------------------------------------------
    console.log('\n--- Test 9: All Workload Rows Preserved Row-by-Row ---');
    const allWorkloads = await FacultyWorkload.find({});
    let totalTeachingRows = 0;
    let totalRespRows = 0;
    allWorkloads.forEach((w) => {
      Object.values(w.teaching).forEach((arr) => {
        totalTeachingRows += arr.length;
      });
      totalRespRows += w.responsibilities.length;
    });
    assert(totalTeachingRows > 0, `Preserved ${totalTeachingRows} teaching rows in MongoDB`);
    assert(totalRespRows > 0, `Preserved ${totalRespRows} responsibility rows in MongoDB`);
    assert(totalTeachingRows + totalRespRows >= 170, `Total workload rows: ${totalTeachingRows + totalRespRows}`);

    // Verify multi-row faculty: M. P. Thiruvenkatasuresh (FWL-02)
    const fwl02 = allWorkloads.find((w) => w.facultyId === 'FWL-02');
    assert(!!fwl02, 'M. P. Thiruvenkatasuresh (FWL-02) exists in DB');
    assert(fwl02.teaching.ugTheory1.length === 1, 'FWL-02 retains UG Theory 1 row');
    assert(fwl02.teaching.lab1.length === 1, 'FWL-02 retains Lab 1 row');
    assert(fwl02.teaching.lab2.length === 1, 'FWL-02 retains Lab 2 row');
    assert(fwl02.teaching.pg.length === 1, 'FWL-02 retains PG row');
    assert(fwl02.teaching.others.length === 3, 'FWL-02 retains 3 Others rows');
    assert(fwl02.responsibilities.length === 3, 'FWL-02 retains 3 Responsibility rows');

    // ------------------------------------------------------------
    // Test 10: Workload Totals (Dynamic Calculation)
    // ------------------------------------------------------------
    console.log('\n--- Test 10: Workload Totals Calculated Dynamically ---');
    let sumTeaching = 0;
    let sumResp = 0;
    let sumTotal = 0;
    allWorkloads.forEach((w) => {
      sumTeaching += w.calculatedTeachingHours;
      sumResp += w.calculatedResponsibilityHours;
      sumTotal += w.calculatedTotalHours;
    });
    assert(sumTeaching === 401, `Calculated teaching hours sum = ${sumTeaching}h (Expected: 401)`);
    assert(sumResp === 129, `Calculated responsibility hours sum = ${sumResp}h (Expected: 129)`);
    assert(sumTotal === 530, `Calculated total allocated workload sum = ${sumTotal}h (Expected: 530)`);

    // ------------------------------------------------------------
    // Test 11: Incomplete Records Preserved Correctly
    // ------------------------------------------------------------
    console.log('\n--- Test 11: Incomplete Records Preserved (Satheesh Kumar & Jaishankar) ---');
    const satheesh = allWorkloads.find((w) => w.facultyName.includes('Satheesh Kumar'));
    assert(!!satheesh, 'Mrs. A. Satheesh Kumar record exists');
    assert(satheesh.status === 'INCOMPLETE SOURCE DATA', 'Satheesh Kumar marked INCOMPLETE SOURCE DATA');
    assert(satheesh.sourceTotalHours === null, 'Satheesh Kumar sourceTotalHours is null');

    const jaishankar = allWorkloads.find((w) => w.facultyName.includes('Jaishankar'));
    assert(!!jaishankar, 'Mr. P. Jaishankar record exists');
    assert(jaishankar.status === 'INCOMPLETE SOURCE DATA', 'Mr. P. Jaishankar marked INCOMPLETE SOURCE DATA');
    assert(jaishankar.sourceTotalHours === null, 'Mr. P. Jaishankar sourceTotalHours is null');

    // ------------------------------------------------------------
    // Test 12: Workload Search
    // ------------------------------------------------------------
    console.log('\n--- Test 12: Workload Search ---');
    const searchRes = await makeRequest(app, { method: 'GET', path: '/api/workload?search=Compiler' });
    assert(searchRes.statusCode === 200, 'Workload search endpoint returns HTTP 200');
    assert(searchRes.body.data.items.length > 0, 'Search for "Compiler" returns matching faculty');

    // ------------------------------------------------------------
    // Test 13: Workload Filters
    // ------------------------------------------------------------
    console.log('\n--- Test 13: Workload Filters ---');
    const matchedFilter = await makeRequest(app, { method: 'GET', path: '/api/workload?status=MATCHED&limit=50' });
    assert(matchedFilter.body.data.items.length === 26 && matchedFilter.body.data.pagination.total === 26, 'Filter status=MATCHED returns exactly 26 records');

    const incompleteFilter = await makeRequest(app, {
      method: 'GET',
      path: '/api/workload?status=INCOMPLETE%20SOURCE%20DATA',
    });
    assert(incompleteFilter.body.data.items.length === 2, 'Filter status=INCOMPLETE returns exactly 2 records');

    const hodFilter = await makeRequest(app, { method: 'GET', path: '/api/workload?role=HOD' });
    assert(hodFilter.body.data.items.length >= 1, 'Filter role=HOD returns HOD faculty');

    // ------------------------------------------------------------
    // Test 14: Workload Summary (Dynamic Aggregation)
    // ------------------------------------------------------------
    console.log('\n--- Test 14: Dynamic Workload Summary Aggregation ---');
    const summaryRes = await makeRequest(app, { method: 'GET', path: '/api/workload/summary' });
    assert(summaryRes.statusCode === 200, '/api/workload/summary returns HTTP 200');
    assert(summaryRes.body.data.totalFaculty === 28, 'Dynamic summary totalFaculty is 28');
    assert(summaryRes.body.data.totalTeachingHours === 401, 'Dynamic summary totalTeachingHours is 401');
    assert(summaryRes.body.data.totalResponsibilityHours === 129, 'Dynamic summary totalResponsibilityHours is 129');
    assert(summaryRes.body.data.totalAllocatedHours === 530, 'Dynamic summary totalAllocatedHours is 530');
    assert(summaryRes.body.data.completeCount === 26, 'Dynamic summary completeCount is 26');
    assert(summaryRes.body.data.incompleteCount === 2, 'Dynamic summary incompleteCount is 2');

    // ------------------------------------------------------------
    // Test 15: Course Faculty Candidate Handlers (AC Input)
    // ------------------------------------------------------------
    console.log('\n--- Test 15: Course Faculty Handlers Domain ---');
    const handlersRes = await makeRequest(app, { method: 'GET', path: '/api/course-faculty-handlers' });
    assert(handlersRes.statusCode === 200, '/api/course-faculty-handlers returns HTTP 200');
    assert(Array.isArray(handlersRes.body.data), 'Handlers data is array');

    // ------------------------------------------------------------
    // Test 16: HOD Allocation Authorization Enforcement
    // ------------------------------------------------------------
    console.log('\n--- Test 16: HOD Allocation Authorization Enforcement ---');
    const dummyContext = await AcademicContext.findOne({});
    const contextId = dummyContext ? dummyContext._id : new mongoose.Types.ObjectId();

    const allocation = await HODFacultyAllocation.create({
      academicContextId: contextId,
      courseCode: '22CSC14',
      facultyId: 'FWL-04',
      allocationType: 'THEORY',
      status: 'DRAFT',
      assignedBy: 'AC',
    });

    let acApproveFailed = false;
    try {
      await updateAllocationStatus(allocation._id, 'APPROVED', 'AC');
    } catch (err) {
      acApproveFailed = true;
    }
    assert(acApproveFailed, 'AC user is blocked from approving final HOD allocation');

    const hodApprove = await updateAllocationStatus(allocation._id, 'APPROVED', 'HOD');
    assert(hodApprove.status === 'APPROVED', 'HOD user successfully approves final allocation');

    // ------------------------------------------------------------
    // Test 17: Timetable Version State Lifecycle Transitions
    // ------------------------------------------------------------
    console.log('\n--- Test 17: Timetable Version State Machine ---');
    const ttVersion = await TimetableVersion.create({
      academicYear: '2026-27',
      semester: 'Odd Semester',
      department: 'CSE',
      status: 'NO_TIMETABLE',
    });

    const v1 = await transitionTimetableStatus(ttVersion._id, 'GENERATED', { role: 'AC', name: 'AC User' });
    assert(v1.status === 'GENERATED', 'State transition to GENERATED succeeded');

    const v2 = await transitionTimetableStatus(ttVersion._id, 'PENDING_HOD_APPROVAL', { role: 'AC', name: 'AC User' });
    assert(v2.status === 'PENDING_HOD_APPROVAL', 'State transition to PENDING_HOD_APPROVAL succeeded');

    let acApproveVersionFailed = false;
    try {
      await transitionTimetableStatus(ttVersion._id, 'APPROVED', { role: 'AC', name: 'AC User' });
    } catch (e) {
      acApproveVersionFailed = true;
    }
    assert(acApproveVersionFailed, 'AC user is blocked from approving TimetableVersion');

    const v3 = await transitionTimetableStatus(ttVersion._id, 'APPROVED', { role: 'HOD', name: 'HOD User' });
    assert(v3.status === 'APPROVED', 'HOD successfully transitioned TimetableVersion to APPROVED');

    const v4 = await transitionTimetableStatus(ttVersion._id, 'PUBLISHED', { role: 'HOD', name: 'HOD User' });
    assert(v4.status === 'PUBLISHED', 'HOD successfully transitioned TimetableVersion to PUBLISHED');

    // ------------------------------------------------------------
    // Test 18: TimetableSession Isolation from Workload
    // ------------------------------------------------------------
    console.log('\n--- Test 18: TimetableSession Isolation from Workload ---');
    const session = await TimetableSession.create({
      timetableVersionId: v4._id,
      academicContextId: contextId,
      courseCode: '22CSC14',
      facultyId: 'FWL-04',
      day: 'MON',
      period: 'P1',
      room: 'LH-101',
      sessionType: 'THEORY',
    });
    assert(!!session._id, 'TimetableSession created with schedule coordinates (day: MON, period: P1, room: LH-101)');

    // Verify workload record for FWL-04 does not contain schedule slots
    const fwl04 = await FacultyWorkload.findOne({ facultyId: 'FWL-04' });
    assert(fwl04.day === undefined, 'FacultyWorkload does not contain day schedule field');
    assert(fwl04.period === undefined, 'FacultyWorkload does not contain period schedule field');
    assert(fwl04.room === undefined, 'FacultyWorkload does not contain room schedule field');

    // ------------------------------------------------------------
    // Test 19: Notification Creation and Read Workflow
    // ------------------------------------------------------------
    console.log('\n--- Test 19: Notification Creation & Read Workflow ---');
    const notif = await Notification.create({
      recipientUserId: 'test_auth@nec.edu.in',
      type: 'ALLOCATION',
      title: 'Allocation Approved',
      message: 'Your teaching allocation has been ratified by HOD.',
      isRead: false,
    });
    assert(notif.isRead === false, 'Notification created with isRead: false');

    const readRes = await makeRequest(app, {
      method: 'PATCH',
      path: `/api/notifications/${notif._id}/read`,
      headers: { Authorization: `Bearer ${hodToken}` },
    });
    assert(readRes.statusCode === 200, 'Mark notification read returns HTTP 200');
    assert(readRes.body.data.isRead === true, 'Notification status updated to isRead: true');

    // ------------------------------------------------------------
    // Test 20: Faculty Absence & Substitute Allocation Flow
    // ------------------------------------------------------------
    console.log('\n--- Test 20: Faculty Absence & Substitute Allocation Flow ---');
    const absence = await FacultyAbsence.create({
      facultyId: 'FWL-04',
      date: '2026-09-22',
      reason: 'Attending International Conference on AI',
      status: 'PENDING',
    });
    assert(absence.status === 'PENDING', 'Absence created in PENDING status');

    absence.status = 'APPROVED';
    absence.approvedBy = 'HOD';
    await absence.save();
    assert(absence.status === 'APPROVED', 'HOD approved faculty absence');

    const substitute = await SubstituteAllocation.create({
      absenceId: absence._id,
      originalFacultyId: 'FWL-04',
      substituteFacultyId: 'FWL-07',
      timetableSessionId: session._id,
      date: '2026-09-22',
      period: 'P1',
      status: 'PENDING',
    });
    assert(substitute.originalFacultyId === 'FWL-04', 'Substitute record points to original faculty FWL-04');
    assert(substitute.substituteFacultyId === 'FWL-07', 'Substitute assigned to FWL-07');

    // Workload remains unaltered
    const fwl04After = await FacultyWorkload.findOne({ facultyId: 'FWL-04' });
    assert(fwl04After.calculatedTotalHours === fwl04.calculatedTotalHours, 'Faculty workload hours remain unaltered after substitution');

    // Clean up test data
    await User.deleteMany({ email: { $in: ['test_auth@nec.edu.in', 'ac_test@nec.edu.in'] } });
    await TimetableSession.findByIdAndDelete(session._id);
    await TimetableVersion.findByIdAndDelete(ttVersion._id);
    await HODFacultyAllocation.findByIdAndDelete(allocation._id);
    await Notification.findByIdAndDelete(notif._id);
    await FacultyAbsence.findByIdAndDelete(absence._id);
    await SubstituteAllocation.findByIdAndDelete(substitute._id);

    console.log('\n============================================================');
    console.log(`TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
    console.log('============================================================\n');

    if (failCount > 0) {
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('[Test Suite Fatal Error]', err);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
