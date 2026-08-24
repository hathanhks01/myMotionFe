import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import MatchingPage from '../pages/MatchingPage'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isMatched, loading } = useAuth()

  // Đang kiểm tra session từ localStorage → chờ
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'var(--font-script)',
        fontSize: '1.5rem',
        color: 'var(--rose)',
      }}>
        💗 Đang tải...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Nếu đã đăng nhập nhưng chưa ghép đôi với ai → hiện giao diện nhập UserCode
  if (!isMatched) {
    return <MatchingPage />
  }

  return children
}
