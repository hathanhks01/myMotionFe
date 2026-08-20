import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loveMessageApi } from '../services/api'

/** Format datetime đẹp tiếng Việt */
function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

export default function MessageCard({ message, onDelete, onMarkRead }) {
  const navigate = useNavigate()
  const [lightbox, setLightbox] = useState(null)
  const [deleting, setDeleting] = useState(false)

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
        className={`message-card${!message.isRead ? ' unread' : ''}`}
        onClick={() => navigate(`/message/${message.id}`)}
        style={{ cursor: 'pointer' }}
      >
        <div className="card-meta">
          <span className="card-time">
            🕐 {formatTime(message.sentAt)}
          </span>
          <div className="card-badges">
            {message.isRead
              ? <span className="badge badge-read">✓ Đã xem</span>
              : <span className="badge badge-unread">💌 Chưa xem</span>
            }
            {message.attachments?.length > 0 && (
              <span className="badge" style={{ background: 'rgba(255,209,220,0.5)', color: 'var(--rose)' }}>
                🖼 {message.attachments.length}
              </span>
            )}
          </div>
        </div>

        <p className="card-content" style={{
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {message.content}
        </p>

        {message.attachments?.length > 0 && (
          <div className="attachments-grid">
            {message.attachments.slice(0, 4).map(att => (
              <img
                key={att.id}
                src={att.fileUrl}
                alt={att.originalFileName || 'ảnh'}
                className="attachment-thumb"
                onClick={e => { e.stopPropagation(); setLightbox(att.fileUrl) }}
              />
            ))}
          </div>
        )}

        <div className="card-actions" onClick={e => e.stopPropagation()}>
          {!message.isRead && (
            <button className="btn-action" onClick={handleMarkRead}>
              👁 Đánh dấu đã đọc
            </button>
          )}
          <button
            className="btn-action danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            🗑 {deleting ? '...' : 'Xóa'}
          </button>
        </div>
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Xem ảnh" />
        </div>
      )}
    </>
  )
}
