import { useState, useEffect, useCallback } from 'react'
import { loveMessageApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import MessageCard from '../components/MessageCard'
import ComposeModal from '../components/ComposeModal'

/** Format ngày tiếng Việt */
function formatDateHeader(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}

/** Group messages by date (local) */
function groupByDate(messages) {
  const groups = {}
  for (const msg of messages) {
    const dateKey = new Date(msg.sentAt).toLocaleDateString('vi-VN')
    if (!groups[dateKey]) groups[dateKey] = { label: formatDateHeader(msg.sentAt), items: [] }
    groups[dateKey].items.push(msg)
  }
  return Object.values(groups)
}

/** Tính số ngày yêu nhau */
function getLoveDays(matchedAtIso) {
  if (!matchedAtIso) return 1
  const start = new Date(matchedAtIso)
  const now = new Date()
  const diffTime = Math.abs(now - start)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1
}

export default function TimelinePage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCompose, setShowCompose] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const pageSize = 20

  const loadMessages = useCallback(async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page
      const res = await loveMessageApi.getAll({
        userId: user?.userId,
        page: currentPage,
        pageSize
      })
      const data = res.data
      if (reset) {
        setMessages(data)
        setPage(2)
      } else {
        setMessages(prev => [...prev, ...data])
        setPage(p => p + 1)
      }
      setHasMore(data.length === pageSize)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, user?.userId])

  useEffect(() => {
    loadMessages(true)
  }, [user?.userId])

  const handleDelete = (id) => setMessages(prev => prev.filter(m => m.id !== id))
  const handleMarkRead = (id) => setMessages(prev =>
    prev.map(m => m.id === id ? { ...m, isRead: true, readAt: new Date().toISOString() } : m)
  )
  const handleComposeDone = () => loadMessages(true)

  const groups = groupByDate(messages)
  const totalUnread = messages.filter(m => !m.isRead && m.senderId !== user?.userId).length
  const loveDays = getLoveDays(user?.matchedAt)

  const partnerName = user?.partnerUsername || 'người ấy'

  return (
    <div className="main-content">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2>
              {user?.username === 'wuy' ? 'Dành cho Khánh Linh 💗' : `Dành cho ${partnerName} 💗`}
            </h2>
            <p>Mỗi ngày một lời nhắn từ trái tim ♡</p>
          </div>

          {/* Love Days Counter Badge */}
          <div className="love-counter-badge">
            <span className="love-counter-icon">💕</span>
            <div className="love-counter-text">
              <span className="love-counter-days">Đã bên nhau <strong>{loveDays}</strong> ngày</span>
              <span className="love-counter-sub">bám lấy nhau thật lâu nhé ♡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {messages.length > 0 && (
        <div className="stats-bar">
          <div className="stat-chip">
            💌 Tổng: <strong>{messages.length}</strong> lời nhắn
          </div>
          {totalUnread > 0 && (
            <div className="stat-chip">
              ✨ Chưa đọc: <strong>{totalUnread}</strong>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="loading-dot" />
          <div className="loading-dot" />
          <div className="loading-dot" />
        </div>
      ) : messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💌</div>
          <h3>Chưa có lời nhắn nào</h3>
          <p>Hãy viết lời yêu thương đầu tiên gửi cho {partnerName} nhé ♡</p>
        </div>
      ) : (
        <>
          {groups.map((group) => (
            <div key={group.label}>
              <div className="date-divider">
                <span>🌸 {group.label}</span>
              </div>
              {group.items.map(msg => (
                <MessageCard
                  key={msg.id}
                  message={msg}
                  onDelete={handleDelete}
                  onMarkRead={handleMarkRead}
                />
              ))}
            </div>
          ))}

          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button
                className="btn-primary"
                onClick={() => loadMessages(false)}
                style={{ margin: '0 auto' }}
              >
                Xem thêm 🌸
              </button>
            </div>
          )}
        </>
      )}

      {/* FAB */}
      <button
        id="fab-compose"
        className="fab"
        onClick={() => setShowCompose(true)}
        title="Viết lời nhắn mới"
      >
        ✍️
      </button>

      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(false)}
          onSuccess={handleComposeDone}
        />
      )}
    </div>
  )
}
