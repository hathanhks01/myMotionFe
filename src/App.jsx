import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import TimelinePage from './pages/TimelinePage'
import ComposePage from './pages/ComposePage'
import MessageDetailPage from './pages/MessageDetailPage'
import LoginPage from './pages/LoginPage'
import SecretRegisterPage from './pages/SecretRegisterPage'
import Mascot from './components/Mascot'
import BackgroundMusic from './components/BackgroundMusic'

function AppLayout() {
  const { isAuthenticated, loading } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        {/* Trang đăng nhập — nếu đã đăng nhập thì redirect về home */}
        <Route
          path="/login"
          element={
            !loading && isAuthenticated
              ? <Navigate to="/" replace />
              : <LoginPage />
          }
        />

        {/* Trang đăng ký ẩn (chỉ ai có link trực tiếp mới vào được) */}
        <Route
          path="/secret-register"
          element={
            !loading && isAuthenticated
              ? <Navigate to="/" replace />
              : <SecretRegisterPage />
          }
        />

        {/* Các trang bảo vệ */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="app-layout">
                <Sidebar />
                <Routes>
                  <Route path="/"            element={<TimelinePage />} />
                  <Route path="/compose"     element={<ComposePage />} />
                  <Route path="/message/:id" element={<MessageDetailPage />} />
                </Routes>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Trình phát nhạc nền lãng mạn */}
      <BackgroundMusic />

      {/* Interactive Mascot - appears on all pages */}
      <Mascot />
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  )
}
