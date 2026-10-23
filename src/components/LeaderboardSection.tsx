import React, { useState } from 'react';
import { Users, Search, Shield, X, ExternalLink, Wifi } from 'lucide-react';

interface LivePlayer {
  rank?: number;
  username: string;
  uuid?: string;
  isOnline?: boolean;
}

interface LeaderboardSectionProps {
  players: LivePlayer[];
  serverVersion?: string;
  serverMotd?: string;
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  players,
  serverVersion = 'Paper 1.21.11',
  serverMotd,
}) => {
  const [search, setSearch] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<LivePlayer | null>(null);

  const filtered = players.filter((p) =>
    p.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="leaderboards" className="py-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
            Real-Time Server Query
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Live Connected Players
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Live player roster polled directly from BukkuzMC via Minecraft server query protocol. Click any active player to inspect their live skin and profile.
          </p>
        </div>

        {/* Search */}
        {players.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search active players..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0D1115] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Main Roster Container */}
      <div className="bg-[#0C1014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="font-bold text-white">Active Players Online:</span>
            <span className="font-mono text-emerald-400 font-bold tabular-nums">
              {players.length}
            </span>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Node: <span className="text-slate-200">{serverVersion}</span>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((player) => (
              <div
                key={player.username}
                onClick={() => setSelectedPlayer(player)}
                className="p-4 bg-[#11161C] border border-white/5 hover:border-emerald-500/40 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:-translate-y-0.5 group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://mc-heads.net/avatar/${player.username}/48`}
                    alt={player.username}
                    className="w-10 h-10 rounded-lg bg-black/40 border border-white/10 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/steve/48';
                    }}
                  />
                  <div>
                    <span className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors block">
                      {player.username}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {player.uuid ? `${player.uuid.slice(0, 8)}...` : 'Connected'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Online
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 space-y-3">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-white">No Players Currently Online</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              The lobby is currently peaceful. Connect via <strong className="text-white font-mono">play.bukkuzmc.fun</strong> on Java or Bedrock (port 19132) to explore the SMP!
            </p>
          </div>
        )}
      </div>

      {/* Real Player 3D Skin Inspector Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C1014] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setSelectedPlayer(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-32 h-52 flex items-center justify-center bg-black/40 border border-white/10 rounded-2xl p-2">
                <img
                  src={`https://mc-heads.net/body/${selectedPlayer.username}/180`}
                  alt={`${selectedPlayer.username} 3D Skin`}
                  className="max-h-full object-contain filter drop-shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://mc-heads.net/avatar/${selectedPlayer.username}/128`;
                  }}
                />
              </div>

              <div>
                <span className="text-xs font-mono text-emerald-400 block mb-1">
                  Active BukkuzMC Player
                </span>
                <h3 className="text-2xl font-black text-white">{selectedPlayer.username}</h3>
                {selectedPlayer.uuid && (
                  <p className="text-[11px] font-mono text-slate-500 mt-1 select-all">
                    UUID: {selectedPlayer.uuid}
                  </p>
                )}
              </div>

              <div className="w-full p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-slate-300">
                Connected to <strong className="text-emerald-400">play.bukkuzmc.fun</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
