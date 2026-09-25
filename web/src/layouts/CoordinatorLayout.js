import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import PageContainer from '../components/layout/PageContainer';
import { clearAuthSession } from '../services/api';

export default function CoordinatorLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <Sidebar
        role="AC"
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      <div className="app-main-layout">
        <Topbar
          user={{
            name: 'Mr. R. Manikandan',
            role: 'Academic Coordinator (L2)',
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
