import React from 'react';
import { Copy, Check } from 'lucide-react';
import { SeasonalToggle } from './SeasonalToggle';
import { SeasonId, SeasonMode, SEASONS } from '../utils/seasonalTheme';

interface NavbarProps {
  onCopyIp: () => void;
  copied: boolean;
  onOpenJoinGuide: () => void;
  activeSection?: string;
  serverPingMs?: number | null;
  seasonId?: SeasonId;
}

export const Navbar: React.FC<NavbarProps> = ({
  onCopyIp,
  copied,
  serverPingMs,
  seasonId = 'winter',
}) => {
  const season = SEASONS[seasonId] || SEASONS.winter;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#080B0D]/90 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-3.5">
        {/* Brand logo & wordmark */}
        <a
          href="#overview"
          className="text-xl font-bold tracking-tight text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5 group"
        >
          <img
            src="/assets/aistudio/file_00000000aae08211b48a3aad0c5b4b07_f1b87ff8.png"
            alt="Bukkuz SMP Logo"
            className="w-9 h-9 object-contain drop-shadow-[0_0_12px_rgba(56,189,248,0.7)] group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
              BUKKUZ <span className="text-sky-400">SMP</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-medium">Kerala Official</span>
          </div>
        </a>

        {/* Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a
            href="#overview"
            className={`hover:${season.classes.textAccent} transition-colors whitespace-nowrap shrink-0`}
          >
            Overview
          </a>
          <a
            href="#status"
            className={`hover:${season.classes.textAccent} transition-colors whitespace-nowrap shrink-0`}
          >
            Server Status
          </a>
          <a
            href="#creator"
            className={`hover:${season.classes.textAccent} transition-colors whitespace-nowrap shrink-0`}
          >
            Creator Hub
          </a>
          <a
            href="#leaderboards"
            className={`hover:${season.classes.textAccent} transition-colors whitespace-nowrap shrink-0`}
          >
            Leaderboards
          </a>
          <a
            href="#join"
            className={`hover:${season.classes.textAccent} transition-colors whitespace-nowrap shrink-0`}
          >
            Join Guide
          </a>
          <a
            href="#support"
            className={`hover:${season.classes.textAccent} transition-colors whitespace-nowrap shrink-0`}
          >
            Discord Tickets
          </a>
        </nav>

        {/* Action Controls: Winter Badge, Server Ping Chip & Copy IP Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Permanent Winter Edition Badge */}
          <SeasonalToggle />

          {serverPingMs !== null && serverPingMs !== undefined && (
            <div
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors"
              style={{
                backgroundColor: season.colors.badgeBg,
                borderColor: season.colors.badgeBorder,
                color: season.colors.accent,
              }}
              title="Real-time TCP ping to play.bukkuzmc.fun:25565"
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: season.colors.accent }}
              />
              <span>{serverPingMs} ms</span>
            </div>
          )}

          <button
            onClick={onCopyIp}
            style={{
              backgroundColor: season.colors.accent,
              boxShadow: `0 4px 12px -2px ${season.colors.glow}`,
            }}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-semibold text-black hover:brightness-110 active:scale-95 transition-all rounded-lg whitespace-nowrap shrink-0"
            title="Click to copy play.bukkuzmc.fun"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-black" />
                <span>Copied IP!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-black" />
                <span>play.bukkuzmc.fun</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
