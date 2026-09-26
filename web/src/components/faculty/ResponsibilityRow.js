import React from 'react';
import Input from '../common/Input';
import {
  RESPONSIBILITY_CATEGORIES,
  STANDARD_ALLOCATIONS,
} from '../../constants/responsibilityMaster';

export default function ResponsibilityRow({
  item,
  index,
  onChange,
  onRemove,
  selectedRoles = [],
  isRemovable = true,
  error = {},
}) {
  const handleFieldChange = (field, value) => {
    onChange(index, {
      ...item,
      [field]: field === 'hours' ? (value === '' ? '' : Number(value)) : value,
    });
  };

  const hoursNum = typeof item.hours === 'number' ? item.hours : Number(item.hours);
  const isOutOfRange = item.hours !== '' && (hoursNum < 1 || hoursNum > 6 || isNaN(hoursNum));

  // Current role is allowed, but other already-selected roles should be disabled
  const isRoleDisabled = (role) => {
    return role !== item.role && selectedRoles.includes(role.toLowerCase().trim());
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.6fr 130px 140px 42px',
        gap: '12px',
        alignItems: 'start',
        padding: '12px 14px',
        backgroundColor: 'var(--color-surface-container-lowest)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '10px',
      }}
    >
      <div className="ui-form-group">
        {index === 0 && (
          <label className="ui-label">
            Responsibility Role (38 Master Roles) <span style={{ color: 'var(--color-error)' }}>*</span>
          </label>
        )}
        <select
          className={`ui-select ${error.role ? 'ui-input-error' : ''}`}
          value={item.role || ''}
          onChange={(e) => handleFieldChange('role', e.target.value)}
          required
        >
          <option value="">Select institutional responsibility...</option>
          {Object.entries(RESPONSIBILITY_CATEGORIES).map(([category, roles]) => (
            <optgroup key={category} label={`── ${category} ──`}>
              {roles.map((r) => {
                const disabled = isRoleDisabled(r);
                return (
                  <option key={r} value={r} disabled={disabled}>
                    {r} {disabled ? '(already assigned)' : ''}
                  </option>
                );
              })}
            </optgroup>
          ))}
        </select>
        {error.role && <span className="ui-form-error">{error.role}</span>}
      </div>

      <Input
        label={index === 0 ? 'Hrs/Wk (1–6) *' : undefined}
        type="number"
        min="1"
        max="6"
        step="1"
        placeholder="2"
        value={item.hours !== undefined && item.hours !== null ? item.hours : 2}
        onChange={(e) => handleFieldChange('hours', e.target.value)}
        error={error.hours || (isOutOfRange ? 'Must be 1–6 hrs' : null)}
        helperText="Strict limit: 1 to 6 hrs"
        required
      />

      <div className="ui-form-group">
        {index === 0 && <label className="ui-label">Allocation / Scope</label>}
        <input
          list="resp-allocation-datalist"
          className="ui-input"
          placeholder="e.g. UG III Year A / Dept"
          value={item.allocation || ''}
          onChange={(e) => handleFieldChange('allocation', e.target.value)}
        />
        <datalist id="resp-allocation-datalist">
          {STANDARD_ALLOCATIONS.map((alloc) => (
            <option key={alloc} value={alloc} />
          ))}
        </datalist>
      </div>

      <div style={{ paddingTop: index === 0 ? '24px' : '2px', display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={!isRemovable}
          title="Remove responsibility"
          style={{
            background: 'none',
            border: 'none',
            color: isRemovable ? 'var(--color-error)' : 'var(--color-outline-variant)',
            cursor: isRemovable ? 'pointer' : 'not-allowed',
            fontSize: '18px',
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
