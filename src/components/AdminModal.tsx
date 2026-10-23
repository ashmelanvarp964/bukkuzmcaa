import React, { useState, useEffect } from 'react';
import { X, Shield, Lock, Check, AlertCircle, Server, LifeBuoy, Bell, Calendar, Settings, LogOut } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onConfigUpdated }) => {
  const [token, setToken] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Active Admin Tab
  const [adminTab, setAdminTab] = useState<'overview' | 'config' | 'tickets' | 'announcements' | 'events'>('overview');

  // Overview Data
  const [overviewData, setOverviewData] = useState<any>(null);

  // Config Form states
  const [serverName, setServerName] = useState('');
  const [serverIpJava, setServerIpJava] = useState('');
  const [serverPortJava, setServerPortJava] = useState(25565);
  const [serverIpBedrock, setServerIpBedrock] = useState('');
  const [serverPortBedrock, setServerPortBedrock] = useState(19132);
  const [discordInvite, setDiscordInvite] = useState('');
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState('');
  const [configSuccess, setConfigSuccess] = useState(false);

  // Announcement Form states
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnCategory, setNewAnnCategory] = useState<'Update' | 'Event' | 'Maintenance' | 'Community'>('Update');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnPinned, setNewAnnPinned] = useState(false);

  // Ticket resolution state
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [ticketReply, setTicketReply] = useState('');
  const [ticketStatusUpdate, setTicketStatusUpdate] = useState<'open' | 'investigating' | 'resolved' | 'closed'>('resolved');

  // Load overview data when authenticated
  const fetchOverview = async (authToken: string) => {
    try {
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOverviewData(data);
        if (data.config) {
          setServerName(data.config.serverName || '');
          setServerIpJava(data.config.serverIpJava || '');
          setServerPortJava(data.config.serverPortJava || 25565);
          setServerIpBedrock(data.config.serverIpBedrock || '');
          setServerPortBedrock(data.config.serverPortBedrock || 19132);
          setDiscordInvite(data.config.discordInvite || '');
          setDiscordWebhookUrl(data.config.discordWebhookUrl || '');
        }
      }
    } catch {
      // Ignore
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      setToken(data.token);
      await fetchOverview(data.token);
    } catch (err: any) {
      setAuthError(err.message || 'Invalid PIN');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serverName,
          serverIpJava,
          serverPortJava,
          serverIpBedrock,
          serverPortBedrock,
          discordInvite,
          discordWebhookUrl,
        }),
      });
      if (res.ok) {
        setConfigSuccess(true);
        setTimeout(() => setConfigSuccess(false), 3000);
        onConfigUpdated();
        fetchOverview(token);
      }
    } catch {}
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newAnnTitle.trim() || !newAnnContent.trim()) return;

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newAnnTitle,
          category: newAnnCategory,
          content: newAnnContent,
          pinned: newAnnPinned,
          author: 'Admin Bukkuz',
        }),
      });
      if (res.ok) {
        setNewAnnTitle('');
        setNewAnnContent('');
        fetchOverview(token);
        onConfigUpdated();
      }
    } catch {}
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOverview(token);
      onConfigUpdated();
    } catch {}
  };

  const handleUpdateTicket = async () => {
    if (!token || !selectedTicket) return;
    try {
      // Send reply if entered
      if (ticketReply.trim()) {
        await fetch(`/api/support/ticket/${selectedTicket.id}/reply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            author: 'Admin Bukkuz',
            message: ticketReply.trim(),
            isAdmin: true,
          }),
        });
      }

      // Update status
      await fetch(`/api/admin/tickets/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: ticketStatusUpdate,
        }),
      });

      setSelectedTicket(null);
      setTicketReply('');
      fetchOverview(token);
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0C1014] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">BukkuzMC Staff Administration</h3>
              <p className="text-xs text-slate-400">Server configuration, support queue, and announcements</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {token && (
              <button
                onClick={() => setToken(null)}
                className="p-2 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {!token ? (
            /* Admin Login View */
            <div className="max-w-md mx-auto py-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Administrator Access</h4>
              <p className="text-xs text-slate-400 mb-6">
                Enter your staff passcode to manage server infrastructure. Default PIN: <code className="text-emerald-400">bukkuzmc2026</code>
              </p>

              {authError && (
                <div className="p-3 mb-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="password"
                  placeholder="Enter Admin PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-[#11161B] border border-white/10 rounded-xl px-4 py-3 text-center text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 tracking-widest"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In as Administrator'}
                </button>
              </form>
            </div>
          ) : (
            /* Authenticated Admin Dashboard */
            <div className="space-y-6">
              {/* Tab navigation */}
              <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
                <button
                  onClick={() => setAdminTab('overview')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    adminTab === 'overview'
                      ? 'bg-emerald-500 text-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setAdminTab('config')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    adminTab === 'config'
                      ? 'bg-emerald-500 text-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Server Config
                </button>
                <button
                  onClick={() => setAdminTab('tickets')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    adminTab === 'tickets'
                      ? 'bg-emerald-500 text-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Support Queue ({overviewData?.tickets?.filter((t: any) => t.status === 'open').length || 0})
                </button>
                <button
                  onClick={() => setAdminTab('announcements')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    adminTab === 'announcements'
                      ? 'bg-emerald-500 text-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Announcements
                </button>
              </div>

              {/* Tab 1: Overview */}
              {adminTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      <span className="text-xs text-slate-400 block mb-1">Total Support Tickets</span>
                      <div className="text-2xl font-bold font-mono text-white">
                        {overviewData?.tickets?.length || 0}
                      </div>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      <span className="text-xs text-slate-400 block mb-1">Active Announcements</span>
                      <div className="text-2xl font-bold font-mono text-emerald-400">
                        {overviewData?.announcements?.length || 0}
                      </div>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      <span className="text-xs text-slate-400 block mb-1">Upcoming Events</span>
                      <div className="text-2xl font-bold font-mono text-white">
                        {overviewData?.events?.length || 0}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-xs space-y-2">
                    <div className="font-bold text-white mb-2">Live Node Status</div>
                    <div>Java IP: <span className="font-mono text-emerald-300">{serverIpJava}</span></div>
                    <div>Bedrock UDP Port: <span className="font-mono text-emerald-300">{serverPortBedrock}</span></div>
                    <div>Hosting Location: <span className="text-slate-300">Kerala, India</span></div>
                  </div>
                </div>
              )}

              {/* Tab 2: Config */}
              {adminTab === 'config' && (
                <form onSubmit={handleSaveConfig} className="space-y-4 max-w-xl">
                  {configSuccess && (
                    <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Server configuration saved successfully!</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Server Name</label>
                    <input
                      type="text"
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                      className="w-full bg-[#11161B] border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Java IP Host</label>
                      <input
                        type="text"
                        value={serverIpJava}
                        onChange={(e) => setServerIpJava(e.target.value)}
                        className="w-full bg-[#11161B] border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Java Port</label>
                      <input
                        type="number"
                        value={serverPortJava}
                        onChange={(e) => setServerPortJava(Number(e.target.value))}
                        className="w-full bg-[#11161B] border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Bedrock IP Host</label>
                      <input
                        type="text"
                        value={serverIpBedrock}
                        onChange={(e) => setServerIpBedrock(e.target.value)}
                        className="w-full bg-[#11161B] border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Bedrock UDP Port</label>
                      <input
                        type="number"
                        value={serverPortBedrock}
                        onChange={(e) => setServerPortBedrock(Number(e.target.value))}
                        className="w-full bg-[#11161B] border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Discord Invite URL</label>
                    <input
                      type="url"
                      value={discordInvite}
                      onChange={(e) => setDiscordInvite(e.target.value)}
                      className="w-full bg-[#11161B] border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Discord Webhook URL (For ticket alert pings)
                    </label>
                    <input
                      type="url"
                      placeholder="https://discord.com/api/webhooks/..."
                      value={discordWebhookUrl}
                      onChange={(e) => setDiscordWebhookUrl(e.target.value)}
                      className="w-full bg-[#11161B] border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    Save Server Configuration
                  </button>
                </form>
              )}

              {/* Tab 3: Tickets */}
              {adminTab === 'tickets' && (
                <div className="space-y-4">
                  {selectedTicket ? (
                    <div className="bg-[#11161B] border border-white/10 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setSelectedTicket(null)}
                          className="text-xs text-emerald-400 hover:underline"
                        >
                          &larr; Back to Ticket Queue
                        </button>
                        <span className="font-mono text-xs font-bold text-slate-300">
                          {selectedTicket.id}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white">{selectedTicket.subject}</h4>
                      <div className="text-xs text-slate-400">
                        Player: <strong className="text-white">{selectedTicket.ign}</strong> · Category: {selectedTicket.type}
                      </div>

                      <div className="p-3 bg-black/40 rounded-xl text-xs text-slate-200">
                        {selectedTicket.description}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-300">Staff Response</label>
                        <textarea
                          rows={3}
                          placeholder="Type official reply to the player..."
                          value={ticketReply}
                          onChange={(e) => setTicketReply(e.target.value)}
                          className="w-full bg-[#0C1014] border border-white/10 rounded-xl p-3 text-xs text-white"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <select
                          value={ticketStatusUpdate}
                          onChange={(e) => setTicketStatusUpdate(e.target.value as any)}
                          className="bg-[#0C1014] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="open">Open</option>
                          <option value="investigating">Investigating</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button
                          onClick={handleUpdateTicket}
                          className="px-5 py-2 bg-emerald-500 text-black text-xs font-bold rounded-xl hover:bg-emerald-400"
                        >
                          Save Update & Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {overviewData?.tickets?.map((t: any) => (
                        <div
                          key={t.id}
                          onClick={() => {
                            setSelectedTicket(t);
                            setTicketStatusUpdate(t.status);
                          }}
                          className="p-4 bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-emerald-400">{t.id}</span>
                              <span className="text-xs font-semibold text-white">{t.subject}</span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">
                              By {t.ign} · {t.type}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              t.status === 'resolved'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Announcements */}
              {adminTab === 'announcements' && (
                <div className="space-y-6">
                  {/* Create Announcement Form */}
                  <form onSubmit={handleCreateAnnouncement} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                    <h5 className="font-bold text-xs text-white uppercase tracking-wider">Publish Announcement</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          required
                          placeholder="Announcement Title"
                          value={newAnnTitle}
                          onChange={(e) => setNewAnnTitle(e.target.value)}
                          className="w-full bg-[#11161B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <select
                          value={newAnnCategory}
                          onChange={(e) => setNewAnnCategory(e.target.value as any)}
                          className="w-full bg-[#11161B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="Update">Update</option>
                          <option value="Event">Event</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Community">Community</option>
                        </select>
                      </div>
                    </div>
                    <textarea
                      required
                      rows={3}
                      placeholder="Announcement body text..."
                      value={newAnnContent}
                      onChange={(e) => setNewAnnContent(e.target.value)}
                      className="w-full bg-[#11161B] border border-white/10 rounded-xl p-3 text-xs text-white"
                    />
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={newAnnPinned}
                          onChange={(e) => setNewAnnPinned(e.target.checked)}
                          className="rounded text-emerald-500"
                        />
                        <span>Pin to top of feed</span>
                      </label>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-500 text-black text-xs font-bold rounded-xl hover:bg-emerald-400"
                      >
                        Publish Now
                      </button>
                    </div>
                  </form>

                  {/* List */}
                  <div className="space-y-2">
                    {overviewData?.announcements?.map((ann: any) => (
                      <div
                        key={ann.id}
                        className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{ann.title}</div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {ann.date} · {ann.category}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteAnnouncement(ann.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-rose-950/20"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
