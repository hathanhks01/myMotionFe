import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

const SESSION_KEY = 'mymotion_session'

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)   // { userId, username, token, userCode, partnerId, partnerUsername, matchedAt, isMatched }
  const [loading, setLoading] = useState(true)   // kiểm tra session khi F5

  // ── Khôi phục session từ localStorage khi app load ────────────────────────
  useEffect(() => {
    const restore = async () => {
      const raw = localStorage.getItem(SESSION_KEY)
      if (!raw) { setLoading(false); return }

      try {
        const session = JSON.parse(raw)
        // Đồng bộ thông tin người dùng và match mới nhất từ server
        const { data } = await authApi.me(session.userId)
        const updatedSession = {
          ...session,
          userCode: data.userCode,
          partnerId: data.partnerId,
          partnerUsername: data.partnerUsername,
          matchedAt: data.matchedAt,
          isMatched: !!data.partnerId,
        }
        localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession))
        setUser(updatedSession)
      } catch (_) {
        // Token hết hạn hoặc server lỗi → xóa session cũ
        localStorage.removeItem(SESSION_KEY)
      } finally {
        setLoading(false)
      }
    }
    restore()
  }, [])

  // ── Đăng nhập ─────────────────────────────────────────────────────────────
  const login = useCallback(async (username, password) => {
    const { data } = await authApi.login(username, password)
    const session = {
      token: data.token,
      userId: data.userId,
      username: data.username,
      fullName: data.fullName,
      birthDate: data.birthDate,
      phoneNumber: data.phoneNumber,
      userCode: data.userCode,
      partnerId: data.partnerId,
      partnerUsername: data.partnerUsername,
      matchedAt: data.matchedAt,
      isMatched: !!data.partnerId,
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
    return session
  }, [])

  // ── Đăng ký ──────────────────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    const { data } = await authApi.register(formData)
    const session = {
      token: data.token,
      userId: data.userId,
      username: data.username,
      fullName: data.fullName,
      birthDate: data.birthDate,
      phoneNumber: data.phoneNumber,
      userCode: data.userCode,
      partnerId: data.partnerId,
      partnerUsername: data.partnerUsername,
      matchedAt: data.matchedAt,
      isMatched: !!data.partnerId,
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
    return session
  }, [])

  // ── Ghép đôi tài khoản ───────────────────────────────────────────────────
  const matchPartner = useCallback(async (partnerCode, matchedAt) => {
    if (!user) return
    const { data } = await authApi.match(user.userId, partnerCode, matchedAt)
    const updatedSession = {
      ...user,
      partnerId: data.partnerId,
      partnerUsername: data.partnerUsername,
      matchedAt: data.matchedAt,
      isMatched: !!data.partnerId,
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession))
    setUser(updatedSession)
    return updatedSession
  }, [user])

  // ── Đăng xuất ─────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      matchPartner,
      isAuthenticated: !!user,
      isMatched: !!user?.partnerId,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải được dùng bên trong AuthProvider')
  return ctx
}
