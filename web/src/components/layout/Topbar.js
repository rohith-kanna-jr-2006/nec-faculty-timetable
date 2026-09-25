import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Topbar({
  user = { name: 'Faculty Member', role: 'FACULTY', department: 'Computer Science & Engineering' },
  onLogout,
  unreadCount = 3,
}) {
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="ui-topbar">
      {/* Left: Active Academic Context */}
      <div className="ui-topbar-left">
        <div className="ui-topbar-context">
          <span className="ui-topbar-pulse-dot" />
          <span>ODD SEMESTER 2024-25</span>
          <span style={{ color: 'var(--color-outline-variant)' }}>•</span>
          <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>WEEK 11 (ACTIVE)</span>
          <span style={{ color: 'var(--color-outline-variant)' }}>•</span>
          <span className="text-muted">CSE • R2022</span>
        </div>
      </div>

      {/* Right: Quick Switcher, Notifications & Profile */}
      <div className="ui-topbar-right">
        {/* Portal Switcher for Quick Preview */}
        <div style={{ display: 'flex', gap: 6 }}>
          <NavLink
            to="/faculty/dashboard"
            className="btn btn-subtle btn-sm"
            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
          >
            Faculty
          </NavLink>
          <NavLink
            to="/coordinator/dashboard"
            className="btn btn-subtle btn-sm"
            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
          >
            Coord
          </NavLink>
          <NavLink
            to="/hod/dashboard"
            className="btn btn-subtle btn-sm"
            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
          >
            HOD
          </NavLink>
        </div>

        {/* Notifications Icon Button */}
        <button
          type="button"
          className="ui-topbar-icon-btn"
          aria-label="View notifications"
          title={`${unreadCount} unread notifications`}
        >
          <span>🔔</span>
          {unreadCount > 0 && (
            <span className="ui-topbar-notification-badge">{unreadCount}</span>
          )}
        </button>

        {/* User Profile Chip */}
        <div className="ui-topbar-user-profile">
          <div className="ui-topbar-avatar">{getInitials(user.name)}</div>
          <div className="ui-topbar-user-info">
            <span className="ui-topbar-user-name">{user.name}</span>
            <span className="ui-topbar-user-role">{user.role}</span>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="btn btn-outline btn-sm"
              style={{ padding: '2px 8px', fontSize: '0.75rem', marginLeft: 6 }}
              title="Sign Out"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
