
class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.15; // Set global volume
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private osc(freq: number, type: OscillatorType = 'sine', duration: number = 0.1, volume: number = 1) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  public playHover() {
    this.osc(2400, 'sine', 0.05, 0.3);
  }

  public playClick() {
    this.osc(1200, 'square', 0.1, 0.2);
    this.osc(600, 'sine', 0.1, 0.4);
  }

  public playBootTick() {
    this.osc(Math.random() * 200 + 800, 'square', 0.02, 0.1);
  }

  public playSyncClick() {
    this.osc(1800, 'sine', 0.08, 0.5);
    this.osc(400, 'triangle', 0.2, 0.3);
  }

  public playScan(progress: number) {
    this.osc(400 + progress * 10, 'sawtooth', 0.05, 0.05);
  }

  public playBiometricCharge(progress: number) {
    // Progress is expected to be 0 to 100 for the hold portion
    this.osc(100 + progress * 5, 'sine', 0.1, 0.2);
  }

  public playSuccess() {
    const now = this.ctx?.currentTime || 0;
    [440, 554.37, 659.25, 880].forEach((f, i) => {
      setTimeout(() => this.osc(f, 'sine', 0.4, 0.5), i * 100);
    });
  }

  public playTransition() {
    if (!this.ctx || !this.masterGain) return;
    this.init();
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
  }

  public playDragStart() {
    this.osc(800, 'sine', 0.1, 0.2);
    this.osc(1600, 'sine', 0.05, 0.1);
  }

  public playDragEnd() {
    this.osc(1600, 'sine', 0.05, 0.1);
    this.osc(800, 'sine', 0.1, 0.2);
  }

  public playMapPing() {
    this.osc(3200, 'sine', 0.15, 0.4);
    setTimeout(() => this.osc(1600, 'sine', 0.1, 0.2), 50);
  }
}

export const soundManager = new SoundManager();
