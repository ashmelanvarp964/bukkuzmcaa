import React from 'react';
import { Copy, Check, ShieldCheck, Compass } from 'lucide-react';

interface NavbarProps {
  onCopyIp: () => void;
  copied: boolean;
  onOpenJoinGuide: () => void;
  onOpenAdmin: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onCopyIp,
  copied,
  onOpenJoinGuide,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#080B0D]/90 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          className="text-xl font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs font-mono font-black">
            B
          </span>
          <span>BukkuzMC</span>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a
            href="#overview"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Overview
          </a>
          <a
            href="#status"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Server Status
          </a>
          <a
            href="#creator"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Creator Hub
          </a>
          <a
            href="#leaderboards"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Leaderboards
          </a>
          <a
            href="#join"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Join Guide
          </a>
          <a
            href="#support"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Support
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onCopyIp}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-black bg-emerald-400 hover:bg-emerald-300 active:scale-95 transition-all rounded-lg whitespace-nowrap shrink-0 shadow-lg shadow-emerald-500/20"
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

          <button
            onClick={onOpenAdmin}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            title="Staff Admin Portal"
            aria-label="Staff Admin Portal"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
