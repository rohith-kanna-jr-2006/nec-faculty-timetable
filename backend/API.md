# NEC Faculty API Reference Documentation

All endpoints are mounted under base path: `/api`.

Standard JSON format:
```json
// Success
{
  "success": true,
  "data": { ... },
  "meta": { ... } // Optional pagination
}

// Error
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": [ ... ] // Optional validation details
}
```

---

## 1. System Health

### `GET /api/health`
Health check endpoint.
- **Access**: Public
- **Response**:
```json
{
  "success": true,
  "service": "nec-faculty-backend"
}
```

---

## 2. Authentication & Authorization (Web Integration Contract)

### `POST /api/auth/login`
Authenticate user with email and password to receive a JWT and user profile.
- **Access**: Public (Rate-limited: 50 requests / 15 minutes)
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "hod@nec.edu.in",
  "password": "Password123!"
}
```
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "6795f0000000000000000001",
      "name": "Dr. T. Rajasekaran",
      "email": "hod@nec.edu.in",
      "role": "HOD",
      "facultyId": "FWL-01",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "HOD",
    "facultyId": "FWL-01"
  }
}
```
- **Error Responses**:
  - `400 Bad Request` (`code: "VALIDATION_ERROR"`): Missing email, invalid email format, or empty password.
  - `401 Unauthorized` (`code: "INVALID_CREDENTIALS"`): Incorrect password or email not registered.
  - `401 Unauthorized` (`code: "ACCOUNT_DEACTIVATED"`): User account is marked `isActive: false`.

