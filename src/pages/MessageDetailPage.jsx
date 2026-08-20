import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { loveMessageApi } from '../services/api'

function formatFull(iso) {
  return new Date(iso).toLocaleString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export default function MessageDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    loveMessageApi.getById(id)
      .then(res => {
        setMessage(res.data)
        // Tự động đánh dấu đã đọc khi mở
        if (!res.data.isRead) {
          loveMessageApi.markRead(id).catch(() => {})
        }
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="main-content">
      <div className="loading">
        <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
      </div>
    </div>
  )

  if (!message) return null

  return (
    <div className="main-content">
      <button className="detail-back" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="detail-card">
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--pink-100)', paddingBottom: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>🕐 {formatFull(message.sentAt)}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {message.isRead
                ? <span className="badge badge-read">✓ Đã xem — {message.readAt ? formatFull(message.readAt) : ''}</span>
                : <span className="badge badge-unread">💌 Chưa xem</span>
              }
            </div>
          </div>
        </div>

        {/* Content */}
        <p className="detail-content">{message.content}</p>

        {/* Attachments */}
        {message.attachments?.length > 0 && (
          <>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: 24, marginBottom: 12 }}>
              🖼 {message.attachments.length} ảnh đính kèm
            </p>
            <div className="detail-attachments">
              {message.attachments.map(att => (
                <img
                  key={att.id}
                  src={att.fileUrl}
                  alt={att.originalFileName || 'ảnh'}
                  onClick={() => setLightbox(att.fileUrl)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Xem ảnh" />
        </div>
      )}
    </div>
  )
}
