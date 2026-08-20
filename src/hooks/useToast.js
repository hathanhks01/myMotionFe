import { useState, useCallback } from 'react'

/** Hiện toast notification tạm thời */
export function useToast() {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success', duration = 2800) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), duration)
  }, [])

  return { toast, showToast }
}
