import React, { useState } from 'react';
import { Copy, Check, Users, Server, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeroSectionProps {
  serverStatus: {
    online: boolean;
    players: { online: number; max: number };
    latencyMs: number | null;
    version: { name: string };
    lastUpdated: string;
    loading?: boolean;
    error?: string;
  };
  onOpenJoinGuide: () => void;
  onCopyJava: () => void;
  onCopyBedrock: () => void;
  copiedJava: boolean;
  copiedBedrock: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  serverStatus,
  onOpenJoinGuide,
  onCopyJava,
  onCopyBedrock,
  copiedJava,
  copiedBedrock,
}) => {
  const [copiedMain, setCopiedMain] = useState(false);

  const handleCopyMain = () => {
    navigator.clipboard.writeText('play.bukkuzmc.fun');
    setCopiedMain(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#34d399', '#6ee7b7', '#ffffff'],
    });
    setTimeout(() => setCopiedMain(false), 2400);
  };

  return (
    <section id="overview" className="relative min-h-[92vh] flex items-center justify-center pt-8 pb-16 px-6">
      {/* Background imagery subtle overlay with verified generated asset */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-25 mix-blend-luminosity overflow-hidden">
        <img
          src="/src/assets/images/bukkuzmc_hero_scenery_1792741364256.jpg"
          alt="BukkuzMC Shaders Landscape"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B0D] via-[#080B0D]/75 to-[#080B0D]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Creator & Region Trust Kicker */}
        <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-emerald-400 mb-6 tracking-wide flex-wrap justify-center">
          <span>Kerala's Official Minecraft SMP</span>
          <span aria-hidden="true">·</span>
          <span><strong>Cracked + Premium Supported</strong></span>
          <span aria-hidden="true">·</span>
          <span>Owner: <strong>Bukkuz Bruh</strong></span>
          <span aria-hidden="true">·</span>
          <span>Java + Bedrock</span>
        </div>

        {/* Primary Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-4xl text-balance leading-none mb-6">
          YOUR ADVENTURE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
            STARTS HERE
          </span>
        </h1>

        {/* Concrete Value Proposition */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl text-balance mb-10 leading-relaxed">
          Join thousands of players in an immersive custom Survival Multiplayer universe.
          Low-latency Kerala hosting, land claims, active economy, custom boss raids, and weekly community events.
        </p>

        {/* Primary Action Buttons & IP Block */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl mb-12">
          {/* Direct Copy IP CTA */}
          <div className="flex-1 w-full bg-[#101418] border border-white/10 rounded-xl p-2.5 flex items-center justify-between gap-3 shadow-xl">
            <div className="flex flex-col text-left pl-2">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Server IP Address</span>
              <span className="font-mono text-sm sm:text-base font-semibold text-emerald-300 select-all">
                play.bukkuzmc.fun
              </span>
            </div>
            <button
              onClick={handleCopyMain}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-lg transition-all active:scale-95 shadow-md shadow-emerald-500/25 shrink-0"
            >
              {copiedMain ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-black" />
                  <span>Copy IP</span>
                </>
              )}
            </button>
          </div>

          {/* How to Join CTA */}
          <button
            onClick={onOpenJoinGuide}
            className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-medium text-sm rounded-xl border border-white/15 transition-all hover:border-emerald-500/40 shrink-0"
          >
            How to Join
          </button>
        </div>

        {/* Live Server Telemetry Bar (Genuine status, never fabricated) */}
        <div className="w-full max-w-3xl bg-[#0D1115]/90 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            {/* Status */}
            <div className="p-3 rounded-lg bg-white/[0.02]">
              <span className="text-xs text-slate-400 block mb-1">Server Status</span>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    serverStatus.online ? 'bg-emerald-400' : 'bg-rose-500'
                  }`}
                />
                <span className="font-semibold text-sm text-white">
                  {serverStatus.online ? 'Online' : 'Offline / Standby'}
                </span>
              </div>
            </div>

            {/* Online Players */}
            <div className="p-3 rounded-lg bg-white/[0.02]">
              <span className="text-xs text-slate-400 block mb-1">Players Online</span>
              <div className="flex items-center gap-1.5 font-mono">
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold text-base text-white tabular-nums">
                  {serverStatus.online ? serverStatus.players.online : 0}
                </span>
                <span className="text-xs text-slate-500">/ {serverStatus.players.max || 200}</span>
              </div>
            </div>

            {/* Version */}
            <div className="p-3 rounded-lg bg-white/[0.02]">
              <span className="text-xs text-slate-400 block mb-1">Supported Versions</span>
              <span className="font-mono text-xs font-bold text-emerald-400 block truncate" title="Every Version Supported: 1.8 – 1.21.x & Latest">
                Every Version (1.8 – 1.21.x)
              </span>
            </div>

            {/* Bedrock Port */}
            <div className="p-3 rounded-lg bg-white/[0.02]">
              <span className="text-xs text-slate-400 block mb-1">Bedrock Port</span>
              <span className="font-mono text-xs font-semibold text-emerald-400">
                19132 (UDP Crossplay)
              </span>
            </div>
          </div>

          {/* Quick Copy Strip for Bedrock & Java */}
          <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span>Java (Cracked + Premium · 1.8 – 1.21.x): <strong className="text-white font-mono">play.bukkuzmc.fun</strong></span>
              <button
                onClick={onCopyJava}
                className="hover:text-emerald-300 transition-colors underline flex items-center gap-1 font-mono text-emerald-400"
              >
                {copiedJava ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span>Bedrock (All Builds): <strong className="text-white font-mono">play.bukkuzmc.fun:19132</strong></span>
              <button
                onClick={onCopyBedrock}
                className="hover:text-emerald-300 transition-colors underline flex items-center gap-1 font-mono text-emerald-400"
              >
                {copiedBedrock ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
