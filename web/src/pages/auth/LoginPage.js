import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('faculty@nec.edu.in');
  const [password, setPassword] = useState('Password123!');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('FACULTY');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === 'HOD') {
        navigate('/hod/dashboard');
      } else if (selectedRole === 'AC') {
        navigate('/coordinator/dashboard');
      } else {
        navigate('/faculty/dashboard');
      }
    }, 600);
  };

  const handleRoleSelect = (role, demoEmail) => {
    setSelectedRole(role);
    setEmail(demoEmail);
  };

  return (
    <Card className="ui-card-hover" style={{ padding: '32px 28px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.375rem', marginBottom: '6px' }}>Portal Authentication</h2>
        <p className="text-muted text-sm">
          Sign in with your institutional credentials to access your designated authority console.
        </p>
      </div>

      {/* Role Selector Tabs for Phase 1 Demo & Testing */}
      <div style={{ marginBottom: '20px' }}>
        <label className="ui-label" style={{ marginBottom: '8px', display: 'block' }}>
          Select Authority Role (Phase 1 Sandbox)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <button
            type="button"
            className={`btn ${selectedRole === 'FACULTY' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => handleRoleSelect('FACULTY', 'faculty@nec.edu.in')}
          >
            Faculty
          </button>
          <button
            type="button"
            className={`btn ${selectedRole === 'AC' ? 'btn-secondary' : 'btn-outline'} btn-sm`}
            onClick={() => handleRoleSelect('AC', 'ac@nec.edu.in')}
          >
            Coordinator
          </button>
          <button
            type="button"
            className={`btn ${selectedRole === 'HOD' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            style={{
              backgroundColor: selectedRole === 'HOD' ? 'var(--color-primary-container)' : undefined,
              borderColor: selectedRole === 'HOD' ? 'var(--color-secondary)' : undefined,
            }}
            onClick={() => handleRoleSelect('HOD', 'hod@nec.edu.in')}
          >
            HOD Exec
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Input
          label="Institutional Email / Staff ERP ID"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="name@nec.edu.in"
          helperText="Authoritative institutional identity address"
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••••••"
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            fontSize: '0.8125rem',
          }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked />
            <span>Remember session</span>
          </label>
          <span style={{ color: 'var(--color-secondary)', cursor: 'pointer' }}>
            Reset password?
          </span>
        </div>

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
        >
          Authenticate & Enter Portal
        </Button>
      </form>

      <div
        style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid var(--color-surface-container)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
        }}
      >
        <span className="text-muted">Target Environment</span>
        <Badge variant="success" dot>
          Phase 1 Foundation
        </Badge>
      </div>
    </Card>
  );
}
