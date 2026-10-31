import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Youtube,
  ExternalLink,
  Play,
  Crown,
  Code2,
  Server,
  UserCheck,
  Flame,
  Gamepad2,
  Radio,
  Star,
  ListVideo,
  Search,
  X,
  Sparkles,
} from 'lucide-react';
import { SeasonId, SEASONS } from '../utils/seasonalTheme.ts';

export interface VideoItem {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
  videoUrl: string;
  isLive?: boolean;
  category?: string;
  episodeNumber?: number;
  description?: string;
}

export interface ChannelInfo {
  name: string;
  handle: string;
  channelId: string;
  channelUrl: string;
  subscribersText: string;
  avatarUrl: string;
  bio: string;
  category: string;
  latestStreams?: VideoItem[];
  popularVODs?: VideoItem[];
  seriesEpisodes?: VideoItem[];
  videos?: VideoItem[];
}

export interface DeveloperInfo {
  name: string;
  handle: string;
  channelUrl: string;
  channelId?: string;
  avatarUrl: string;
  subscribersText: string;
  roles: string[];
  ign: string;
  hostingSite: string;
  bio?: string;
  category?: string;
  latestStreams?: VideoItem[];
  popularVODs?: VideoItem[];
  seriesEpisodes?: VideoItem[];
  videos?: VideoItem[];
}

interface CreatorHubProps {
  creatorStats: {
    owner: string;
    developer?: DeveloperInfo;
    mainChannel: ChannelInfo;
    varietyChannel: ChannelInfo;
  };
  seasonId?: SeasonId;
}

