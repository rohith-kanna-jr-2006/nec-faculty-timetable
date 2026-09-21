/**
 * Validation rules for Faculty Workload operations.
 */

function validateWorkloadPayload(req) {
  const errors = [];
  const { facultyId, facultyName, designation, teaching, responsibilities } = req.body || {};

  if (!facultyId || typeof facultyId !== 'string' || !facultyId.trim()) {
    errors.push('facultyId is required');
  }

  if (!facultyName || typeof facultyName !== 'string' || !facultyName.trim()) {
    errors.push('facultyName is required');
  }

  if (!designation || typeof designation !== 'string' || !designation.trim()) {
    errors.push('designation is required');
  }

  if (teaching && typeof teaching !== 'object') {
    errors.push('teaching must be an object containing teaching categories');
  } else if (teaching) {
    const validCats = ['ugTheory1', 'ugTheory2', 'lab1', 'lab2', 'pg', 'others'];
    validCats.forEach((catKey) => {
      const items = teaching[catKey];
      if (items) {
        if (!Array.isArray(items)) {
          errors.push(`teaching.${catKey} must be an array`);
        } else {
          items.forEach((item, idx) => {
            if (!item.courseName || !item.courseName.trim()) {
              errors.push(`Missing courseName in ${catKey} row ${idx + 1}`);
            }
            if (typeof item.hours !== 'number' || item.hours < 0) {
              errors.push(`Invalid hours in ${catKey} row ${idx + 1}`);
            }
          });
        }
      }
    });
  }

  if (responsibilities && !Array.isArray(responsibilities)) {
    errors.push('responsibilities must be an array');
  } else if (responsibilities) {
    responsibilities.forEach((resp, idx) => {
      if (!resp.role || !resp.role.trim()) {
        errors.push(`Missing role in responsibility row ${idx + 1}`);
      }
      if (typeof resp.hours !== 'number' || resp.hours < 0) {
        errors.push(`Invalid hours in responsibility row ${idx + 1}`);
      }
    });
  }

  return errors;
}

module.exports = {
  validateWorkloadPayload,
};
