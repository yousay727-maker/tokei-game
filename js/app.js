/**
 * とけいマスター - メインアプリケーション
 */

// ==================== 紙吹雪（Confetti）エフェクト ====================
class ConfettiEffect {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  start() {
    this.particles = [];
    const colors = ['#FF5964', '#35A7FF', '#FFE74C', '#2ECC71', '#9B59B6', '#FF9F1C'];
    for (let i = 0; i < 70; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: this.canvas.height / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 16 - 4,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.loop();
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let activeCount = 0;

    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // 重力
      p.rotation += p.vRot;
      p.opacity -= 0.008;

      if (p.opacity > 0 && p.y < this.canvas.height + 20) {
        activeCount++;
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        this.ctx.restore();
      }
    }

    if (activeCount > 0) {
      this.animationId = requestAnimationFrame(() => this.loop());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// ==================== アプリ本体 ====================
class App {
  constructor() {
    this.currentMode = 'quiz'; // 'quiz' | 'match' | 'free'
    this.quizDiff = 'easy'; // 'easy' | 'normal'
    this.matchDiff = 'easy';
    
    this.confetti = new ConfettiEffect('confetti-canvas');
    this.initPWA();
    this.initClocks();
    this.initDOM();
    
    // 初回クイズ開始
    this.startQuizQuestion();
  }

  initPWA() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.log('SW registration skipped:', err);
      });
    }
  }

  initClocks() {
    // 1. クイズ用時計（読み取り専用）
    this.quizClock = new ClockComponent('quiz-clock-container', {
      readOnly: true,
      showMinuteLabels: false
    });

    // 2. 時計合わせ用時計（ドラッグ可能・スナップ付き）
    this.matchClock = new ClockComponent('match-clock-container', {
      readOnly: false,
      snapToMinutes: 60,
      showMinuteLabels: true
    });

    // 3. フリー用時計
    this.freeClock = new ClockComponent('free-clock-container', {
      readOnly: false,
      snapToMinutes: 5,
      showMinuteLabels: true,
      onChange: (h, m) => this.onFreeClockChange(h, m)
    });
  }

  initDOM() {
    // サウンド切り替えボタン
    const soundBtn = document.getElementById('btn-sound-toggle');
    soundBtn.addEventListener('click', () => {
      const isMuted = window.soundEngine.toggleMute();
      soundBtn.textContent = isMuted ? '🔇' : '🔊';
    });

    // モードタブ切り替え
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundEngine.playPop();
        const mode = btn.dataset.mode;
        this.switchMode(mode);
      });
    });

    // クイズ難易度
    document.querySelectorAll('#view-quiz .diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundEngine.playPop();
        document.querySelectorAll('#view-quiz .diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.quizDiff = btn.dataset.diff;
        this.startQuizQuestion();
      });
    });

    // クイズのヒント音声ボタン
    document.getElementById('btn-quiz-speak').addEventListener('click', () => {
      window.soundEngine.playPop();
      this.speakQuizTime();
    });

    // 時計合わせ難易度
    document.querySelectorAll('#view-match .diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundEngine.playPop();
        document.querySelectorAll('#view-match .diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.matchDiff = btn.dataset.diff;
        this.matchClock.setSnap(this.matchDiff === 'easy' ? 60 : 30);
        this.startMatchQuestion();
      });
    });

    // 時計合わせの「できたよ！」判定ボタン
    document.getElementById('btn-match-check').addEventListener('click', () => {
      this.checkMatchAnswer();
    });

    // フリーモード音声ボタン
    document.getElementById('btn-free-speak').addEventListener('click', () => {
      const time = this.freeClock.getTime();
      const text = this.formatSpokenTime(time.hour, time.minute);
      window.soundEngine.speak(text);
    });

    // フリーモードのクイックジャンプボタン
    document.querySelectorAll('.quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundEngine.playPop();
        const [h, m] = btn.dataset.time.split(':').map(Number);
        this.freeClock.setTime(h, m, true);
        this.onFreeClockChange(h, m);
      });
    });

    // モーダル「つぎへ」ボタン
    document.getElementById('btn-feedback-next').addEventListener('click', () => {
      window.soundEngine.playPop();
      this.closeFeedbackModal();
      if (this.currentMode === 'quiz') {
        this.startQuizQuestion();
      } else if (this.currentMode === 'match') {
        this.startMatchQuestion();
      }
    });
  }

  switchMode(mode) {
    this.currentMode = mode;

    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === mode);
    });

    document.querySelectorAll('.view-section').forEach(s => {
      s.classList.remove('active');
    });

    const targetSection = document.getElementById(`view-${mode}`);
    if (targetSection) targetSection.classList.add('active');

    if (mode === 'quiz') {
      this.startQuizQuestion();
    } else if (mode === 'match') {
      this.matchClock.setSnap(this.matchDiff === 'easy' ? 60 : 30);
      this.startMatchQuestion();
    } else if (mode === 'free') {
      const t = this.freeClock.getTime();
      this.onFreeClockChange(t.hour, t.minute);
    }
  }

  // ==================== 1. クイズロジック ====================
  startQuizQuestion() {
    let hour = Math.floor(Math.random() * 12) + 1;
    let minute = 0;

    if (this.quizDiff === 'normal') {
      // 50%の確率で 30分（はん）
      if (Math.random() > 0.5) {
        minute = 30;
      }
    }

    this.currentQuizTime = { hour, minute };
    this.quizClock.setTime(hour, minute, true);

    // 選択肢作成（3択）
    const options = [this.currentQuizTime];
    while (options.length < 3) {
      let randH = Math.floor(Math.random() * 12) + 1;
      let randM = this.quizDiff === 'normal' ? (Math.random() > 0.5 ? 30 : 0) : 0;
      // 重複チェック
      const exists = options.some(o => o.hour === randH && o.minute === randM);
      if (!exists) {
        options.push({ hour: randH, minute: randM });
      }
    }

    // シャッフル
    options.sort(() => Math.random() - 0.5);

    // ボタン描画
    const container = document.getElementById('quiz-options-container');
    container.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = this.formatOptionHtml(opt.hour, opt.minute);
      btn.addEventListener('click', () => this.handleQuizAnswer(btn, opt));
      container.appendChild(btn);
    });

    // 問いかけ読み上げ
    setTimeout(() => {
      window.soundEngine.speak('いま なんじかな？');
    }, 200);
  }

  formatOptionHtml(h, m) {
    if (m === 0) {
      return `<span style="color: var(--color-hour); font-size: 1.6rem;">${h}</span><span style="font-size: 1rem;">じ</span>`;
    } else if (m === 30) {
      return `<span style="color: var(--color-hour); font-size: 1.6rem;">${h}</span><span style="font-size: 1rem;">じ</span> <span style="color: var(--color-minute); font-size: 1.2rem;">はん</span>`;
    }
    return `<span>${h}:${m < 10 ? '0' + m : m}</span>`;
  }

  formatSpokenTime(h, m) {
    if (m === 0) {
      return `${h}じ だよ！`;
    } else if (m === 30) {
      return `${h}じ はん だよ！`;
    }
    return `${h}じ ${m}ふん だよ！`;
  }

  speakQuizTime() {
    const spoken = this.formatSpokenTime(this.currentQuizTime.hour, this.currentQuizTime.minute);
    window.soundEngine.speak(spoken);
  }

  handleQuizAnswer(buttonEl, selected) {
    const isCorrect = (selected.hour === this.currentQuizTime.hour && selected.minute === this.currentQuizTime.minute);

    if (isCorrect) {
      buttonEl.classList.add('correct');
      window.soundEngine.playCorrect();
      this.confetti.start();
      
      const praise = ['すごい！', 'せいかい！', 'やったね！', 'だいせいかい！'];
      const randomPraise = praise[Math.floor(Math.random() * praise.length)];
      const answerSpoken = `${randomPraise} ${this.formatSpokenTime(this.currentQuizTime.hour, this.currentQuizTime.minute)}`;
      window.soundEngine.speak(answerSpoken);

      setTimeout(() => {
        this.showFeedbackModal('🎉', randomPraise, `${this.formatSpokenTime(this.currentQuizTime.hour, this.currentQuizTime.minute)}`);
      }, 700);
    } else {
      buttonEl.classList.add('wrong');
      window.soundEngine.playWrong();
      window.soundEngine.speak('おしい！ もういっかい！');
      setTimeout(() => {
        buttonEl.classList.remove('wrong');
      }, 1000);
    }
  }

  // ==================== 2. 時計合わせロジック ====================
  startMatchQuestion() {
    let hour = Math.floor(Math.random() * 12) + 1;
    let minute = 0;

    if (this.matchDiff === 'normal' && Math.random() > 0.5) {
      minute = 30;
    }

    this.currentMatchTarget = { hour, minute };

    // 時計の初期位置はお題と異なる位置にセット
    let initialHour = (hour + 4) % 12 || 12;
    this.matchClock.setTime(initialHour, 0, true);

    // お題カードの表示更新
    const targetEl = document.getElementById('match-target-text');
    const scene = getSceneForTime(hour, minute);

    let timeTextHtml = `<span class="question-highlight-hour">${hour}じ</span>`;
    if (minute === 30) {
      timeTextHtml += ` <span class="question-highlight-min">はん</span>`;
    }

    targetEl.innerHTML = `
      <span>${scene.emoji} <b>${timeTextHtml}</b> に してね！</span>
      <button id="btn-match-speak" class="speak-hint-btn" title="おだいを きく">🔊</button>
    `;

    document.getElementById('btn-match-speak').addEventListener('click', () => {
      window.soundEngine.playPop();
      this.speakMatchTarget();
    });

    setTimeout(() => {
      this.speakMatchTarget();
    }, 200);
  }

  speakMatchTarget() {
    const t = this.currentMatchTarget;
    let prompt = `${t.hour}じ に してね！`;
    if (t.minute === 30) {
      prompt = `${t.hour}じ はん に してね！`;
    }
    window.soundEngine.speak(prompt);
  }

  checkMatchAnswer() {
    const current = this.matchClock.getTime();
    const target = this.currentMatchTarget;

    // 許容誤差の判定
    const isHourMatch = (current.hour % 12) === (target.hour % 12);
    // 分は±5分以内なら合格
    const minDiff = Math.abs(current.minute - target.minute);
    const isMinuteMatch = (minDiff <= 5 || minDiff >= 55);

    if (isHourMatch && isMinuteMatch) {
      window.soundEngine.playCorrect();
      this.confetti.start();

      let praise = 'ぴったり！ すごいね！';
      let spoken = `${praise} ${this.formatSpokenTime(target.hour, target.minute)}`;
      window.soundEngine.speak(spoken);

      this.showFeedbackModal('🌟', 'せいかい！', praise);
    } else {
      window.soundEngine.playWrong();
      window.soundEngine.speak('おしい！ はりを まわして あわせてみてね！');
    }
  }

  // ==================== 3. フリーモード ====================
  onFreeClockChange(h, m) {
    // 画面の数字更新
    const hourEl = document.getElementById('free-digital-hour');
    const minEl = document.getElementById('free-digital-min');
    const kanaEl = document.getElementById('free-digital-kana');

    hourEl.textContent = h;
    minEl.textContent = m < 10 ? `0${m}` : m;

    let kana = `${h}じ`;
    if (m === 30) {
      kana += ' はん';
    } else if (m > 0) {
      kana += ` ${m}ふん`;
    }
    kanaEl.textContent = `（${kana}）`;

    // 生活シーンカードの更新
    const scene = getSceneForTime(h, m);
    const card = document.getElementById('free-scene-card');
    const iconBox = document.getElementById('free-scene-icon');
    const badge = document.getElementById('free-scene-badge');
    const title = document.getElementById('free-scene-title');
    const desc = document.getElementById('free-scene-desc');

    card.style.backgroundColor = scene.bgColor;
    iconBox.innerHTML = scene.iconSvg;
    badge.textContent = `${scene.emoji} ${scene.title}`;
    badge.style.backgroundColor = scene.badgeColor;
    title.textContent = scene.title;
    desc.textContent = scene.desc;
  }

  // ==================== モーダル ====================
  showFeedbackModal(icon, title, message) {
    const modal = document.getElementById('feedback-modal');
    document.getElementById('feedback-icon').textContent = icon;
    document.getElementById('feedback-title').textContent = title;
    document.getElementById('feedback-message').textContent = message;
    modal.classList.add('show');
  }

  closeFeedbackModal() {
    const modal = document.getElementById('feedback-modal');
    modal.classList.remove('show');
  }
}

// アプリ起動
window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
