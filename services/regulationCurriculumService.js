/**
 * Regulation-Driven Curriculum Service
 *
 * Context-Aware Authoritative resolver for Regulation Curriculum subjects.
 * Strictly resolves subjects belonging ONLY to the selected academic context:
 * (Regulation + Academic Year + Department + Year + Semester).
 *
 * Strict Domain Boundary:
 * - Curriculum subjects: Regular Theory, Laboratory, and Regulation Non-Credit / Special subjects.
 * - Institutional allocations (HOD Periods, AC Periods, Proctor Periods) are NOT curriculum subjects.
 * - NEVER renders or falls back to an unfiltered global list or courses from other semesters.
 */

import { getCurriculumCourses } from '../constants/demoData.js';

// Subject Classification Constants
export const SUBJECT_CLASSIFICATIONS = {
  REGULAR_THEORY: 'REGULAR_THEORY',
  LABORATORY: 'LABORATORY',
  NON_CREDIT: 'NON_CREDIT',
  OTHER: 'OTHER',
  SPECIAL: 'SPECIAL',
};

/**
 * Normalizes regulation key (e.g., 'Autonomous Regulation R2022' -> 'R2022')
 */
export function normalizeRegulationKey(regulation) {
  if (!regulation) return 'R2022';
  const clean = String(regulation).toUpperCase();
  if (clean.includes('R2022') || clean.includes('2022')) return 'R2022';
  if (clean.includes('R2026') || clean.includes('2026')) return 'R2026';
  return clean.trim();
}

/**
 * Normalizes semester string (e.g., 'Sem V', 'Semester V', '5', 'V' -> 'Sem V')
 */
export function normalizeSemester(sem) {
  if (!sem) return '';
  const s = String(sem).trim().toUpperCase();
  if (s === 'SEM VIII' || s === 'SEMESTER VIII' || s === 'VIII' || s === '8') return 'Sem VIII';
  if (s === 'SEM VII' || s === 'SEMESTER VII' || s === 'VII' || s === '7') return 'Sem VII';
  if (s === 'SEM VI' || s === 'SEMESTER VI' || s === 'VI' || s === '6') return 'Sem VI';
  if (s === 'SEM V' || s === 'SEMESTER V' || s === 'V' || s === '5') return 'Sem V';
  if (s === 'SEM IV' || s === 'SEMESTER IV' || s === 'IV' || s === '4') return 'Sem IV';
  if (s === 'SEM III' || s === 'SEMESTER III' || s === 'III' || s === '3') return 'Sem III';
  if (s === 'SEM II' || s === 'SEMESTER II' || s === 'II' || s === '2') return 'Sem II';
  if (s === 'SEM I' || s === 'SEMESTER I' || s === 'I' || s === '1') return 'Sem I';
  return String(sem).trim();
}

/**
 * Normalizes year tier string (e.g., 'III Year', '3rd Year', 'III' -> 'III Year')
 */
export function normalizeYear(yr) {
  if (!yr) return '';
  const y = String(yr).trim().toUpperCase();
  if (y.includes('IV') || y === '4' || y === '4TH YEAR') return 'IV Year';
  if (y.includes('III') || y === '3' || y === '3RD YEAR') return 'III Year';
  if (y.includes('II') || y === '2' || y === '2ND YEAR') return 'II Year';
  if (y.includes('I') || y === '1' || y === '1ST YEAR') return 'I Year';
  return String(yr).trim();
}

