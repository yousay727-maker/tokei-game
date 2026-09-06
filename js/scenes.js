/**
 * 生活シーンデータ（4歳児の生活リズムと連動したイラストとお題）
 */
const DAILY_SCENES = [
  {
    hour: 7,
    minute: 0,
    title: "あさごはん",
    desc: "あさ 7じ！ おいしい ごはんを たべよう！",
    emoji: "🍳",
    color: "#FFEAA7",
    badgeColor: "#F39C12",
    bgColor: "#FFF8E7",
    iconSvg: `<svg viewBox="0 0 100 100" class="scene-illustration">
      <ellipse cx="50" cy="70" rx="35" ry="12" fill="#E2E8F0"/>
      <ellipse cx="50" cy="65" rx="30" ry="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      <circle cx="50" cy="45" r="28" fill="#FFFBEB" stroke="#FDE68A" stroke-width="3"/>
      <!-- 目玉焼き -->
      <ellipse cx="50" cy="45" rx="20" ry="16" fill="#FFFFFF"/>
      <circle cx="50" cy="45" r="9" fill="#F59E0B"/>
      <circle cx="47" cy="42" r="3" fill="#FEF3C7"/>
      <!-- フォークとスプーン -->
      <path d="M 12 35 L 12 65 M 9 35 L 15 35" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
      <path d="M 88 35 L 88 65" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="88" cy="38" rx="5" ry="7" fill="#94A3B8"/>
    </svg>`
  },
  {
    hour: 8,
    minute: 30,
    title: "しゅっぱつ！",
    desc: "8じはん！ ようちえん・ほいくえんに しゅっぱつ！",
    emoji: "🎒",
    color: "#DDF4FF",
    badgeColor: "#0284C7",
    bgColor: "#F0F9FF",
    iconSvg: `<svg viewBox="0 0 100 100" class="scene-illustration">
      <!-- リュックサック -->
      <rect x="25" y="25" width="50" height="55" rx="14" fill="#38BDF8" stroke="#0284C7" stroke-width="3"/>
      <rect x="35" y="48" width="30" height="25" rx="6" fill="#BAE6FD"/>
      <!-- ポケットファスナー -->
      <line x1="38" y1="55" x2="62" y2="55" stroke="#0284C7" stroke-width="2"/>
      <!-- 持ち手 -->
      <path d="M 40 25 Q 50 12 60 25" fill="none" stroke="#0284C7" stroke-width="4" stroke-linecap="round"/>
      <!-- きらきら星 -->
      <path d="M 18 20 L 21 27 L 28 27 L 22 31 L 24 38 L 18 34 L 12 38 L 14 31 L 8 27 L 15 27 Z" fill="#FBBF24"/>
    </svg>`
  },
  {
    hour: 10,
    minute: 0,
    title: "あそびの じかん",
    desc: "10じ！ おそとで 元気に あそぼう！",
    emoji: "⚽",
    color: "#DCFCE7",
    badgeColor: "#16A34A",
    bgColor: "#F0FDF4",
    iconSvg: `<svg viewBox="0 0 100 100" class="scene-illustration">
      <!-- サッカーボールと太陽 -->
      <circle cx="75" cy="25" r="14" fill="#FBBF24"/>
      <circle cx="45" cy="55" r="28" fill="#FFFFFF" stroke="#334155" stroke-width="3"/>
      <polygon points="45,43 53,49 50,58 40,58 37,49" fill="#334155"/>
      <line x1="45" y1="43" x2="45" y2="28" stroke="#334155" stroke-width="2"/>
      <line x1="53" y1="49" x2="68" y2="43" stroke="#334155" stroke-width="2"/>
      <line x1="50" y1="58" x2="60" y2="72" stroke="#334155" stroke-width="2"/>
      <line x1="40" y1="58" x2="30" y2="72" stroke="#334155" stroke-width="2"/>
      <line x1="37" y1="49" x2="22" y2="43" stroke="#334155" stroke-width="2"/>
    </svg>`
  },
  {
    hour: 12,
    minute: 0,
    title: "おひるごはん",
    desc: "12じ！ おひるごはんだよ！ おなかすいたね！",
    emoji: "🍙",
    color: "#FFEDD5",
    badgeColor: "#EA580C",
    bgColor: "#FFF7ED",
    iconSvg: `<svg viewBox="0 0 100 100" class="scene-illustration">
      <!-- おにぎり -->
      <path d="M 50 20 Q 55 18 60 25 L 82 65 Q 85 72 78 75 L 22 75 Q 15 72 18 65 L 40 25 Q 45 18 50 20 Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
      <!-- のり -->
      <path d="M 38 75 L 38 52 Q 50 50 62 52 L 62 75 Z" fill="#1E293B"/>
      <!-- うめぼしやほっぺ -->
      <ellipse cx="33" cy="45" rx="4" ry="2" fill="#FCA5A5"/>
      <ellipse cx="67" cy="45" rx="4" ry="2" fill="#FCA5A5"/>
    </svg>`
  },
  {
    hour: 15,
    minute: 0,
    title: "おやつの じかん",
    desc: "3じ！ まってました！ おやつの じかん！",
    emoji: "🍰",
    color: "#FCE7F3",
    badgeColor: "#DB2777",
    bgColor: "#FDF2F8",
    iconSvg: `<svg viewBox="0 0 100 100" class="scene-illustration">
      <!-- ケーキ -->
      <path d="M 20 65 L 80 65 L 80 48 L 50 35 L 20 48 Z" fill="#FDE047"/>
      <path d="M 20 78 L 80 78 L 80 65 L 20 65 Z" fill="#F472B6"/>
      <!-- クリーム -->
      <path d="M 20 48 Q 28 55 35 48 Q 42 55 50 48 Q 58 55 65 48 Q 72 55 80 48 L 80 44 L 20 44 Z" fill="#FFFFFF"/>
      <!-- いちご -->
      <ellipse cx="50" cy="28" rx="8" ry="11" fill="#EF4444"/>
      <path d="M 46 20 L 54 20 L 50 16 Z" fill="#22C55E"/>
    </svg>`
  },
  {
    hour: 17,
    minute: 0,
    title: "おかたづけ",
    desc: "5じ！ おもちゃを かたづけようね！",
    emoji: "🧸",
    color: "#EDE9FE",
    badgeColor: "#7C3AED",
    bgColor: "#F5F3FF",
    iconSvg: `<svg viewBox="0 0 100 100" class="scene-illustration">
      <!-- くまのぬいぐるみ -->
      <circle cx="28" cy="30" r="12" fill="#D97706"/>
      <circle cx="28" cy="30" r="7" fill="#FDE68A"/>
      <circle cx="72" cy="30" r="12" fill="#D97706"/>
      <circle cx="72" cy="30" r="7" fill="#FDE68A"/>
      <circle cx="50" cy="48" r="25" fill="#B45309"/>
      <ellipse cx="50" cy="54" rx="12" ry="9" fill="#FDE68A"/>
      <circle cx="50" cy="50" r="4" fill="#1F2937"/>
      <circle cx="42" cy="44" r="3" fill="#1F2937"/>
      <circle cx="58" cy="44" r="3" fill="#1F2937"/>
    </svg>`
  },
  {
    hour: 18,
    minute: 0,
    title: "ばんごはん",
    desc: "6じ！ よるの ごはんだよ！ いっぱい たべよう！",
    emoji: "🍲",
    color: "#FEF3C7",
    badgeColor: "#D97706",
    bgColor: "#FFFBEB",
    iconSvg: `<svg viewBox="0 0 100 100" class="scene-illustration">
      <!-- おなべ -->
      <ellipse cx="50" cy="70" rx="36" ry="10" fill="#E2E8F0"/>
      <path d="M 18 45 L 24 70 Q 50 82 76 70 L 82 45 Z" fill="#EF4444" stroke="#DC2626" stroke-width="2"/>
      <rect x="8" y="47" width="10" height="6" rx="3" fill="#DC2626"/>
      <rect x="82" y="47" width="10" height="6" rx="3" fill="#DC2626"/>
      <!-- ゆげ -->
      <path d="M 38 36 Q 34 26 40 18" fill="none" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
      <path d="M 50 34 Q 54 24 48 15" fill="none" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
      <path d="M 62 36 Q 58 26 64 18" fill="none" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
    </svg>`
  },
  {
    hour: 19,
    minute: 0,
    title: "おふろ",
    desc: "7じ！ おふろに はいって ぽっかぽか！",
    emoji: "🛁",
    color: "#E0F2FE",
    badgeColor: "#0284C7",
    bgColor: "#F0F9FF",
    iconSvg: `<svg viewBox="0 0 100 100" class="scene-illustration">
      <!-- お風呂・あわあわ -->
      <path d="M 15 50 Q 15 75 50 75 Q 85 75 85 50 Z" fill="#38BDF8"/>
      <ellipse cx="50" cy="50" rx="35" ry="8" fill="#BAE6FD"/>
      <!-- あひる隊長 -->
      <circle cx="50" cy="40" r="10" fill="#FACC15"/>
      <polygon points="56,40 66,42 56,45" fill="#F97316"/>
      <circle cx="52" cy="38" r="2" fill="#1F2937"/>
      <!-- あわ -->
      <circle cx="30" cy="36" r="6" fill="#FFFFFF" opacity="0.8"/>
      <circle cx="68" cy="32" r="8" fill="#FFFFFF" opacity="0.8"/>
      <circle cx="40" cy="26" r="5" fill="#FFFFFF" opacity="0.8"/>
    </svg>`
  },
  {
    hour: 20,
    minute: 0,
    title: "おやすみ",
    desc: "8じ！ はをみがいて、おふとんで おやすみなさい！",
    emoji: "🌙",
    color: "#E0E7FF",
    badgeColor: "#4F46E5",
    bgColor: "#EEF2FF",
    iconSvg: `<svg viewBox="0 0 100 100" class="scene-illustration">
      <!-- 三日月とお星さま -->
      <path d="M 65 20 A 30 30 0 1 0 75 75 A 25 25 0 0 1 65 20 Z" fill="#FBBF24"/>
      <circle cx="28" cy="32" r="3" fill="#FFFFFF"/>
      <circle cx="36" cy="60" r="2.5" fill="#FFFFFF"/>
      <circle cx="78" cy="35" r="2" fill="#FFFFFF"/>
      <!-- おふとん -->
      <rect x="20" y="65" width="60" height="20" rx="8" fill="#818CF8"/>
      <rect x="25" y="58" width="20" height="12" rx="4" fill="#FFFFFF"/>
    </svg>`
  }
];

