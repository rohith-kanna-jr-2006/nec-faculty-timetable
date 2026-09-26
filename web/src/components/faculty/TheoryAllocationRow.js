import React from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { STANDARD_ALLOCATIONS } from '../../constants/responsibilityMaster';

export default function TheoryAllocationRow({
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
      [field]: field === 'hours' ? (value === '' ? '' : Math.max(0, Number(value))) : value,
    });
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '130px 1.5fr 150px 110px 42px',
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
        label={index === 0 ? 'Course Code' : undefined}
        placeholder="e.g. 22CS501"
        value={item.courseCode || ''}
        onChange={(e) => handleFieldChange('courseCode', e.target.value)}
        error={error.courseCode}
      />

      <Input
        label={index === 0 ? 'Course Title *' : undefined}
        placeholder="e.g. Compiler Design"
        value={item.courseName || ''}
        onChange={(e) => handleFieldChange('courseName', e.target.value)}
        error={error.courseName}
        required
      />

      <div className="ui-form-group">
        {index === 0 && <label className="ui-label">Allocation</label>}
        <input
          list="allocation-datalist"
          className="ui-input"
          placeholder="e.g. UG III Year A"
          value={item.allocation || ''}
          onChange={(e) => handleFieldChange('allocation', e.target.value)}
        />
        <datalist id="allocation-datalist">
          {STANDARD_ALLOCATIONS.map((alloc) => (
            <option key={alloc} value={alloc} />
          ))}
        </datalist>
      </div>

      <Input
        label={index === 0 ? 'Hrs/Week' : undefined}
        type="number"
        min="0"
        max="10"
        step="1"
        placeholder="3"
        value={item.hours !== undefined && item.hours !== null ? item.hours : 3}
        onChange={(e) => handleFieldChange('hours', e.target.value)}
        error={error.hours}
      />

      <div style={{ paddingTop: index === 0 ? '24px' : '2px', display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={!isRemovable}
          title="Remove allocation"
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