// Authoritative Regulation Curriculum Registry
// Authoritative curriculum courses verified from project data sources:
// constants/workloadMasterData.js, docs/timetable-workflow.md, docs/ac-workflow.md,
// and backend/src/seeds/seedHandlers.js.
// Semesters with unconfigured curriculum are left pending rather than fabricating fake subjects.
const REGULATION_CURRICULUM_REGISTRY = {
  'R2022': {
    regulationName: 'Autonomous Regulation R2022',
    departments: {
      'CSE': {
        'III Year': {
          'Sem V': [
            // Core Theory (3 Courses • 10 Periods)
            {
              courseCode: '22CSC14',
              courseName: 'Principles of Compiler Design',
              code: '22CSC14',
              name: 'Principles of Compiler Design',
              shortName: 'Compiler Design',
              classification: SUBJECT_CLASSIFICATIONS.REGULAR_THEORY,
              category: 'THEORY',
              type: 'THEORY',
              credits: 4,
              periods: 4,
              periodsPerWeek: 4,
              allocationRule: 'SINGLE_FACULTY',
              isLab: false,
              requiresACHandler: true,
              sourceVerified: true,
            },
            {
              courseCode: '22CSC15',
              courseName: 'Full Stack Development',
              code: '22CSC15',
              name: 'Full Stack Development',
              shortName: 'Full Stack Dev',
              classification: SUBJECT_CLASSIFICATIONS.REGULAR_THEORY,
              category: 'THEORY',
              type: 'THEORY',
              credits: 3,
              periods: 3,
              periodsPerWeek: 3,
              allocationRule: 'SINGLE_FACULTY',
              isLab: false,
              requiresACHandler: true,
              sourceVerified: true,
            },
            {
              courseCode: '22CSC16',
              courseName: 'Object Oriented Software Engineering',
              code: '22CSC16',
              name: 'Object Oriented Software Engineering',
              shortName: 'OOSE',
              classification: SUBJECT_CLASSIFICATIONS.REGULAR_THEORY,
              category: 'THEORY',
              type: 'THEORY',
              credits: 3,
              periods: 3,
              periodsPerWeek: 3,
              allocationRule: 'SINGLE_FACULTY',
              isLab: false,
              requiresACHandler: true,
              sourceVerified: true,
            },

            // Laboratory / Practical (2 Labs • 8 Periods)
            {
              courseCode: '22CSP09',
              courseName: 'Full Stack Development Laboratory',
              code: '22CSP09',
              name: 'Full Stack Development Laboratory',
              shortName: 'FSD Lab',
              classification: SUBJECT_CLASSIFICATIONS.LABORATORY,
              category: 'LAB',
              type: 'LAB',
              credits: 2,
              periods: 4,
              periodsPerWeek: 4,
              allocationRule: 'PRIMARY_PLUS_ADDITIONAL',
              isLab: true,
              requiresACHandler: true,
              isDualFaculty: true,
              sourceVerified: true,
            },
            {
              courseCode: '22CSP10',
              courseName: 'Object Oriented Software Engineering Laboratory',
              code: '22CSP10',
              name: 'Object Oriented Software Engineering Laboratory',
              shortName: 'OOSE Lab',
              classification: SUBJECT_CLASSIFICATIONS.LABORATORY,
              category: 'LAB',
              type: 'LAB',
              credits: 2,
              periods: 4,
              periodsPerWeek: 4,
              allocationRule: 'PRIMARY_PLUS_ADDITIONAL',
              isLab: true,
              requiresACHandler: true,
              isDualFaculty: true,
              sourceVerified: true,
            },

            // Professional Electives (3 Courses • 9 Periods)
            {
              courseCode: '22CSX01',
              courseName: 'Deep Learning',
              code: '22CSX01',
              name: 'Deep Learning',
              shortName: 'Deep Learning',
              classification: SUBJECT_CLASSIFICATIONS.REGULAR_THEORY,
              category: 'ELECTIVE',
              type: 'ELECTIVE',
              credits: 3,
              periods: 3,
              periodsPerWeek: 3,
              allocationRule: 'SINGLE_FACULTY',
              isLab: false,
              requiresACHandler: true,
              sourceVerified: true,
            },
            {
              courseCode: '22CSX21',
              courseName: 'Cryptography and Network Security',
              code: '22CSX21',
              name: 'Cryptography and Network Security',
              shortName: 'Crypto & NetSec',
              classification: SUBJECT_CLASSIFICATIONS.REGULAR_THEORY,
              category: 'ELECTIVE',
              type: 'ELECTIVE',
              credits: 3,
              periods: 3,
              periodsPerWeek: 3,
              allocationRule: 'SINGLE_FACULTY',
              isLab: false,
              requiresACHandler: true,
              sourceVerified: true,
            },
            {
              courseCode: '22CSX42',
              courseName: 'UI and UX Design',
              code: '22CSX42',
              name: 'UI and UX Design',
              shortName: 'UI/UX Design',
              classification: SUBJECT_CLASSIFICATIONS.REGULAR_THEORY,
              category: 'ELECTIVE',
              type: 'ELECTIVE',
              credits: 3,
              periods: 3,
              periodsPerWeek: 3,
              allocationRule: 'SINGLE_FACULTY',
              isLab: false,
              requiresACHandler: true,
              sourceVerified: true,
            },

            // Non-Credit / Applied / Special / Other (4 Courses • 8 Periods)
            {
              courseCode: '22MAN08R',
              courseName: 'Soft/Analytical Skills – IV',
              code: '22MAN08R',
              name: 'Soft/Analytical Skills – IV',
              shortName: 'Soft Skills',
              classification: SUBJECT_CLASSIFICATIONS.NON_CREDIT,
              category: 'NON_CREDIT',
              type: 'SAS',
              credits: 1,
              periods: 2,
              periodsPerWeek: 2,
              allocationRule: 'MINIMUM_TWO',
              isLab: false,
              requiresACHandler: false,
              isDualFaculty: true,
              sourceVerified: true,
            },
            {
              courseCode: 'SD',
              courseName: 'Skill Development',
              code: 'SD',
              name: 'Skill Development',
              shortName: 'Skill Dev',
              classification: SUBJECT_CLASSIFICATIONS.SPECIAL,
              category: 'SPECIAL',
              type: 'SKILL_DEV',
              credits: 1,
              periods: 2,
              periodsPerWeek: 2,
              allocationRule: 'STAFFS_HANDLED',
              isLab: false,
              requiresACHandler: false,
              sourceVerified: true,
            },
            {
              courseCode: 'NPTEL',
              courseName: 'NPTEL Certification Mentoring',
              code: 'NPTEL',
              name: 'NPTEL Certification Mentoring',
              shortName: 'NPTEL Mentoring',
              classification: SUBJECT_CLASSIFICATIONS.SPECIAL,
              category: 'SPECIAL',
              type: 'NPTEL',
              credits: 1,
              periods: 2,
              periodsPerWeek: 2,
              allocationRule: 'STAFFS_HANDLED',
              isLab: false,
              requiresACHandler: false,
              sourceVerified: true,
            },
            {
              courseCode: 'PBL',
              courseName: 'Project Based Learning',
              code: 'PBL',
              name: 'Project Based Learning',
              shortName: 'PBL Capstone',
              classification: SUBJECT_CLASSIFICATIONS.OTHER,
              category: 'OTHER',
              type: 'PBL',
              credits: 1,
              periods: 2,
              periodsPerWeek: 2,
              allocationRule: 'STAFFS_HANDLED',
              isLab: false,
              requiresACHandler: false,
              isDualFaculty: true,
              sourceVerified: true,
            },
          ],
        },
      },
    },
  },
};