export const CreatorHub: React.FC<CreatorHubProps> = ({ creatorStats, seasonId = 'winter' }) => {
  const [selectedChannel, setSelectedChannel] = useState<'variety' | 'main' | 'developer'>('variety');
  const [activeTab, setActiveTab] = useState<'latest' | 'popular' | 'series'>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalVideo, setActiveModalVideo] = useState<VideoItem | null>(null);
  const season = SEASONS[seasonId] || SEASONS.winter;

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const dev: DeveloperInfo = creatorStats.developer || {
    name: 'ICONIC OP',
    handle: '@ft.iconicmc',
    channelUrl: 'https://www.youtube.com/@ft.iconicmc',
    channelId: 'UC-1Trw_SDW05tASGTx32MkA',
    avatarUrl:
      'https://yt3.googleusercontent.com/yUJw9yeYManLLp_lE7F81YlwUHvjWztkwJL133Va7H79D2l6Smop3RQTz9kAdaJaVY8-119FJrc=s900-c-k-c0x00ffffff-no-rj',
    subscribersText: '1.04K+ Subscribers',
    roles: [
      'Developer of BukkuzMC',
      'Founder and Owner of LumaCloud Hosting',
      'Manager of Bukkuz Bruh',
    ],
    ign: 'IconicMC_',
    hostingSite: 'https://lumacloud.xyz',
    bio: 'Lead Developer of BukkuzMC, Manager of Bukkuz Bruh, and Founder of LumaCloud Hosting. Creating Minecraft SMP videos and live streams in Kerala.',
    category: 'BukkuzMC Developer & Creator',
  };

  const activeChannel: ChannelInfo = useMemo(() => {
    if (selectedChannel === 'main') {
      return creatorStats.mainChannel;
    }
    if (selectedChannel === 'developer') {
      return {
        name: dev.name,
        handle: dev.handle,
        channelId: dev.channelId || 'UC-1Trw_SDW05tASGTx32MkA',
        channelUrl: dev.channelUrl,
        subscribersText: dev.subscribersText,
        avatarUrl: dev.avatarUrl,
        bio: dev.bio || 'Lead Developer of BukkuzMC and Founder of LumaCloud Hosting.',
        category: dev.category || 'Lead Developer & Creator',
        latestStreams: dev.latestStreams || [],
        popularVODs: dev.popularVODs || [],
        seriesEpisodes: dev.seriesEpisodes || [],
        videos: dev.videos || [],
      };
    }
    return creatorStats.varietyChannel;
  }, [selectedChannel, creatorStats, dev]);

  // Determine current tab videos
  const tabVideos = useMemo(() => {
    let list: VideoItem[] = [];
    if (activeTab === 'latest') {
      list = activeChannel.latestStreams || activeChannel.videos || [];
    } else if (activeTab === 'popular') {
      list = activeChannel.popularVODs || activeChannel.videos || [];
    } else if (activeTab === 'series') {
      list = activeChannel.seriesEpisodes || activeChannel.videos || [];
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        (v.description && v.description.toLowerCase().includes(q)) ||
        (v.category && v.category.toLowerCase().includes(q)) ||
        (v.episodeNumber && `ep ${v.episodeNumber}`.includes(q))
    );
  }, [activeChannel, activeTab, searchQuery]);

  return (
    <section id="creator" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
      {/* 1. Header with Channel Switcher */}
      <div className="pb-6 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${season.classes.textAccent} mb-2`}>
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Official YouTube Channels & Verified Broadcasts</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Creator Hub & Live Streams
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Directly connected to official YouTube channels: Watch Server Owner <strong className="text-white">Bukkuz Bruh</strong> live on <strong className={season.classes.textAccentLight}>@real_bukkuz</strong> &amp; <strong className="text-red-400">@bukkuz_bruh</strong>, and explore server streams by Lead Developer <strong className="text-cyan-400">ICONIC OP</strong> (1.04K subs).
          </p>
        </div>

        {/* Channel Selection Buttons (3 Channels: Real Bukkuz, Bukkuz Bruh, Iconic OP) */}
        <div className="flex items-center gap-2 p-1.5 bg-[#0C1014] border border-white/10 rounded-2xl shrink-0 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => {
              setSelectedChannel('variety');
              setSearchQuery('');
            }}
            style={{
              backgroundColor: selectedChannel === 'variety' ? season.colors.accent : 'transparent',
              color: selectedChannel === 'variety' ? '#000000' : undefined,
              boxShadow: selectedChannel === 'variety' ? `0 10px 15px -3px ${season.colors.glow}` : undefined,
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedChannel === 'variety'
                ? 'font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Real Bukkuz (Minecraft &amp; Variety)</span>
          </button>

          <button
            onClick={() => {
              setSelectedChannel('main');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedChannel === 'main'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>BUKKUZ BRUH (185K+)</span>
          </button>

          <button
            onClick={() => {
              setSelectedChannel('developer');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedChannel === 'developer'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>ICONIC OP (1.04K)</span>
          </button>
        </div>
      </div>

      {/* 2. Active Channel Showcase Card */}
      <motion.div
        key={activeChannel.name}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="bg-[#0C1014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        <div
          className={`absolute top-0 right-0 w-96 h-96 blur-[120px] pointer-events-none ${
            selectedChannel === 'main'
              ? 'bg-red-600/10'
              : selectedChannel === 'developer'
              ? 'bg-cyan-500/10'
              : 'bg-sky-500/10'
          }`}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className={`w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 p-1 bg-gradient-to-tr shadow-2xl ${
                selectedChannel === 'main'
                  ? 'border-red-500/50 from-red-500/20 to-transparent'
                  : selectedChannel === 'developer'
                  ? 'border-cyan-500/50 from-cyan-500/20 to-transparent'
                  : 'border-sky-500/50 from-sky-500/20 to-transparent'
              }`}
            >
              <img
                src={activeChannel.avatarUrl}
                alt={`${activeChannel.name} Avatar`}
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://yt3.googleusercontent.com/oOi-7s_rgN2nv7wHWNoQ8xHSRiJgbxlGnrqZZYMuFVzEyXaSq-yMGp67I-vbYhmqHX7ttbpNkw=s900-c-k-c0x00ffffff-no-rj';
                }}
              />
            </div>
            <div
              className={`absolute -bottom-2 -right-2 text-white p-2 rounded-xl shadow-md ${
                selectedChannel === 'developer' ? 'bg-cyan-600' : 'bg-red-600'
              }`}
            >
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
                    : selectedChannel === 'developer'
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    : 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
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
                <span className="text-[11px] text-slate-400 block mb-0.5">Audience &amp; Reach</span>
                <span className="text-base sm:text-lg font-bold font-mono text-white tabular-nums">
                  {activeChannel.subscribersText}
                </span>
              </div>

              <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                <span className="text-[11px] text-slate-400 block mb-0.5">Role in Server</span>
                <span className="text-base sm:text-lg font-bold font-mono text-amber-400">
                  {selectedChannel === 'developer' ? 'Lead Developer & Manager' : 'Server Founder & Host'}
                </span>
              </div>

              <a
                href={activeChannel.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-5 py-3 font-bold text-xs rounded-xl transition-all shadow-lg active:scale-95 ${
                  selectedChannel === 'main'
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                    : selectedChannel === 'developer'
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/25'
                    : 'bg-sky-400 hover:bg-sky-300 text-black shadow-sky-500/25'
                }`}
              >
                <Youtube className="w-4 h-4 fill-current" />
                <span>Subscribe on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Tabbed Video Catalog: Latest Streams | Popular VODs | Series Episodes */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('latest')}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'latest'
                  ? 'bg-white/10 text-white border border-white/20 shadow-md'
                  : 'text-slate-400 hover:text-white bg-transparent'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${activeTab === 'latest' ? 'text-red-500' : ''}`} />
              <span>Live &amp; Latest Broadcasts</span>
              {activeTab === 'latest' && (
                <motion.div
                  layoutId="streamTabIndicator"
                  className="absolute inset-0 border-2 border-sky-500/50 rounded-xl pointer-events-none"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('popular')}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'popular'
                  ? 'bg-white/10 text-white border border-white/20 shadow-md'
                  : 'text-slate-400 hover:text-white bg-transparent'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${activeTab === 'popular' ? 'text-amber-400' : ''}`} />
              <span>Popular VODs &amp; Highlights</span>
              {activeTab === 'popular' && (
                <motion.div
                  layoutId="streamTabIndicator"
                  className="absolute inset-0 border-2 border-sky-500/50 rounded-xl pointer-events-none"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('series')}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'series'
                  ? 'bg-white/10 text-white border border-white/20 shadow-md'
                  : 'text-slate-400 hover:text-white bg-transparent'
              }`}
            >
              <ListVideo className={`w-3.5 h-3.5 ${activeTab === 'series' ? 'text-sky-400' : ''}`} />
              <span>Series &amp; Gameplay Episodes</span>
              {activeTab === 'series' && (
                <motion.div
                  layoutId="streamTabIndicator"
                  className="absolute inset-0 border-2 border-sky-500/50 rounded-xl pointer-events-none"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
            </button>
          </div>

          {/* Search Filter Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search streams or episodes..."
              className="w-full bg-[#0C1014] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white uppercase font-mono"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {tabVideos.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                className="group bg-[#0D1115] border border-white/10 hover:border-sky-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-sky-500/10 flex flex-col relative cursor-pointer"
                onClick={() => setActiveModalVideo(video)}
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                    }}
                  />

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-active:scale-95 transition-all">
                      <Play className="w-5 h-5 ml-0.5 fill-white" />
                    </div>
                  </div>

                  {/* Badges - ONLY authentic LIVE status if active */}
                  {video.isLive && (
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="flex items-center gap-1 bg-red-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        LIVE
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-white group-hover:text-sky-300 transition-colors line-clamp-2 mb-2 leading-snug">
                      {video.title}
                    </h4>
                    {video.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                        {video.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-white/5 mt-auto">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Youtube className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>YouTube Video</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sky-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Watch &rarr;
                      </span>
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Open directly in YouTube"
                        className="text-slate-500 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {tabVideos.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-[#0D1115] border border-white/10">
            <p className="text-sm text-slate-400 mb-2">No videos matched your search query.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-sky-400 font-semibold hover:underline"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </div>

      {/* 4. Developer & Manager Spotlight Card: ICONIC OP (1.04K+ Subs) */}
      <div className="bg-[#0B0F13] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[130px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Avatar & Details */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-cyan-500/50 p-1 bg-gradient-to-tr from-cyan-500/20 to-transparent shadow-xl">
                <img
                  src={dev.avatarUrl}
                  alt="ICONIC OP Channel Avatar"
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://yt3.googleusercontent.com/yUJw9yeYManLLp_lE7F81YlwUHvjWztkwJL133Va7H79D2l6Smop3RQTz9kAdaJaVY8-119FJrc=s900-c-k-c0x00ffffff-no-rj';
                  }}
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
                  className="font-mono text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded hover:bg-cyan-500/20 transition-colors"
                >
                  {dev.handle}
                </a>
              </div>

              <div className="text-xs font-mono text-slate-300 mb-3 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                <span>In-Game: <strong className="text-white">IconicMC_</strong></span>
                <span className="text-slate-600">·</span>
                <span className="text-cyan-400 font-bold">{dev.subscribersText}</span>
                <span className="text-slate-600">·</span>
                <span className="text-sky-400">Live YouTube Creator</span>
              </div>

              {/* Roles Chips */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[11px] font-semibold flex items-center gap-1.5">
                  <Code2 className="w-3 h-3" />
                  <span>Developer of BukkuzMC</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold flex items-center gap-1.5">
                  <Server className="w-3 h-3" />
                  <span>Founder &amp; Owner of LumaCloud</span>
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
            <button
              onClick={() => {
                setSelectedChannel('developer');
                window.scrollTo({ top: document.getElementById('creator')?.offsetTop || 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Browse Developer Streams</span>
            </button>

            <a
              href={dev.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              <Youtube className="w-4 h-4 fill-white" />
              <span>Subscribe @ft.iconicmc (1.04K)</span>
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

      {/* 5. In-App Video Modal Player */}
      <AnimatePresence>
        {activeModalVideo && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-[#0D1115] border border-white/20 rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              {/* Modal Top Bar */}
              <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between gap-4 bg-[#090D10]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-bold text-xs sm:text-sm text-white truncate">
                    {activeModalVideo.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={activeModalVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
                  >
                    <Youtube className="w-3.5 h-3.5 fill-white" />
                    <span className="hidden sm:inline">Open in YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => setActiveModalVideo(null)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Close video player"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* YouTube Responsive Embed Player */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${activeModalVideo.id}?autoplay=1&rel=0`}
                  title={activeModalVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Video Info Footer */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0B0F13] border-t border-white/5">
                <div>
                  <h4 className="font-semibold text-sm text-white mb-1">
                    {activeModalVideo.title}
                  </h4>
                  {activeModalVideo.description && (
                    <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                      {activeModalVideo.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-400 shrink-0">
                  <a
                    href={activeModalVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sky-400 hover:underline"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
