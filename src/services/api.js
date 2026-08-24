import axios from 'axios'

// Ưu tiên VITE_API_URL từ biến môi trường, nếu không có thì mặc định trỏ thẳng tới Render Backend
const defaultApiUrl = 'https://mymotionapi.onrender.com'
const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : defaultApiUrl)
const baseURL = apiUrl.startsWith('http') ? apiUrl.replace(/\/$/, '') + '/api' : apiUrl

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Interceptor: tự động gắn token vào header nếu đã đăng nhập ──────────────
api.interceptors.request.use((config) => {
  const session = localStorage.getItem('mymotion_session')
  if (session) {
    try {
      const { token } = JSON.parse(session)
      if (token) config.headers['Authorization'] = `Bearer ${token}`
    } catch (_) {}
  }
  return config
})

// ── Auth & Matching ───────────────────────────────────────────────────────────
export const authApi = {
  /** Đăng nhập, trả về { token, userId, username, fullName, birthDate, phoneNumber, userCode, partnerId, partnerUsername, matchedAt, isMatched } */
  login: (username, password) =>
    api.post('/auth/login', { username, password }),

  /** Đăng ký tài khoản mới (họ tên, ngày sinh, SĐT) */
  register: (data) =>
    api.post('/auth/register', data),

  /** Kiểm tra userId còn hợp lệ không và lấy thông tin match mới nhất */
  me: (userId) =>
    api.get('/auth/me', { params: { userId } }),

  /** Ghép đôi 2 tài khoản qua mã code */
  match: (userId, partnerCode, matchedAt) =>
    api.post('/auth/match', { userId, partnerCode, matchedAt }),
}

// ── Love Messages ─────────────────────────────────────────────────────────
export const loveMessageApi = {
  /** Lấy tất cả tin nhắn 2 chiều, lọc theo userId và ngày nếu có */
  getAll: (params = {}) => api.get('/lovemessages', { params }),

  /** Lấy chi tiết 1 tin nhắn */
  getById: (id) => api.get(`/lovemessages/${id}`),

  /** Gửi lời nhắn mới (hỗ trợ isPublic, senderId, receiverId) */
  create: (data) => api.post('/lovemessages', data),

  /** Cập nhật tin nhắn */
  update: (id, data) => api.put(`/lovemessages/${id}`, data),

  /** Đổi trạng thái Công khai / Riêng tư */
  togglePrivacy: (id, isPublic) =>
    api.patch(`/lovemessages/${id}/privacy`, { isPublic }),

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