/**
 * Offline-resilient Ambient Sound Generator using the Web Audio API.
 * Synthesizes relaxing procedural soundscapes without relying on external MP3 URLs.
 */

export type AmbientSoundType = 'rain' | 'ocean' | 'cafe' | 'forest' | 'fireplace' | 'whitenoise';

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private currentType: AmbientSoundType | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private volume: number = 0.5;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentType(): AmbientSoundType | null {
    return this.isPlaying ? this.currentType : null;
  }

  public stop() {
    this.activeNodes.forEach((node) => {
      if (typeof node === 'number') {
        clearInterval(node);
      } else {
        try {
          if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        } catch {
          // ignore disconnect errors
        }
      }
    });
    this.activeNodes = [];
    this.isPlaying = false;
  }

  public play(type: AmbientSoundType) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.isPlaying && this.currentType === type) {
      return;
    }

    this.stop();
    this.currentType = type;
    this.isPlaying = true;

    switch (type) {
      case 'rain':
        this.startRain();
        break;
      case 'ocean':
        this.startOcean();
        break;
      case 'whitenoise':
        this.startWhiteNoise();
        break;
      case 'fireplace':
        this.startFireplace();
        break;
      case 'cafe':
        this.startCafe();
        break;
      case 'forest':
        this.startForest();
        break;
    }
  }

  public toggle(type: AmbientSoundType): boolean {
    if (this.isPlaying && this.currentType === type) {
      this.stop();
      return false;
    } else {
      this.play(type);
      return true;
    }
  }

  // Create a buffer with pink/white noise
  private createNoiseBuffer(durationSeconds = 5): AudioBuffer {
    const sampleRate = this.ctx!.sampleRate;
    const buffer = this.ctx!.createBuffer(1, sampleRate * durationSeconds, sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  private startWhiteNoise() {
    const bufferNode = this.ctx!.createBufferSource();
    bufferNode.buffer = this.createNoiseBuffer();
    bufferNode.loop = true;

    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, this.ctx!.currentTime);

    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx!.currentTime);

    bufferNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    bufferNode.start();
    this.activeNodes.push(bufferNode, filter, gain);
  }

  private startRain() {
    const bufferNode = this.ctx!.createBufferSource();
    bufferNode.buffer = this.createNoiseBuffer();
    bufferNode.loop = true;

    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, this.ctx!.currentTime);
    filter.Q.setValueAtTime(0.8, this.ctx!.currentTime);

    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(0.35, this.ctx!.currentTime);

    bufferNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    bufferNode.start();
    this.activeNodes.push(bufferNode, filter, gain);
  }

  private startOcean() {
    const bufferNode = this.ctx!.createBufferSource();
    bufferNode.buffer = this.createNoiseBuffer();
    bufferNode.loop = true;

    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, this.ctx!.currentTime);

    // Modulate gain smoothly like ocean waves (8-second cycle)
    const waveGain = this.ctx!.createGain();
    waveGain.gain.setValueAtTime(0.15, this.ctx!.currentTime);

    const lfo = this.ctx!.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, this.ctx!.currentTime); // ~8 sec wave

    const lfoGain = this.ctx!.createGain();
    lfoGain.gain.setValueAtTime(0.12, this.ctx!.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    bufferNode.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.masterGain!);

    bufferNode.start();
    lfo.start();
    this.activeNodes.push(bufferNode, filter, waveGain, lfo, lfoGain);
  }

  private startFireplace() {
    const bufferNode = this.ctx!.createBufferSource();
    bufferNode.buffer = this.createNoiseBuffer();
    bufferNode.loop = true;

    const lowFilter = this.ctx!.createBiquadFilter();
    lowFilter.type = 'lowpass';
    lowFilter.frequency.setValueAtTime(450, this.ctx!.currentTime);

    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx!.currentTime);

    bufferNode.connect(lowFilter);
    lowFilter.connect(gain);
    gain.connect(this.masterGain!);
    bufferNode.start();
    this.activeNodes.push(bufferNode, lowFilter, gain);

    // Random crackle pops
    const interval = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const crackGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150 + Math.random() * 400, this.ctx.currentTime);
        crackGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        crackGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
        osc.connect(crackGain);
        crackGain.connect(this.masterGain!);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      } catch {
        // ignore
      }
    }, 450);
    this.activeNodes.push(interval);
  }

  private startCafe() {
    const bufferNode = this.ctx!.createBufferSource();
    bufferNode.buffer = this.createNoiseBuffer();
    bufferNode.loop = true;

    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.ctx!.currentTime);
    filter.Q.setValueAtTime(0.5, this.ctx!.currentTime);

    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx!.currentTime);

    bufferNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    bufferNode.start();
    this.activeNodes.push(bufferNode, filter, gain);
  }

  private startForest() {
    const bufferNode = this.ctx!.createBufferSource();
    bufferNode.buffer = this.createNoiseBuffer();
    bufferNode.loop = true;

    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1400, this.ctx!.currentTime);

    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(0.12, this.ctx!.currentTime);

    bufferNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    bufferNode.start();
    this.activeNodes.push(bufferNode, filter, gain);
  }
}

export const ambientSound = new AmbientSoundEngine();
