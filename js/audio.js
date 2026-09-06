/**
 * 音声エンジン（Web Audio API による効果音 ＆ Web Speech API による音声案内）
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.speechAvailable = 'speechSynthesis' in window;
  }

  // 初回ユーザー操作時にオーディオコンテキストを初期化
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.speechAvailable) {
      window.speechSynthesis.cancel();
    }
    return this.isMuted;
  }

  // 正解音（ピンポーン！）
  playCorrect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // 1音目（ド〜ミ：高いファ # 698Hz）
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(698.46, t); // F5
    gain1.gain.setValueAtTime(0.3, t);
    gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.4);

    // 2音目（高音のド 1046Hz）
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1046.5, t + 0.18); // C6
    gain2.gain.setValueAtTime(0.35, t + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t + 0.18);
    osc2.stop(t + 0.7);
  }

  // 大正解・クリア ファンファーレ
  playFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const t = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const startTime = t + i * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + (i === 3 ? 0.6 : 0.25));
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + (i === 3 ? 0.6 : 0.25));
    });
  }

  // 残念音（ぶぶー / やわらかい音）
  playWrong() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.linearRampToValueAtTime(180, t + 0.35);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, t);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  // 針を動かしたときのカチッという音
  playTick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  // ボタンタップ音
  playPop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  // 日本語音声読み上げ
  speak(text) {
    if (this.isMuted || !this.speechAvailable) return;
    try {
      window.speechSynthesis.cancel();
      const uttr = new SpeechSynthesisUtterance(text);
      uttr.lang = 'ja-JP';
      uttr.rate = 0.95; // 4歳児向けに少しゆったりと聞き取りやすく
      uttr.pitch = 1.15; // 明るく優しいトーン

      // 日本語の自然な音声があれば優先選択
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {};
      }
      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find(v => v.lang.includes('ja') || v.lang.includes('JP') || v.name.includes('Japanese'));
      if (jaVoice) {
        uttr.voice = jaVoice;
      }
      window.speechSynthesis.speak(uttr);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }
}

window.soundEngine = new SoundEngine();

// 初回クリック/タッチでオーディオをアンロック
const unlockAudio = () => {
  window.soundEngine.init();
  window.removeEventListener('click', unlockAudio);
  window.removeEventListener('touchstart', unlockAudio);
};
window.addEventListener('click', unlockAudio);
window.addEventListener('touchstart', unlockAudio);
