import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { loveMessageApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

function formatFull(iso) {
  return new Date(iso).toLocaleString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export default function MessageDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxItem, setLightboxItem] = useState(null)
  const [togglingPrivacy, setTogglingPrivacy] = useState(false)

  useEffect(() => {
    loveMessageApi.getById(id)
      .then(res => {
        setMessage(res.data)
        // Tự động đánh dấu đã đọc khi người nhận mở
        const isMe = user && (res.data.senderId === user.userId || res.data.senderUsername === user.username)
        if (!res.data.isRead && !isMe) {
          loveMessageApi.markRead(id).catch(() => {})
        }
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id, user])

  if (loading) return (
    <div className="main-content">
      <div className="loading">
        <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
      </div>
    </div>
  )

  if (!message) return null

  const isMe = user && message && (message.senderId === user.userId || message.senderUsername === user.username)

  const handleTogglePrivacy = async () => {
    if (togglingPrivacy || !message) return
    setTogglingPrivacy(true)
    const newIsPublic = !message.isPublic
    try {
      await loveMessageApi.togglePrivacy(message.id, newIsPublic)
      setMessage(prev => ({ ...prev, isPublic: newIsPublic }))
    } catch (err) {
      console.error(err)
    } finally {
      setTogglingPrivacy(false)
    }
  }

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
              <span className="card-sender-badge" style={{ marginBottom: 6, display: 'inline-block' }}>
                {message.senderUsername === 'wuy' ? '👦 wuy' : message.senderUsername === 'klinh' ? '👧 klinh' : `💌 ${message.senderUsername || 'Người ấy'}`}
              </span>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>🕐 {formatFull(message.sentAt)}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {isMe ? (
                <button
                  type="button"
                  className={`badge badge-interactive ${message.isPublic ? 'badge-public' : 'badge-private'}`}
                  onClick={handleTogglePrivacy}
                  disabled={togglingPrivacy}
                  title={message.isPublic ? 'Đang công khai. Bấm để chuyển sang Riêng tư' : 'Đang riêng tư. Bấm để chuyển sang Công khai'}
                >
                  {togglingPrivacy ? '⏳' : message.isPublic ? '🔓 Công khai' : '🔒 Riêng tư'}
                </button>
              ) : (
                !message.isPublic && (
                  <span className="badge badge-private">🔒 Riêng tư</span>
                )
              )}
              {message.isRead
                ? <span className="badge badge-read">✓ Đã xem — {message.readAt ? formatFull(message.readAt) : ''}</span>
                : <span className="badge badge-unread">💌 Chưa xem</span>
              }
            </div>
          </div>
        </div>

        {/* Content */}
        {message.content && message.content.trim() !== '' && message.content !== '💌 (Đã gửi đính kèm)' && (
          <p className="detail-content">{message.content}</p>
        )}

        {/* Attachments */}
        {message.attachments?.length > 0 && (
          <>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: 24, marginBottom: 12 }}>
              📎 {message.attachments.length} tệp đính kèm
            </p>
            <div className="detail-attachments">
              {message.attachments.map(att => {
                const isVideo = att.fileType === 'video' || (att.fileUrl && /\.(mp4|webm|mov|mkv)$/i.test(att.fileUrl))
                return (
                  <div
                    key={att.id}
                    className={`detail-attachment-item ${isVideo ? 'is-video' : ''}`}
                    onClick={() => setLightboxItem({ url: att.fileUrl, isVideo, title: att.originalFileName })}
                  >
                    {isVideo ? (
                      <>
                        <video
                          src={att.fileUrl}
                          className="detail-attachment-media"
                          muted
                          playsInline
                          preload="metadata"
                          onLoadedMetadata={e => { e.target.currentTime = 0.5 }}
                        />
                        <span className="video-play-overlay">▶</span>
                      </>
                    ) : (
                      <img
                        src={att.fileUrl}
                        alt={att.originalFileName || 'ảnh'}
                        className="detail-attachment-media"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {lightboxItem && (
        <div className="lightbox" onClick={() => setLightboxItem(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxItem(null)}>✕</button>
            {lightboxItem.isVideo ? (
              <video src={lightboxItem.url} controls autoPlay className="lightbox-media" />
            ) : (
              <img src={lightboxItem.url} alt={lightboxItem.title || 'Xem ảnh'} className="lightbox-media" />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
