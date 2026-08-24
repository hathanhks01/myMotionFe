import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Các trái tim nổi bay background
const HEARTS = ['💗', '💕', '💖', '💓', '🌸', '✨', '💌', '🌹']

export default function LoginPage() {
  const navigate  = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [shake,    setShake]    = useState(false)

  const usernameRef = useRef(null)
  useEffect(() => { usernameRef.current?.focus() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password) return

    setLoading(true)
    setError('')
    try {
      await login(username.trim(), password)
      navigate('/', { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng.'
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

      {/* Card */}
      <div className={`login-card${shake ? ' login-shake' : ''}`}>
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">💗</div>
          <h1 className="login-title">myMotion</h1>
          <p className="login-subtitle">Góc nhỏ yêu thương của chúng mình 🌸</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Username */}
          <div className="login-field">
            <label htmlFor="login-username" className="login-label">
              Tên đăng nhập
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon">👤</span>
              <input
                id="login-username"
                ref={usernameRef}
                type="text"
                className="login-input"
                placeholder="username của bạn..."
                value={username}
                onChange={e => { setUsername(e.target.value); setError('') }}
                autoComplete="username"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label htmlFor="login-password" className="login-label">
              Mật khẩu
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon">🔑</span>
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                className="login-input"
                placeholder="••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                autoComplete="current-password"
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

          {/* Error */}
          {error && (
            <div className="login-error" role="alert">
              ❌ {error}
            </div>
          )}

          {/* Submit */}
          <button
            id="btn-login-submit"
            type="submit"
            className="login-btn"
            disabled={loading || !username.trim() || !password}
          >
            {loading
              ? <span className="login-btn-loading"><span className="login-spinner" />Đang vào...</span>
              : '💕 Vào rồi nào'}
          </button>
        </form>

        <p className="login-footer-note">
          Chỉ dành cho hai người đặc biệt 🌹
        </p>
      </div>
    </div>
  )
}
