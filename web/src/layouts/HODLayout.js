import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import PageContainer from '../components/layout/PageContainer';
import { clearAuthSession } from '../services/api';

export default function HODLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <Sidebar
        role="HOD"
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      <div className="app-main-layout">
        <Topbar
          user={{
            name: 'Dr. T. Rajasekaran',
            role: 'Head of Department (L1 Authority)',
            department: 'Computer Science and Engineering',
          }}
          onLogout={handleLogout}
        />
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}
