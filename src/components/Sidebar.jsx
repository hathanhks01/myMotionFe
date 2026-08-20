import { NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/',        icon: '💌', label: 'Lời nhắn hằng ngày' },
  { to: '/compose', icon: '✍️', label: 'Viết lời nhắn' },
]

export default function Sidebar() {
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
        <p>Gửi đến người đặc biệt của tôi 🌸</p>
        <p style={{ marginTop: 4 }}>mỗi ngày một lời yêu</p>
      </div>
    </aside>
  )
}
