import React from 'react';
import { MessageSquare, ExternalLink } from 'lucide-react';
import { SeasonId, SEASONS } from '../utils/seasonalTheme.ts';

interface CommunityStatsProps {
  communityData: {
    discord: {
      inviteUrl: string;
      onlineMembers: number | null;
      totalMembers: number | null;
      connected: boolean;
    };
    minecraft: {
      serverHost: string;
      maxSlots: number;
      onlineNow: number;
      engine: string;
      hosting: string;
      hostingWebsite?: string;
    };
    location: string;
    crossplay: string;
  };
  seasonId?: SeasonId;
}

export const CommunityStats: React.FC<CommunityStatsProps> = ({ communityData, seasonId = 'winter' }) => {
  const discordUrl = communityData.discord.inviteUrl || 'https://discord.gg/WVXeaXy2Ux';
  const hostingUrl = communityData.minecraft.hostingWebsite || 'https://lumacloud.xyz';
  const season = SEASONS[seasonId] || SEASONS.winter;

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-[#0C1116] via-[#0E151A] to-[#0C1116] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div
          className="absolute top-0 right-0 w-96 h-96 blur-[120px] pointer-events-none"
          style={{ backgroundColor: season.colors.badgeBg }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Left Column: Heading & Discord Card */}
          <div className="max-w-xl text-center lg:text-left">
            <div className={`text-xs font-semibold uppercase tracking-wider ${season.classes.textAccent} mb-2`}>
              Official Community Hub
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Join BukkuzMC on Discord
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Connect with Server Owner Bukkuz Bruh, participate in server events, get support from active moderators, and voice chat with fellow Minecraft players across Kerala.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold text-xs rounded-xl shadow-lg shadow-[#5865F2]/25 transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Join Official Discord (discord.gg/WVXeaXy2Ux)</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
              </a>

              <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: season.colors.accent }}
                />
                <span>Community Voice &amp; Text Channels Open</span>
              </div>
            </div>
          </div>

          {/* Right Column: Verified Server Specs */}
          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto shrink-0">
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-left">
              <span className="text-xs text-slate-400 block mb-1">Server Engine</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                {communityData.minecraft.engine}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">PaperMC Architecture</span>
            </div>

            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-left">
              <span className="text-xs text-slate-400 block mb-1">Max Capacity</span>
              <div className={`text-xl sm:text-2xl font-bold font-mono ${season.classes.textAccent} tabular-nums`}>
                {communityData.minecraft.maxSlots} Slots
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Dedicated game slots</span>
            </div>

            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-left">
              <span className="text-xs text-slate-400 block mb-1">Hosting Partner</span>
              <a
                href={hostingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xl sm:text-2xl font-bold font-mono ${season.classes.textAccent} hover:brightness-110 transition-colors inline-flex items-center gap-1.5`}
              >
                <span>LumaCloud</span>
                <ExternalLink className="w-4 h-4 opacity-75" />
              </a>
              <span className="text-[11px] text-slate-500 mt-1 block">
                <a
                  href={hostingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hover:underline hover:${season.classes.textAccent}`}
                >
                  lumacloud.xyz
                </a>
              </span>
            </div>

            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-left">
              <span className="text-xs text-slate-400 block mb-1">Official Address</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white select-all truncate">
                {communityData.minecraft.serverHost}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Port 25565 / UDP 19132</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
