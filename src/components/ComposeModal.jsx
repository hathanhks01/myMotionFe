import { useState, useRef } from 'react'
import { loveMessageApi, attachmentApi } from '../services/api'
import { uploadAttachment } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function ComposeModal({ onClose, onSuccess }) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [sending, setSending] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || [])
    if (!selected.length) return

    const newPreviews = selected.map(file => ({
      file,
      url: URL.createObjectURL(file),
      isVideo: file.type.startsWith('video/'),
      name: file.name
    }))

    setFiles(prev => [...prev, ...selected])
    setPreviews(prev => [...prev, ...newPreviews])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemoveFile = (index) => {
    URL.revokeObjectURL(previews[index].url)
    setFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSend = async () => {
    if (!content.trim() && files.length === 0) return
    setSending(true)
    setErrorMsg('')

    try {
      // 1. Tạo LoveMessage trước (2 chiều + IsPublic)
      setUploadStatus('Đang gửi lời nhắn...')
      const resMsg = await loveMessageApi.create({
        senderId: user?.userId,
        receiverId: user?.partnerId,
        content: content.trim(),
        isPublic: isPublic
      })
      const messageId = resMsg.data.id

      // 2. Upload các file đính kèm lên Supabase Storage nếu có
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          setUploadStatus(`Đang tải lên tệp ${i + 1}/${files.length}...`)
          
          const uploaded = await uploadAttachment(file)

          await attachmentApi.create({
            messageId: messageId,
            fileUrl: uploaded.fileUrl,
            fileType: uploaded.fileType,
            originalFileName: uploaded.originalFileName,
            fileSizeBytes: uploaded.fileSizeBytes,
          })
        }
      }

      setUploadStatus('Hoàn tất! ✨')
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Có lỗi xảy ra khi gửi tin nhắn hoặc upload file.')
      setSending(false)
      setUploadStatus('')
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !sending) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">Gửi lời yêu thương 💌</h2>
          <button className="btn-close" onClick={onClose} disabled={sending} aria-label="Đóng">✕</button>
        </div>

        <textarea
          autoFocus
          placeholder={
            user?.partnerUsername
              ? `Hôm nay bạn muốn nói gì với ${user.partnerUsername}?`
              : 'Hôm nay bạn muốn nói gì với người ấy?'
          }
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={sending}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend()
          }}
        />

        {/* Selected media preview grid */}
        {previews.length > 0 && (
          <div className="compose-preview-grid">
            {previews.map((item, idx) => (
              <div key={idx} className="compose-preview-item">
                {item.isVideo ? (
                  <video src={item.url} className="compose-preview-media" muted />
                ) : (
                  <img src={item.url} alt={item.name} className="compose-preview-media" />
                )}
                <span className="compose-preview-badge">
                  {item.isVideo ? '🎥 Video' : '🖼️ Ảnh'}
                </span>
                {!sending && (
                  <button
                    type="button"
                    className="compose-preview-remove"
                    onClick={() => handleRemoveFile(idx)}
                    title="Xóa tệp này"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Attachment & Public/Private Controls */}
        <div className="compose-media-toolbar">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={sending}
          />
          <button
            type="button"
            className="compose-attach-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={sending}
          >
            📎 Thêm ảnh / video
          </button>

          {/* Công tắc Công khai / Riêng tư */}
          <button
            type="button"
            className={`compose-privacy-toggle ${isPublic ? 'is-public' : 'is-private'}`}
            onClick={() => setIsPublic(!isPublic)}
            disabled={sending}
            title={isPublic ? 'Đối phương sẽ xem được tin nhắn này' : 'Chỉ mình bạn xem được (nhật ký bí mật)'}
          >
            {isPublic ? '🔓 Công khai' : '🔒 Riêng tư'}
          </button>
        </div>

        {uploadStatus && (
          <p className="compose-status-text">
            ✨ {uploadStatus}
          </p>
        )}

        {errorMsg && (
          <p className="compose-error-text">
            ⚠️ {errorMsg}
          </p>
        )}

        <div className="modal-footer">
          <span className="compose-hint">Ctrl + Enter để gửi</span>
          <button
            id="btn-send-message"
            className="btn-primary"
            onClick={handleSend}
            disabled={sending || (!content.trim() && files.length === 0)}
          >
            {sending ? '⏳ Đang gửi...' : '💕 Gửi đi'}
          </button>
        </div>
      </div>
    </div>
  )
}
