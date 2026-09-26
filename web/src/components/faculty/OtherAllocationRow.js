import React from 'react';
import Input from '../common/Input';
import { STANDARD_ALLOCATIONS } from '../../constants/responsibilityMaster';

export default function OtherAllocationRow({
  item,
  index,
  onChange,
  onRemove,
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
  const isOutOfRange = item.hours !== '' && (hoursNum < 1 || hoursNum > 3 || isNaN(hoursNum));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 150px 140px 42px',
        gap: '12px',
        alignItems: 'start',
        padding: '12px 14px',
        backgroundColor: 'var(--color-surface-container-lowest)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '10px',
      }}
    >
      <Input
        label={index === 0 ? 'Academic Activity / Course Title *' : undefined}
        placeholder="e.g. Project Based Learning (PBL) / Mini Project"
        value={item.courseName || ''}
        onChange={(e) => handleFieldChange('courseName', e.target.value)}
        error={error.courseName}
        required
      />

      <div className="ui-form-group">
        {index === 0 && <label className="ui-label">Allocation / Section</label>}
        <input
          list="other-allocation-datalist"
          className="ui-input"
          placeholder="e.g. UG II Year A"
          value={item.allocation || ''}
          onChange={(e) => handleFieldChange('allocation', e.target.value)}
        />
        <datalist id="other-allocation-datalist">
          {STANDARD_ALLOCATIONS.map((alloc) => (
            <option key={alloc} value={alloc} />
          ))}
        </datalist>
      </div>

      <Input
        label={index === 0 ? 'Hrs/Week (1–3) *' : undefined}
        type="number"
        min="1"
        max="3"
        step="1"
        placeholder="2"
        value={item.hours !== undefined && item.hours !== null ? item.hours : 2}
        onChange={(e) => handleFieldChange('hours', e.target.value)}
        error={error.hours || (isOutOfRange ? 'Must be between 1 and 3 hrs' : null)}
        helperText="Strict limit: 1 to 3 hours/week"
        required
      />

      <div style={{ paddingTop: index === 0 ? '24px' : '2px', display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={!isRemovable}
          title="Remove other academic allocation"
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
