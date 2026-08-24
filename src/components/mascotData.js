// All 33 extracted stickers and rich animation sequences
export const MASCOT_STICKERS = [
  // ROW 1: BUSTS & EMOTES
  {
    id: 'pose_peace',
    name: '01_peace',
    src: '/sprites/01_peace.png',
    label: 'Vui vẻ Peace ✌️',
    category: 'emote',
    dialogue: 'Chào bạn nha! Chúc bạn một ngày tràn đầy năng lượng và may mắn! 🌸',
    sound: 'pop',
    particles: ['✨', '🌸', '✌️']
  },
  {
    id: 'pose_chin_rest',
    name: '02_chin_rest',
    src: '/sprites/02_chin_rest.png',
    label: 'Nũng nịu chống cằm 🌸',
    category: 'idle',
    dialogue: 'Đang chăm chú làm gì thế bạn ơi? Có cần bé giúp gì hông nè? 💕',
    sound: 'sparkle',
    particles: ['💕', '🌸', '✨']
  },
  {
    id: 'pose_finger_heart',
    name: '03_finger_heart',
    src: '/sprites/03_finger_heart.png',
    label: 'Bắn tim finger heart 🫰',
    category: 'love',
    dialogue: 'Pằng pằng! Bắn tim yêu thương bay thẳng tới bạn nè~ 💖',
    sound: 'sparkle',
    particles: ['💖', '🫰', '✨', '❤️']
  },
  {
    id: 'pose_happy_laugh',
    name: '04_happy_laugh',
    src: '/sprites/04_happy_laugh.png',
    label: 'Cười tươi phấn khích 😄',
    category: 'cheer',
    dialogue: 'Yayyy! Hôm nay mọi thứ tuyệt vời quá đúng hông nè! 🎉',
    sound: 'pop',
    particles: ['🎉', '⭐', '✨', '🌟']
  },
  {
    id: 'pose_shock_cheeks',
    name: '05_shock_cheeks',
    src: '/sprites/05_shock_cheeks.png',
    label: 'Ngạc nhiên ôm má 😲',
    category: 'cheer',
    dialogue: 'Oa oa~ Thật luôn hả? Đỉnh nóc kịch trần bay phấp phới luôn! ✨',
    sound: 'boing',
    particles: ['😲', '✨', '🌟', '💫']
  },

  // ROW 2: FULL BODY STANDING & ACTIONS
  {
    id: 'pose_wave_hi',
    name: '06_wave_hi',
    src: '/sprites/06_wave_hi.png',
    label: 'Vẫy tay Hi~ 👋',
    category: 'greeting',
    dialogue: 'Hi bạn! Bé là linh thú 2D cưng xỉu đồng hành cùng bạn trên web đây! 🐾',
    sound: 'pop',
    particles: ['👋', '✨', '🌸']
  },
  {
    id: 'pose_point_wink',
    name: '07_point_wink',
    src: '/sprites/07_point_wink.png',
    label: 'Nháy mắt chỉ tay 😉',
    category: 'action',
    dialogue: 'Click vào tính năng này thử xem, có nhiều điều bất ngờ lắm đó! 🎯',
    sound: 'pop',
    particles: ['😉', '✨', '🎯']
  },
  {
    id: 'pose_point_smile',
    name: '08_point_smile',
    src: '/sprites/08_point_smile.png',
    label: 'Chỉ tay cười tươi 👉',
    category: 'action',
    dialogue: 'Đừng quên kiểm tra tin nhắn và bài viết mới nha! 📬',
    sound: 'pop',
    particles: ['👉', '✨', '📬']
  },
  {
    id: 'pose_hug_heart',
    name: '09_hug_heart',
    src: '/sprites/09_hug_heart.png',
    label: 'Ôm tim yêu thương 💖',
    category: 'love',
    dialogue: 'Trao bạn một chiếc ôm ấm áp xua tan mọi mệt mỏi nè! 💗',
    sound: 'sparkle',
    particles: ['💖', '💗', '❤️', '🌸']
  },
  {
    id: 'pose_hold_love',
    name: '10_hold_love',
    src: '/sprites/10_hold_love.png',
    label: 'Bảng LOVE 💝',
    category: 'love',
    dialogue: 'LOVE YOU SO MUCH~! Mãi là bạn tốt của nhau nha! 🥰',
    sound: 'sparkle',
    particles: ['💝', '💖', '❤️', '💕', '✨']
  },
  {
    id: 'pose_thumb_like',
    name: '11_thumb_like',
    src: '/sprites/11_thumb_like.png',
    label: 'Bảng Like! 👍',
    category: 'cheer',
    dialogue: '10 điểm không có nhưng! Bé thả triệu like cho bạn! ⭐',
    sound: 'pop',
    particles: ['👍', '⭐', '✨', '🌟']
  },
  {
    id: 'pose_wave_ok',
    name: '12_wave_ok',
    src: '/sprites/12_wave_ok.png',
    label: 'Bảng OK! 👌',
    category: 'action',
    dialogue: 'OK con dê! Nhiệm vụ đã hoàn thành xuất sắc! 🚀',
    sound: 'pop',
    particles: ['👌', '✨', '🚀']
  },
  {
    id: 'pose_confused',
    name: '13_confused',
    src: '/sprites/13_confused.png',
    label: 'Thắc mắc hỏi chấm ❓',
    category: 'idle',
    dialogue: 'Ủa ủa? Có gì đó là lạ kìa, để bé ngó thử xem sao nha? 🤔',
    sound: 'tap',
    particles: ['❓', '🤔', '💭']
  },

  // ROW 3: SITTING & DAILY CHILL
  {
    id: 'pose_drink_boba',
    name: '14_drink_boba',
    src: '/sprites/14_drink_boba.png',
    label: 'Uống trà sữa chill 🧋',
    category: 'activity',
    dialogue: 'Làm ngụm trà sữa trân châu full topping cho ngọt ngào nào! 🥤',
    sound: 'pop',
    particles: ['🧋', '🥤', '✨', '😋']
  },
  {
    id: 'pose_laptop_work',
    name: '15_laptop_work',
    src: '/sprites/15_laptop_work.png',
    label: 'Gõ laptop làm việc 💻',
    category: 'work',
    dialogue: 'Cạch cạch... bé đang phụ bạn gõ code và kiểm tra bug nè! ⌨️',
    sound: 'tap',
    particles: ['💻', '⌨️', '⚡', '💡']
  },
  {
    id: 'pose_phone_lying',
    name: '16_phone_lying',
    src: '/sprites/16_phone_lying.png',
    label: 'Nằm lướt điện thoại 📱',
    category: 'relax',
    dialogue: 'Nằm dài lướt newfeed xả stress một tẹo rồi làm tiếp nào~ 💬',
    sound: 'tap',
    particles: ['📱', '💬', '💕', '🌸']
  },
  {
    id: 'pose_music_listen',
    name: '17_music_listen',
    src: '/sprites/17_music_listen.png',
    label: 'Đeo tai nghe chill 🎧',
    category: 'relax',
    dialogue: 'Bật bài hát yêu thích lên và tận hưởng giai điệu êm dịu nào! 🎵',
    sound: 'sparkle',
    particles: ['🎧', '🎵', '🎶', '✨']
  },
  {
    id: 'pose_phone_mail',
    name: '18_phone_mail',
    src: '/sprites/18_phone_mail.png',
    label: 'Có thông báo mới 📩',
    category: 'notification',
    dialogue: 'Ting ting! Bạn có 1 thông báo mới quan trọng kìa! 🔔',
    sound: 'sparkle',
    particles: ['📩', '🔔', '✨', '⚡']
  },
  {
    id: 'pose_sleeping',
    name: '19_sleeping',
    src: '/sprites/19_sleeping.png',
    label: 'Ngủ ôm gấu bông 😴',
    category: 'sleep',
    dialogue: 'Khò khò... buồn ngủ quá rồi, ngủ một giấc thật ngon nha... zZz',
    sound: 'sleep',
    particles: ['💤', '🌙', '⭐', '🐰']
  },

  // ROW 4: EMOTIONS
  {
    id: 'pose_cry_tissue',
    name: '20_cry_tissue',
    src: '/sprites/20_cry_tissue.png',
    label: 'Khóc lau nước mắt 😭',
    category: 'emotion',
    dialogue: 'Huhu... đừng buồn nha, có bé luôn bên bạn mà! Đưa khăn giấy nè! 🥺',
    sound: 'tap',
    particles: ['😭', '💧', '🥺', '🩹']
  },
  {
    id: 'pose_angry_pout',
    name: '21_angry_pout',
    src: '/sprites/21_angry_pout.png',
    label: 'Giận dỗi khoanh tay 😤',
    category: 'emotion',
    dialogue: 'Hứ! Ai dám làm bạn khó chịu thế, kể bé nghe để bé đòi lại công đạo! 😾',
    sound: 'boing',
    particles: ['😤', '💢', '😾', '🔥']
  },
  {
    id: 'pose_blush_cheeks',
    name: '22_blush_cheeks',
    src: '/sprites/22_blush_cheeks.png',
    label: 'Ngại ngùng đỏ mặt 😳',
    category: 'love',
    dialogue: 'Khen bé hoài làm bé ngại đỏ bừng cả hai má rồi nè~ 🌸',
    sound: 'sparkle',
    particles: ['😳', '🌸', '💕', '✨']
  },
  {
    id: 'pose_dizzy_stars',
    name: '23_dizzy_stars',
    src: '/sprites/23_dizzy_stars.png',
    label: 'Chóng mặt sao bay 💫',
    category: 'emotion',
    dialogue: 'Ui da... xoay mòng mòng chóng cả mặt, sao bay lấp lánh quanh đầu rồi! 🌀',
    sound: 'boing',
    particles: ['💫', '🌀', '⭐', '✨']
  },
  {
    id: 'pose_megaphone',
    name: '24_megaphone',
    src: '/sprites/24_megaphone.png',
    label: 'Cầm loa thông báo 📢',
    category: 'action',
    dialogue: 'LOA LOA LOA! Thông báo đặc biệt: Chúc bạn luôn rạng rỡ và hạnh phúc! 📣',
    sound: 'pop',
    particles: ['📢', '📣', '✨', '🎉']
  },

  // WALK FRAMES
  {
    id: 'walk_01',
    name: '25_walk_01',
    src: '/sprites/25_walk_01.png',
    label: 'Đi bộ bước 1 🚶‍♀️',
    category: 'walk',
    isWalkFrame: true,
    walkStep: 1
  },
  {
    id: 'walk_02',
    name: '26_walk_02',
    src: '/sprites/26_walk_02.png',
    label: 'Đi bộ bước 2 🚶‍♀️',
    category: 'walk',
    isWalkFrame: true,
    walkStep: 2
  },
  {
    id: 'walk_03',
    name: '27_walk_03',
    src: '/sprites/27_walk_03.png',
    label: 'Đi bộ bước 3 🚶‍♀️',
    category: 'walk',
    isWalkFrame: true,
    walkStep: 3
  },
  {
    id: 'walk_04',
    name: '28_walk_04',
    src: '/sprites/28_walk_04.png',
    label: 'Đi bộ bước 4 🚶‍♀️',
    category: 'walk',
    isWalkFrame: true,
    walkStep: 4
  },

  // RUN FRAMES
  {
    id: 'run_01',
    name: '29_run_01',
    src: '/sprites/29_run_01.png',
    label: 'Chạy tung tăng 1 🏃‍♀️',
    category: 'run',
    isWalkFrame: true,
    isRun: true,
    runStep: 1
  },
  {
    id: 'run_02',
    name: '30_run_02',
    src: '/sprites/30_run_02.png',
    label: 'Chạy tung tăng 2 🏃‍♀️',
    category: 'run',
    isWalkFrame: true,
    isRun: true,
    runStep: 2
  },
  {
    id: 'run_03',
    name: '31_run_03',
    src: '/sprites/31_run_03.png',
    label: 'Chạy tung tăng 3 🏃‍♀️',
    category: 'run',
    isWalkFrame: true,
    isRun: true,
    runStep: 3
  },
  {
    id: 'run_04',
    name: '32_run_04',
    src: '/sprites/32_run_04.png',
    label: 'Chạy tung tăng 4 🏃‍♀️',
    category: 'run',
    isWalkFrame: true,
    isRun: true,
    runStep: 4
  },
  {
    id: 'run_05',
    name: '33_run_05',
    src: '/sprites/33_run_05.png',
    label: 'Chạy tung tăng 5 🏃‍♀️',
    category: 'run',
    isWalkFrame: true,
    isRun: true,
    runStep: 5
  },
];

