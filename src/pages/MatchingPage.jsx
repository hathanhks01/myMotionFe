import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function MatchingPage() {
  const { user, matchPartner, logout } = useAuth()

  const [partnerCode, setPartnerCode] = useState('')
  const [matchedDate, setMatchedDate] = useState('2026-08-17T16:00')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCopyCode = () => {
    if (!user?.userCode) return
    navigator.clipboard.writeText(user.userCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleMatch = async (e) => {
    e.preventDefault()
    if (!partnerCode.trim()) {
      setError('Vui lòng nhập mã của người ấy nhé!')
      return
    }

    setLoading(true)
    setError('')
    try {
      const dateIso = matchedDate ? new Date(matchedDate).toISOString() : new Date().toISOString()
      await matchPartner(partnerCode.trim(), dateIso)
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể kết nối. Vui lòng kiểm tra lại mã!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card matching-card">
        <div className="login-logo">
          <div className="login-logo-icon">🔗</div>
          <h1 className="login-title">Kết nối tình yêu</h1>
          <p className="login-subtitle">
            Xin chào <strong>{user?.username}</strong>! Hãy ghép đôi với người ấy để cùng viết lời nhắn nhé 🌸
          </p>
        </div>

        {/* My UserCode Box */}
        <div className="matching-my-code-box">
          <span className="matching-code-label">MÃ KẾT NỐI CỦA BẠN:</span>
          <div className="matching-code-display">
            <span className="matching-code-text">{user?.userCode || '---'}</span>
            <button
              type="button"
              className="matching-copy-btn"
              onClick={handleCopyCode}
              title="Sao chép mã"
            >
              {copied ? '✓ Đã chép' : '📋 Chép mã'}
            </button>
          </div>
          <p className="matching-code-hint">Gửi mã này cho người yêu của bạn để kết nối 💕</p>
        </div>

        <div className="date-divider" style={{ margin: '20px 0' }}>
          <span>HOẶC</span>
        </div>

        {/* Enter Partner's Code Form */}
        <form onSubmit={handleMatch} className="login-form">
          <div className="login-field">
            <label className="login-label">Nhập mã của người ấy</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">💌</span>
              <input
                type="text"
                className="login-input"
                placeholder="Ví dụ: KL1234..."
                value={partnerCode}
                onChange={e => { setPartnerCode(e.target.value); setError('') }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Ngày hai bạn bắt đầu yêu nhau</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">🗓️</span>
              <input
                type="datetime-local"
                className="login-input"
                value={matchedDate}
                onChange={e => setMatchedDate(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="login-error" role="alert">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={loading || !partnerCode.trim()}
          >
            {loading ? '⏳ Đang kết nối...' : '💕 Kết nối trái tim'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={logout}
            style={{ fontSize: '0.82rem', padding: '6px 16px' }}
          >
            Đăng xuất tài khoản khác
          </button>
        </div>
      </div>
    </div>
  )
}
