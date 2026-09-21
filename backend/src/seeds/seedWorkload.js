const FacultyWorkload = require('../models/FacultyWorkload');
const { processWorkloadCalculations } = require('../services/workloadService');

async function seedWorkload() {
  console.log('[Seed] Importing authoritative workload master data from constants/workloadMasterData.js...');
  const workloadModule = await import('../../../constants/workloadMasterData.js');
  const masterData = workloadModule.FACULTY_WORKLOAD_MASTER;

  if (!masterData || masterData.length !== 28) {
    throw new Error(`Expected exactly 28 faculty records in source, but found: ${masterData ? masterData.length : 0}`);
  }

  const workloadDocs = masterData.map((f) => {
    const calc = processWorkloadCalculations(f);

    return {
      facultyId: f.facultyId,
      facultyName: f.facultyName,
      designation: f.designation,
      teaching: {
        ugTheory1: (f.teaching?.ugTheory1 || []).map((item) => ({ ...item })),
        ugTheory2: (f.teaching?.ugTheory2 || []).map((item) => ({ ...item })),
        lab1: (f.teaching?.lab1 || []).map((item) => ({ ...item })),
        lab2: (f.teaching?.lab2 || []).map((item) => ({ ...item })),
        pg: (f.teaching?.pg || []).map((item) => ({ ...item })),
        others: (f.teaching?.others || []).map((item) => ({ ...item })),
      },
      responsibilities: (f.responsibilities || []).map((resp) => ({ ...resp })),
      sourceTotalHours: f.sourceTotalHours !== undefined ? f.sourceTotalHours : null,
      calculatedTeachingHours: calc.calculatedTeachingHours,
      calculatedResponsibilityHours: calc.calculatedResponsibilityHours,
      calculatedTotalHours: calc.calculatedTotalHours,
      status: calc.status,
      isIncomplete: calc.isIncomplete,
      incompleteReason: calc.incompleteReason,
      discrepancyNote: calc.discrepancyNote,
      sourceVersion: 'v1.0-master-register',
    };
  });

  await FacultyWorkload.deleteMany({});
  const inserted = await FacultyWorkload.insertMany(workloadDocs);

  // Verification of invariants
  let totalTeachingHours = 0;
  let totalResponsibilityHours = 0;
  let totalAllocatedHours = 0;
  let incompleteCount = 0;
  let totalTeachingRows = 0;
  let totalRespRows = 0;

  inserted.forEach((doc) => {
    totalTeachingHours += doc.calculatedTeachingHours;
    totalResponsibilityHours += doc.calculatedResponsibilityHours;
    totalAllocatedHours += doc.calculatedTotalHours;
    if (doc.status === 'INCOMPLETE SOURCE DATA') {
      incompleteCount++;
    }

    Object.values(doc.teaching).forEach((arr) => {
      totalTeachingRows += arr.length;
    });
    totalRespRows += doc.responsibilities.length;
  });

  console.log(`[Seed Verification]`);
  console.log(`  - Faculty records seeded: ${inserted.length} (Expected: 28)`);
  console.log(`  - Total teaching rows: ${totalTeachingRows}`);
  console.log(`  - Total responsibility rows: ${totalRespRows}`);
  console.log(`  - Total teaching hours: ${totalTeachingHours} (Expected: 401)`);
  console.log(`  - Total responsibility hours: ${totalResponsibilityHours} (Expected: 129)`);
  console.log(`  - Total calculated workload: ${totalAllocatedHours} (Expected: 530)`);
  console.log(`  - Incomplete source records: ${incompleteCount} (Expected: 2)`);

  if (inserted.length !== 28) throw new Error('Workload seed failed: count != 28');
  if (totalTeachingHours !== 401) throw new Error('Workload seed failed: teachingHours != 401');
  if (totalResponsibilityHours !== 129) throw new Error('Workload seed failed: respHours != 129');
  if (totalAllocatedHours !== 530) throw new Error('Workload seed failed: totalHours != 530');
  if (incompleteCount !== 2) throw new Error('Workload seed failed: incompleteCount != 2');

  return inserted;
}

module.exports = { seedWorkload };
