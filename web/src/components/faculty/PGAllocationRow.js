import React from 'react';
import Input from '../common/Input';
import Badge from '../common/Badge';
import { STANDARD_ALLOCATIONS } from '../../constants/responsibilityMaster';

export default function PGAllocationRow({
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
      [field]: value,
    });
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '130px 1.5fr 150px 130px 42px',
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
        placeholder="e.g. 22CPB05"
        value={item.courseCode || ''}
        onChange={(e) => handleFieldChange('courseCode', e.target.value)}
        error={error.courseCode}
      />

      <Input
        label={index === 0 ? 'PG / Honours / Minor Title *' : undefined}
        placeholder="e.g. Advanced Distributed Systems"
        value={item.courseName || ''}
        onChange={(e) => handleFieldChange('courseName', e.target.value)}
        error={error.courseName}
        required
      />

      <div className="ui-form-group">
        {index === 0 && <label className="ui-label">Allocation</label>}
        <input
          list="pg-allocation-datalist"
          className="ui-input"
          placeholder="e.g. PG I Year"
          value={item.allocation || ''}
          onChange={(e) => handleFieldChange('allocation', e.target.value)}
        />
        <datalist id="pg-allocation-datalist">
          {STANDARD_ALLOCATIONS.map((alloc) => (
            <option key={alloc} value={alloc} />
          ))}
        </datalist>
      </div>

      <div className="ui-form-group">
        {index === 0 && <label className="ui-label">Equivalent Load</label>}
        <div
          style={{
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--color-surface-container-low)',
            padding: '0 10px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-outline-variant)',
            fontSize: '0.8125rem',
            color: 'var(--color-on-surface-variant)',
          }}
        >
          <Badge variant="secondary">1 hr/wk</Badge>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Norm</span>
        </div>
      </div>

      <div style={{ paddingTop: index === 0 ? '24px' : '2px', display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={!isRemovable}
          title="Remove PG course"
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
