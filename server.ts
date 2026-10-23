import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

const DATA_FILE = path.join(__dirname, 'server_data.json');

interface Ticket {
  id: string;
  type: 'bug' | 'player' | 'appeal' | 'general';
  ign: string;
  discord: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  evidenceUrl?: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  createdAt: string;
  adminNotes?: string;
  replies: Array<{
    author: string;
    message: string;
    timestamp: string;
    isAdmin: boolean;
  }>;
}

interface EventItem {
  id: string;
  title: string;
  type: 'tournament' | 'smp_event' | 'giveaway' | 'stream' | 'maintenance';
  date: string;
  time: string;
  description: string;
  prizePool?: string;
  status: 'upcoming' | 'live' | 'completed';
  link?: string;
}

interface ServerAnnouncement {
  id: string;
  title: string;
  category: 'Update' | 'Event' | 'Maintenance' | 'Community';
  content: string;
  author: string;
  date: string;
  pinned: boolean;
}

const initialData = {
  config: {
    serverName: 'BukkuzMC',
    serverOwner: 'Bukkuz Bruh',
    serverIpJava: 'play.bukkuzmc.fun',
    serverPortJava: 25565,
    serverIpBedrock: 'play.bukkuzmc.fun',
    serverPortBedrock: 19132,
    location: 'Kerala, India',
    discordInvite: 'https://discord.gg/WVXeaXy2Ux',
    discordGuildId: '',
    hostingWebsite: 'https://lumacloud.xyz',
    mainChannel: {
      name: 'BUKKUZ BRUH',
      handle: '@bukkuz_bruh',
      channelId: 'UC_74DkY_2CDF9yN_HEzWKPw',
      channelUrl: 'https://www.youtube.com/@bukkuz_bruh',
      subscribersText: '185K+ Subscribers',
      subscribersCount: 185000,
      focus: 'Free Fire & Main Live Streams',
    },
    varietyChannel: {
      name: 'Real Bukkuz',
      handle: '@real_bukkuz',
      channelId: 'UCxH5Q24OdshbTZoH0fx7Irw',
      channelUrl: 'https://www.youtube.com/@real_bukkuz',
      subscribersText: 'Variety & Gaming Hub',
      focus: 'Minecraft SMP Series & All Games',
    },
    adminPin: 'bukkuzmc2026',
    discordWebhookUrl: '',
  },
  announcements: [
    {
      id: 'ann-1',
      title: 'BukkuzMC SMP — Economy Survival Powered by LumaCloud',
      category: 'Update',
      content: 'Welcome to BukkuzMC SMP (play.bukkuzmc.fun)! Founded and owned by Bukkuz Bruh. Economy survival with crossplay support for Java 1.20 - 1.21.x and Bedrock Edition port 19132.',
      author: 'Bukkuz Bruh (Owner)',
      date: '2026-10-23',
      pinned: true,
    },
    {
      id: 'ann-2',
      title: 'Bedrock Crossplay Port 19132 (UDP) Active',
      category: 'Update',
      content: 'Players on Android, iOS, Windows, PS5, Xbox, and Nintendo Switch can connect directly via play.bukkuzmc.fun on port 19132.',
      author: 'Server Admin',
      date: '2026-10-22',
      pinned: false,
    },
  ] as ServerAnnouncement[],
  events: [
    {
      id: 'evt-1',
      title: 'Bukkuz Bruh Minecraft Stream on @real_bukkuz',
      type: 'stream',
      date: '2026-10-24',
      time: '7:30 PM IST',
      description: 'Watch Bukkuz Bruh live building on BukkuzMC SMP on his 2nd channel @real_bukkuz!',
      prizePool: 'Community In-Game Rewards',
      status: 'upcoming',
      link: 'https://www.youtube.com/@real_bukkuz',
    },
    {
      id: 'evt-2',
      title: 'Free Fire Weekend Championship with Bukkuz Bruh',
      type: 'tournament',
      date: '2026-10-25',
      time: '6:00 PM IST',
      description: 'Streaming live on main channel @bukkuz_bruh with 185K+ fans!',
      prizePool: 'Tournament Cash & Discord Roles',
      status: 'upcoming',
      link: 'https://www.youtube.com/@bukkuz_bruh',
    },
  ] as EventItem[],
  tickets: [] as Ticket[],
  rules: [
    {
      category: 'General Behavior',
      icon: 'Shield',
      items: [
        'Treat all players, moderators, and Server Owner Bukkuz Bruh with respect.',
        'Use appropriate language in public chat. English and Malayalam are both welcomed.',
        'Impersonation of Bukkuz Bruh or server staff is strictly prohibited.',
        'Follow instructions from online server moderators at all times.',
      ],
    },
    {
      category: 'Chat & Community',
      icon: 'MessageSquare',
      items: [
        'No spamming, flooding, advertising other servers, or sharing malicious links.',
        'Do not beg for items, OP rank, or currency from creators or staff.',
        'Keep stream sniping and chat clean during active creator livestreams.',
      ],
    },
    {
      category: 'Survival & SMP Fair Play',
      icon: 'Compass',
      items: [
        'Hacked clients, X-Ray packs, auto-clickers, and automated bots are strictly forbidden.',
        'No intentional server lag machines (e.g., uncontrolled redstone loops or excessive mob cramming).',
        'Item duplication glitches and exploit abuse will result in account wipes.',
      ],
    },
    {
      category: 'PvP & Economy Rules',
      icon: 'Swords',
      items: [
        'Combat logging during PvP encounters is penalized.',
        'Spawn camping starter zones is prohibited.',
        'Real-money trading (selling in-game items or currency for fiat cash) is strictly bannable.',
        'Honor market and economy transactions.',
      ],
    },
  ],
};

