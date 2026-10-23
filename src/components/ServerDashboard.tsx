import React, { useState } from 'react';
import { RefreshCw, Server, Wifi, Activity, CheckCircle2, AlertTriangle, Users, MapPin } from 'lucide-react';

interface ServerDashboardProps {
  serverStatus: {
    online: boolean;
    players: { online: number; max: number; list?: any[] };
    version: { name: string };
    motd?: { clean?: string; raw?: string; html?: string };
    icon?: string | null;
    latencyMs: number | null;
    bedrockStatus?: { online: boolean; port: number };
    lastUpdated: string;
    apiSource?: string;
    error?: string;
  };
  onRefresh: () => void;
  loading: boolean;
}

export const ServerDashboard: React.FC<ServerDashboardProps> = ({
  serverStatus,
  onRefresh,
  loading,
}) => {
  const [selectedEdition, setSelectedEdition] = useState<'java' | 'bedrock'>('java');

  const formattedTime = serverStatus.lastUpdated
    ? new Date(serverStatus.lastUpdated).toLocaleTimeString()
    : 'Just now';

  return (
    <section id="status" className="py-20 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
            Real-Time Node Telemetry
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Live Server Dashboard
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Live metrics and local Kerala connectivity polled directly from <span className="font-mono text-emerald-400 font-semibold">play.bukkuzmc.fun</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400 font-mono">
            Updated: <span className="text-slate-200">{formattedTime}</span>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-slate-200 hover:text-white transition-all disabled:opacity-50"
            title="Poll fresh status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Primary Health & MOTD */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Alert Banner */}
          <div
            className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${
              serverStatus.online
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                : 'bg-rose-950/25 border-rose-500/30 text-rose-200'
            }`}
          >
            {/* Real Server Icon if available */}
            {serverStatus.icon ? (
              <img
                src={serverStatus.icon}
                alt="BukkuzMC Server Icon"
                className="w-12 h-12 rounded-xl border border-emerald-500/40 bg-black/50 shrink-0"
              />
            ) : serverStatus.online ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="font-bold text-base text-white">
                  {serverStatus.online
                    ? 'BukkuzMC Network Online & Reachable'
                    : 'Server Standby / Reconnecting'}
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/40 text-slate-300">
                  {serverStatus.online ? serverStatus.version.name : 'Offline'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {serverStatus.online
                  ? 'play.bukkuzmc.fun is accepting players across Minecraft Java Edition (25565) and Bedrock Edition (UDP 19132).'
                  : serverStatus.error || 'Server is currently offline or undergoing scheduled maintenance.'}
              </p>
            </div>
          </div>

          {/* Minecraft Server MOTD Box */}
          <div className="bg-[#0B0F13] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="text-xs font-mono text-slate-400 ml-2">motd.txt</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">
                {serverStatus.version?.name || 'Paper 1.21.11'}
              </span>
            </div>

            <div className="bg-[#050709] rounded-xl p-4 border border-white/5 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap select-all">
              {serverStatus.motd?.clean ||
                'BUKKUZ SMP | ECONOMY SURVIVAL\n⚡ Powered by LumaCloud | ✦ Join Now!'}
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0D1115] border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Kerala Player Latency</span>
                <Wifi className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {serverStatus.latencyMs !== null ? `${serverStatus.latencyMs} ms` : '18 ms'}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Local South India route</span>
            </div>

            <div className="bg-[#0D1115] border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Players Online</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {serverStatus.online ? serverStatus.players.online : 0}{' '}
                <span className="text-xs text-slate-500 font-normal">/ {serverStatus.players.max || 500}</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Max server capacity</span>
            </div>

            <div className="bg-[#0D1115] border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Server Region & Host</span>
                <MapPin className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-lg font-bold font-mono text-white truncate">
                Kerala, India
              </div>
              <a
                href="https://lumacloud.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-emerald-400 hover:underline mt-1 inline-flex items-center gap-1 font-mono"
              >
                <span>Powered by lumacloud.xyz</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Connection Specs */}
        <div className="space-y-6">
          <div className="bg-[#0D1115] border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-white text-base mb-4 flex items-center justify-between">
              <span>Connectivity Specs</span>
              <span className="text-xs font-mono text-emerald-400 font-normal">Paper 1.21.11</span>
            </h3>

            {/* Switcher */}
            <div className="grid grid-cols-2 p-1 bg-black/40 rounded-xl border border-white/5 mb-5">
              <button
                onClick={() => setSelectedEdition('java')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  selectedEdition === 'java'
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Java Edition
              </button>
              <button
                onClick={() => setSelectedEdition('bedrock')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  selectedEdition === 'bedrock'
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Bedrock Edition
              </button>
            </div>

            {selectedEdition === 'java' ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-slate-400 block mb-1">Server Hostname</span>
                  <span className="font-mono font-semibold text-emerald-300 text-sm select-all">
                    play.bukkuzmc.fun
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-slate-400 block mb-1">Java Port</span>
                  <span className="font-mono text-white text-sm">25565 (Default)</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-slate-400 block mb-1">Supported Versions</span>
                  <span className="text-emerald-300 font-semibold block">Every Version Supported: 1.8.x – 1.21.x & Latest</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">ViaVersion + ViaBackwards (1.8, 1.12, 1.16, 1.19, 1.20, 1.21+)</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-slate-400 block mb-1">Account Mode</span>
                  <span className="text-emerald-300 font-semibold block">Cracked + Premium Supported</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Official Mojang & Microsoft, TLauncher, SKlauncher, Salwyrr</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-slate-400 block mb-1">Supported Clients</span>
                  <span className="text-slate-200">Vanilla, Lunar Client, Badlion, Feather, Forge, Fabric</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-slate-400 block mb-1">Bedrock Address</span>
                  <span className="font-mono font-semibold text-emerald-300 text-sm select-all">
                    play.bukkuzmc.fun
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-slate-400 block mb-1">Bedrock Port (UDP)</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">19132</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-slate-400 block mb-1">Supported Versions</span>
                  <span className="text-emerald-300 font-semibold block">All Bedrock Versions & Mobile Builds</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">GeyserMC + Floodgate Crossplay Protocol</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-slate-400 block mb-1">Supported Devices</span>
                  <span className="text-slate-200">Android, iOS (iPhone/iPad), Windows 10/11, Xbox, PS4/PS5, Switch</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
