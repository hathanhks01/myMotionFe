import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/', icon: '💌', label: 'Lời nhắn hàng ngày' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">💗</span>
        <h1>myMotion</h1>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {/* User info + partner tag */}
        {user && (
          <div className="sidebar-user-block">
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">
                {user.username === 'wuy' ? '👦' : '👧'}
              </div>
              <div className="sidebar-user-meta">
                <span className="sidebar-user-name">{user.username}</span>
                <span className="sidebar-user-code">Mã: {user.userCode}</span>
              </div>
              <button
                className="sidebar-logout-btn"
                onClick={logout}
                title="Đăng xuất"
              >
                Thoát
              </button>
            </div>

            {user.partnerUsername && (
              <div className="sidebar-partner-pill">
                <span>💕 Đã ghép đôi với <strong>{user.partnerUsername}</strong></span>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