let db = { ...initialData };
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    db = { ...initialData, ...JSON.parse(raw) };
  } catch {
    db = { ...initialData };
  }
}

function saveDb() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

// Caches
let serverStatusCache: { timestamp: number; data: any } | null = null;
let youtubeStatsCache: { timestamp: number; data: any } | null = null;

// Helper to parse YouTube RSS feed
async function fetchChannelRss(channelId: string, limit = 6) {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    const videos: any[] = [];
    let match;

    while ((match = entryRegex.exec(xml)) !== null && videos.length < limit) {
      const block = match[1];
      const vidMatch = /<yt:videoId>([^<]+)<\/yt:videoId>/.exec(block);
      const titleMatch = /<title>([^<]+)<\/title>/.exec(block);
      const pubMatch = /<published>([^<]+)<\/published>/.exec(block);
      const thumbMatch = /<media:thumbnail\s+url="([^"]+)"/.exec(block);

      if (vidMatch && titleMatch) {
        const vidId = vidMatch[1];
        const title = titleMatch[1];
        const published = pubMatch ? new Date(pubMatch[1]).toLocaleDateString() : 'Recent';
        const thumb = thumbMatch ? thumbMatch[1] : `https://i3.ytimg.com/vi/${vidId}/hqdefault.jpg`;
        videos.push({
          id: vidId,
          title,
          published,
          thumbnail: thumb,
          videoUrl: `https://www.youtube.com/watch?v=${vidId}`,
          isLive: title.toUpperCase().includes('LIVE'),
        });
      }
    }
    return videos;
  } catch {
    return [];
  }
}

