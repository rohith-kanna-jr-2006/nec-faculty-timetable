const Course = require('../models/Course');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { getPaginationParams, formatPaginatedResult } = require('../utils/pagination');

/**
 * Get courses list with filters and pagination
 * GET /api/courses
 */
async function getCourses(req, res, next) {
  try {
    const { search, courseType, semester, department, isLab } = req.query;
    const { page, limit, skip } = getPaginationParams(req.query);

    const query = {};

    if (search) {
      const q = search.trim();
      query.$or = [
        { courseCode: { $regex: q, $options: 'i' } },
        { courseName: { $regex: q, $options: 'i' } },
      ];
    }

    if (courseType) {
      query.courseType = courseType;
    }

    if (semester) {
      query.semester = { $regex: semester.trim(), $options: 'i' };
    }

    if (department) {
      query.department = department.toUpperCase().trim();
    }

    if (isLab !== undefined) {
      query.isLab = isLab === 'true';
    }

    const [items, total] = await Promise.all([
      Course.find(query).sort({ courseCode: 1 }).skip(skip).limit(limit),
      Course.countDocuments(query),
    ]);

    return successResponse(res, formatPaginatedResult(items, total, page, limit));
  } catch (error) {
    next(error);
  }
}

/**
 * Get course by courseCode
 * GET /api/courses/:courseCode
 */
async function getCourseByCode(req, res, next) {
  try {
    const { courseCode } = req.params;
    const course = await Course.findOne({ courseCode: courseCode.toUpperCase().trim() });

    if (!course) {
      return errorResponse(res, `Course '${courseCode}' not found`, 404, 'NOT_FOUND');
    }

    return successResponse(res, course);
  } catch (error) {
    next(error);
  }
}

/**
 * Create course
 * POST /api/courses
 */
async function createCourse(req, res, next) {
  try {
    const { courseCode, courseName, courseType, category, credits, academicYear, semester, department, isLab } =
      req.body;

    const existing = await Course.findOne({ courseCode: courseCode.toUpperCase().trim() });
    if (existing) {
      return errorResponse(res, `Course code '${courseCode}' already exists`, 409, 'DUPLICATE_CODE');
    }

    const course = await Course.create({
      courseCode: courseCode.toUpperCase().trim(),
      courseName,
      courseType: courseType || 'THEORY',
      category: category || 'Professional Core',
      credits: credits !== undefined ? credits : 3,
      academicYear: academicYear || '2026-27',
      semester: semester || 'Odd Semester',
      department: (department || 'CSE').toUpperCase().trim(),
      isLab: Boolean(isLab),
    });

    return successResponse(res, course, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Update course
 * PUT /api/courses/:courseCode
 */
async function updateCourse(req, res, next) {
  try {
    const { courseCode } = req.params;

    const course = await Course.findOneAndUpdate(
      { courseCode: courseCode.toUpperCase().trim() },
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return errorResponse(res, `Course '${courseCode}' not found`, 404, 'NOT_FOUND');
    }

    return successResponse(res, course);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete course
 * DELETE /api/courses/:courseCode
 */
async function deleteCourse(req, res, next) {
  try {
    const { courseCode } = req.params;

    const course = await Course.findOneAndDelete({ courseCode: courseCode.toUpperCase().trim() });
    if (!course) {
      return errorResponse(res, `Course '${courseCode}' not found`, 404, 'NOT_FOUND');
    }

    return successResponse(res, { message: `Course '${courseCode}' deleted successfully` });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCourses,
  getCourseByCode,
  createCourse,
  updateCourse,
  deleteCourse,
};
