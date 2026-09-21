const FacultyWorkload = require('../models/FacultyWorkload');

/**
 * Calculates sum of teaching contact hours across all categories.
 */
function calculateTeachingHours(teaching = {}) {
  let sum = 0;
  if (!teaching || typeof teaching !== 'object') return sum;

  const categories = ['ugTheory1', 'ugTheory2', 'lab1', 'lab2', 'pg', 'others'];
  categories.forEach((catKey) => {
    const items = teaching[catKey];
    if (Array.isArray(items)) {
      items.forEach((item) => {
        sum += item.hours || 0;
      });
    }
  });

  return sum;
}

/**
 * Calculates sum of responsibility hours.
 */
function calculateResponsibilityHours(responsibilities = []) {
  let sum = 0;
  if (Array.isArray(responsibilities)) {
    responsibilities.forEach((item) => {
      sum += item.hours || 0;
    });
  }
  return sum;
}

/**
 * Computes deterministic totals and integrity status for a workload payload.
 */
function processWorkloadCalculations(payload) {
  const teachingHours = calculateTeachingHours(payload.teaching);
  const responsibilityHours = calculateResponsibilityHours(payload.responsibilities);
  const calculatedTotalHours = teachingHours + responsibilityHours;

  let status = 'MATCHED';
  let discrepancyNote = null;
  let isIncomplete = Boolean(payload.isIncomplete);
  let incompleteReason = payload.incompleteReason || null;

  const sourceTotal = payload.sourceTotalHours;

  if (isIncomplete || sourceTotal === null || sourceTotal === undefined) {
    status = 'INCOMPLETE SOURCE DATA';
    isIncomplete = true;
    discrepancyNote = incompleteReason || 'Source total hours not specified or legible.';
  } else if (sourceTotal !== calculatedTotalHours) {
    status = 'REVIEW REQUIRED';
    discrepancyNote = `Source total (${sourceTotal}h) does not match calculated total (${calculatedTotalHours}h). Difference: ${Math.abs(
      sourceTotal - calculatedTotalHours
    )}h.`;
  }

  return {
    calculatedTeachingHours: teachingHours,
    calculatedResponsibilityHours: responsibilityHours,
    calculatedTotalHours,
    status,
    isIncomplete,
    incompleteReason,
    discrepancyNote,
  };
}

/**
 * Aggregates workload metrics directly from MongoDB.
 * Computes dynamic totals without hardcoding numbers.
 */
async function getDynamicSummaryMetrics() {
  const aggregateResult = await FacultyWorkload.aggregate([
    {
      $group: {
        _id: null,
        totalFaculty: { $sum: 1 },
        totalTeachingHours: { $sum: '$calculatedTeachingHours' },
        totalResponsibilityHours: { $sum: '$calculatedResponsibilityHours' },
        totalAllocatedHours: { $sum: '$calculatedTotalHours' },
        completeCount: {
          $sum: { $cond: [{ $eq: ['$status', 'MATCHED'] }, 1, 0] },
        },
        incompleteCount: {
          $sum: { $cond: [{ $eq: ['$status', 'INCOMPLETE SOURCE DATA'] }, 1, 0] },
        },
        discrepancyCount: {
          $sum: { $cond: [{ $eq: ['$status', 'REVIEW REQUIRED'] }, 1, 0] },
        },
      },
    },
  ]);

  if (!aggregateResult || aggregateResult.length === 0) {
    return {
      totalFaculty: 0,
      totalTeachingHours: 0,
      totalResponsibilityHours: 0,
      totalAllocatedHours: 0,
      completeCount: 0,
      incompleteCount: 0,
      discrepancyCount: 0,
    };
  }

  const { _id, ...metrics } = aggregateResult[0];
  return metrics;
}

module.exports = {
  calculateTeachingHours,
  calculateResponsibilityHours,
  processWorkloadCalculations,
  getDynamicSummaryMetrics,
};
