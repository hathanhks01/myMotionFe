import axios from 'axios'

// Tự động dùng VITE_API_URL từ biến môi trường Vercel (nếu có), hoặc fallback về '/api'
const baseURL = import.meta.env.VITE_API_URL
  ? ${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api
  : '/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Love Messages ─────────────────────────────────────────────────────────
export const loveMessageApi = {
  /** Lấy tất cả tin nhắn, lọc theo ngày nếu có */
  getAll: (params = {}) => api.get('/lovemessages', { params }),

  /** Lấy chi tiết 1 tin nhắn */
  getById: (id) => api.get(/lovemessages/),

  /** Gửi lời nhắn mới */
  create: (data) => api.post('/lovemessages', data),

  /** Cập nhật tin nhắn */
  update: (id, data) => api.put(/lovemessages/, data),

  /** Đánh dấu đã đọc */
  markRead: (id) => api.patch(/lovemessages//read),

  /** Xóa tin nhắn */
  delete: (id) => api.delete(/lovemessages/),
}

// ── Attachments ───────────────────────────────────────────────────────────
export const attachmentApi = {
  getByMessage: (messageId) =>
    api.get('/messageattachments', { params: { messageId } }),

  create: (data) => api.post('/messageattachments', data),

  delete: (id) => api.delete(/messageattachments/),
}
