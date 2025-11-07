class AudioSystem {
  private audioContext: AudioContext | null = null;
  private initialized = false;
  private masterVolume = 0.5;
  private soundEnabled = true;

  async initialize() {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.initialized = true;
      console.log('Audio system initialized');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  private async resumeContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  private playTone(frequency: number, duration: number, volume: number = 0.3) {
    if (!this.soundEnabled || !this.audioContext) return;

    this.resumeContext();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume * this.masterVolume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playLetterTap(index: number = 0) {
    const baseFreq = 400;
    const freq = baseFreq + (index * 20);
    this.playTone(freq, 0.05, 0.2);
  }

  playWordValid() {
    if (!this.soundEnabled || !this.audioContext) return;
    this.resumeContext();

    // Play ascending chord
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    frequencies.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 0.25), i * 50);
    });
  }

  playWordInvalid() {
    this.playTone(200, 0.15, 0.15);
  }

  playCombo(level: number) {
    const baseFreq = 600;
    const freq = baseFreq + (level * 100);
    this.playTone(freq, 0.3, 0.3);
  }

  playLevelUp() {
    if (!this.soundEnabled || !this.audioContext) return;
    this.resumeContext();

    // Triumphant fanfare
    const melody = [523.25, 587.33, 659.25, 783.99, 880.00]; // C5, D5, E5, G5, A5
    melody.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.25, 0.35), i * 100);
    });
  }

  playPowerUp() {
    if (!this.soundEnabled || !this.audioContext) return;
    this.resumeContext();

    // Rising whoosh
    const startFreq = 200;
    const endFreq = 1000;
    const duration = 0.5;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);

    gainNode.gain.setValueAtTime(0.3 * this.masterVolume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playAchievement() {
    if (!this.soundEnabled || !this.audioContext) return;
    this.resumeContext();

    // Epic orchestral hit simulation
    const frequencies = [130.81, 164.81, 196.00, 261.63]; // C3, E3, G3, C4
    frequencies.forEach((freq) => {
      this.playTone(freq, 0.8, 0.2);
    });
  }

  playSurgeMode() {
    if (!this.soundEnabled || !this.audioContext) return;
    this.resumeContext();

    // Intense rising tone
    const melody = [392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 739.99, 783.99];
    melody.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.1, 0.25), i * 40);
    });
  }

  playTick() {
    this.playTone(800, 0.05, 0.1);
  }

  playGameOver() {
    if (!this.soundEnabled || !this.audioContext) return;
    this.resumeContext();

    // Descending tones
    const melody = [523.25, 493.88, 440.00, 392.00]; // C5, B4, A4, G4
    melody.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, 0.25), i * 150);
    });
  }

  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }
}

export const audioSystem = new AudioSystem();
