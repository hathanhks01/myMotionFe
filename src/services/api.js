import axios from 'axios'

// Ưu tiên VITE_API_URL từ biến môi trường, nếu không có thì mặc định trỏ thẳng tới Render Backend
const defaultApiUrl = 'https://mymotionapi.onrender.com'
const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : defaultApiUrl)
const baseURL = apiUrl.startsWith('http') ? apiUrl.replace(/\/$/, '') + '/api' : apiUrl

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Love Messages ─────────────────────────────────────────────────────────
export const loveMessageApi = {
  /** Lấy tất cả tin nhắn, lọc theo ngày nếu có */
  getAll: (params = {}) => api.get('/lovemessages', { params }),

  /** Lấy chi tiết 1 tin nhắn */
  getById: (id) => api.get(`/lovemessages/${id}`),

  /** Gửi lời nhắn mới */
  create: (data) => api.post('/lovemessages', data),

  /** Cập nhật tin nhắn */
  update: (id, data) => api.put(`/lovemessages/${id}`, data),

  /** Đánh dấu đã đọc */
  markRead: (id) => api.patch(`/lovemessages/${id}/read`),

  /** Xóa tin nhắn */
  delete: (id) => api.delete(`/lovemessages/${id}`),
}

// ── Attachments ───────────────────────────────────────────────────────────
export const attachmentApi = {
  getByMessage: (messageId) =>
    api.get('/messageattachments', { params: { messageId } }),

  create: (data) => api.post('/messageattachments', data),

  delete: (id) => api.delete(`/messageattachments/${id}`),
}