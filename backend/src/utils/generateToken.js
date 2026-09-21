const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT for an authenticated user.
 */
function generateToken(user) {
  const secret = process.env.JWT_SECRET || 'nec_faculty_secret_jwt_key_2026_production_grade';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    facultyId: user.facultyId,
    name: user.name,
  };

  return jwt.sign(payload, secret, { expiresIn });
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET || 'nec_faculty_secret_jwt_key_2026_production_grade';
  return jwt.verify(token, secret);
}

module.exports = {
  generateToken,
  verifyToken,
};
