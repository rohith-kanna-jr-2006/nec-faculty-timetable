const { verifyToken } = require('../utils/generateToken');
const { errorResponse } = require('../utils/responseHandler');
const User = require('../models/User');

/**
 * Middleware to authenticate requests using JWT Bearer token.
 */
async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication token missing or invalid', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return errorResponse(res, 'Authentication token missing', 401, 'UNAUTHORIZED');
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 'Authentication token expired', 401, 'TOKEN_EXPIRED');
      }
      return errorResponse(res, 'Invalid authentication token', 401, 'INVALID_TOKEN');
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return errorResponse(res, 'User not found or account deactivated', 401, 'USER_INACTIVE');
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Authentication error', 500, 'AUTH_ERROR', error.message);
  }
}

module.exports = {
  authenticateUser,
};
