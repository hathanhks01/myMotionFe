import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Mascot.css';
import { MASCOT_STICKERS, WALK_FRAMES, RUN_FRAMES, IDLE_ROUTINES } from './mascotData';
import { mascotAudio } from './MascotAudio';

const MASCOT_WIDTH = 135;
const MASCOT_HEIGHT = 135;

export default function Mascot() {
  // --- Position & Movement State ---
  const [pos, setPos] = useState({
    x: typeof window !== 'undefined' ? 280 : 280,
    y: typeof window !== 'undefined' ? window.innerHeight - 150 : 500,
  });
  const [facingLeft, setFacingLeft] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [isAirborne, setIsAirborne] = useState(false);

  // --- Animation & Sprite State ---
  const [currentStickerId, setCurrentStickerId] = useState('pose_wave_hi');
  const [animClass, setAnimClass] = useState('anim-idle');
  const [mode, setMode] = useState('idle'); // 'idle' | 'walk' | 'run' | 'sleep' | 'action' | 'drag'

  // --- UI & Interaction State ---
  const [dialogue, setDialogue] = useState({
    show: true,
    title: 'Bé Mascot',
    text: 'Hi bạn! Bé là linh thú 2D cưng xỉu của bạn nè! 🐾',
    timer: null,
  });
  const [particles, setParticles] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [showGallery, setShowGallery] = useState(false);
  const [galleryCategory, setGalleryCategory] = useState('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  // --- Refs for Physics & Timers ---
  const posRef = useRef(pos);
  posRef.current = pos;
  const isDraggingRef = useRef(isDragging);
  isDraggingRef.current = isDragging;
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, elemX: 0, elemY: 0 });
  const dragVelocityRef = useRef({ vx: 0, vy: 0, lastX: 0, lastY: 0, lastTime: 0 });
  const walkTargetRef = useRef(null);
  const walkFrameIndexRef = useRef(0);
  const walkTimerRef = useRef(null);
  const idleTimerRef = useRef(null);
  const physicsFrameRef = useRef(null);
  const particleIdRef = useRef(0);

  // Get current sticker object
  const currentSticker = MASCOT_STICKERS.find(s => s.id === currentStickerId) || MASCOT_STICKERS[0];

  // =========================================================
  // 💬 SPEAK DIALOGUE BUBBLE
  // =========================================================
  const speak = useCallback((text, title = 'Bé Linh Vật', duration = 3800) => {
    setDialogue(prev => {
      if (prev.timer) clearTimeout(prev.timer);
      const timer = setTimeout(() => {
        setDialogue(d => ({ ...d, show: false }));
      }, duration);
      return { show: true, title, text, timer };
    });
  }, []);

  // Initial welcome greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      speak('Chào mừng bạn đến với myMotion! Chúc bạn ngày mới vui vẻ~ 🌸', 'Hi bạn!');
    }, 800);
    return () => clearTimeout(timer);
  }, [speak]);

  // =========================================================
  // ✨ BURST PARTICLES
  // =========================================================
  const spawnParticles = useCallback((emojis = ['✨', '💖', '🌸'], count = 6) => {
    const newItems = [];
    const originX = posRef.current.x + MASCOT_WIDTH / 2;
    const originY = posRef.current.y + MASCOT_HEIGHT / 3;

    for (let i = 0; i < count; i++) {
      newItems.push({
        id: particleIdRef.current++,
        emoji: emojis[i % emojis.length],
        x: originX + (Math.random() * 40 - 20),
        y: originY + (Math.random() * 30 - 15),
        dx: (Math.random() * 80 - 40) + 'px',
        rot: (Math.random() * 60 - 30) + 'deg',
      });
    }

    setParticles(prev => [...prev, ...newItems]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newItems.some(n => n.id === p.id)));
    }, 1500);
  }, []);

  // =========================================================
  // 🎭 SET POSE / EMOTE
  // =========================================================
  const setPose = useCallback((stickerId, customAnim = 'anim-idle', speakDialogue = true) => {
    const sticker = MASCOT_STICKERS.find(s => s.id === stickerId);
    if (!sticker) return;

    setCurrentStickerId(sticker.id);
    setAnimClass(customAnim);

    // Audio & particles
    if (sticker.sound === 'pop') mascotAudio.playPop();
    else if (sticker.sound === 'sparkle') mascotAudio.playSparkle();
    else if (sticker.sound === 'boing') mascotAudio.playBoing();
    else if (sticker.sound === 'tap') mascotAudio.playTap();
    else if (sticker.sound === 'sleep') mascotAudio.playSleepZzz();

    if (sticker.particles) {
      spawnParticles(sticker.particles, 5);
    }

    if (speakDialogue && sticker.dialogue) {
      speak(sticker.dialogue, sticker.label);
    }
  }, [spawnParticles, speak]);

  // =========================================================
  // 🏃‍♀️ WALK / RUN ENGINE
  // =========================================================
  const startWalkingTo = useCallback((targetX, isRunning = false) => {
    setMode(isRunning ? 'run' : 'walk');
    setAnimClass(isRunning ? 'anim-run' : 'anim-walk');
    walkTargetRef.current = targetX;
    setFacingLeft(targetX < posRef.current.x);

    if (isRunning) {
      mascotAudio.playSparkle();
      speak('Bé chạy vèo qua nè! 🏃‍♀️💨', 'Chạy nhanh');
    } else {
      mascotAudio.playTap();
      speak('Đi dạo ngắm cảnh chút xíu~ 🚶‍♀️', 'Đi dạo');
    }
  }, [speak]);

  // Stop walking
  const stopWalking = useCallback((newStickerId = 'pose_chin_rest') => {
    setMode('idle');
    setAnimClass('anim-idle');
    walkTargetRef.current = null;
    setPose(newStickerId, 'anim-idle', false);
  }, [setPose]);

  // Animation Loop for Walking / Running
  useEffect(() => {
    if (mode !== 'walk' && mode !== 'run') return;

    const frames = mode === 'run' ? RUN_FRAMES : WALK_FRAMES;
    const speed = mode === 'run' ? 4.5 : 2.0;
    const intervalMs = mode === 'run' ? 90 : 140;

    let frameCount = 0;

    const interval = setInterval(() => {
      const targetX = walkTargetRef.current;
      if (targetX === null) return;

      const currentX = posRef.current.x;
      const dist = targetX - currentX;

      if (Math.abs(dist) <= speed * 1.5) {
        // Arrived at destination!
        setPos(p => ({ ...p, x: targetX }));
        stopWalking('pose_happy_laugh');
        spawnParticles(['✨', '🎉', '🌸'], 4);
        speak('Tới nơi rồi nè bạn ơi! ✨', 'Đã đến đích');
      } else {
        const nextX = currentX + (dist > 0 ? speed : -speed);
        setPos(p => ({ ...p, x: nextX }));
        setFacingLeft(dist < 0);

        // Cycle walk frames
        frameCount = (frameCount + 1) % frames.length;
        const currentFrameSrc = frames[frameCount];
        const matchSticker = MASCOT_STICKERS.find(s => s.src === currentFrameSrc);
        if (matchSticker) {
          setCurrentStickerId(matchSticker.id);
        }
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [mode, stopWalking, spawnParticles, speak]);

  // =========================================================
  // 🌸 AUTONOMOUS IDLE BEHAVIOR (Pet AI)
  // =========================================================
  useEffect(() => {
    if (mode !== 'idle' || isDragging) return;

    // Trigger random idle activities every 14-22 seconds
    const delay = Math.random() * 8000 + 14000;
    idleTimerRef.current = setTimeout(() => {
      const rand = Math.random();

      if (rand < 0.35) {
        // Walk to random spot on screen
        const padding = 60;
        const minX = padding;
        const maxX = window.innerWidth - MASCOT_WIDTH - padding;
        const randomX = Math.floor(Math.random() * (maxX - minX) + minX);
        startWalkingTo(randomX, false);
      } else if (rand < 0.85) {
        // Pick a cute spontaneous routine (laptop, boba, music, finger heart)
        const routine = IDLE_ROUTINES[Math.floor(Math.random() * IDLE_ROUTINES.length)];
        setPose(routine.stickerId, 'anim-idle', true);
      } else {
        // Short nap in bed
        setMode('sleep');
        setPose('pose_sleeping', 'anim-sleep', true);
      }
    }, delay);

    return () => clearTimeout(idleTimerRef.current);
  }, [mode, isDragging, startWalkingTo, setPose]);

  // =========================================================
  // 🖱️ DRAG & DROP WITH GRAVITY PHYSICS
  // =========================================================
  const handlePointerDown = (e) => {
    if (e.button === 2) return; // Right click
    e.preventDefault();

    mascotAudio.init();
    mascotAudio.playBoing();

    setIsDragging(true);
    setMode('drag');
    setIsAirborne(false);
    setShowMenu(false);

    // Picked up expression!
    setPose('pose_shock_cheeks', 'anim-idle', false);
    speak('Oa oa~ Bạn nhấc bé lên rồi! 😲', 'Bay lên nào');

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      elemX: posRef.current.x,
      elemY: posRef.current.y,
    };

    dragVelocityRef.current = {
      vx: 0,
      vy: 0,
      lastX: e.clientX,
      lastY: e.clientY,
      lastTime: performance.now(),
    };
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDraggingRef.current) return;

      const dx = e.clientX - dragStartRef.current.mouseX;
      const dy = e.clientY - dragStartRef.current.mouseY;

      const newX = Math.max(10, Math.min(window.innerWidth - MASCOT_WIDTH - 10, dragStartRef.current.elemX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - MASCOT_HEIGHT - 10, dragStartRef.current.elemY + dy));

      // Measure velocity for inertia
      const now = performance.now();
      const dt = Math.max(1, now - dragVelocityRef.current.lastTime);
      dragVelocityRef.current.vx = ((e.clientX - dragVelocityRef.current.lastX) / dt) * 12;
      dragVelocityRef.current.vy = ((e.clientY - dragVelocityRef.current.lastY) / dt) * 12;
      dragVelocityRef.current.lastX = e.clientX;
      dragVelocityRef.current.lastY = e.clientY;
      dragVelocityRef.current.lastTime = now;

      setPos({ x: newX, y: newY });
      if (Math.abs(dx) > 5) {
        setFacingLeft(dx < 0);
      }
    };

    const handlePointerUp = () => {
      if (!isDraggingRef.current) return;
      setIsDragging(false);

      const groundY = window.innerHeight - MASCOT_HEIGHT - 20;
      const currentY = posRef.current.y;

      if (currentY < groundY - 30) {
        // Airborne: apply gravity drop
        setIsAirborne(true);
        setPose('pose_dizzy_stars', 'anim-idle', false);

        let curY = currentY;
        let vy = dragVelocityRef.current.vy || 1;
        const gravity = 0.8;

        const dropLoop = () => {
          vy += gravity;
          curY += vy;

          if (curY >= groundY) {
            // Landed!
            curY = groundY;
            setPos(p => ({ ...p, y: groundY }));
            setIsAirborne(false);
            setMode('idle');

            // Landing squash and happy reaction
            mascotAudio.playBoing();
            setAnimClass('anim-land');
            setPose('pose_happy_laugh', 'anim-land', false);
            spawnParticles(['💫', '⭐', '✨'], 5);
            speak('Bé hạ cánh an toàn rồi nè! 🎉', 'Hạ cánh');

            setTimeout(() => {
              setPose('pose_chin_rest', 'anim-idle', false);
            }, 1800);
          } else {
            setPos(p => ({ ...p, y: curY }));
            physicsFrameRef.current = requestAnimationFrame(dropLoop);
          }
        };

        physicsFrameRef.current = requestAnimationFrame(dropLoop);
      } else {
        // Directly on ground
        setMode('idle');
        setPose('pose_thumb_like', 'anim-idle', false);
        speak('Đặt bé ở đây nha~ Cảm ơn bạn! 😊', 'Đặt xuống');
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (physicsFrameRef.current) cancelAnimationFrame(physicsFrameRef.current);
    };
  }, [setPose, spawnParticles, speak]);

  // =========================================================
  // 💖 CLICK & DOUBLE CLICK REACTIONS
  // =========================================================
  const handleClick = (e) => {
    if (isDragging) return;
    mascotAudio.init();

    // If sleeping, wake up!
    if (mode === 'sleep') {
      setMode('idle');
      setPose('pose_shock_cheeks', 'anim-cheer', true);
      speak('Ủa ai gọi bé đó? Dậy liền nè! 🌸', 'Tỉnh ngủ');
      return;
    }

    // Friendly click reactions pool
    const clickPool = [
      'pose_finger_heart',
      'pose_peace',
      'pose_happy_laugh',
      'pose_hug_heart',
      'pose_hold_love',
      'pose_thumb_like',
      'pose_blush_cheeks',
      'pose_wave_ok',
    ];
    const nextSticker = clickPool[Math.floor(Math.random() * clickPool.length)];
    setPose(nextSticker, 'anim-love', true);
  };

  const handleDoubleClick = () => {
    mascotAudio.init();
    mascotAudio.playSparkle();
    setPose('pose_hold_love', 'anim-love', false);
    spawnParticles(['💖', '💝', '❤️', '💕', '🌸', '✨'], 12);
    speak('LOVE YOU 3000~! Mãi yêu quý bạn thật nhiều nha! 🥰💖', 'Siêu cấp tình cảm');
  };

  // =========================================================
  // 📜 CONTEXT MENU & QUICK ACTIONS
  // =========================================================
  const handleContextMenu = (e) => {
    e.preventDefault();
    mascotAudio.init();
    mascotAudio.playPop();

    const menuW = 220;
    const menuH = 340;
    const clampedX = Math.min(window.innerWidth - menuW - 10, Math.max(10, e.clientX));
    const clampedY = Math.min(window.innerHeight - menuH - 10, Math.max(10, e.clientY - menuH / 2));

    setMenuPos({ x: clampedX, y: clampedY });
    setShowMenu(true);
  };

  // Close context menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.mascot-quick-menu')) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    }
  }, [showMenu]);

  // Window resize bounds check
  useEffect(() => {
    const handleResize = () => {
      setPos(p => ({
        x: Math.min(window.innerWidth - MASCOT_WIDTH - 20, p.x),
        y: Math.min(window.innerHeight - MASCOT_HEIGHT - 20, p.y),
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter stickers for Gallery Modal
  const filteredStickers = MASCOT_STICKERS.filter(s => {
    if (galleryCategory === 'all') return true;
    if (galleryCategory === 'walk') return s.isWalkFrame;
    return s.category === galleryCategory;
  });

  // =========================================================
  // 🌸 MINIMIZED CORNER BUTTON
  // =========================================================
  if (isMinimized) {
    return (
      <div
        className="mascot-minimized-bubble"
        onClick={() => {
          setIsMinimized(false);
          mascotAudio.playSparkle();
          speak('Bé đã quay trở lại rồi nè! 🌸', 'Xin chào');
        }}
        title="Bấm để mở bé Mascot 2D"
      >
        <img
          src="/sprites/02_chin_rest.png"
          alt="Mascot Avatar"
          className="mascot-min-avatar"
        />
      </div>
    );
  }

  // =========================================================
  // 🌟 MAIN RENDER
  // =========================================================
  return (
    <>
      {/* --- Main Interactive Mascot --- */}
      <div
        className={`mascot-root ${animClass} ${facingLeft ? 'face-left' : ''} ${isDragging ? 'is-dragging' : ''} ${isAirborne ? 'is-airborne' : ''}`}
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: `${MASCOT_WIDTH}px`,
          height: `${MASCOT_HEIGHT}px`,
        }}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        {/* Hover Mini Toolbar */}
        <div className="mascot-hover-bar" onClick={e => e.stopPropagation()}>
          <button
            className="mascot-bar-icon-btn"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              mascotAudio.enabled = next;
              if (next) mascotAudio.playPop();
            }}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button
            className="mascot-bar-icon-btn"
            title="Bộ sưu tập 33 biểu cảm"
            onClick={() => {
              setShowGallery(true);
              mascotAudio.playSparkle();
            }}
          >
            🎭
          </button>
          <button
            className="mascot-bar-icon-btn"
            title={mode === 'walk' ? 'Dừng đi' : 'Đi dạo'}
            onClick={() => {
              if (mode === 'walk' || mode === 'run') {
                stopWalking();
              } else {
                const randomX = Math.random() * (window.innerWidth - MASCOT_WIDTH - 80) + 40;
                startWalkingTo(randomX, false);
              }
            }}
          >
            {mode === 'walk' ? '⏹️' : '🚶‍♀️'}
          </button>
          <button
            className="mascot-bar-icon-btn"
            title="Thu nhỏ góc màn hình"
            onClick={() => setIsMinimized(true)}
          >
            🌸
          </button>
        </div>

        {/* Speech / Dialogue Bubble */}
        <div className={`mascot-dialogue-bubble ${dialogue.show ? 'show' : ''}`}>
          <div className="mascot-bubble-title">
            <span>✨</span> {dialogue.title}
          </div>
          <div className="mascot-bubble-text">{dialogue.text}</div>
        </div>

        {/* Sleeping ZZZ Particles */}
        {mode === 'sleep' && (
          <div className="mascot-zzz-box">
            <span>z</span>
            <span>Z</span>
            <span>Z</span>
          </div>
        )}

        {/* Character Sprite */}
        <div className="mascot-character-box">
          <img
            src={currentSticker.src}
            alt={currentSticker.label}
            className="mascot-img"
            draggable={false}
          />
        </div>

        {/* Ground Shadow */}
        <div className="mascot-ground-shadow" />
      </div>

      {/* --- Floating Particles (Hearts, Stars, Notes) --- */}
      {particles.map(p => (
        <div
          key={p.id}
          className="mascot-particle-item"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            '--dx': p.dx,
            '--rot': p.rot,
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* --- Right-Click Context Menu --- */}
      <div
        className={`mascot-quick-menu ${showMenu ? 'open' : ''}`}
        style={{ left: `${menuPos.x}px`, top: `${menuPos.y}px` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="mascot-menu-header">
          <span>🌸 LỆNH CHO BÉ MASCOT</span>
          <span style={{ fontSize: '11px', color: '#ff7675' }}>2D Animated</span>
        </div>

        <button
          className="mascot-menu-btn"
          onClick={() => {
            setShowMenu(false);
            const randomX = Math.random() * (window.innerWidth - MASCOT_WIDTH - 80) + 40;
            startWalkingTo(randomX, false);
          }}
        >
          <span className="btn-emoji">🚶‍♀️</span> Đi dạo quanh web
        </button>

        <button
          className="mascot-menu-btn"
          onClick={() => {
            setShowMenu(false);
            const targetX = pos.x > window.innerWidth / 2 ? 60 : window.innerWidth - MASCOT_WIDTH - 60;
            startWalkingTo(targetX, true);
          }}
        >
          <span className="btn-emoji">🏃‍♀️</span> Chạy tung tăng
        </button>

        <button
          className="mascot-menu-btn"
          onClick={() => {
            setShowMenu(false);
            setMode('action');
            setPose('pose_laptop_work', 'anim-idle', true);
          }}
        >
          <span className="btn-emoji">💻</span> Phụ bạn gõ code
        </button>

        <button
          className="mascot-menu-btn"
          onClick={() => {
            setShowMenu(false);
            setMode('action');
            setPose('pose_drink_boba', 'anim-idle', true);
          }}
        >
          <span className="btn-emoji">🧋</span> Uống trà sữa chill
        </button>

        <button
          className="mascot-menu-btn"
          onClick={() => {
            setShowMenu(false);
            setMode('action');
            setPose('pose_music_listen', 'anim-idle', true);
          }}
        >
          <span className="btn-emoji">🎧</span> Đeo tai nghe nghe nhạc
        </button>

        <button
          className="mascot-menu-btn"
          onClick={() => {
            setShowMenu(false);
            handleDoubleClick();
          }}
        >
          <span className="btn-emoji">💖</span> Bắn tim / Tỏ tình
        </button>

        <button
          className="mascot-menu-btn"
          onClick={() => {
            setShowMenu(false);
            setMode('sleep');
            setPose('pose_sleeping', 'anim-sleep', true);
          }}
        >
          <span className="btn-emoji">😴</span> Đi ngủ ngoan zZ
        </button>

        <div className="mascot-menu-divider" />

        <button
          className="mascot-menu-btn"
          style={{ color: '#feca57' }}
          onClick={() => {
            setShowMenu(false);
            setShowGallery(true);
          }}
        >
          <span className="btn-emoji">🎭</span> Bộ sưu tập 33 biểu cảm
        </button>

        <button
          className="mascot-menu-btn"
          onClick={() => {
            setShowMenu(false);
            const next = !soundEnabled;
            setSoundEnabled(next);
            mascotAudio.enabled = next;
            if (next) mascotAudio.playPop();
          }}
        >
          <span className="btn-emoji">{soundEnabled ? '🔊' : '🔇'}</span>
          {soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        </button>

        <button
          className="mascot-menu-btn"
          onClick={() => {
            setShowMenu(false);
            setPos({
              x: window.innerWidth - MASCOT_WIDTH - 40,
              y: window.innerHeight - MASCOT_HEIGHT - 20,
            });
            setMode('idle');
            setPose('pose_wave_hi', 'anim-idle', true);
          }}
        >
          <span className="btn-emoji">📍</span> Về góc ban đầu
        </button>
      </div>

      {/* --- STICKER GALLERY MODAL (33 Emotes Library) --- */}
      {showGallery && (
        <div className="mascot-gallery-backdrop" onClick={() => setShowGallery(false)}>
          <div className="mascot-gallery-modal" onClick={e => e.stopPropagation()}>
            <div className="mascot-gallery-header">
              <div className="mascot-gallery-title">
                <span style={{ fontSize: '24px' }}>🎭</span>
                <div>
                  <h3>Bộ Sưu Tập 33 Biểu Cảm Chibi</h3>
                  <div style={{ fontSize: '12px', color: '#a4b0be' }}>
                    Bấm vào bất kỳ sticker nào để linh vật diễn hoạt & nói chuyện ngay!
                  </div>
                </div>
              </div>
              <button
                className="mascot-gallery-close"
                onClick={() => setShowGallery(false)}
                title="Đóng"
              >
                ✕
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="mascot-gallery-tabs">
              {[
                { id: 'all', label: '🌸 Tất cả (33)' },
                { id: 'emote', label: '✌️ Cảm xúc' },
                { id: 'love', label: '💖 Yêu thương' },
                { id: 'activity', label: '🧋 Hoạt động' },
                { id: 'work', label: '💻 Làm việc' },
                { id: 'relax', label: '🎧 Thư giãn' },
                { id: 'emotion', label: '😭 Hỉ nộ ái ố' },
                { id: 'walk', label: '🚶‍♀️ Bước đi' },
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`mascot-tab-btn ${galleryCategory === tab.id ? 'active' : ''}`}
                  onClick={() => setGalleryCategory(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sticker Grid */}
            <div className="mascot-gallery-grid">
              {filteredStickers.map(sticker => (
                <div
                  key={sticker.id}
                  className={`mascot-gallery-item ${currentStickerId === sticker.id ? 'is-selected' : ''}`}
                  onClick={() => {
                    setPose(sticker.id, 'anim-love', true);
                    setShowGallery(false);
                  }}
                  title={sticker.dialogue || sticker.label}
                >
                  <img
                    src={sticker.src}
                    alt={sticker.label}
                    className="mascot-gallery-thumb"
                  />
                  <div className="mascot-gallery-name">{sticker.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