### `GET /api/auth/me`
Retrieve active user session profile during page refresh or session restoration.
- **Access**: Authenticated
- **Required Header**: `Authorization: Bearer <token>`
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "id": "6795f0000000000000000001",
    "name": "Dr. T. Rajasekaran",
    "email": "hod@nec.edu.in",
    "role": "HOD",
    "facultyId": "FWL-01",
    "isActive": true,
    "createdAt": "2026-09-20T10:00:00.000Z",
    "user": {
      "id": "6795f0000000000000000001",
      "name": "Dr. T. Rajasekaran",
      "email": "hod@nec.edu.in",
      "role": "HOD",
      "facultyId": "FWL-01",
      "isActive": true,
      "createdAt": "2026-09-20T10:00:00.000Z"
    }
  }
}
```
- **Error Responses**:
  - `401 Unauthorized` (`code: "UNAUTHORIZED"`): Missing or non-Bearer `Authorization` header.
  - `401 Unauthorized` (`code: "INVALID_TOKEN"`): Malformed or tampered token.
  - `401 Unauthorized` (`code: "TOKEN_EXPIRED"`): Token has expired (triggers client auto-redirect to `/login?expired=true`).
  - `401 Unauthorized` (`code: "USER_INACTIVE"`): User account deactivated.

---

### Seed User Credentials (Development Environment)

| Role | Email | Password | Faculty ID | Default Dashboard Route |
| :--- | :--- | :--- | :--- | :--- |
| **HOD** | `hod@nec.edu.in` | `Password123!` | `FWL-01` | `/hod/dashboard` |
| **AC** | `ac@nec.edu.in` | `Password123!` | `FWL-22` | `/coordinator/dashboard` |
| **FACULTY** | `faculty@nec.edu.in` | `Password123!` | `FWL-03` | `/faculty/dashboard` |
| **ADMIN** | `admin@nec.edu.in` | `Password123!` | *None* | `/hod/dashboard` |

---

### Role-Based Access Control (RBAC) Matrix

| Domain Operation | Method & Endpoint | FACULTY | AC | HOD | ADMIN |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Authentication** | `POST /api/auth/login`, `GET /api/auth/me` | Allowed | Allowed | Allowed | Allowed |
| **View Own Timetable** | `GET /api/timetable/faculty/:id` | Allowed | Allowed | Allowed | Allowed |
| **View Class Timetable** | `GET /api/timetable/class/:id` | Allowed | Allowed | Allowed | Allowed |
| **View Workload** | `GET /api/workload`, `/summary` | Allowed | Allowed | Allowed | Allowed |
| **Submit Absence** | `POST /api/absences` | Allowed | Allowed | Allowed | Allowed |
| **Approve/Reject Absence** | `PATCH /api/absences/:id/status` | **403** | **403** | Allowed | Allowed |
| **Assign Substitute** | `POST /api/substitutes` | **403** | **403** | Allowed | Allowed |
| **Course Candidate Handlers**| `POST/PUT/DELETE /api/course-faculty-handlers` | **403** | Allowed | Allowed | Allowed |
| **Create Timetable Version** | `POST /api/timetable/version` | **403** | Allowed | Allowed | Allowed |
| **Approve / Publish Timetable**| `PATCH /api/timetable/version/:id/status` | **403** | **403** | Allowed | Allowed |
| **Create Draft Allocation** | `POST /api/hod-allocations` | **403** | Allowed | Allowed | Allowed |
| **Approve HOD Allocation** | `PATCH /api/hod-allocations/:id/status` | **403** | **403** | Allowed | Allowed |
| **Assign Class Advisor** | `POST /api/class-advisors` | **403** | **403** | Allowed | Allowed |
| **Create/Update Faculty** | `POST/PUT /api/faculty` | **403** | **403** | Allowed | Allowed |
| **Delete Faculty Master** | `DELETE /api/faculty/:facultyId` | **403** | **403** | **403** | Allowed |

---

## 3. Faculty Directory Master

### `GET /api/faculty`
List faculty with pagination and search.
- **Access**: Public / Authenticated
- **Query Params**: `search`, `department`, `role`, `page`, `limit`

### `GET /api/faculty/:facultyId`
Retrieve faculty details by unique ID (e.g. `FWL-01`).

### `POST /api/faculty`
Create new faculty profile.
- **Access**: HOD, ADMIN

### `PUT /api/faculty/:facultyId`
Update faculty profile.
- **Access**: HOD, ADMIN

---

## 4. Faculty Workload Master

### `GET /api/workload`
List all 28 faculty workload records.
- **Query Params**:
  - `search`: multi-attribute text search across faculty, courses, responsibilities
  - `status`: `MATCHED`, `REVIEW REQUIRED`, `INCOMPLETE SOURCE DATA`
  - `role`: `HOD`, `ACADEMIC_COORDINATOR`, `CLASS_ADVISOR`, `PROCTOR`, `TEACHING_ONLY`, `RESPONSIBILITIES`
  - `category`: `UG_THEORY`, `LAB`, `PG`, `OTHERS`
  - `facultyId`: filter by specific faculty member
  - `page`, `limit`

### `GET /api/workload/summary`
Dynamic aggregation metrics computed live from MongoDB:
```json
{
  "success": true,
  "data": {
    "totalFaculty": 28,
    "totalTeachingHours": 401,
    "totalResponsibilityHours": 129,
    "totalAllocatedHours": 530,
    "completeCount": 26,
    "incompleteCount": 2,
    "discrepancyCount": 0
  }
}
```

### `GET /api/workload/discrepancies`
Retrieve records requiring arithmetic review (`REVIEW REQUIRED`).

### `GET /api/workload/incomplete`
Retrieve records with incomplete source totals (`INCOMPLETE SOURCE DATA`).

### `GET /api/workload/:facultyId`
Retrieve full breakdown of teaching rows and responsibilities for a faculty member.

---

## 5. Course Faculty Handlers (AC Input)

### `GET /api/course-faculty-handlers`
List all course-level handler candidates nominated by Academic Coordinators.

### `GET /api/course-faculty-handlers/:courseCode`
Get handlers for a specific course code (e.g. `22CSC14`).

### `POST /api/course-faculty-handlers`
Submit candidate faculty pool for a course.
- **Access**: AC, HOD, ADMIN

### `PUT /api/course-faculty-handlers/:courseCode`
Update candidate handlers.

---

## 6. HOD Faculty Allocations

### `GET /api/hod-allocations`
List final ratified allocations.
- **Query Params**: `academicContextId`, `facultyId`, `courseCode`, `status`

### `POST /api/hod-allocations`
Create draft or submitted allocation.
- **Access**: AC (drafts only), HOD (can create directly as approved)

### `PATCH /api/hod-allocations/:id/status`
Approve or reject allocation.
- **Access**: HOD, ADMIN (AC forbidden)
- **Body**: `{ "status": "APPROVED" | "REJECTED", "rejectionReason": "..." }`

---

## 7. Timetable Version & Sessions

### `GET /api/timetable/faculty/:facultyId`
Get scheduled sessions for a faculty member.
- **Query Params**: `versionId` (optional)

### `GET /api/timetable/class/:academicContextId`
Get class timetable grid.

### `GET /api/timetable/published/:academicContextId`
Get current published timetable for a class.

### `GET /api/timetable/versions`
List timetable versions.

### `POST /api/timetable/version`
Create candidate timetable version.

### `PATCH /api/timetable/version/:id/status`
State machine transition:
`NO_TIMETABLE -> GENERATED -> PENDING_HOD_APPROVAL -> APPROVED -> PUBLISHED`
- **Access**: Transition to `APPROVED` or `PUBLISHED` requires HOD or ADMIN.

### `POST /api/timetable/session`
Create scheduled slot (`day`, `period`, `room`, `courseCode`, `facultyId`).
- Checks for hard conflicts: returns 409 if faculty is already busy at that slot.

---

## 8. Notifications

### `GET /api/notifications`
Get user notifications with unread count.

### `PATCH /api/notifications/:id/read`
Mark individual notification as read.

### `PATCH /api/notifications/read-all`
Mark all notifications read for the user.

---

## 9. Availability, Absences & Substitutes

### `GET /api/availability` & `POST /api/availability`
Record faculty availability or preferences.

### `GET /api/absences` & `POST /api/absences`
Submit and track faculty leave.

### `PATCH /api/absences/:id/status`
HOD approval/rejection of leave.

### `GET /api/substitutes` & `POST /api/substitutes`
Assign substitute faculty to a scheduled timetable session without altering historical workload.
