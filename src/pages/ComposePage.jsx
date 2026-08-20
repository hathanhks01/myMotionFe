import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loveMessageApi } from '../services/api'

export default function ComposePage() {
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSend = async () => {
    if (!content.trim()) return
    setSending(true)
    try {
      await loveMessageApi.create({ content: content.trim() })
      setSent(true)
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      console.error(err)
      setSending(false)
    }
  }

  if (sent) return (
    <div className="main-content">
      <div className="empty-state" style={{ paddingTop: '120px' }}>
        <div className="empty-icon" style={{ animation: 'heartbeat 1s ease-in-out 3' }}>💌</div>
        <h3>Lời nhắn đã được gửi!</h3>
        <p>Đang quay lại trang chính...</p>
      </div>
    </div>
  )

  return (
    <div className="main-content">
      <div className="page-header">
        <h2>Viết lời yêu thương ✍️</h2>
        <p>Hôm nay bạn muốn nói gì với người ấy?</p>
      </div>

      <div className="detail-card">
        <p style={{
          fontFamily: 'var(--font-script)',
          fontSize: '1.1rem',
          color: 'var(--rose)',
          marginBottom: 16
        }}>
          Gửi người đặc biệt của tôi... 💕
        </p>

        <textarea
          id="compose-textarea"
          autoFocus
          placeholder="Hôm nay tôi muốn nói với em rằng..."
          value={content}
          onChange={e => setContent(e.target.value)}
          style={{
            width: '100%',
            minHeight: '260px',
            border: '1.5px solid var(--glass-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            lineHeight: 1.75,
            color: 'var(--text-dark)',
            background: 'rgba(255,255,255,0.7)',
            resize: 'vertical',
            outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--rose)'}
          onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
            {content.length} ký tự
          </p>
          <button
            id="btn-compose-send"
            className="btn-primary"
            onClick={handleSend}
            disabled={sending || !content.trim()}
          >
            {sending ? '⏳ Đang gửi...' : '💕 Gửi đi'}
          </button>
        </div>
      </div>
    </div>
  )
}
