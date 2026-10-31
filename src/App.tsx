/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, X, Wifi } from 'lucide-react';
import { Navbar } from './components/Navbar.tsx';
import { MinecraftHeroCanvas } from './components/MinecraftHeroCanvas.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { ServerDashboard } from './components/ServerDashboard.tsx';
import { CreatorHub } from './components/CreatorHub.tsx';
import { CommunityStats } from './components/CommunityStats.tsx';
import { JoinSystem } from './components/JoinSystem.tsx';
import { LeaderboardSection } from './components/LeaderboardSection.tsx';
import { EventsAndRules } from './components/EventsAndRules.tsx';
import { SupportCenter } from './components/SupportCenter.tsx';
import { Footer } from './components/Footer.tsx';
import { SnowfallEffect } from './components/SnowfallEffect.tsx';
import confetti from 'canvas-confetti';
import { SeasonId, SeasonMode, getSeasonForMonth, SEASONS } from './utils/seasonalTheme.ts';

interface ToastMessage {
  id: string;
  type: 'online' | 'offline';
  title: string;
  description: string;
  timestamp: string;
}

export default function App() {
  // Live Server Status State
  const [serverStatus, setServerStatus] = useState({
    online: true,
    players: { online: 0, max: 500, list: [] as any[] },
    version: { name: 'Paper 1.21.11' },
    motd: {
      clean: 'BUKKUZ SMP | ECONOMY SURVIVAL\n⚡ Powered by LumaCloud | ✦ Join Now!',
    },
    icon: null as string | null,
    latencyMs: null as number | null,
    bedrockStatus: { online: true, port: 19132 },
    lastUpdated: new Date().toISOString(),
    apiSource: 'play.bukkuzmc.fun',
    loading: false,
    error: undefined as string | undefined,
  });
  const [statusLoading, setStatusLoading] = useState(false);

  // Status Change Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const prevOnlineRef = useRef<boolean | null>(null);

  // Both YouTube Channels & Team (ICONIC OP accurately at 1.04K+ Subs)
  const [creatorStats, setCreatorStats] = useState({
    owner: 'Bukkuz Bruh',
    developer: {
      name: 'ICONIC OP',
      handle: '@ft.iconicmc',
      channelUrl: 'https://www.youtube.com/@ft.iconicmc',
      channelId: 'UC-1Trw_SDW05tASGTx32MkA',
      avatarUrl: 'https://yt3.googleusercontent.com/yUJw9yeYManLLp_lE7F81YlwUHvjWztkwJL133Va7H79D2l6Smop3RQTz9kAdaJaVY8-119FJrc=s900-c-k-c0x00ffffff-no-rj',
      subscribersText: '1.04K+ Subscribers',
      roles: [
        'Developer of BukkuzMC',
        'Founder and Owner of LumaCloud Hosting',
        'Manager of Bukkuz Bruh',
      ],
      ign: 'IconicMC_',
      hostingSite: 'https://lumacloud.xyz',
      bio: 'Lead Developer of BukkuzMC, Manager of Bukkuz Bruh, and Founder of LumaCloud Hosting.',
      category: 'BukkuzMC Developer & Creator',
      latestStreams: [
        {
          id: '7K6NiOnHOhk',
          title: 'Grinding on BukkuzSMP | With @bukkuz_bruh :)',
          published: 'Recent Stream',
          thumbnail: 'https://i.ytimg.com/vi/7K6NiOnHOhk/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=7K6NiOnHOhk',
          isLive: false,
          category: 'BukkuzMC SMP',
        },
        {
          id: 'EaA24zGhFXc',
          title: 'Playing With BukkuzBrihh',
          published: 'Stream Archive',
          thumbnail: 'https://i.ytimg.com/vi/EaA24zGhFXc/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=EaA24zGhFXc',
          isLive: false,
          category: 'BukkuzMC Co-op',
        },
      ],
      popularVODs: [
        {
          id: 'GUSDoUmnIqU',
          title: 'Minecraft Kerala SMP Day 1 🔥 | New Survival Journey Begins!',
          published: 'Popular VOD',
          thumbnail: 'https://i.ytimg.com/vi/GUSDoUmnIqU/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=GUSDoUmnIqU',
          category: 'Kerala SMP',
        },
      ],
      seriesEpisodes: [
        {
          id: 'deiekxvf2c8',
          episodeNumber: 1,
          title: 'My survival series episode 1 with Salman. Letsplay series part 1 #minecraftgameplayandroidmalayalam',
          published: 'Episode 01',
          thumbnail: 'https://i.ytimg.com/vi/deiekxvf2c8/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=deiekxvf2c8',
          category: 'Survival Letsplay',
        },
      ],
      videos: [],
    },
    mainChannel: {
      name: 'BUKKUZ BRUH',
      handle: '@bukkuz_bruh',
      channelId: 'UC_74DkY_2CDF9yN_HEzWKPw',
      channelUrl: 'https://www.youtube.com/@bukkuz_bruh',
      subscribersText: '185K+ Subscribers',
      avatarUrl: 'https://yt3.googleusercontent.com/VK1C_ZZdTFnB5fGpiQkG7UesXaAxYaVETb9CdVRqAehNJNcL3ZYO89jdT_j0XSjbVB0fHGMrWw=s900-c-k-c0x00ffffff-no-rj',
      bio: 'Main channel of Bukkuz Bruh with 185K+ subscribers! Home to Free Fire live streams, high-stakes custom room tournaments, and gaming comedy in Malayalam.',
      category: 'Free Fire & Main Hub',
      latestStreams: [
        {
          id: 'nA5UeFU9GRk',
          title: 'FREEFIRE LIVE MALAYALAM - BUKKUZ HERE #freefire',
          published: 'Latest Broadcast',
          thumbnail: 'https://i.ytimg.com/vi/nA5UeFU9GRk/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=nA5UeFU9GRk',
          isLive: true,
        },
        {
          id: 'NTbEr2876OU',
          title: 'FREEFIRE LIVE MALAYALAM - BUKKUZ HERE #freefire',
          published: 'Recent Stream',
          thumbnail: 'https://i.ytimg.com/vi/NTbEr2876OU/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=NTbEr2876OU',
          isLive: false,
        },
      ],
      popularVODs: [
        {
          id: 'LTQEvXJ1Ky4',
          title: 'FREEFIRE LIVE MALAYALAM - BUKKUZ HERE #freefire',
          published: 'Popular VOD',
          thumbnail: 'https://i.ytimg.com/vi/LTQEvXJ1Ky4/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=LTQEvXJ1Ky4',
        },
        {
          id: 'FXSOtQsRWqk',
          title: 'FREEFIRE LIVE MALAYALAM - BUKKUZ HERE #freefire',
          published: 'Popular VOD',
          thumbnail: 'https://i.ytimg.com/vi/FXSOtQsRWqk/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=FXSOtQsRWqk',
        },
      ],
      seriesEpisodes: [
        {
          id: 'YUDrZ4SfxFM',
          episodeNumber: 1,
          title: '😱 100k special surprise',
          published: 'Milestone Special',
          thumbnail: 'https://i.ytimg.com/vi/YUDrZ4SfxFM/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=YUDrZ4SfxFM',
        },
      ],
      videos: [],
    },
    varietyChannel: {
      name: 'Real Bukkuz',
      handle: '@real_bukkuz',
      channelId: 'UCxH5Q24OdshbTZoH0fx7Irw',
      channelUrl: 'https://www.youtube.com/@real_bukkuz',
      subscribersText: 'Minecraft & All Games',
      avatarUrl: 'https://yt3.googleusercontent.com/oOi-7s_rgN2nv7wHWNoQ8xHSRiJgbxlGnrqZZYMuFVzEyXaSq-yMGp67I-vbYhmqHX7ttbpNkw=s900-c-k-c0x00ffffff-no-rj',
      bio: 'Second official channel of Bukkuz Bruh dedicated to BukkuzMC Minecraft SMP gameplay, 24/7 server streams, mega builds, and variety gaming in Malayalam.',
      category: 'Minecraft & All Games',
      latestStreams: [
        {
          id: 'bWk2uSM7MHs',
          title: 'MINECRAFT LIVE MALAYALAM 24/7 server',
          published: 'Stream Archive',
          thumbnail: 'https://i.ytimg.com/vi/bWk2uSM7MHs/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=bWk2uSM7MHs',
          isLive: true,
        },
        {
          id: 'S0Yy12fYdUQ',
          title: 'MINECRAFT | make the largest house in new server',
          published: 'Recent Stream',
          thumbnail: 'https://i.ytimg.com/vi/S0Yy12fYdUQ/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=S0Yy12fYdUQ',
          isLive: false,
        },
        {
          id: '1gBHYAkP5SM',
          title: 'MINECRAFT LIVE',
          published: 'Stream Archive',
          thumbnail: 'https://i.ytimg.com/vi/1gBHYAkP5SM/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=1gBHYAkP5SM',
          isLive: false,
        },
        {
          id: 'cS9rBy97qsI',
          title: 'FIRST MINECRAFT LIVE',
          published: 'Stream Archive',
          thumbnail: 'https://i.ytimg.com/vi/cS9rBy97qsI/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=cS9rBy97qsI',
          isLive: false,
        },
      ],
      popularVODs: [
        {
          id: 'JffF7CgRPME',
          title: 'MINECRAFT | make the largest house in new server (Part 2)',
          published: 'Popular VOD',
          thumbnail: 'https://i.ytimg.com/vi/JffF7CgRPME/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=JffF7CgRPME',
        },
        {
          id: '-MUKxHYJn-M',
          title: 'MINECRAFT | make the largest house in new server (Part 1)',
          published: 'Popular VOD',
          thumbnail: 'https://i.ytimg.com/vi/-MUKxHYJn-M/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=-MUKxHYJn-M',
        },
      ],
      seriesEpisodes: [
        {
          id: 'HlSD18tdI2w',
          episodeNumber: 1,
          title: 'Grand Theft Auto V Enhanced Edition Gameplay Walkthrough Part 1 [PC 4K 60FPS] on RTX 4060',
          published: 'Episode 01',
          thumbnail: 'https://i.ytimg.com/vi/HlSD18tdI2w/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=HlSD18tdI2w',
        },
        {
          id: 'y6CdeD8Ifnc',
          episodeNumber: 2,
          title: 'PUBG PC LIVE MALAYALAM',
          published: 'Episode 02',
          thumbnail: 'https://i.ytimg.com/vi/y6CdeD8Ifnc/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=y6CdeD8Ifnc',
        },
      ],
      videos: [],
    },
  });

  // Community Specifications
  const [communityData, setCommunityData] = useState({
    discord: {
      inviteUrl: 'https://discord.gg/WVXeaXy2Ux',
      onlineMembers: null,
      totalMembers: null,
      connected: true,
    },
    minecraft: {
      serverHost: 'play.bukkuzmc.fun',
      maxSlots: 500,
      onlineNow: 0,
      engine: 'Paper 1.21.11',
      hosting: 'LumaCloud',
      hostingWebsite: 'https://lumacloud.xyz',
    },
    location: 'Kerala, India',
    crossplay: 'Minecraft Java Edition + Bedrock Edition (UDP 19132)',
  });

  // Live Connected Players
  const [livePlayers, setLivePlayers] = useState<any[]>([]);

  // Announcements & Events
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);

  // UI state
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedJava, setCopiedJava] = useState(false);
  const [copiedBedrock, setCopiedBedrock] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Theme locked exclusively to Winter Edition
  const activeSeasonId: SeasonId = 'winter';
  const currentSeason = SEASONS.winter;

  // Trigger Toast Notification
  const triggerToast = (type: 'online' | 'offline', title: string, description: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = {
      id,
      type,
      title,
      description,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setToasts((prev) => [newToast, ...prev.slice(0, 2)]);

    // Auto dismiss after 5.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };



  // Poll server status & detect state changes
  const fetchStatus = useCallback(async () => {
    setStatusLoading(true);
    try {
      const res = await fetch('/api/server/status');
      if (res.ok) {
        const data = await res.json();
        const currentOnline = !!data.online;

        // Check if transition occurred from previous state
        if (prevOnlineRef.current !== null && prevOnlineRef.current !== currentOnline) {
          if (currentOnline) {
            triggerToast(
              'online',
              'Server Status: Network Online',
              'play.bukkuzmc.fun is online and reachable. All nodes operational.'
            );
          } else {
            triggerToast(
              'offline',
              'Server Status: Standby / Reconnecting',
              'BukkuzMC network is currently unreachable or undergoing maintenance.'
            );
          }
        }
        prevOnlineRef.current = currentOnline;

        setServerStatus((prev) => ({
          ...prev,
          ...data,
          loading: false,
        }));

        if (data.players?.list) {
          setLivePlayers(
            data.players.list.map((p: any, i: number) => ({
              rank: i + 1,
              username: p.name_clean || p.name || 'Player',
              uuid: p.uuid,
              isOnline: true,
            }))
          );
        }
      }
    } catch {
      if (prevOnlineRef.current === true) {
        triggerToast(
          'offline',
          'Server Status: Probe Disconnected',
          'Could not reach server status endpoint.'
        );
      }
      prevOnlineRef.current = false;
      setServerStatus((prev) => ({
        ...prev,
        online: false,
        error: 'Live probe connection failed',
        loading: false,
      }));
    } finally {
      setStatusLoading(false);
    }
  }, []);

  // Fetch all app data
  const fetchAllData = useCallback(async () => {
    fetchStatus();

    // YouTube (Both Channels + ICONIC OP)
    fetch('/api/youtube/stats')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && d.mainChannel && d.varietyChannel) setCreatorStats(d);
      })
      .catch(() => {});

    // Community
    fetch('/api/community/stats')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setCommunityData(d);
      })
      .catch(() => {});

    // Live Players
    fetch('/api/leaderboards')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.players) setLivePlayers(d.players);
      })
      .catch(() => {});

    // Announcements
    fetch('/api/announcements')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.announcements) setAnnouncements(d.announcements);
      })
      .catch(() => {});

    // Events
    fetch('/api/events')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.events) setEvents(d.events);
      })
      .catch(() => {});

    // Rules
    fetch('/api/rules')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.rules) setRules(d.rules);
      })
      .catch(() => {});
  }, [fetchStatus]);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchStatus, 20000);
    return () => clearInterval(interval);
  }, [fetchAllData, fetchStatus]);

  // Copy Handlers
  const handleCopyMain = () => {
    navigator.clipboard.writeText('play.bukkuzmc.fun');
    setCopiedMain(true);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.2 },
      colors: ['#38bdf8', '#7dd3fc', '#bae6fd', '#ffffff'],
    });
    setTimeout(() => setCopiedMain(false), 2400);
  };

  const handleCopyJava = () => {
    navigator.clipboard.writeText('play.bukkuzmc.fun');
    setCopiedJava(true);
    setTimeout(() => setCopiedJava(false), 2400);
  };

  const handleCopyBedrock = () => {
    navigator.clipboard.writeText('play.bukkuzmc.fun:19132');
    setCopiedBedrock(true);
    setTimeout(() => setCopiedBedrock(false), 2400);
  };

  const handleScrollToJoin = () => {
    const el = document.getElementById('join');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#080B0D] text-slate-100 flex flex-col relative selection:bg-sky-500/30 selection:text-white">
      {/* 3D Minecraft Scene Canvas In Background with Season Particle & Lighting Themes */}
      <MinecraftHeroCanvas reducedMotion={reducedMotion} seasonId={activeSeasonId} />

      {/* Gentle Randomized Snowfall Overlay (Framer Motion) */}
      <SnowfallEffect reducedMotion={reducedMotion} />

      {/* Top Navigation with Winter Badge & Live Ping Probe */}
      <Navbar
        onCopyIp={handleCopyMain}
        copied={copiedMain}
        onOpenJoinGuide={handleScrollToJoin}
        serverPingMs={serverStatus.latencyMs}
        seasonId={activeSeasonId}
      />

      {/* Framer Motion Toast Notifications for Server Status Transitions */}
      <aside aria-label="Status Notifications" className="fixed top-20 right-6 z-[999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.9 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start gap-3 relative ${
                toast.type === 'online'
                  ? 'bg-[#08131E]/95 text-sky-100'
                  : 'bg-[#1C0E10]/95 border-rose-500/50 text-rose-100 shadow-rose-500/15'
              }`}
              style={{
                borderColor: toast.type === 'online' ? currentSeason.colors.badgeBorder : undefined,
                boxShadow: toast.type === 'online' ? `0 25px 50px -12px ${currentSeason.colors.glow}` : undefined,
              }}
            >
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  toast.type === 'online'
                    ? ''
                    : 'bg-rose-500/20 text-rose-400'
                }`}
                style={{
                  backgroundColor: toast.type === 'online' ? currentSeason.colors.badgeBg : undefined,
                  color: toast.type === 'online' ? currentSeason.colors.accentLight : undefined,
                }}
              >
                {toast.type === 'online' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h4 className="font-bold text-xs text-white">{toast.title}</h4>
                  <span className="text-[10px] font-mono opacity-70">{toast.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{toast.description}</p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white transition-colors p-1"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </aside>

      {/* Main Content Sections */}
      <main className="relative z-10 flex-1">
        {/* 1. Hero Section with dynamic seasonal atmosphere & badge */}
        <HeroSection
          serverStatus={serverStatus}
          seasonId={activeSeasonId}
          onOpenJoinGuide={handleScrollToJoin}
          onCopyJava={handleCopyJava}
          onCopyBedrock={handleCopyBedrock}
          copiedJava={copiedJava}
          copiedBedrock={copiedBedrock}
        />

        {/* 2. Live Server Dashboard */}
        <ServerDashboard
          serverStatus={serverStatus}
          onRefresh={fetchStatus}
          loading={statusLoading}
          seasonId={activeSeasonId}
        />

        {/* 3. YouTube Creator Hub (ICONIC OP 1.04K+ Subs & Bukkuz Bruh) */}
        <CreatorHub creatorStats={creatorStats} seasonId={activeSeasonId} />

        {/* 5. Community Statistics & Specifications */}
        <CommunityStats communityData={communityData} seasonId={activeSeasonId} />

        {/* 6. Java + Bedrock Join System (Cracked + Premium, All Versions) */}
        <JoinSystem
          onCopyJava={handleCopyJava}
          onCopyBedrock={handleCopyBedrock}
          copiedJava={copiedJava}
          copiedBedrock={copiedBedrock}
          seasonId={activeSeasonId}
        />

        {/* 7. Live Connected Players Roster */}
        <LeaderboardSection
          players={livePlayers}
          serverVersion={serverStatus.version?.name}
          serverMotd={serverStatus.motd?.clean}
          seasonId={activeSeasonId}
        />

        {/* 8. Events, Announcements, Rules & FAQs */}
        <EventsAndRules
          events={events}
          announcements={announcements}
          rules={rules}
          seasonId={activeSeasonId}
        />

        {/* 9. Discord Ticket Center (Direct Ticket Redirection) */}
        <SupportCenter seasonId={activeSeasonId} />
      </main>

      {/* Footer */}
      <Footer
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
      />
    </div>
  );
}
