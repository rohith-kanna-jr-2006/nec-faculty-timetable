/**
 * Institutional Allocation Service
 *
 * Dedicated Domain for Administrative & Statutory Institutional Responsibilities:
 * - HOD Periods
 * - AC Periods
 * - Proctor Periods
 *
 * DOMAIN BOUNDARY:
 * These are NOT curriculum subjects and are NEVER placed in the AC Subject Faculty Handler pool.
 * They are direct HOD executive allocations assigned to CSE faculty members.
 */

const listeners = new Set();

export function subscribeInstitutionalAllocations(cb) {
  if (typeof cb === 'function') {
    listeners.add(cb);
    return () => listeners.delete(cb);
  }
  return () => {};
}

function notifySubscribers() {
  listeners.forEach((cb) => {
    try {
      cb();
    } catch (err) {
      console.error('Error in institutional allocation subscriber:', err);
    }
  });
}

export const INSTITUTIONAL_ALLOCATION_TYPES = [
  {
    typeId: 'HOD_PERIOD',
    name: 'Head of Department (HOD) Period',
    shortCode: 'HOD-PER',
    description: 'Statutory departmental executive and administrative contact period.',
    defaultHours: 1,
    roleCategory: 'DEPARTMENT_LEADERSHIP',
  },
  {
    typeId: 'AC_PERIOD',
    name: 'Academic Coordinator (AC) Period',
    shortCode: 'AC-PER',
    description: 'Academic coordination, curriculum governance, and cohort monitoring period.',
    defaultHours: 1,
    roleCategory: 'ACADEMIC_COORDINATION',
  },
  {
    typeId: 'PROCTOR_PERIOD',
    name: 'Proctor / Mentorship Period',
    shortCode: 'PROC-PER',
    description: 'Student proctoring, advisory tracking, and personal mentorship period.',
    defaultHours: 1,
    roleCategory: 'STUDENT_MENTORSHIP',
  },
];

// Runtime store for institutional allocations keyed by: `${typeId}_${section}_${academicYear}`
let currentInstitutionalAllocations = {};

/**
 * Returns the defined institutional allocation types.
 */
export function getInstitutionalAllocationTypes() {
  return INSTITUTIONAL_ALLOCATION_TYPES.map((t) => ({ ...t }));
}

/**
 * Returns the statutory institutional contact period total (3 contact periods across HOD, AC, Proctor).
 * Domain separation: institutional periods are NEVER mixed into curriculum course totals.
 */
export function getInstitutionalContactPeriodTotal() {
  return INSTITUTIONAL_ALLOCATION_TYPES.reduce((sum, t) => sum + (t.defaultHours || 0), 0);
}

/**
 * Generates an allocation key for institutional assignments.
 */
export function getInstitutionalKey(typeId, section = 'CSE-C', academicYear = 'AY 2024-25') {
  return `${typeId}_${section}_${academicYear}`;
}

/**
 * Retrieves all active institutional allocations, optionally filtered by context.
 */
export function getInstitutionalAllocations(filterContext = {}) {
  const all = { ...currentInstitutionalAllocations };
  if (!filterContext || Object.keys(filterContext).length === 0) {
    return all;
  }

  const { section, academicYear } = filterContext;
  const filtered = {};

  Object.entries(all).forEach(([key, alloc]) => {
    let match = true;
    if (section && alloc.section !== section) match = false;
    if (academicYear && alloc.academicYear !== academicYear) match = false;
    if (match) {
      filtered[key] = alloc;
    }
  });

  return filtered;
}

/**
 * Sets an institutional allocation directly under HOD statutory authority.
 * Includes duplicate prevention: rejects setting identical faculty assignment if already present.
 */
export function setInstitutionalAllocation(typeId, assignment = {}) {
  const {
    facultyId,
    facultyName,
    designation,
    section = 'CSE-C',
    academicYear = 'AY 2024-25',
    year = 'III Year',
    hours = 1,
  } = assignment;

  if (!typeId) {
    throw new Error('Institutional allocation typeId is required.');
  }
  if (!facultyId || !facultyName) {
    throw new Error('Faculty assignment details (ID and Name) are required.');
  }

  const key = getInstitutionalKey(typeId, section, academicYear);
  const existing = currentInstitutionalAllocations[key];

  // Duplicate check: identical assignment
  if (
    existing &&
    existing.facultyId === facultyId &&
    existing.section === section &&
    existing.academicYear === academicYear
  ) {
    return {
      success: false,
      isDuplicate: true,
      message: `${facultyName} is already assigned to this institutional allocation for ${section}.`,
      allocations: { ...currentInstitutionalAllocations },
    };
  }

  currentInstitutionalAllocations = {
    ...currentInstitutionalAllocations,
    [key]: {
      typeId,
      facultyId,
      facultyName,
      designation,
      section,
      academicYear,
      year,
      hours,
      assignedBy: 'HOD',
      assignedAt: new Date().toISOString(),
      status: 'CONFIRMED',
    },
  };

  notifySubscribers();

  return {
    success: true,
    isDuplicate: false,
    allocations: { ...currentInstitutionalAllocations },
  };
}

/**
 * Removes an institutional allocation.
 */
export function removeInstitutionalAllocation(typeId, section = 'CSE-C', academicYear = 'AY 2024-25') {
  const key = getInstitutionalKey(typeId, section, academicYear);
  const updated = { ...currentInstitutionalAllocations };
  delete updated[key];
  currentInstitutionalAllocations = updated;

  notifySubscribers();

  return { ...currentInstitutionalAllocations };
}

/**
 * Resets institutional allocations.
 */
export function clearInstitutionalAllocations() {
  currentInstitutionalAllocations = {};
  notifySubscribers();
}