/**
 * Classifies any given curriculum course object into standard classification.
 */
export function classifySubject(course) {
  if (!course) return SUBJECT_CLASSIFICATIONS.OTHER;

  if (course.classification) return course.classification;

  const cat = String(course.category || course.type || '').toUpperCase();
  const name = String(course.name || course.courseName || '').toLowerCase();

  if (cat.includes('LAB') || course.isLab === true) {
    return SUBJECT_CLASSIFICATIONS.LABORATORY;
  }

  if (
    cat.includes('NON_CREDIT') ||
    cat.includes('NON CREDIT') ||
    cat.includes('MANDATORY') ||
    name.includes('constitution') ||
    name.includes('ethics') ||
    name.includes('soft') ||
    name.includes('analytical')
  ) {
    return SUBJECT_CLASSIFICATIONS.NON_CREDIT;
  }

  if (cat.includes('PBL') || name.includes('pbl') || name.includes('project based')) {
    return SUBJECT_CLASSIFICATIONS.OTHER;
  }

  if (
    cat.includes('SPECIAL') ||
    name.includes('nptel') ||
    name.includes('library') ||
    name.includes('skill dev')
  ) {
    return SUBJECT_CLASSIFICATIONS.SPECIAL;
  }

  if (cat.includes('THEORY') || cat.includes('CREDIT') || cat.includes('CORE') || cat.includes('ELECTIVE')) {
    return SUBJECT_CLASSIFICATIONS.REGULAR_THEORY;
  }

  return SUBJECT_CLASSIFICATIONS.OTHER;
}

