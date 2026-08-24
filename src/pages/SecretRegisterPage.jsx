import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const HEARTS = ['💗', '💕', '💖', '💓', '🌸', '✨', '💌', '🌹']

export default function SecretRegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    phoneNumber: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [shake, setShake] = useState(false)

  const fullNameRef = useRef(null)
  useEffect(() => {
    fullNameRef.current?.focus()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { username, fullName, password, confirmPassword, birthDate, phoneNumber } = formData

    if (!fullName.trim()) {
      setError('Vui lòng nhập Họ và tên của bạn.')
      return
    }

    if (!username.trim()) {
      setError('Vui lòng nhập Tên đăng nhập.')
      return
    }

    if (username.trim().length < 3) {
      setError('Tên đăng nhập phải có ít nhất 3 ký tự.')
      return
    }

    if (!password) {
      setError('Vui lòng nhập Mật khẩu.')
      return
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.')
      return
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await register({
        username: username.trim().toLowerCase(),
        fullName: fullName.trim(),
        password,
        birthDate: birthDate ? new Date(birthDate).toISOString() : null,
        phoneNumber: phoneNumber.trim() || null,
      })

      // Đăng ký thành công -> Vào thẳng trang chính hoặc ghép đôi
      navigate('/', { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Không thể tạo tài khoản. Vui lòng thử lại sau.'
      setError(msg)
      setShake(true)
      setTimeout(() => setShake(false), 600)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Floating hearts background */}
      <div className="login-hearts" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="floating-heart"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
              fontSize: `${0.8 + Math.random() * 1.4}rem`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          >
            {HEARTS[i % HEARTS.length]}
          </span>
        ))}
      </div>

      {/* Register Card */}
      <div className={`login-card matching-card${shake ? ' login-shake' : ''}`} style={{ maxWidth: 480 }}>
        {/* Logo */}
        <div className="login-logo" style={{ marginBottom: 20 }}>
          <div className="login-logo-icon">✨</div>
          <h1 className="login-title" style={{ fontSize: '1.8rem' }}>Đăng Ký Thành Viên</h1>
          <p className="login-subtitle">Tạo tài khoản đặc biệt tham gia myMotion 🌸</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Full Name */}
          <div className="login-field">
            <label htmlFor="reg-fullname" className="login-label">
              Họ và tên <span style={{ color: 'var(--rose)' }}>*</span>
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon">🌸</span>
              <input
                id="reg-fullname"
                ref={fullNameRef}
                name="fullName"
                type="text"
                className="login-input"
                placeholder="Ví dụ: Nguyễn Khánh Linh..."
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Username */}
          <div className="login-field">
            <label htmlFor="reg-username" className="login-label">
              Tên đăng nhập <span style={{ color: 'var(--rose)' }}>*</span>
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon">👤</span>
              <input
                id="reg-username"
                name="username"
                type="text"
                className="login-input"
                placeholder="klinh, wuy..."
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                disabled={loading}
              />
            </div>
          </div>

          {/* BirthDate */}
          <div className="login-field">
            <label htmlFor="reg-birthdate" className="login-label">
              Ngày sinh / Ngày kỷ niệm 🎂
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon">📅</span>
              <input
                id="reg-birthdate"
                name="birthDate"
                type="date"
                className="login-input"
                value={formData.birthDate}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="login-field">
            <label htmlFor="reg-phone" className="login-label">
              Số điện thoại 📱
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon">📞</span>
              <input
                id="reg-phone"
                name="phoneNumber"
                type="tel"
                className="login-input"
                placeholder="0912 xxx xxx..."
                value={formData.phoneNumber}
                onChange={handleChange}
                autoComplete="tel"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label htmlFor="reg-password" className="login-label">
              Mật khẩu <span style={{ color: 'var(--rose)' }}>*</span>
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon">🔑</span>
              <input
                id="reg-password"
                name="password"
                type={showPass ? 'text' : 'password'}
                className="login-input"
                placeholder="Tối thiểu 6 ký tự..."
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={loading}
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPass(p => !p)}
                tabIndex={-1}
                aria-label={showPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="login-field">
            <label htmlFor="reg-confirm-password" className="login-label">
              Nhập lại mật khẩu <span style={{ color: 'var(--rose)' }}>*</span>
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon">🔒</span>
              <input
                id="reg-confirm-password"
                name="confirmPassword"
                type={showPass ? 'text' : 'password'}
                className="login-input"
                placeholder="Nhập lại mật khẩu..."
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={loading}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error" role="alert">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            id="btn-register-submit"
            type="submit"
            className="login-btn"
            disabled={loading || !formData.username.trim() || !formData.password || !formData.fullName.trim()}
            style={{ marginTop: 8 }}
          >
            {loading ? (
              <span className="login-btn-loading">
                <span className="login-spinner" /> Đang tạo tài khoản...
              </span>
            ) : (
              '💖 Đăng ký tài khoản'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <Link
            to="/login"
            style={{
              fontSize: '0.82rem',
              color: 'var(--rose)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            ← Đã có tài khoản? Đăng nhập ngay
          </Link>
        </div>

        <p className="login-footer-note" style={{ marginTop: 16 }}>
          Link đăng ký bảo mật riêng tư 🔒
        </p>
      </div>
    </div>
  )
}
