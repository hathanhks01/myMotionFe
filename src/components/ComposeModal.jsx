import { useState } from 'react'
import { loveMessageApi } from '../services/api'

export default function ComposeModal({ onClose, onSuccess }) {
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!content.trim()) return
    setSending(true)
    try {
      await loveMessageApi.create({ content: content.trim() })
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      setSending(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">Viết lời yêu thương 💌</h2>
          <button className="btn-close" onClick={onClose} aria-label="Đóng">✕</button>
        </div>

        <textarea
          autoFocus
          placeholder="Hôm nay tôi muốn nói với em rằng..."
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend()
          }}
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: 6 }}>
          Ctrl + Enter để gửi
        </p>

        <div className="modal-footer">
          <button
            id="btn-send-message"
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
