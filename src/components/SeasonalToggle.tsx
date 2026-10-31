import React from 'react';
import { SeasonId, SeasonMode } from '../utils/seasonalTheme';

interface SeasonalToggleProps {
  mode?: SeasonMode;
  activeSeasonId?: SeasonId;
  onSelectMode?: (mode: SeasonMode) => void;
}

export const SeasonalToggle: React.FC<SeasonalToggleProps> = () => {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-xs font-mono font-semibold text-sky-300 shadow-sm shadow-sky-500/10 select-none"
      title="BukkuzMC Winter Edition (Active Theme)"
    >
      <span className="text-sm animate-pulse" role="img" aria-label="Winter">
        ❄️
      </span>
      <span className="hidden sm:inline">Winter Edition</span>
      <span className="sm:hidden">Winter</span>
    </div>
  );
};
