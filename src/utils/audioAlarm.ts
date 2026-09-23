/**
 * Web Audio API Synthesizer for CyberX SOC Threat Alarms
 * Generates clear, high-tech cyber alert sound chimes directly in the browser.
 * Works with zero external sound files or network requests.
 */

class AudioAlarmManager {
  private ctx: AudioContext | null = null;
  public isSoundEnabled: boolean = true;
  private isUnlocked: boolean = false;

  constructor() {
    // Attach automatic unlock listeners on first user interaction in browser
    if (typeof window !== 'undefined') {
      const unlockHandler = () => {
        this.unlock();
        window.removeEventListener('click', unlockHandler);
        window.removeEventListener('keydown', unlockHandler);
        window.removeEventListener('touchstart', unlockHandler);
      };
      window.addEventListener('click', unlockHandler, { once: true, passive: true });
      window.addEventListener('keydown', unlockHandler, { once: true, passive: true });
      window.addEventListener('touchstart', unlockHandler, { once: true, passive: true });
    }
  }

  public unlock(): AudioContext | null {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.isUnlocked = true;
      return this.ctx;
    } catch (e) {
      console.warn('AudioContext initialization note:', e);
      return null;
    }
  }

  private getAudioContext(): AudioContext | null {
    return this.unlock();
  }

  /**
   * Plays a high-tech SOC cyber threat alarm beep/chime
   */
  public playThreatAlarm(severity: string = 'CRITICAL') {
    if (!this.isSoundEnabled) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const sev = severity.toUpperCase();

      if (sev === 'CRITICAL') {
        // High-urgency dual-pulse cyber alert siren (880Hz -> 440Hz -> 880Hz -> 440Hz)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.12);
        osc.frequency.setValueAtTime(880, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.32);

        gain.gain.setValueAtTime(0.20, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.start(now);
        osc.stop(now + 0.38);
      } else if (sev === 'HIGH') {
        // High severity warning chime (659Hz -> 523Hz)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659, now);
        osc.frequency.exponentialRampToValueAtTime(523, now + 0.22);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.start(now);
        osc.stop(now + 0.28);
      } else {
        // Medium/Low advisory blip
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.start(now);
        osc.stop(now + 0.20);
      }
    } catch (e) {
      console.warn('Audio alarm playback notice:', e);
    }
  }

  /**
   * Explicitly triggers a test alarm tone and returns sound status
   */
  public testAlarm(): boolean {
    this.unlock();
    this.playThreatAlarm('CRITICAL');
    return this.isSoundEnabled;
  }

  public toggleSound(): boolean {
    this.isSoundEnabled = !this.isSoundEnabled;
    if (this.isSoundEnabled) {
      this.testAlarm();
    }
    return this.isSoundEnabled;
  }
}

export const audioAlarm = new AudioAlarmManager();
