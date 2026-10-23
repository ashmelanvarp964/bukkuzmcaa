import React, { useState } from 'react';
import { Youtube, ExternalLink, Play, Radio, Flame, Gamepad2, Crown, Code2, Server, UserCheck } from 'lucide-react';

interface ChannelInfo {
  name: string;
  handle: string;
  channelId: string;
  channelUrl: string;
  subscribersText: string;
  avatarUrl: string;
  bio: string;
  category: string;
  videos: Array<{
    id: string;
    title: string;
    published: string;
    thumbnail: string;
    videoUrl: string;
    isLive?: boolean;
  }>;
}

interface DeveloperInfo {
  name: string;
  handle: string;
  channelUrl: string;
  avatarUrl: string;
  subscribersText: string;
  roles: string[];
  ign: string;
  hostingSite: string;
}

interface CreatorHubProps {
  creatorStats: {
    owner: string;
    developer?: DeveloperInfo;
    mainChannel: ChannelInfo;
    varietyChannel: ChannelInfo;
  };
}

export const CreatorHub: React.FC<CreatorHubProps> = ({ creatorStats }) => {
  const [selectedChannel, setSelectedChannel] = useState<'main' | 'variety'>('variety');

  const activeChannel =
    selectedChannel === 'main' ? creatorStats.mainChannel : creatorStats.varietyChannel;

  const dev = creatorStats.developer || {
    name: 'ICONIC OP',
    handle: '@ft.iconicmc',
    channelUrl: 'https://www.youtube.com/@ft.iconicmc',
    avatarUrl: 'https://yt3.googleusercontent.com/yUJw9yeYManLLp_lE7F81YlwUHvjWztkwJL133Va7H79D2l6Smop3RQTz9kAdaJaVY8-119FJrc=s900-c-k-c0x00ffffff-no-rj',
    subscribersText: '16.6K+ Subscribers',
    roles: [
      'Developer of BukkuzMC',
      'Founder and Owner of LumaCloud Hosting',
      'Manager of Bukkuz Bruh',
    ],
    ign: 'IconicMC_',
    hostingSite: 'https://lumacloud.xyz',
  };

  return (
    <section id="creator" className="py-20 px-6 max-w-7xl mx-auto space-y-16">
      {/* 1. Header */}
      <div className="pb-6 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Creators & Engineering Team</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Creator Hub & Staff
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Meet the driving forces behind BukkuzMC: Server Owner <strong className="text-white">Bukkuz Bruh</strong> and Lead Developer & Manager <strong className="text-white">ICONIC OP</strong> (Founder of LumaCloud).
          </p>
        </div>

        {/* Channel Selection Buttons */}
        <div className="flex items-center gap-2 p-1.5 bg-[#0C1014] border border-white/10 rounded-2xl">
          <button
            onClick={() => setSelectedChannel('main')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedChannel === 'main'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>BUKKUZ BRUH (185K+)</span>
          </button>

          <button
            onClick={() => setSelectedChannel('variety')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedChannel === 'variety'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Real Bukkuz (Minecraft & All Games)</span>
          </button>
        </div>
      </div>

      {/* 2. Active Channel Showcase Card */}
      <div className="bg-[#0C1014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div
          className={`absolute top-0 right-0 w-96 h-96 blur-[120px] pointer-events-none ${
            selectedChannel === 'main' ? 'bg-red-600/10' : 'bg-emerald-500/10'
          }`}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className={`w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 p-1 bg-gradient-to-tr shadow-2xl ${
                selectedChannel === 'main'
                  ? 'border-red-500/50 from-red-500/20 to-transparent'
                  : 'border-emerald-500/50 from-emerald-500/20 to-transparent'
              }`}
            >
              <img
                src={activeChannel.avatarUrl}
                alt={`${activeChannel.name} YouTube Channel Avatar`}
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-red-600 text-white p-2 rounded-xl shadow-md">
              <Youtube className="w-4 h-4 fill-white" />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h3 className="text-2xl sm:text-3xl font-black text-white">{activeChannel.name}</h3>
              <span className="font-mono text-xs text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                {activeChannel.handle}
              </span>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                  selectedChannel === 'main'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {activeChannel.category}
              </span>
            </div>

            <p className="text-sm text-slate-300 max-w-2xl mb-6 leading-relaxed">
              {activeChannel.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                <span className="text-[11px] text-slate-400 block mb-1">Subscriber Milestone</span>
                <span className="text-base sm:text-lg font-bold font-mono text-white tabular-nums">
                  {activeChannel.subscribersText}
                </span>
              </div>

              <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                <span className="text-[11px] text-slate-400 block mb-1">Server Ownership</span>
                <span className="text-base sm:text-lg font-bold font-mono text-amber-400">
                  Server Owner
                </span>
              </div>

              <a
                href={activeChannel.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-5 py-3 font-bold text-xs rounded-xl transition-all shadow-lg active:scale-95 ${
                  selectedChannel === 'main'
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/25'
                }`}
              >
                <Youtube className="w-4 h-4 fill-current" />
                <span>Subscribe on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Real Videos from Active Channel Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Recent Uploads & Streams on {activeChannel.name}</span>
          </h4>
          <span className="text-xs font-mono text-slate-400">Live Channel Feed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeChannel.videos.map((video) => (
            <a
              key={video.id}
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#0D1115] border border-white/10 hover:border-emerald-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col"
            >
              <div className="relative aspect-video bg-black overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </div>
                </div>
                {video.isLive && (
                  <span className="absolute top-2 left-2 bg-red-600 font-mono text-[10px] font-bold text-white px-2 py-0.5 rounded uppercase">
                    Live
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <h5 className="font-semibold text-xs sm:text-sm text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mb-3 leading-snug">
                  {video.title}
                </h5>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{video.published}</span>
                  <span className="text-emerald-400 group-hover:underline">Watch on YouTube &rarr;</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 4. Developer & Manager Spotlight Card: ICONIC OP */}
      <div className="bg-[#0B0F13] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[130px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Avatar & Badges */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-cyan-500/50 p-1 bg-gradient-to-tr from-cyan-500/20 to-transparent shadow-xl">
                <img
                  src={dev.avatarUrl}
                  alt="ICONIC OP Channel Avatar"
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-cyan-600 text-white p-1.5 rounded-lg shadow-md">
                <Code2 className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap mb-1">
                <h4 className="text-2xl font-black text-white">{dev.name}</h4>
                <a
                  href={dev.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded hover:bg-cyan-500/20"
                >
                  {dev.handle}
                </a>
              </div>

              <div className="text-xs font-mono text-slate-400 mb-3">
                In-Game IGN: <strong className="text-white">IconicMC_</strong> · {dev.subscribersText}
              </div>

              {/* Roles Chips */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1.5">
                  <Code2 className="w-3 h-3" />
                  <span>Developer of BukkuzMC</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold flex items-center gap-1.5">
                  <Server className="w-3 h-3" />
                  <span>Founder & Owner of LumaCloud</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[11px] font-semibold flex items-center gap-1.5">
                  <UserCheck className="w-3 h-3" />
                  <span>Manager of Bukkuz Bruh</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action links */}
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href={dev.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              <Youtube className="w-4 h-4 fill-white" />
              <span>Subscribe @ft.iconicmc</span>
            </a>

            <a
              href={dev.hostingSite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              <Server className="w-4 h-4" />
              <span>Visit LumaCloud (lumacloud.xyz)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
