import React from 'react';
import { Youtube, MessageSquare, ShieldCheck, ExternalLink } from 'lucide-react';

interface FooterProps {
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  reducedMotion,
  onToggleReducedMotion,
  onOpenAdmin,
}) => {
  return (
    <footer className="w-full bg-[#06080A] border-t border-white/10 text-slate-400 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-xs">
        {/* Brand & Creator Attribution */}
        <div className="text-center md:text-left">
          <div className="text-base font-bold text-white mb-1 flex items-center justify-center md:justify-start gap-2">
            <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-mono font-black">
              B
            </span>
            <span>BukkuzMC</span>
            <span className="text-[11px] text-amber-400 font-normal">· Owner: Bukkuz Bruh</span>
            <span className="text-[11px] text-cyan-400 font-normal">· Developer: ICONIC OP</span>
          </div>
          <p className="text-slate-400 max-w-md">
            Kerala's Premier Minecraft Java & Bedrock Community. Follow Server Owner Bukkuz Bruh on{' '}
            <a
              href="https://www.youtube.com/@bukkuz_bruh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:underline font-semibold"
            >
              @bukkuz_bruh (185K+ Free Fire)
            </a>{' '}
            and his 2nd channel{' '}
            <a
              href="https://www.youtube.com/@real_bukkuz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline font-semibold"
            >
              @real_bukkuz (Minecraft & All Games)
            </a>
            . Server engineered by Lead Developer & Manager{' '}
            <a
              href="https://www.youtube.com/@ft.iconicmc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline font-semibold"
            >
              ICONIC OP
            </a>
            .
          </p>
          <div className="mt-2 text-[11px] text-slate-500">
            Hosted with pride by{' '}
            <a
              href="https://lumacloud.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline font-mono"
            >
              LumaCloud (lumacloud.xyz)
            </a>
            . Not an official Minecraft product.
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-300">
          <a href="#overview" className="hover:text-emerald-400 transition-colors">
            Overview
          </a>
          <a href="#status" className="hover:text-emerald-400 transition-colors">
            Server Status
          </a>
          <a href="#creator" className="hover:text-emerald-400 transition-colors">
            Creator Hub
          </a>
          <a href="#leaderboards" className="hover:text-emerald-400 transition-colors">
            Live Players
          </a>
          <a href="#join" className="hover:text-emerald-400 transition-colors">
            Join Guide
          </a>
          <a href="#support" className="hover:text-emerald-400 transition-colors">
            Support
          </a>
          <button
            onClick={onOpenAdmin}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Staff Portal</span>
          </button>
        </div>

        {/* Social Links & Accessibility */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleReducedMotion}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 transition-colors"
          >
            Motion: {reducedMotion ? 'Reduced' : '3D Smooth'}
          </button>

          <a
            href="https://discord.gg/WVXeaXy2Ux"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-[#5865F2]/20 hover:bg-[#5865F2]/40 text-[#5865F2] hover:text-white transition-colors"
            title="Join BukkuzMC Discord (discord.gg/WVXeaXy2Ux)"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
          </a>

          <a
            href="https://www.youtube.com/@bukkuz_bruh"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-red-600/20 hover:text-red-400 text-slate-400 transition-colors"
            title="Bukkuz Bruh Main Channel (185K+ Free Fire)"
          >
            <Youtube className="w-4 h-4" />
          </a>

          <a
            href="https://www.youtube.com/@real_bukkuz"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-emerald-600/20 hover:text-emerald-400 text-slate-400 transition-colors font-mono text-xs font-bold"
            title="Real Bukkuz (Minecraft & All Games)"
          >
            2
          </a>
        </div>
      </div>
    </footer>
  );
};
