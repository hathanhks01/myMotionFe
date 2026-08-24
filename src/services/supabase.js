import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sdngzqsfrclsoauqvwwq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkbmd6cXNmcmNsc29hdXF2d3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyNDg5OTcsImV4cCI6MjEwMjgyNDk5N30.ImGqK3JrBwk-5CAXGOGNoW8cORJcYEJAdEu6hTpw46c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const BUCKET_NAME = 'attachments'

/**
 * Tải file (ảnh hoặc video) lên Supabase Storage bucket 'attachments'
 * @param {File} file 
 * @returns {Promise<{ publicUrl: string, fileType: 'image'|'video', originalFileName: string, fileSizeBytes: number }>}
 */
export async function uploadAttachment(file) {
  const isVideo = file.type.startsWith('video/')
  const fileType = isVideo ? 'video' : 'image'
  const ext = file.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg')
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${cleanName}`

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Supabase upload error:', error)
    // Nếu bucket chưa tồn tại hoặc lỗi quyền, ném exception rõ ràng
    throw new Error(error.message || 'Lỗi khi tải file lên Supabase Storage')
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path)

  return {
    fileUrl: publicUrl,
    fileType,
    originalFileName: file.name,
    fileSizeBytes: file.size,
  }
}
