const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function seedUsers() {
  console.log('[Seed] Seeding development user accounts with hashed passwords...');

  const defaultPassword = process.env.DEV_SEED_PASSWORD || 'Password123!';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(defaultPassword, salt);

  const users = [
    {
      name: 'Dr. T. Rajasekaran',
      email: 'hod@nec.edu.in',
      passwordHash,
      role: 'HOD',
      facultyId: 'FWL-01',
      isActive: true,
    },
    {
      name: 'Mr. R. Manikandan',
      email: 'ac@nec.edu.in',
      passwordHash,
      role: 'AC',
      facultyId: 'FWL-22',
      isActive: true,
    },
    {
      name: 'Dr. S. Karpusamy',
      email: 'faculty@nec.edu.in',
      passwordHash,
      role: 'FACULTY',
      facultyId: 'FWL-03',
      isActive: true,
    },
    {
      name: 'System Administrator',
      email: 'admin@nec.edu.in',
      passwordHash,
      role: 'ADMIN',
      facultyId: null,
      isActive: true,
    },
  ];

  await User.deleteMany({});
  const inserted = await User.insertMany(users);
  console.log(`[Seed] Successfully seeded ${inserted.length} development user accounts.`);
  return inserted;
}

module.exports = { seedUsers };
