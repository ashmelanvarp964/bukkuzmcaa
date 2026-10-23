/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
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
import { AdminModal } from './components/AdminModal.tsx';
import { Footer } from './components/Footer.tsx';
import confetti from 'canvas-confetti';

export default function App() {
  // Live Server Status State (Real defaults matching genuine node output)
  const [serverStatus, setServerStatus] = useState({
    online: true,
    players: { online: 1, max: 500, list: [] as any[] },
    version: { name: 'Every Version Supported (1.8 – 1.21.x & Latest)' },
    motd: {
      clean: 'BUKKUZ SMP | ECONOMY SURVIVAL\n⚡ Powered by LumaCloud | ✦ Join Now!',
    },
    icon: null as string | null,
    latencyMs: 18,
    bedrockStatus: { online: true, port: 19132 },
    lastUpdated: new Date().toISOString(),
    apiSource: 'play.bukkuzmc.fun',
    loading: false,
    error: undefined as string | undefined,
  });
  const [statusLoading, setStatusLoading] = useState(false);

  // Both YouTube Channels & Team
  const [creatorStats, setCreatorStats] = useState({
    owner: 'Bukkuz Bruh',
    developer: {
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
      videos: [
        {
          id: 'NTbEr2876OU',
          title: 'FREEFIRE LIVE MALAYALAM - BUKKUZ HERE #freefire',
          published: 'Oct 23, 2026',
          thumbnail: 'https://i3.ytimg.com/vi/NTbEr2876OU/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=NTbEr2876OU',
          isLive: true,
        },
        {
          id: 'vXZIsIobgO0',
          title: 'FREEFIRE LIVE MALAYALAM - BUKKUZ HERE #freefire',
          published: 'Oct 22, 2026',
          thumbnail: 'https://i3.ytimg.com/vi/vXZIsIobgO0/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=vXZIsIobgO0',
        },
        {
          id: 'Al5f61D37vk',
          title: 'FREEFIRE LIVE MALAYALAM - BUKKUZ HERE #freefire',
          published: 'Oct 20, 2026',
          thumbnail: 'https://i2.ytimg.com/vi/Al5f61D37vk/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=Al5f61D37vk',
        },
      ],
    },
    varietyChannel: {
      name: 'Real Bukkuz',
      handle: '@real_bukkuz',
      channelId: 'UCxH5Q24OdshbTZoH0fx7Irw',
      channelUrl: 'https://www.youtube.com/@real_bukkuz',
      subscribersText: 'Minecraft & All Games Hub',
      avatarUrl: 'https://yt3.googleusercontent.com/oOi-7s_rgN2nv7wHWNoQ8xHSRiJgbxlGnrqZZYMuFVzEyXaSq-yMGp67I-vbYhmqHX7ttbpNkw=s900-c-k-c0x00ffffff-no-rj',
      bio: 'Second official channel of Bukkuz Bruh dedicated to Minecraft SMP gameplay, building series, variety gaming, and full community playthroughs.',
      category: 'Minecraft & All Games',
      videos: [
        {
          id: 'S0Yy12fYdUQ',
          title: 'MINECRAFT | make the largest house in new server',
          published: 'Oct 23, 2026',
          thumbnail: 'https://i4.ytimg.com/vi/S0Yy12fYdUQ/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=S0Yy12fYdUQ',
          isLive: true,
        },
        {
          id: 'bUr41XBV_Iw',
          title: 'UNICYCLE TOGETHER',
          published: 'Oct 22, 2026',
          thumbnail: 'https://i3.ytimg.com/vi/bUr41XBV_Iw/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=bUr41XBV_Iw',
        },
        {
          id: '1gBHYAkP5SM',
          title: 'MINECRAFT LIVE',
          published: 'Oct 19, 2026',
          thumbnail: 'https://i2.ytimg.com/vi/1gBHYAkP5SM/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=1gBHYAkP5SM',
        },
      ],
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
      onlineNow: 1,
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
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Poll server status
  const fetchStatus = useCallback(async () => {
    setStatusLoading(true);
    try {
      const res = await fetch('/api/server/status');
      if (res.ok) {
        const data = await res.json();
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

    // YouTube (Both Channels)
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
      colors: ['#10b981', '#34d399', '#ffffff'],
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
    <div className="min-h-screen bg-[#080B0D] text-slate-100 flex flex-col relative selection:bg-emerald-500 selection:text-black">
      {/* 3D Minecraft Scene Canvas In Background */}
      <MinecraftHeroCanvas reducedMotion={reducedMotion} />

      {/* Top Navigation */}
      <Navbar
        onCopyIp={handleCopyMain}
        copied={copiedMain}
        onOpenJoinGuide={handleScrollToJoin}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeSection="overview"
      />

      {/* Main Content Sections */}
      <main className="relative z-10 flex-1">
        {/* 1. Hero Section */}
        <HeroSection
          serverStatus={serverStatus}
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
        />

        {/* 3. YouTube Creator Hub (Both Channels: Bukkuz Bruh 185K+ Free Fire & Real Bukkuz Minecraft / All Games) */}
        <CreatorHub creatorStats={creatorStats} />

        {/* 4. Community Statistics & Specifications */}
        <CommunityStats communityData={communityData} />

        {/* 5. Java + Bedrock Join System */}
        <JoinSystem
          onCopyJava={handleCopyJava}
          onCopyBedrock={handleCopyBedrock}
          copiedJava={copiedJava}
          copiedBedrock={copiedBedrock}
        />

        {/* 6. Live Connected Players Roster */}
        <LeaderboardSection
          players={livePlayers}
          serverVersion={serverStatus.version?.name}
          serverMotd={serverStatus.motd?.clean}
        />

        {/* 7. Events, Announcements, Rules & FAQs */}
        <EventsAndRules
          events={events}
          announcements={announcements}
          rules={rules}
        />

        {/* 8. Support Center */}
        <SupportCenter />
      </main>

      {/* Staff Admin Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onConfigUpdated={fetchAllData}
      />

      {/* Footer */}
      <Footer
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />
    </div>
  );
}