// 時間から一番近い日常シーンを取得
function getSceneForTime(hour, minute = 0) {
  // 24時間制対応（午前午後の生活イメージ）
  let normalizedHour = hour % 12;
  if (normalizedHour === 0) normalizedHour = 12;

  // 15時＝3時、20時＝8時などのマッピング
  if (hour >= 13 && hour <= 23) {
    // 午後
    if (hour === 15 || hour === 3) return DAILY_SCENES.find(s => s.hour === 15);
    if (hour === 17 || hour === 5) return DAILY_SCENES.find(s => s.hour === 17);
    if (hour === 18 || hour === 6) return DAILY_SCENES.find(s => s.hour === 18);
    if (hour === 19 || hour === 7) return DAILY_SCENES.find(s => s.hour === 19);
    if (hour >= 20 || hour <= 5) return DAILY_SCENES.find(s => s.hour === 20);
  }

  // 朝・昼
  const exact = DAILY_SCENES.find(s => (s.hour % 12) === normalizedHour);
  if (exact) return exact;

  // なければ時間帯で分類
  if (normalizedHour >= 6 && normalizedHour <= 8) return DAILY_SCENES[0];
  if (normalizedHour >= 9 && normalizedHour <= 11) return DAILY_SCENES[2];
  if (normalizedHour === 12 || normalizedHour === 1) return DAILY_SCENES[3];
  if (normalizedHour >= 2 && normalizedHour <= 4) return DAILY_SCENES[4];
  if (normalizedHour >= 5 && normalizedHour <= 7) return DAILY_SCENES[6];
  return DAILY_SCENES[8];
}