/**
 * Resolves curriculum subjects STRICTLY for the specified Academic Context.
 *
 * Rules:
 * 1. HOD selects context (Regulation, Academic Year, Department, Year, Semester, Section).
 * 2. Only subjects belonging to the selected context are returned.
 * 3. Never returns subjects from another semester.
 * 4. If runtime curriculum courses exist in demoData, they are strictly filtered by semester, year, department, and regulation.
 * 5. Does not fabricate missing regulation data; returns empty array if context curriculum is pending.
 */
export function getRegulationSubjects(context = {}) {
  const {
    regulation,
    academicYear,
    semester,
    department,
    year,
    section,
  } = context;

  // Context must specify at minimum semester to filter curriculum subjects
  if (!semester) {
    return [];
  }

  const targetReg = normalizeRegulationKey(regulation || 'R2022');
  const targetSem = normalizeSemester(semester);
  const targetYr = normalizeYear(year || 'III Year');
  const targetDept = String(department || 'CSE').toUpperCase();
  const targetSection = section || 'CSE-C';
  const targetAY = academicYear || 'AY 2024-25';

  // 1. Check runtime courses from demoData, applying STRICT context filtering
  const runtimeCourses = getCurriculumCourses();
  if (Array.isArray(runtimeCourses) && runtimeCourses.length > 0) {
    const contextFiltered = runtimeCourses.filter((c) => {
      // Semester filter: MUST match targetSem
      if (!c.semester || normalizeSemester(c.semester) !== targetSem) {
        return false;
      }
      // Year filter
      if (c.year && normalizeYear(c.year) !== targetYr) {
        return false;
      }
      // Department filter
      if (c.department && c.department.toUpperCase() !== targetDept) {
        return false;
      }
      // Regulation filter
      if (c.regulation && normalizeRegulationKey(c.regulation) !== targetReg) {
        return false;
      }
      return true;
    });

    if (contextFiltered.length > 0) {
      return contextFiltered.map((c) => {
        const classification = classifySubject(c);
        const isDirectHOD = isDirectHODCurriculumSubject({ classification });
        return {
          courseCode: c.code || c.courseCode,
          courseName: c.name || c.courseName,
          code: c.code || c.courseCode,
          name: c.name || c.courseName,
          category: c.category || (classification === SUBJECT_CLASSIFICATIONS.LABORATORY ? 'LAB' : 'THEORY'),
          type: classification,
          classification,
          credits: c.credits !== undefined ? c.credits : classification === SUBJECT_CLASSIFICATIONS.REGULAR_THEORY ? 3 : 0,
          periods: c.periods || c.periodsPerWeek || (classification === SUBJECT_CLASSIFICATIONS.LABORATORY ? 4 : 3),
          periodsPerWeek: c.periods || c.periodsPerWeek || (classification === SUBJECT_CLASSIFICATIONS.LABORATORY ? 4 : 3),
          allocationRule: c.allocationRule || (classification === SUBJECT_CLASSIFICATIONS.LABORATORY ? 'PRIMARY_PLUS_ADDITIONAL' : 'SINGLE_FACULTY'),
          isLab: classification === SUBJECT_CLASSIFICATIONS.LABORATORY,
          requiresACHandler: !isDirectHOD,
          academicYear: targetAY,
          year: targetYr,
          semester: targetSem,
          department: targetDept,
          section: targetSection,
          regulation: targetReg,
          isAuthoritative: true,
        };
      });
    }

    // Runtime courses were loaded globally, but NONE matched this semester: return empty!
    // Do NOT fall back to showing other semesters' courses.
    return [];
  }

  // 2. Query authoritative regulation curriculum registry
  const regData = REGULATION_CURRICULUM_REGISTRY[targetReg];
  if (!regData) {
    return [];
  }

  const deptData = regData.departments?.[targetDept];
  if (!deptData) {
    return [];
  }

  const yearData = deptData[targetYr];
  if (!yearData) {
    return [];
  }

  const semSubjects = yearData[targetSem];
  if (!Array.isArray(semSubjects) || semSubjects.length === 0) {
    // Authoritative curriculum data for this semester is pending. Do not fabricate fake subjects.
    return [];
  }

  return semSubjects.map((s) => ({
    ...s,
    academicYear: targetAY,
    year: targetYr,
    semester: targetSem,
    department: targetDept,
    section: targetSection,
    regulation: targetReg,
    isAuthoritative: true,
  }));
}

