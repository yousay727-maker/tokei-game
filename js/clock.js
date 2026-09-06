/**
 * インタラクティブSVG時計コンポーネント
 */
class ClockComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = Object.assign({
      readOnly: false,
      snapToMinutes: 60, // 60: ちょうどのみ、30: はん対応、5: 5分刻み、1: 1分刻み
      showMinuteLabels: true,
      onChange: null
    }, options);

    this.hour = 3;
    this.minute = 0;
    this.isDragging = null; // 'hour' | 'minute' | null
    this.lastTickMinute = 0;

    this.render();
    this.attachEvents();
  }

  // 時間の設定（0〜12, 0〜59）
  setTime(hour, minute, animate = false) {
    this.hour = hour % 12 === 0 ? 12 : hour % 12;
    this.minute = Math.round(minute) % 60;
    this.updateHands(animate);
    if (this.options.onChange) {
      this.options.onChange(this.hour, this.minute);
    }
  }

  getTime() {
    return { hour: this.hour, minute: this.minute };
  }

  setReadOnly(readOnly) {
    this.options.readOnly = readOnly;
    if (this.svg) {
      this.svg.classList.toggle('readonly', readOnly);
    }
  }

  setSnap(minutes) {
    this.options.snapToMinutes = minutes;
  }

  render() {
    const size = 340;
    const center = size / 2;
    const radius = 145;

    // 文字盤の目盛りと数字
    let hourNumbersSvg = '';
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30) * (Math.PI / 180);
      const numR = radius - 30;
      const x = center + numR * Math.sin(angle);
      const y = center - numR * Math.cos(angle) + 9; // フォントベースライン補正
      hourNumbersSvg += `
        <g class="hour-mark-group" data-hour="${i}">
          <circle cx="${x}" cy="${y - 9}" r="18" class="hour-num-bg"/>
          <text x="${x}" y="${y}" class="hour-num">${i}</text>
        </g>
      `;
    }

    // 分の補助表示（外側の小さなドットと主な数字: 00, 15, 30, 45）
    let minuteMarksSvg = '';
    for (let m = 0; m < 60; m++) {
      const angle = (m * 6) * (Math.PI / 180);
      const is5Min = m % 5 === 0;
      const rOuter = radius - 2;
      const rInner = is5Min ? radius - 14 : radius - 7;
      const x1 = center + rOuter * Math.sin(angle);
      const y1 = center - rOuter * Math.cos(angle);
      const x2 = center + rInner * Math.sin(angle);
      const y2 = center - rInner * Math.cos(angle);

      minuteMarksSvg += `
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
          class="min-tick ${is5Min ? 'min-tick-large' : 'min-tick-small'}" />
      `;

      if (is5Min && this.options.showMinuteLabels) {
        const textR = radius + 15;
        const tx = center + textR * Math.sin(angle);
        const ty = center - textR * Math.cos(angle) + 4;
        const labelText = m === 0 ? '0' : `${m}`;
        minuteMarksSvg += `
          <text x="${tx}" y="${ty}" class="min-label">${labelText}</text>
        `;
      }
    }

    this.container.innerHTML = `
      <div class="clock-wrapper">
        <svg id="clock-svg" class="clock-svg ${this.options.readOnly ? 'readonly' : ''}" 
             viewBox="0 0 ${size} ${size}" width="100%" height="100%">
          <defs>
            <radialGradient id="clockFaceGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FFFFFF"/>
              <stop offset="85%" stop-color="#FFFDF7"/>
              <stop offset="100%" stop-color="#F5EFE0"/>
            </radialGradient>
            <filter id="clockShadow" x="-10%" y="-10%" width="125%" height="125%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#E2D4B7" flood-opacity="0.6"/>
            </filter>
            <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.2"/>
            </filter>
          </defs>

          <!-- 時計の外枠 -->
          <circle cx="${center}" cy="${center}" r="${radius + 18}" class="clock-outer-rim" filter="url(#clockShadow)"/>
          <circle cx="${center}" cy="${center}" r="${radius}" class="clock-rim"/>
          <circle cx="${center}" cy="${center}" r="${radius - 4}" fill="url(#clockFaceGrad)"/>

          <!-- かわいい時計のお顔（背景） -->
          <g class="clock-cute-face">
            <ellipse cx="${center - 32}" cy="${center + 20}" rx="4" ry="6" fill="#3D405B"/>
            <ellipse cx="${center + 32}" cy="${center + 20}" rx="4" ry="6" fill="#3D405B"/>
            <circle cx="${center - 30}" cy="${center + 18}" r="1.5" fill="#FFFFFF"/>
            <circle cx="${center + 34}" cy="${center + 18}" r="1.5" fill="#FFFFFF"/>
            <!-- ほっぺ -->
            <ellipse cx="${center - 42}" cy="${center + 26}" rx="8" ry="5" fill="#FF8A8A" opacity="0.45"/>
            <ellipse cx="${center + 42}" cy="${center + 26}" rx="8" ry="5" fill="#FF8A8A" opacity="0.45"/>
            <!-- おくち -->
            <path d="M ${center - 10} ${center + 28} Q ${center} ${center + 36} ${center + 10} ${center + 28}" 
                  fill="none" stroke="#3D405B" stroke-width="2.5" stroke-linecap="round"/>
          </g>

          <!-- 目盛り -->
          <g class="clock-minutes-group">${minuteMarksSvg}</g>
          <!-- 数字 -->
          <g class="clock-numbers-group">${hourNumbersSvg}</g>

          <!-- 短針 (時針: 赤) -->
          <g id="hour-hand-group" class="hand-group" filter="url(#handShadow)">
            <!-- 針本体 -->
            <path d="M ${center - 7} ${center} L ${center - 5} ${center - 70} L ${center} ${center - 85} L ${center + 5} ${center - 70} L ${center + 7} ${center} Z" class="hour-hand-body"/>
            <!-- つまみ部分（タッチしやすい大きめの丸） -->
            <circle cx="${center}" cy="${center - 85}" r="14" class="hand-knob hour-knob"/>
            <text x="${center}" y="${center - 81}" class="hand-tag">じ</text>
          </g>

          <!-- 長針 (分針: 青) -->
          <g id="minute-hand-group" class="hand-group" filter="url(#handShadow)">
            <!-- 針本体 -->
            <path d="M ${center - 5} ${center} L ${center - 4} ${center - 110} L ${center} ${center - 128} L ${center + 4} ${center - 110} L ${center + 5} ${center} Z" class="minute-hand-body"/>
            <!-- つまみ部分 -->
            <circle cx="${center}" cy="${center - 128}" r="15" class="hand-knob minute-knob"/>
            <text x="${center}" y="${center - 124}" class="hand-tag">ふん</text>
          </g>

          <!-- センターピン -->
          <circle cx="${center}" cy="${center}" r="10" class="clock-center-cap"/>
          <circle cx="${center}" cy="${center}" r="4" fill="#FFFFFF"/>
        </svg>
      </div>
    `;

    this.svg = this.container.querySelector('#clock-svg');
    this.hourHandGroup = this.container.querySelector('#hour-hand-group');
    this.minuteHandGroup = this.container.querySelector('#minute-hand-group');
    this.center = center;

    this.updateHands();
  }

  updateHands(animate = false) {
    if (!this.hourHandGroup || !this.minuteHandGroup) return;

    // 長針の角度: 1分あたり 6度
    const minuteDeg = this.minute * 6;
    // 短針の角度: 1時間あたり 30度 + 1分あたり 0.5度
    const hourDeg = (this.hour % 12) * 30 + this.minute * 0.5;

    const transitionStyle = animate ? 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none';
    this.minuteHandGroup.style.transition = transitionStyle;
    this.hourHandGroup.style.transition = transitionStyle;

    this.minuteHandGroup.style.transformOrigin = `${this.center}px ${this.center}px`;
    this.hourHandGroup.style.transformOrigin = `${this.center}px ${this.center}px`;

    this.minuteHandGroup.style.transform = `rotate(${minuteDeg}deg)`;
    this.hourHandGroup.style.transform = `rotate(${hourDeg}deg)`;

    // 現在の「時」に対応する文字盤の数字をほんのりハイライト
    const activeHour = this.hour % 12 === 0 ? 12 : this.hour % 12;
    this.container.querySelectorAll('.hour-mark-group').forEach(group => {
      const h = parseInt(group.getAttribute('data-hour'), 10);
      group.classList.toggle('active', h === activeHour);
    });
  }

  attachEvents() {
    const onStart = (e) => {
      if (this.options.readOnly) return;
      const point = this.getSvgPoint(e);
      const target = e.target.closest('.hand-group');

      if (target === this.minuteHandGroup) {
        this.isDragging = 'minute';
      } else if (target === this.hourHandGroup) {
        this.isDragging = 'hour';
      } else {
        // 盤面を直接タップした場合は、近い針または分針を動かす
        const dx = point.x - this.center;
        const dy = point.y - this.center;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 25 && dist < 160) {
          // 盤面の外側タップは分針、内側は時針
          this.isDragging = dist > 95 ? 'minute' : 'hour';
          this.handleDrag(point);
        }
      }

      if (this.isDragging) {
        e.preventDefault();
        window.soundEngine.init();
      }
    };

    const onMove = (e) => {
      if (!this.isDragging) return;
      e.preventDefault();
      const point = this.getSvgPoint(e);
      this.handleDrag(point);
    };

    const onEnd = () => {
      if (this.isDragging) {
        this.isDragging = null;
        // ドラッグ終了時にスナップ調整
        this.snapTime();
      }
    };

    this.svg.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    this.svg.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
  }

  getSvgPoint(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = this.svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 340;
    const y = ((clientY - rect.top) / rect.height) * 340;
    return { x, y };
  }

  handleDrag(point) {
    const dx = point.x - this.center;
    const dy = point.y - this.center;
    // 12時位置を0度とする (上向き: 0度、時計回り正)
    let rad = Math.atan2(dx, -dy);
    let deg = (rad * 180) / Math.PI;
    if (deg < 0) deg += 360;

    if (this.isDragging === 'minute') {
      let rawMin = (deg / 6);
      let roundedMin = Math.round(rawMin);
      if (roundedMin >= 60) roundedMin = 0;

      // カチカチ音
      if (roundedMin !== this.lastTickMinute) {
        window.soundEngine.playTick();

        // 12時跨ぎの検出（時計回りに55分前後から0分付近へ跨いだら+1時間、逆なら-1時間）
        if (this.lastTickMinute >= 45 && roundedMin <= 15) {
          this.hour = (this.hour % 12) + 1;
        } else if (this.lastTickMinute <= 15 && roundedMin >= 45) {
          this.hour = this.hour === 1 ? 12 : this.hour - 1;
        }

        this.lastTickMinute = roundedMin;
      }

      this.minute = roundedMin;
      this.updateHands();
      if (this.options.onChange) {
        this.options.onChange(this.hour, this.minute);
      }
    } else if (this.isDragging === 'hour') {
      // 短針を直接回す
      let rawHour = (deg / 30);
      let roundedHour = Math.round(rawHour);
      if (roundedHour === 0) roundedHour = 12;

      if (roundedHour !== this.hour) {
        window.soundEngine.playTick();
        this.hour = roundedHour;
      }

      this.updateHands();
      if (this.options.onChange) {
        this.options.onChange(this.hour, this.minute);
      }
    }
  }

  // スナップ（指定分数刻みに自動吸着）
  snapTime() {
    const snap = this.options.snapToMinutes;
    if (snap > 1) {
      const snappedMin = Math.round(this.minute / snap) * snap;
      this.minute = snappedMin % 60;
      this.updateHands(true);
      if (this.options.onChange) {
        this.options.onChange(this.hour, this.minute);
      }
    }
  }
}