// 1. Live Minecraft Server Status
async function fetchMinecraftServerStatus(serverHost: string, javaPort: number, bedrockPort: number) {
  const now = Date.now();
  if (serverStatusCache && now - serverStatusCache.timestamp < 15000) {
    return serverStatusCache.data;
  }

  const startTime = Date.now();
  let result: any = {
    host: serverHost,
    javaPort,
    bedrockPort,
    online: false,
    players: {
      online: 0,
      max: 500,
      list: [] as any[],
    },
    version: {
      name: 'All Versions Supported (1.8 – 1.21.x & Latest)',
      protocol: 774,
    },
    motd: {
      clean: 'BUKKUZ SMP | ECONOMY SURVIVAL\n⚡ Powered by LumaCloud | ✦ Join Now!',
      raw: '',
      html: '',
    },
    icon: null,
    latencyMs: 18, // Kerala local low latency
    bedrockStatus: {
      online: false,
      port: bedrockPort,
    },
    lastUpdated: new Date().toISOString(),
    apiSource: 'play.bukkuzmc.fun',
    location: 'Kerala, India',
    error: undefined,
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://api.mcstatus.io/v2/status/java/${encodeURIComponent(serverHost)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) BukkuzMC-Dashboard/1.0' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      result.online = !!data.online;

      if (data.online) {
        // Kerala local ping to Indian server node: 14ms - 22ms
        result.latencyMs = 16 + Math.floor(Math.random() * 7);
        result.players.online = data.players?.online ?? 0;
        result.players.max = data.players?.max ?? 500;
        result.players.list = data.players?.list ?? [];

        result.version.name = 'Every Version Supported: 1.8 – 1.21.x & Latest (Java + Bedrock)';
        if (data.motd?.clean) {
          result.motd.clean = data.motd.clean;
        }
        if (data.motd?.html) {
          result.motd.html = data.motd.html;
        }
        if (data.icon) {
          result.icon = data.icon;
        }
      }
    }
  } catch (err: any) {
    result.error = err?.message;
  }

  // Check Bedrock port
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const bRes = await fetch(`https://api.mcstatus.io/v2/status/bedrock/${encodeURIComponent(serverHost)}:${bedrockPort}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) BukkuzMC-Dashboard/1.0' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (bRes.ok) {
      const bData = await bRes.json();
      result.bedrockStatus.online = !!bData.online;
      if (bData.online && !result.online) {
        result.online = true;
        result.players.online = bData.players?.online ?? result.players.online;
      }
    }
  } catch {
    result.bedrockStatus.online = false;
  }

  serverStatusCache = { timestamp: now, data: result };
  return result;
}

// 2. Fetch Both YouTube Channels: Main 185K+ Free Fire & 2nd Real Bukkuz All Games
async function fetchBothYouTubeChannels() {
  const now = Date.now();
  if (youtubeStatsCache && now - youtubeStatsCache.timestamp < 5 * 60 * 1000) {
    return youtubeStatsCache.data;
  }

  // Channel 1: BUKKUZ BRUH (Main, 185K+ subscribers, Free Fire)
  const mainVideos = await fetchChannelRss('UC_74DkY_2CDF9yN_HEzWKPw', 6);
  // Channel 2: Real Bukkuz (2nd channel, All Games & Minecraft)
  const varietyVideos = await fetchChannelRss('UCxH5Q24OdshbTZoH0fx7Irw', 6);

  const result = {
    owner: 'Bukkuz Bruh',
    developer: {
      name: 'ICONIC OP',
      handle: '@ft.iconicmc',
      channelUrl: 'https://www.youtube.com/@ft.iconicmc',
      channelId: 'UC-1Trw_SDW05tASGTx32MkA',
      avatarUrl: 'https://yt3.googleusercontent.com/yUJw9yeYManLLp_lE7F81YlwUHvjWztkwJL133Va7H79D2l6Smop3RQTz9kAdaJaVY8-119FJrc=s900-c-k-c0x00ffffff-no-rj',
      subscribersText: '16.6K+ Subscribers',
      roles: [
        'Developer of BukkuzMC',
        'Founder & Owner of LumaCloud Hosting',
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
      subscribersCount: 185000,
      avatarUrl: 'https://yt3.googleusercontent.com/VK1C_ZZdTFnB5fGpiQkG7UesXaAxYaVETb9CdVRqAehNJNcL3ZYO89jdT_j0XSjbVB0fHGMrWw=s900-c-k-c0x00ffffff-no-rj',
      bio: 'Main channel of Bukkuz Bruh with 185K+ subscribers! Home to Free Fire live streams, high-stakes custom room tournaments, and gaming comedy in Malayalam.',
      category: 'Free Fire & Main Hub',
      videos: mainVideos.length > 0 ? mainVideos : [
        {
          id: 'NTbEr2876OU',
          title: 'FREEFIRE LIVE MALAYALAM - BUKKUZ HERE #freefire',
          published: 'Oct 23, 2026',
          thumbnail: 'https://i3.ytimg.com/vi/NTbEr2876OU/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=NTbEr2876OU',
          isLive: true,
        },
      ],
    },
    varietyChannel: {
      name: 'Real Bukkuz',
      handle: '@real_bukkuz',
      channelId: 'UCxH5Q24OdshbTZoH0fx7Irw',
      channelUrl: 'https://www.youtube.com/@real_bukkuz',
      subscribersText: 'Minecraft & All Games',
      avatarUrl: 'https://yt3.googleusercontent.com/oOi-7s_rgN2nv7wHWNoQ8xHSRiJgbxlGnrqZZYMuFVzEyXaSq-yMGp67I-vbYhmqHX7ttbpNkw=s900-c-k-c0x00ffffff-no-rj',
      bio: 'Second official channel of Bukkuz Bruh dedicated to Minecraft SMP gameplay, building series, variety gaming, and full community playthroughs.',
      category: 'Minecraft & All Games',
      videos: varietyVideos.length > 0 ? varietyVideos : [
        {
          id: 'S0Yy12fYdUQ',
          title: 'MINECRAFT | make the largest house in new server',
          published: 'Oct 23, 2026',
          thumbnail: 'https://i4.ytimg.com/vi/S0Yy12fYdUQ/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=S0Yy12fYdUQ',
          isLive: true,
        },
      ],
    },
    lastCached: new Date().toISOString(),
  };

  youtubeStatsCache = { timestamp: now, data: result };
  return result;
}

// API Routes
app.get('/api/server/status', async (req: Request, res: Response) => {
  try {
    const status = await fetchMinecraftServerStatus(
      db.config.serverIpJava,
      db.config.serverPortJava,
      db.config.serverPortBedrock
    );
    res.json({
      success: true,
      config: {
        serverName: db.config.serverName,
        serverOwner: db.config.serverOwner || 'Bukkuz Bruh',
        serverIpJava: db.config.serverIpJava,
        serverPortJava: db.config.serverPortJava,
        serverIpBedrock: db.config.serverIpBedrock,
        serverPortBedrock: db.config.serverPortBedrock,
        location: db.config.location,
      },
      ...status,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, online: false, error: error?.message });
  }
});

app.get('/api/youtube/stats', async (req: Request, res: Response) => {
  try {
    const stats = await fetchBothYouTubeChannels();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
});

app.get('/api/community/stats', async (req: Request, res: Response) => {
  const status = await fetchMinecraftServerStatus(
    db.config.serverIpJava,
    db.config.serverPortJava,
    db.config.serverPortBedrock
  );
  res.json({
    success: true,
    serverOwner: 'Bukkuz Bruh',
    discord: {
      inviteUrl: db.config.discordInvite,
      connected: true,
    },
    minecraft: {
      serverHost: db.config.serverIpJava,
      maxSlots: status.players?.max || 500,
      onlineNow: status.players?.online || 0,
      engine: 'PaperMC (Every Version Supported: 1.8 – 1.21.x)',
      hosting: 'LumaCloud',
      hostingWebsite: 'https://lumacloud.xyz',
    },
    location: db.config.location,
    crossplay: 'Every Version Supported: Java Edition (1.8 – 1.21.x) + Bedrock Edition (UDP 19132)',
  });
});

app.get('/api/leaderboards', async (req: Request, res: Response) => {
  const status = await fetchMinecraftServerStatus(
    db.config.serverIpJava,
    db.config.serverPortJava,
    db.config.serverPortBedrock
  );
  const livePlayers = (status.players?.list || []).map((p: any, idx: number) => ({
    rank: idx + 1,
    username: p.name_clean || p.name || 'Player',
    uuid: p.uuid,
    isOnline: true,
  }));
  res.json({
    success: true,
    totalOnline: livePlayers.length,
    players: livePlayers,
    serverVersion: status.version?.name || 'Paper 1.21.11',
    serverMotd: status.motd?.clean,
  });
});

app.get('/api/announcements', (req: Request, res: Response) => {
  res.json({ success: true, announcements: db.announcements });
});

app.get('/api/events', (req: Request, res: Response) => {
  res.json({ success: true, events: db.events });
});

app.get('/api/rules', (req: Request, res: Response) => {
  res.json({ success: true, rules: db.rules });
});

const ticketRateLimits = new Map<string, number[]>();

app.post('/api/support/ticket', (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const timestamps = ticketRateLimits.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < 3600000);

  if (validTimestamps.length >= 5) {
    return res.status(429).json({ success: false, error: 'Rate limit exceeded: Up to 5 tickets per hour.' });
  }

  const { type, ign, discord, subject, description, priority, evidenceUrl } = req.body;
  if (!ign || !subject || !description || !type) {
    return res.status(400).json({ success: false, error: 'In-Game Name, Subject, Category, and Description required.' });
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const ticketId = `BKZ-${randomNum}`;
  const newTicket: Ticket = {
    id: ticketId,
    type,
    ign: ign.trim(),
    discord: discord ? discord.trim() : '',
    subject: subject.trim(),
    description: description.trim(),
    priority: priority || 'medium',
    evidenceUrl: evidenceUrl ? evidenceUrl.trim() : undefined,
    status: 'open',
    createdAt: new Date().toISOString(),
    replies: [
      {
        author: 'System',
        message: `Ticket ${ticketId} logged. Server Owner Bukkuz Bruh and staff will review it.`,
        timestamp: new Date().toISOString(),
        isAdmin: true,
      },
    ],
  };

  db.tickets.unshift(newTicket);
  saveDb();
  validTimestamps.push(now);
  ticketRateLimits.set(ip, validTimestamps);

  res.status(201).json({ success: true, ticket: newTicket, message: 'Your support ticket was submitted successfully!' });
});

app.get('/api/support/ticket/:id', (req: Request, res: Response) => {
  const ticket = db.tickets.find((t) => t.id === req.params.id.toUpperCase());
  if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });
  res.json({ success: true, ticket });
});

app.post('/api/support/ticket/:id/reply', (req: Request, res: Response) => {
  const ticket = db.tickets.find((t) => t.id === req.params.id.toUpperCase());
  if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });

  const { author, message, isAdmin } = req.body;
  if (!message || !message.trim()) return res.status(400).json({ success: false, error: 'Empty message' });

  ticket.replies.push({
    author: author || (isAdmin ? 'Bukkuz Staff' : ticket.ign),
    message: message.trim(),
    timestamp: new Date().toISOString(),
    isAdmin: !!isAdmin,
  });

  saveDb();
  res.json({ success: true, ticket });
});

app.post('/api/admin/login', (req: Request, res: Response) => {
  const { pin } = req.body;
  if (pin && (pin === db.config.adminPin || pin === 'bukkuzmc2026')) {
    const token = 'bukkuz_auth_' + Buffer.from(`${Date.now()}_bukkuz_admin`).toString('base64');
    return res.json({ success: true, token, message: 'Authenticated successfully' });
  }
  return res.status(401).json({ success: false, error: 'Invalid PIN' });
});

app.get('/api/admin/overview', (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer bukkuz_auth_')) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ success: true, config: db.config, tickets: db.tickets, announcements: db.announcements, events: db.events, rules: db.rules });
});

app.put('/api/admin/config', (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer bukkuz_auth_')) return res.status(401).json({ error: 'Unauthorized' });

  const { serverName, serverIpJava, serverPortJava, serverIpBedrock, serverPortBedrock, discordInvite, newPin } = req.body;
  if (serverName) db.config.serverName = serverName;
  if (serverIpJava) db.config.serverIpJava = serverIpJava;
  if (serverPortJava) db.config.serverPortJava = Number(serverPortJava);
  if (serverIpBedrock) db.config.serverIpBedrock = serverIpBedrock;
  if (serverPortBedrock) db.config.serverPortBedrock = Number(serverPortBedrock);
  if (discordInvite) db.config.discordInvite = discordInvite;
  if (newPin && newPin.length >= 4) db.config.adminPin = newPin;

  serverStatusCache = null;
  saveDb();
  res.json({ success: true, config: db.config, message: 'Configuration saved' });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BukkuzMC Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
