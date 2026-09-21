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

## 2. Authentication

### `POST /api/auth/login`
Authenticate user with email and password.
- **Access**: Public (Rate-limited)
- **Body**:
```json
{
  "email": "hod@nec.edu.in",
  "password": "Password123!"
}
```
- **Response**: `{ "success": true, "data": { "user": { ... }, "token": "..." } }`

### `GET /api/auth/me`
Retrieve authenticated user profile.
- **Access**: Authenticated (Bearer Token)
- **Headers**: `Authorization: Bearer <token>`

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
