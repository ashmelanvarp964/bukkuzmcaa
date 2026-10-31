import React from 'react';
import { Youtube, MessageSquare } from 'lucide-react';

interface FooterProps {
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  reducedMotion,
  onToggleReducedMotion,
}) => {
  return (
    <footer className="w-full bg-[#06080A] border-t border-white/10 text-slate-400 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-xs">
        {/* Brand & Creator Attribution */}
        <div className="text-center md:text-left">
          <div className="text-base font-bold text-white mb-1 flex items-center justify-center md:justify-start gap-2.5">
            <img
              src="/assets/aistudio/file_00000000aae08211b48a3aad0c5b4b07_f1b87ff8.png"
              alt="Bukkuz SMP Logo"
              className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]"
            />
            <span>BUKKUZ <span className="text-sky-400">SMP</span></span>
            <span className="text-[11px] text-sky-300 font-normal">· Owner: Bukkuz Bruh</span>
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
              className="text-sky-400 hover:underline font-semibold"
            >
              @real_bukkuz (Minecraft &amp; All Games)
            </a>
            . Server engineered by Lead Developer &amp; Manager{' '}
            <a
              href="https://www.youtube.com/@ft.iconicmc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline font-semibold"
            >
              ICONIC OP (1.04K+ Subs)
            </a>
            .
          </p>
          <div className="mt-2 text-[11px] text-slate-500">
            Hosted with pride by{' '}
            <a
              href="https://lumacloud.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline font-mono"
            >
              LumaCloud (lumacloud.xyz)
            </a>
            . Not an official Minecraft product.
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-300">
          <a href="#overview" className="hover:text-sky-400 transition-colors">
            Overview
          </a>
          <a href="#status" className="hover:text-sky-400 transition-colors">
            Server Status
          </a>
          <a href="#creator" className="hover:text-sky-400 transition-colors">
            Creator Hub
          </a>
          <a href="#leaderboards" className="hover:text-sky-400 transition-colors">
            Live Players
          </a>
          <a href="#join" className="hover:text-sky-400 transition-colors">
            Join Guide
          </a>
          <a href="#support" className="hover:text-sky-400 transition-colors">
            Discord Tickets
          </a>
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
            className="p-2 rounded-lg bg-white/5 hover:bg-sky-600/20 hover:text-sky-400 text-slate-400 transition-colors font-mono text-xs font-bold"
            title="Real Bukkuz (Minecraft & All Games)"
          >
            2
          </a>
        </div>
      </div>
    </footer>
  );
};
