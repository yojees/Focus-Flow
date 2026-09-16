import React from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  CloudRain,
  Waves,
  Coffee,
  Trees,
  Flame,
  Radio,
  Sparkles,
} from 'lucide-react';
import { AmbientSoundType, ambientSound } from '../utils/ambientSound';

interface SoundsViewProps {
  activeSoundName: string | null;
  onToggleSoundType: (type: AmbientSoundType) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
}

export const SoundsView: React.FC<SoundsViewProps> = ({
  activeSoundName,
  onToggleSoundType,
  volume,
  onVolumeChange,
}) => {
  const soundTracks: {
    id: AmbientSoundType;
    name: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    accentColor: string;
  }[] = [
    {
      id: 'rain',
      name: 'Gentle Rain',
      description: 'Soft rhythmic raindrops calming cognitive clutter.',
      icon: CloudRain,
      accentColor: 'text-sky-400',
    },
    {
      id: 'ocean',
      name: 'Ocean Waves',
      description: 'Slow rhythmic rolling swell of the deep tide.',
      icon: Waves,
      accentColor: 'text-cyan-400',
    },
    {
      id: 'cafe',
      name: 'Quiet Café',
      description: 'Warm ambient low murmur simulating a cozy library corner.',
      icon: Coffee,
      accentColor: 'text-amber-400',
    },
    {
      id: 'forest',
      name: 'Whispering Forest',
      description: 'Subtle pine rustling and gentle natural breezes.',
      icon: Trees,
      accentColor: 'text-emerald-400',
    },
    {
      id: 'fireplace',
      name: 'Warm Fireplace',
      description: 'Cozy hearthside crackles and gentle low warmth.',
      icon: Flame,
      accentColor: 'text-orange-400',
    },
    {
      id: 'whitenoise',
      name: 'White Noise',
      description: 'Broadband acoustic mask blocking loud outside distractions.',
      icon: Radio,
      accentColor: 'text-indigo-400',
    },
  ];

  return (
    <div id="sounds-view" className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Focus Soundscapes</h2>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Procedurally synthesized ambient sound masking distracting environments. Plays continuously as you study.
          </p>
        </div>

        {/* Global Volume Control */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 self-start sm:self-auto">
          {volume === 0 ? (
            <VolumeX className="w-4 h-4 text-white/40" />
          ) : (
            <Volume2 className="w-4 h-4 text-white/70" />
          )}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-24 sm:w-32 accent-white cursor-pointer"
          />
          <span className="text-xs font-mono text-white/60 w-8 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* Active Sound Indicator Banner */}
      {activeSoundName && (
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-white/50 font-semibold block">
                NOW PLAYING ACROSS TABS
              </span>
              <h4 className="text-sm font-semibold text-white capitalize">
                {activeSoundName} Soundscape
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToggleSoundType(activeSoundName as AmbientSoundType)}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer border border-white/10"
          >
            Stop Audio
          </button>
        </div>
      )}

      {/* Sound Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {soundTracks.map((sound) => {
          const Icon = sound.icon;
          const isCurrentActive = activeSoundName === sound.id;

          return (
            <div
              key={sound.id}
              onClick={() => onToggleSoundType(sound.id)}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer group select-none ${
                isCurrentActive
                  ? 'bg-white/15 border-white/30 shadow-lg'
                  : 'bg-white/5 hover:bg-white/[0.08] border-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      isCurrentActive
                        ? 'bg-white text-black shadow-md'
                        : 'bg-white/10 text-white group-hover:bg-white/15'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <button
                    type="button"
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCurrentActive
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-white group-hover:bg-white/20'
                    }`}
                  >
                    {isCurrentActive ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>
                </div>

                <h3 className="text-base font-semibold text-white mb-1">{sound.name}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{sound.description}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className={isCurrentActive ? 'text-emerald-400 font-medium' : 'text-white/40'}>
                  {isCurrentActive ? '● Streaming procedural audio' : 'Click to start soundscape'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