// Walk animation frame lists
export const WALK_FRAMES = [
  '/sprites/25_walk_01.png',
  '/sprites/26_walk_02.png',
  '/sprites/27_walk_03.png',
  '/sprites/28_walk_04.png',
];

export const RUN_FRAMES = [
  '/sprites/29_run_01.png',
  '/sprites/30_run_02.png',
  '/sprites/31_run_03.png',
  '/sprites/32_run_04.png',
  '/sprites/33_run_05.png',
];

// Spontaneous idle actions sequence when the user leaves the character alone
export const IDLE_ROUTINES = [
  { stickerId: 'pose_chin_rest', duration: 4000, dialogue: 'Nhìn bạn tập trung làm việc xinh xắn ghê á~ 🌸' },
  { stickerId: 'pose_drink_boba', duration: 5000, dialogue: 'Trà sữa thơm ngon mời bạn một ngụm nha! 🧋' },
  { stickerId: 'pose_laptop_work', duration: 6000, dialogue: 'Bé gõ code phụ bạn nè... Cố lên nào! 💻' },
  { stickerId: 'pose_music_listen', duration: 5000, dialogue: 'Nghe bài này chill cực kì luôn á~ 🎧' },
  { stickerId: 'pose_phone_lying', duration: 5000, dialogue: 'Nằm xả hơi ngắm mây ngắm trời tí xíu~ 📱' },
  { stickerId: 'pose_finger_heart', duration: 3500, dialogue: 'Thả tim nè pằng pằng pằng! 💖' },
  { stickerId: 'pose_thumb_like', duration: 3500, dialogue: 'Tuyệt vời lắm luôn! Like 100 lần! 👍' },
];
