import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loveMessageApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

/** Format datetime đẹp tiếng Việt */
function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

export default function MessageCard({ message, onDelete, onMarkRead, onTogglePrivacy }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [lightboxItem, setLightboxItem] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingPrivacy, setTogglingPrivacy] = useState(false)

  const isMe = user && (message.senderId === user.userId || message.senderUsername === user.username)

  const handleTogglePrivacy = async (e) => {
    e.stopPropagation()
    if (togglingPrivacy) return
    setTogglingPrivacy(true)
    const newIsPublic = !message.isPublic
    try {
      await loveMessageApi.togglePrivacy(message.id, newIsPublic)
      if (onTogglePrivacy) onTogglePrivacy(message.id, newIsPublic)
    } catch (err) {
      console.error(err)
    } finally {
      setTogglingPrivacy(false)
    }
  }

  const handleMarkRead = async (e) => {
    e.stopPropagation()
    try {
      await loveMessageApi.markRead(message.id)
      onMarkRead(message.id)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!window.confirm('Xóa lời nhắn này?')) return
    setDeleting(true)
    try {
      await loveMessageApi.delete(message.id)
      onDelete(message.id)
    } catch (err) {
      console.error(err)
      setDeleting(false)
    }
  }

  return (
    <>
      <div
        className={`message-card${!message.isRead && !isMe ? ' unread' : ''}`}
        onClick={() => navigate(`/message/${message.id}`)}
        style={{ cursor: 'pointer' }}
      >
        <div className="card-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Sender Tag */}
            <span className="card-sender-badge">
              {message.senderUsername === 'wuy' ? '👦 wuy' : message.senderUsername === 'klinh' ? '👧 klinh' : `💌 ${message.senderUsername || 'Người ấy'}`}
            </span>
            <span className="card-time">
              🕐 {formatTime(message.sentAt)}
            </span>
          </div>

          <div className="card-badges">
            {/* Trạng thái Công khai / Riêng tư (Người gửi có thể bấm vào để đổi nhanh) */}
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
                <span className="badge badge-private" title="Chỉ người viết xem được">
                  🔒 Riêng tư
                </span>
              )
            )}

            {message.isRead
              ? <span className="badge badge-read">✓ Đã xem</span>
              : <span className="badge badge-unread">💌 Chưa xem</span>
            }
            {message.attachments?.length > 0 && (
              <span className="badge" style={{ background: 'rgba(255,209,220,0.5)', color: 'var(--rose)' }}>
                📎 {message.attachments.length} đính kèm
              </span>
            )}
          </div>
        </div>

        {message.content && message.content.trim() !== '' && message.content !== '💌 (Đã gửi đính kèm)' && (
          <p className="card-content" style={{
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {message.content}
          </p>
        )}

        {message.attachments?.length > 0 && (
          <div className="attachments-grid">
            {message.attachments.slice(0, 4).map(att => {
              const isVideo = att.fileType === 'video' || (att.fileUrl && /\.(mp4|webm|mov|mkv)$/i.test(att.fileUrl))
              return (
                <div
                  key={att.id}
                  className={`attachment-thumb-wrap ${isVideo ? 'is-video' : ''}`}
                  onClick={e => {
                    e.stopPropagation()
                    setLightboxItem({ url: att.fileUrl, isVideo, title: att.originalFileName })
                  }}
                >
                  {isVideo ? (
                    <>
                      <video
                        src={att.fileUrl}
                        className="attachment-thumb-media"
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
                      className="attachment-thumb-media"
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="card-actions" onClick={e => e.stopPropagation()}>
          {!message.isRead && !isMe && (
            <button className="btn-action" onClick={handleMarkRead}>
              👁 Đánh dấu đã đọc
            </button>
          )}
          {isMe && (
            <>
              <button
                className="btn-action"
                onClick={handleTogglePrivacy}
                disabled={togglingPrivacy}
                title={message.isPublic ? 'Chuyển sang chỉ mình bạn xem được' : 'Chuyển sang để đối phương cùng xem'}
              >
                {togglingPrivacy ? '⏳ Đang đổi...' : message.isPublic ? '🔒 Đặt riêng tư' : '🔓 Đặt công khai'}
              </button>
              <button
                className="btn-action danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                🗑 {deleting ? '...' : 'Xóa'}
              </button>
            </>
          )}
        </div>
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
    </>
  )
}
