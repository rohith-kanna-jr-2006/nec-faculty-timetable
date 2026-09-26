/**
 * NEC Faculty Timetable & Workload Management System
 * Faculty Service - Frontend API integration for faculty operations
 * This service handles all faculty-related API calls.
 * Backend contract: Pending Ragul's implementation
 */

import api from './api.js';

// API Endpoints - These will be confirmed with Ragul's backend
const FACULTY_ENDPOINTS = {
  LIST: '/faculty',
  CREATE: '/faculty',
  GET_BY_ID: '/faculty/',
  UPDATE: '/faculty/',
  DELETE: '/faculty/',
  WORKLOAD: '/faculty/workload/',
};

/**
 * Get all faculty members
 * @param {Object} params - Query parameters (department, status, etc.)
 * @returns {Promise<Array>} List of faculty
 */
export async function getAllFaculty(params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${FACULTY_ENDPOINTS.LIST}?${queryString}` : FACULTY_ENDPOINTS.LIST;
    return await api.get(endpoint);
  } catch (error) {
    console.error('[facultyService] Failed to fetch faculty list:', error);
    throw error;
  }
}

/**
 * Get a single faculty member by ID
 * @param {string} facultyId - Faculty ID
 * @returns {Promise<Object>} Faculty details
 */
export async function getFacultyById(facultyId) {
  try {
    return await api.get(`${FACULTY_ENDPOINTS.GET_BY_ID}${facultyId}`);
  } catch (error) {
    console.error('[facultyService] Failed to fetch faculty:', error);
    throw error;
  }
}

/**
 * Create a new faculty member with workload allocation
 * @param {Object} facultyData - Faculty data including workload
 * @returns {Promise<Object>} Created faculty
 */
export async function createFaculty(facultyData) {
  try {
    const response = await api.post(FACULTY_ENDPOINTS.CREATE, facultyData);
    return response;
  } catch (error) {
    console.error('[facultyService] Failed to create faculty:', error);
    throw error;
  }
}

/**
 * Update an existing faculty member
 * @param {string} facultyId - Faculty ID
 * @param {Object} facultyData - Updated faculty data
 * @returns {Promise<Object>} Updated faculty
 */
export async function updateFaculty(facultyId, facultyData) {
  try {
    return await api.put(`${FACULTY_ENDPOINTS.UPDATE}${facultyId}`, facultyData);
  } catch (error) {
    console.error('[facultyService] Failed to update faculty:', error);
    throw error;
  }
}

/**
 * Delete a faculty member
 * @param {string} facultyId - Faculty ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteFaculty(facultyId) {
  try {
    return await api.delete(`${FACULTY_ENDPOINTS.DELETE}${facultyId}`);
  } catch (error) {
    console.error('[facultyService] Failed to delete faculty:', error);
    throw error;
  }
}

/**
 * Get faculty workload details
 * @param {string} facultyId - Faculty ID
 * @returns {Promise<Object>} Workload details
 */
export async function getFacultyWorkload(facultyId) {
  try {
    return await api.get(`${FACULTY_ENDPOINTS.WORKLOAD}${facultyId}`);
  } catch (error) {
    console.error('[facultyService] Failed to fetch workload:', error);
    throw error;
  }
}

/**
 * Update faculty workload allocation
 * @param {string} facultyId - Faculty ID
 * @param {Object} workloadData - Workload allocation data
 * @returns {Promise<Object>} Updated workload
 */
export async function updateFacultyWorkload(facultyId, workloadData) {
  try {
    return await api.put(`${FACULTY_ENDPOINTS.WORKLOAD}${facultyId}`, workloadData);
  } catch (error) {
    console.error('[facultyService] Failed to update workload:', error);
    throw error;
  }
}

// Faculty form data structure for frontend use
export const FACULTY_FORM_STRUCTURE = {
  // Basic Information
  basicInfo: {
    name: '',
    designation: '',
    department: 'CSE',
    email: '',
    facultyId: '',
    activeStatus: true,
  },
  // UG Theory Allocations
  ugTheory: [
    { courseCode: '', courseName: '', year: '', section: '', hours: 0 },
    { courseCode: '', courseName: '', year: '', section: '', hours: 0 },
  ],
  // Lab Allocations
  labs: [
    { courseCode: '', courseName: '', year: '', section: '', hours: 0 },
    { courseCode: '', courseName: '', year: '', section: '', hours: 0 },
  ],
  // PG / Honours / Minor
  pgHonoursMinor: [],
  // Others
  others: { name: '', hours: 1 },
  // Other Responsibilities
  responsibilities: [],
};

// Validation rules
export const FACULTY_VALIDATION = {
  basicInfo: {
    name: { required: true, minLength: 2, maxLength: 100 },
    designation: { required: true, minLength: 2, maxLength: 100 },
    department: { required: true },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    facultyId: { required: true, minLength: 2, maxLength: 20 },
  },
  ugTheory: {
    hours: { min: 0, max: 10 },
  },
  labs: {
    hours: { min: 0, max: 10 },
  },
  others: {
    hours: { min: 1, max: 3 },
  },
  responsibilities: {
    hours: { min: 1, max: 6 },
  },
};

export const facultyService = {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultyWorkload,
  updateFacultyWorkload,
  FACULTY_FORM_STRUCTURE,
  FACULTY_VALIDATION,
};

export default facultyService;