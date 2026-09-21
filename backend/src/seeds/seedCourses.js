const Course = require('../models/Course');

async function seedCourses() {
  console.log('[Seed] Extracting courses from authoritative workload master...');
  const workloadModule = await import('../../../constants/workloadMasterData.js');
  const masterData = workloadModule.FACULTY_WORKLOAD_MASTER;

  const courseMap = new Map();

  masterData.forEach((f) => {
    Object.entries(f.teaching).forEach(([catKey, items]) => {
      items.forEach((item) => {
        if (item.courseCode && !courseMap.has(item.courseCode)) {
          const isLab = catKey.toLowerCase().includes('lab') || item.courseName.toLowerCase().includes('laboratory') || item.courseName.toLowerCase().includes('lab');
          const isPG = catKey === 'pg' || item.allocation?.includes('PG');

          courseMap.set(item.courseCode, {
            courseCode: item.courseCode.toUpperCase().trim(),
            courseName: item.courseName.trim(),
            courseType: isLab ? 'LAB' : 'THEORY',
            category: isPG ? 'Postgraduate Core' : 'Professional Core',
            credits: isLab ? 2 : 3,
            academicYear: '2026-27',
            semester: 'Odd Semester',
            department: 'CSE',
            isLab,
            isActive: true,
          });
        }
      });
    });
  });

  await Course.deleteMany({});
  const inserted = await Course.insertMany(Array.from(courseMap.values()));
  console.log(`[Seed] Successfully seeded ${inserted.length} courses.`);
  return inserted;
}

module.exports = { seedCourses };
