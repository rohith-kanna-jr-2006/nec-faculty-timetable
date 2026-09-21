const Faculty = require('../models/Faculty');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { getPaginationParams, formatPaginatedResult } = require('../utils/pagination');

/**
 * Get all faculty with search and filtering
 * GET /api/faculty
 */
async function getFacultyList(req, res, next) {
  try {
    const { search, department, role, isActive } = req.query;
    const { page, limit, skip } = getPaginationParams(req.query);

    const query = {};

    if (search) {
      const q = search.trim();
      query.$or = [
        { facultyName: { $regex: q, $options: 'i' } },
        { facultyId: { $regex: q, $options: 'i' } },
        { designation: { $regex: q, $options: 'i' } },
      ];
    }

    if (department) {
      query.department = { $regex: department.trim(), $options: 'i' };
    }

    if (role) {
      query.roles = { $in: [role] };
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const [items, total] = await Promise.all([
      Faculty.find(query).sort({ facultyId: 1 }).skip(skip).limit(limit),
      Faculty.countDocuments(query),
    ]);

    return successResponse(res, formatPaginatedResult(items, total, page, limit));
  } catch (error) {
    next(error);
  }
}

/**
 * Get single faculty by facultyId or _id
 * GET /api/faculty/:facultyId
 */
async function getFacultyById(req, res, next) {
  try {
    const { facultyId } = req.params;

    const faculty = await Faculty.findOne({
      $or: [{ facultyId }, { _id: facultyId.match(/^[0-9a-fA-F]{24}$/) ? facultyId : null }],
    });

    if (!faculty) {
      return errorResponse(res, `Faculty with identifier '${facultyId}' not found`, 404, 'NOT_FOUND');
    }

    return successResponse(res, faculty);
  } catch (error) {
    next(error);
  }
}

/**
 * Create new Faculty record
 * POST /api/faculty
 */
async function createFaculty(req, res, next) {
  try {
    const { facultyId, facultyName, designation, department, email, phone, roles } = req.body;

    const existing = await Faculty.findOne({ facultyId });
    if (existing) {
      return errorResponse(res, `Faculty ID '${facultyId}' already exists`, 409, 'DUPLICATE_ID');
    }

    const faculty = await Faculty.create({
      facultyId,
      facultyName,
      designation,
      department: department || 'Computer Science and Engineering',
      email,
      phone,
      roles: roles || [],
    });

    return successResponse(res, faculty, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Update Faculty record
 * PUT /api/faculty/:facultyId
 */
async function updateFaculty(req, res, next) {
  try {
    const { facultyId } = req.params;

    const faculty = await Faculty.findOneAndUpdate({ facultyId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!faculty) {
      return errorResponse(res, `Faculty with ID '${facultyId}' not found`, 404, 'NOT_FOUND');
    }

    return successResponse(res, faculty);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete Faculty record
 * DELETE /api/faculty/:facultyId
 */
async function deleteFaculty(req, res, next) {
  try {
    const { facultyId } = req.params;

    const faculty = await Faculty.findOneAndDelete({ facultyId });
    if (!faculty) {
      return errorResponse(res, `Faculty with ID '${facultyId}' not found`, 404, 'NOT_FOUND');
    }

    return successResponse(res, { message: `Faculty '${facultyId}' deleted successfully` });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFacultyList,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
};
