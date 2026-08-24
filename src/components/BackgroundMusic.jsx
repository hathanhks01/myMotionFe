import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const AUDIO_SRC = '/asset/dunglamtraitymanhdau.mp3'

export default function BackgroundMusic() {
  const { isAuthenticated } = useAuth()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const isPlayingRef = useRef(false)

  // Auto-play when user is authenticated (login or refreshed session)
  useEffect(() => {
    if (!isAuthenticated) return

    const tryAutoPlay = () => {
      if (!audioRef.current || isPlayingRef.current) return
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
          isPlayingRef.current = true
        })
        .catch(() => {
          // If browser policy blocks autoplay, play on the first click anywhere
          const playOnGesture = () => {
            if (audioRef.current && !isPlayingRef.current) {
              audioRef.current.play()
                .then(() => {
                  setIsPlaying(true)
                  isPlayingRef.current = true
                })
                .catch(() => {})
            }
            window.removeEventListener('click', playOnGesture)
            window.removeEventListener('keydown', playOnGesture)
            window.removeEventListener('touchstart', playOnGesture)
          }

          window.addEventListener('click', playOnGesture, { once: true })
          window.addEventListener('keydown', playOnGesture, { once: true })
          window.addEventListener('touchstart', playOnGesture, { once: true })
        })
    }

    tryAutoPlay()
  }, [isAuthenticated])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      isPlayingRef.current = false
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
          isPlayingRef.current = true
        })
        .catch(err => {
          console.log('Audio playback info:', err)
        })
    }
  }

  return (
    <div className="cute-music-widget">
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="auto"
      />

      <button
        type="button"
        className={`cute-music-btn ${isPlaying ? 'is-playing' : 'is-muted'}`}
        onClick={togglePlay}
        title={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc: Đừng Làm Trái Tim Anh Đau 💕'}
        aria-label={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
      >
        {/* Animated cute record disc / heart icon */}
        <div className="cute-disc">
          <span className="cute-disc-core">{isPlaying ? '💗' : '💤'}</span>
        </div>

        {/* Floating notes when playing */}
        {isPlaying && (
          <div className="cute-floating-notes" aria-hidden="true">
            <span className="float-note">🎵</span>
            <span className="float-note">💕</span>
            <span className="float-note">✨</span>
          </div>
        )}
      </button>
    </div>
  )
}
