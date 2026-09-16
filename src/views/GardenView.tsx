import React, { useState } from 'react';
import { TreePine, Sparkles, Droplets, Sun, Info } from 'lucide-react';
import { GardenItem } from '../types';

interface GardenViewProps {
  gardenItems: GardenItem[];
  totalSessions: number;
}

export const GardenView: React.FC<GardenViewProps> = ({
  gardenItems,
  totalSessions,
}) => {
  const [selectedPlant, setSelectedPlant] = useState<GardenItem | null>(null);

  const getPlantVisual = (type: GardenItem['type']) => {
    switch (type) {
      case 'sprout':
        return { emoji: '🌱', title: 'First Focus Sprout', size: 'text-2xl' };
      case 'sapling':
        return { emoji: '🌿', title: 'Birch Sapling', size: 'text-3xl' };
      case 'flower':
        return { emoji: '🪻', title: 'Lavender Patch', size: 'text-2xl' };
      case 'tree':
        return { emoji: '🌳', title: 'Ancient Cedar', size: 'text-4xl' };
      case 'stone':
        return { emoji: '🪨', title: 'Zen Meditation Stones', size: 'text-2xl' };
      case 'blossom':
        return { emoji: '🌸', title: 'Cherry Blossom', size: 'text-4xl' };
      case 'bench':
        return { emoji: '🪵', title: 'Study Bench', size: 'text-3xl' };
      case 'pond':
        return { emoji: '🌊', title: 'Koi Pond Sanctuary', size: 'text-4xl' };
      default:
        return { emoji: '🌱', title: 'Flora', size: 'text-2xl' };
    }
  };

  const unlockedCount = gardenItems.filter((g) => totalSessions >= g.requiredSessions).length;

  return (
    <div id="garden-view" className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Garden Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TreePine className="w-5 h-5 text-emerald-400" />
            <h2 className="text-2xl font-semibold tracking-tight text-white">Focus Garden</h2>
          </div>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            A serene digital biome cultivated by your focused study sessions.
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold">{totalSessions} Sessions Cultivated</span>
          </div>
          <span className="text-white/30">|</span>
          <span className="text-white/70">{unlockedCount} / {gardenItems.length} Flora Unlocked</span>
        </div>
      </div>

      {totalSessions === 0 && (
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-center text-xs sm:text-sm text-emerald-300/80">
          🌱 Your garden is waiting. Complete focus sessions to plant and grow your trees.
        </div>
      )}

      {/* Interactive Garden Terrain Canvas */}
      <div
        id="garden-canvas-container"
        className="relative w-full h-80 sm:h-96 rounded-3xl bg-gradient-to-b from-[#0c140e] via-[#09100a] to-[#050705] border border-emerald-500/20 shadow-2xl overflow-hidden p-6 select-none"
      >
        {/* Soft atmospheric overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-black/60 pointer-events-none" />

        {/* Ambient fireflies / glowing spores */}
        <div className="absolute top-10 left-1/4 w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-24 right-1/3 w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-ping" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-16 left-1/3 w-1.5 h-1.5 rounded-full bg-emerald-300/60 animate-ping" style={{ animationDuration: '5s' }} />

        {/* Terrain Hill contours */}
        <div className="absolute -bottom-10 -left-10 w-96 h-48 rounded-[100%] bg-emerald-950/30 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-96 h-48 rounded-[100%] bg-emerald-950/40 blur-2xl pointer-events-none" />

        {/* Plants placed dynamically according to coordinates */}
        {gardenItems.map((item) => {
          const isUnlocked = totalSessions >= item.requiredSessions;
          const visual = getPlantVisual(item.type);

          return (
            <div
              key={item.id}
              style={{
                left: `${item.position.x}%`,
                top: `${item.position.y}%`,
              }}
              onClick={() => setSelectedPlant(item)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-all duration-300 ${
                isUnlocked ? 'scale-100 hover:scale-125' : 'scale-75 opacity-30 grayscale'
              }`}
            >
              <div
                className={`flex items-center justify-center p-2 rounded-2xl transition-all ${
                  isUnlocked ? 'hover:bg-white/10 group-hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]' : ''
                }`}
              >
                <span className={visual.size}>{visual.emoji}</span>
              </div>
              <span className="text-[10px] text-white/70 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-2 py-0.5 rounded-md bg-black/80 border border-white/10 shadow-lg pointer-events-none">
                {isUnlocked ? visual.title : `Unlocks at ${item.requiredSessions} sessions`}
              </span>
            </div>
          );
        })}

        {/* Bottom Garden Sanctuary Quote */}
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[11px] text-white/40 border-t border-white/5 pt-2">
          <span>🌿 "The garden of the mind grows one focused breath at a time."</span>
          <span className="hidden sm:inline">Click any plant for botanical focus lore</span>
        </div>
      </div>

      {/* Selected Plant Detail Drawer / Card */}
      {selectedPlant && (
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{getPlantVisual(selectedPlant.type).emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-semibold text-white">
                  {getPlantVisual(selectedPlant.type).title}
                </h4>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    totalSessions >= selectedPlant.requiredSessions
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {totalSessions >= selectedPlant.requiredSessions
                    ? 'Cultivated in your garden'
                    : `Requires ${selectedPlant.requiredSessions} sessions`}
                </span>
              </div>
              <p className="text-xs text-white/60 mt-1">
                Unlocked after {selectedPlant.requiredSessions} Pomodoro sessions of uninterrupted study.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedPlant(null)}
            className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      )}

      {/* Growth Milestones Roadmap */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-white">Growth Milestones</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {gardenItems.map((item) => {
            const isUnlocked = totalSessions >= item.requiredSessions;
            const visual = getPlantVisual(item.type);

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                  isUnlocked ? 'bg-white/5 border-white/15' : 'bg-white/[0.02] border-white/5 opacity-40'
                }`}
              >
                <span className="text-2xl">{visual.emoji}</span>
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-semibold text-white truncate">{visual.title}</h5>
                  <span className="text-[10px] text-white/50 block">
                    {item.requiredSessions} sessions needed
                  </span>
                </div>
                {isUnlocked && <span className="text-xs text-emerald-400 font-bold">✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
