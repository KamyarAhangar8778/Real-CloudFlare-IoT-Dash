class SoundManager {
  private audioCtx: AudioContext | null = null;
  private enabled: boolean = true;

  private ambientAudio: HTMLAudioElement | null = null;
  public isAmbientPlaying: boolean = false;
  
  public currentTrack: { title: string; creator: string; url: string; isLocal: boolean } | null = null;
  private onTrackUpdateCallback: ((track: any) => void) | null = null;
  
  public playlist: any[] = [];
  public currentTrackIndex: number = -1;

  constructor() {
    // Init is deferred to first user interaction
  }

  public setOnTrackUpdate(cb: (track: any) => void) {
    this.onTrackUpdateCallback = cb;
    if (this.currentTrack) {
      cb(this.currentTrack);
    }
  }

  private init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }
  
  public async fetchPlaylistIfNeeded() {
    if (this.playlist.length > 0) return true;
    try {
      const res = await fetch('https://archive.org/advancedsearch.php?q=subject:(traditional+OR+historical)+AND+subject:(instrumental)+AND+mediatype:(audio)&fl[]=identifier,title,creator&sort[]=downloads+desc&rows=30&output=json');
      if (res.ok) {
        const data = await res.json();
        if (data.response?.docs?.length > 0) {
          this.playlist = data.response.docs;
          this.currentTrackIndex = Math.floor(Math.random() * this.playlist.length);
          return true;
        }
      }
    } catch(err) {
      console.error("Audio API error:", err);
    }
    return false;
  }

  public async loadAmbientTrack(direction?: 'next' | 'prev') {
    if (typeof window === 'undefined') return;
    const source = localStorage.getItem('music_source') || 'local';
    
    if (source === 'local') {
      this.currentTrack = {
        title: 'Dele Divaneh',
        creator: 'Track 06',
        url: '/06 Dele Divaneh.mp3',
        isLocal: true
      };
    } else {
      const hasPlaylist = await this.fetchPlaylistIfNeeded();
      
      if (hasPlaylist) {
        if (direction === 'next') {
          this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        } else if (direction === 'prev') {
          this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        }
        
        let found = false;
        let attempts = 0;
        
        // Try up to 5 times to find a valid mp3 in the playlist
        while (!found && attempts < 5) {
          try {
            const track = this.playlist[this.currentTrackIndex];
            const metaRes = await fetch(`https://archive.org/metadata/${track.identifier}`);
            const metaData = await metaRes.json();
            
            const mp3File = metaData.files?.find((f: any) => f.format === "128Kbps MP3" || f.format === "VBR MP3" || f.name.endsWith(".mp3"));
            
            if (mp3File) {
              this.currentTrack = {
                title: track.title || "Unknown Title",
                creator: track.creator || "Unknown Creator",
                url: `https://archive.org/download/${track.identifier}/${mp3File.name}`,
                isLocal: false
              };
              found = true;
            } else {
              // Move to next if not found
              this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
              attempts++;
            }
          } catch(err) {
            this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
            attempts++;
          }
        }
        
        if (!found) {
          this.currentTrack = {
            title: 'Dele Divaneh',
            creator: 'Track 06 (Fallback)',
            url: '/06 Dele Divaneh.mp3',
            isLocal: true
          };
        }
      } else {
        this.currentTrack = {
          title: 'Dele Divaneh',
          creator: 'Track 06 (Fallback)',
          url: '/06 Dele Divaneh.mp3',
          isLocal: true
        };
      }
    }

    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio.src = this.currentTrack!.url;
      if (this.isAmbientPlaying) {
        this.ambientAudio.play().catch(e => console.error(e));
      }
    } else {
      this.ambientAudio = new Audio(this.currentTrack!.url);
      this.ambientAudio.loop = true;
      this.ambientAudio.volume = 0.3;
      if (this.isAmbientPlaying) {
        this.ambientAudio.play().catch(e => console.error(e));
      }
    }
    
    if (this.onTrackUpdateCallback) {
      this.onTrackUpdateCallback(this.currentTrack);
    }
  }

  public async nextTrack() {
    await this.loadAmbientTrack('next');
  }

  public async prevTrack() {
    await this.loadAmbientTrack('prev');
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (!val && this.isAmbientPlaying) {
      this.stopAmbient();
    }
  }

  public async toggleAmbient() {
    if (this.isAmbientPlaying) {
      this.stopAmbient();
      if (typeof window !== 'undefined') localStorage.setItem('music_disabled', 'true');
    } else {
      await this.startAmbient();
      if (typeof window !== 'undefined') localStorage.setItem('music_disabled', 'false');
    }
    return this.isAmbientPlaying;
  }

  public async startAmbient() {
    if (!this.enabled) return;
    this.init();
    
    if (!this.ambientAudio || !this.currentTrack) {
      await this.loadAmbientTrack();
    }
    
    if (!this.ambientAudio) return;
    if (this.isAmbientPlaying) return;

    this.isAmbientPlaying = true;
    this.ambientAudio.play().catch(e => {
      console.error("Audio playback failed", e);
      this.isAmbientPlaying = false;
    });
  }

  public stopAmbient() {
    if (!this.ambientAudio || !this.isAmbientPlaying) return;
    
    this.ambientAudio.pause();
    this.ambientAudio.currentTime = 0; // Optional: reset to beginning or keep position
    this.isAmbientPlaying = false;
  }

  // A subtle, soft click for generic buttons
  public playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.02);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.02);
  }

  // A slightly higher, pleasant rising tone for turning something ON
  public playToggleOn() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.08);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.06, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  // A lower, descending tone for turning something OFF
  public playToggleOff() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.08);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.06, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  // A soft chord or gentle bell for success
  public playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    const t = this.audioCtx.currentTime;
    
    // Play two quick notes
    [400, 600].forEach((freq, i) => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.1);

      gain.gain.setValueAtTime(0, t + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.04, t + i * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.15);

      osc.connect(gain);
      gain.connect(this.audioCtx!.destination);

      osc.start(t + i * 0.1);
      osc.stop(t + i * 0.1 + 0.15);
    });
  }

  // A low dull buzz for error
  public playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    const t = this.audioCtx.currentTime;
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.2);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.2);
  }
}

export const soundManager = new SoundManager();

// Setup global click listener for generic button clicks
let interacted = false;

if (typeof window !== 'undefined') {
  window.addEventListener('click', (e) => {
    // Attempt auto-start of ambient music on first interaction
    if (!interacted) {
      interacted = true;
      const musicDisabled = localStorage.getItem('music_disabled');
      if (musicDisabled !== 'true') {
        soundManager.startAmbient();
        // Since other components might need to know the state changed, 
        // we can dispatch a custom event.
        window.dispatchEvent(new Event('ambientMusicStarted'));
      }
    }

    const target = (e.target as Element).closest('button, [role="button"], a');
    
    // Ignore if it's a switch toggle since we handle that explicitly with playToggleOn/Off
    if (target) {
       const isToggle = target.classList.contains('switch-toggle') || target.closest('.switch-toggle');
       if (!isToggle) {
         soundManager.playClick();
       }
    }
  }, { capture: true });
}
