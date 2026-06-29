import React, { useState, useEffect } from "react";
import { soundManager } from "@/lib/audio";
import { Music, VolumeX, Activity, Globe, HardDrive, Download, SkipBack, SkipForward } from "lucide-react";

export default function AudioSection() {
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [musicSource, setMusicSource] = useState<'local' | 'api'>('local');
  const [trackInfo, setTrackInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check initial state
    setIsMusicOn(soundManager.isAmbientPlaying);
    setMusicSource((localStorage.getItem('music_source') as 'local' | 'api') || 'local');
    setTrackInfo(soundManager.currentTrack);

    const handleMusicStart = () => {
      setIsMusicOn(soundManager.isAmbientPlaying);
    };

    window.addEventListener('ambientMusicStarted', handleMusicStart);
    
    soundManager.setOnTrackUpdate((track) => {
      setTrackInfo(track);
      setIsLoading(false);
    });

    return () => {
      window.removeEventListener('ambientMusicStarted', handleMusicStart);
      soundManager.setOnTrackUpdate(() => {});
    };
  }, []);

  const handleToggle = async () => {
    setIsLoading(true);
    const newState = await soundManager.toggleAmbient();
    setIsMusicOn(newState);
    setIsLoading(false);
    if (newState) {
      soundManager.playToggleOn();
    } else {
      soundManager.playToggleOff();
    }
  };
  
  const handleSourceChange = async (source: 'local' | 'api') => {
    if (source === musicSource) return;
    setMusicSource(source);
    localStorage.setItem('music_source', source);
    soundManager.playClick();
    
    if (isMusicOn) {
      setIsLoading(true);
      soundManager.stopAmbient();
      await soundManager.loadAmbientTrack();
      await soundManager.startAmbient();
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    setIsLoading(true);
    soundManager.playClick();
    await soundManager.nextTrack();
    setIsLoading(false);
  };

  const handlePrev = async () => {
    setIsLoading(true);
    soundManager.playClick();
    await soundManager.prevTrack();
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-[10px] text-[var(--text-tertiary)] leading-relaxed text-right">
          پخش پیوسته موزیک پس‌زمینه برای افزایش تمرکز و آرامش حین استفاده از داشبورد هوشمند.
        </p>

        <button
          onClick={handleToggle}
          type="button"
          disabled={isLoading}
          className={`switch-toggle w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer text-right group ${
            isMusicOn
              ? "bg-indigo-950/20 border-indigo-500/60 shadow-[0_0_12px_rgba(99,102,241,0.1)]"
              : "bg-[var(--card-bg-solid)] border-[var(--border-color)] hover:border-[var(--text-muted)]"
          } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          <div
            className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${
              isMusicOn ? "bg-indigo-500" : "bg-[var(--card-hover-bg)] border border-[var(--border-color)]"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                isMusicOn ? "translate-x-0" : "-translate-x-4"
              }`}
            />
          </div>

          <div className="text-right space-y-0.5 max-w-[70%]">
            <span
              className={`block text-sm font-bold transition-colors ${
                isMusicOn ? "text-indigo-400" : "text-[var(--text-secondary)]"
              }`}
            >
              موزیک پس‌زمینه
            </span>
            <span className="block text-[9px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
              {isLoading ? "Loading..." : isMusicOn ? "Active / Playing" : "Disabled / Paused"}
            </span>
          </div>

          <div
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              isMusicOn
                ? "bg-indigo-500/20 text-indigo-400 shadow-[inset_0_0_8px_rgba(99,102,241,0.2)]"
                : "bg-[var(--card-hover-bg)] text-[var(--text-muted)]"
            }`}
          >
            {isMusicOn ? (
              <Activity className="w-5 h-5 animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </div>
        </button>
      </div>

      <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
        <p className="text-xs text-[var(--text-primary)] font-bold text-right">منبع موزیک</p>
        <div className="grid grid-cols-2 gap-2">
           <button 
             type="button"
             onClick={() => handleSourceChange('api')}
             className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
               musicSource === 'api' 
                 ? "bg-indigo-950/20 border-indigo-500/50 text-indigo-400" 
                 : "bg-[var(--card-bg-solid)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--card-hover-bg)]"
             }`}
           >
              <Globe className="w-5 h-5" />
              <span className="text-xs font-semibold">موزیک‌های آنلاین</span>
              <span className="text-[9px] opacity-70">Internet Archive API</span>
           </button>

           <button 
             type="button"
             onClick={() => handleSourceChange('local')}
             className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
               musicSource === 'local' 
                 ? "bg-emerald-950/20 border-emerald-500/50 text-emerald-400" 
                 : "bg-[var(--card-bg-solid)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--card-hover-bg)]"
             }`}
           >
              <HardDrive className="w-5 h-5" />
              <span className="text-xs font-semibold">موزیک ثابت</span>
              <span className="text-[9px] opacity-70">Dele Divaneh</span>
           </button>
        </div>
      </div>

      {isMusicOn && trackInfo && (
        <div className="p-4 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3 max-w-[70%]">
               <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-500/20 flex items-center justify-center">
                 <Music className="w-4 h-4 text-indigo-400" />
               </div>
               <div className="text-right overflow-hidden">
                  <span className="block text-xs font-bold text-[var(--text-primary)] truncate" title={trackInfo.title}>{trackInfo.title}</span>
                  <span className="block text-[10px] text-[var(--text-muted)] mt-0.5 truncate" title={trackInfo.creator}>{trackInfo.creator}</span>
               </div>
            </div>
            
            <div className="flex items-center gap-3">
              {!trackInfo.isLocal && (
                <div className="flex items-center gap-1 ml-2 rtl:mr-2 rtl:ml-0">
                  <button 
                    onClick={handlePrev}
                    disabled={isLoading}
                    className="p-1.5 rounded bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={handleNext}
                    disabled={isLoading}
                    className="p-1.5 rounded bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {!trackInfo.isLocal && (
                <a 
                  href={trackInfo.url} 
                  target="_blank" 
                  rel="noreferrer"
                  title="دانلود موزیک"
                  className="p-1.5 rounded bg-[var(--bg-main)] text-[var(--text-secondary)] hover:text-indigo-400 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              )}
              <div className="flex gap-1">
                  {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-1 bg-indigo-500/60 rounded-full animate-pulse" style={{ height: `${Math.random() * 12 + 6}px`, animationDelay: `${i * 0.1}s` }} />
                  ))}
              </div>
            </div>
        </div>
      )}
    </div>
  );
}