/**
 * Calculates the authoritative weekly curriculum period total for a given context.
 * For Semester V (R2022 / CSE / III Year), this returns exactly 35 periods.
 */
export function getAuthoritativeCurriculumPeriodTotal(context = {}) {
  const subjects = getRegulationSubjects(context);
  return subjects.reduce((sum, s) => sum + (s.periodsPerWeek || s.periods || 0), 0);
}

/**
 * Checks if authoritative regulation curriculum data is registered for this context.
 */
export function hasAuthoritativeCurriculum({
  regulation = 'R2022',
  department = 'CSE',
  year = 'III Year',
  semester = 'Sem V',
} = {}) {
  const regKey = normalizeRegulationKey(regulation);
  const targetSem = normalizeSemester(semester);
  const targetYr = normalizeYear(year);
  const targetDept = String(department).toUpperCase();

  const subjects = REGULATION_CURRICULUM_REGISTRY[regKey]?.departments?.[targetDept]?.[targetYr]?.[targetSem];
  return Array.isArray(subjects) && subjects.length > 0;
}

/**
 * Determines whether a curriculum subject is a direct HOD sole-decision allocation.
 * True for: Non-Credit, Other (PBL), and Special (NPTEL, Skill Development).
 * False for: Regular Theory, Laboratory.
 */
export function isDirectHODCurriculumSubject(subject) {
  if (!subject) return false;
  const classification = subject.classification || classifySubject(subject);
  return (
    classification === SUBJECT_CLASSIFICATIONS.NON_CREDIT ||
    classification === SUBJECT_CLASSIFICATIONS.OTHER ||
    classification === SUBJECT_CLASSIFICATIONS.SPECIAL
  );
}

/**
 * Determines whether a curriculum subject requires AC Subject Handler advisory input.
 * Only Regular Theory and Laboratory subjects use AC advisory input.
 */
export function requiresACSubjectHandler(subject) {
  return !isDirectHODCurriculumSubject(subject);
}

/**
 * Dynamic registration helper for new Regulations or Curricula.
 */
export function registerRegulationCurriculum(regulationKey, curriculumData) {
  const key = normalizeRegulationKey(regulationKey);
  REGULATION_CURRICULUM_REGISTRY[key] = {
    ...REGULATION_CURRICULUM_REGISTRY[key],
    ...curriculumData,
  };
}

/**
 * Registers an individual subject into a regulation context.
 */
export function registerRegulationSubject({
  regulation = 'R2022',
  department = 'CSE',
  year = 'III Year',
  semester = 'Sem V',
  subject,
}) {
  const regKey = normalizeRegulationKey(regulation);
  const targetSem = normalizeSemester(semester);
  const targetYr = normalizeYear(year);
  const targetDept = String(department).toUpperCase();

  if (!REGULATION_CURRICULUM_REGISTRY[regKey]) {
    REGULATION_CURRICULUM_REGISTRY[regKey] = { regulationName: `Regulation ${regKey}`, departments: {} };
  }
  const reg = REGULATION_CURRICULUM_REGISTRY[regKey];
  if (!reg.departments[targetDept]) reg.departments[targetDept] = {};
  if (!reg.departments[targetDept][targetYr]) reg.departments[targetDept][targetYr] = {};
  if (!reg.departments[targetDept][targetYr][targetSem]) reg.departments[targetDept][targetYr][targetSem] = [];

  const list = reg.departments[targetDept][targetYr][targetSem];
  const existingIdx = list.findIndex((s) => s.code === subject.code || s.courseCode === subject.courseCode);
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...subject };
  } else {
    list.push(subject);
  }
}
