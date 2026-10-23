import React, { useState } from 'react';
import { LifeBuoy, AlertCircle, CheckCircle2, MessageSquare, Send, Search, Clock, ShieldAlert } from 'lucide-react';

interface SupportTicket {
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

export const SupportCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'lookup'>('create');

  // Form states
  const [type, setType] = useState<'bug' | 'player' | 'appeal' | 'general'>('bug');
  const [ign, setIgn] = useState('');
  const [discord, setDiscord] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [evidenceUrl, setEvidenceUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdTicket, setCreatedTicket] = useState<SupportTicket | null>(null);

  // Lookup state
  const [lookupId, setLookupId] = useState('');
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [viewedTicket, setViewedTicket] = useState<SupportTicket | null>(null);

  // Reply state
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!ign.trim() || !subject.trim() || !description.trim()) {
      setSubmitError('Please fill in your In-Game Name, Subject, and Description.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/support/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          ign,
          discord,
          subject,
          description,
          priority,
          evidenceUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit ticket');
      }

      setCreatedTicket(data.ticket);
      // Reset form
      setIgn('');
      setDiscord('');
      setSubject('');
      setDescription('');
      setEvidenceUrl('');
    } catch (err: any) {
      setSubmitError(err.message || 'Error communicating with support API');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim()) return;

    setLookingUp(true);
    setLookupError(null);
    setViewedTicket(null);

    try {
      const res = await fetch(`/api/support/ticket/${encodeURIComponent(lookupId.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ticket not found');
      }
      setViewedTicket(data.ticket);
    } catch (err: any) {
      setLookupError(err.message || 'Failed to lookup ticket');
    } finally {
      setLookingUp(false);
    }
  };

  const handleSendReply = async () => {
    if (!viewedTicket || !replyText.trim()) return;
    setReplying(true);
    try {
      const res = await fetch(`/api/support/ticket/${viewedTicket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: viewedTicket.ign,
          message: replyText.trim(),
          isAdmin: false,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ticket) {
        setViewedTicket(data.ticket);
        setReplyText('');
      }
    } catch {
      // Ignore
    } finally {
      setReplying(false);
    }
  };

  return (
    <section id="support" className="py-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
            Player Assistance & Appeals
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Support Center
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Submit bug reports, griefing reports, ban appeals, or general inquiries directly to our staff team.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'create'
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Submit Ticket
          </button>
          <button
            onClick={() => setActiveTab('lookup')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'lookup'
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Track Existing Ticket
          </button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <div className="bg-[#0C1014] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-3xl mx-auto">
          {createdTicket ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Ticket Submitted Successfully</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Your ticket has been logged into the BukkuzMC queue. Keep your reference ID safe to track responses from our moderators.
              </p>
              <div className="p-4 bg-white/[0.03] border border-emerald-500/30 rounded-xl inline-block font-mono text-lg font-bold text-emerald-400 select-all">
                {createdTicket.id}
              </div>
              <div>
                <button
                  onClick={() => {
                    setViewedTicket(createdTicket);
                    setLookupId(createdTicket.id);
                    setActiveTab('lookup');
                    setCreatedTicket(null);
                  }}
                  className="px-5 py-2.5 bg-emerald-500 text-black text-xs font-bold rounded-xl shadow-md hover:bg-emerald-400 transition-colors"
                >
                  View Ticket Status Now
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && (
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Category selector */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Ticket Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['bug', 'player', 'appeal', 'general'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setType(cat)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                        type === cat
                          ? 'bg-emerald-500 text-black border-emerald-400 shadow-sm'
                          : 'bg-white/[0.02] text-slate-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {cat === 'bug' && 'Bug Report'}
                      {cat === 'player' && 'Player Report'}
                      {cat === 'appeal' && 'Ban Appeal'}
                      {cat === 'general' && 'General Help'}
                    </button>
                  ))}
                </div>
              </div>

              {/* In-Game Name & Discord */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Minecraft In-Game Name (IGN) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bukkuz_Fan99"
                    value={ign}
                    onChange={(e) => setIgn(e.target.value)}
                    className="w-full bg-[#11161B] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Discord Username (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. player#0001 or @handle"
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    className="w-full bg-[#11161B] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Subject & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief summary of the issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#11161B] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-[#11161B] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain what occurred, timestamps, coordinates, or player names involved..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#11161B] border border-white/10 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              {/* Evidence URL */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Evidence Link (Imgur, YouTube clip, or screenshot link)
                </label>
                <input
                  type="url"
                  placeholder="https://imgur.com/..."
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  className="w-full bg-[#11161B] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting to Queue...' : 'Submit Support Ticket'}</span>
              </button>
            </form>
          )}
        </div>
      ) : (
        /* Lookup view */
        <div className="bg-[#0C1014] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-3xl mx-auto space-y-6">
          <form onSubmit={handleLookup} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Ticket ID (e.g. BKZ-8821)"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                className="w-full bg-[#11161B] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500 uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={lookingUp}
              className="px-5 py-2.5 bg-emerald-500 text-black font-semibold text-xs rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50"
            >
              {lookingUp ? 'Searching...' : 'Search'}
            </button>
          </form>

          {lookupError && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-200 text-xs">
              {lookupError}
            </div>
          )}

          {viewedTicket && (
            <div className="space-y-6 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="font-mono text-sm font-bold text-emerald-400 block">
                    {viewedTicket.id}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">{viewedTicket.subject}</h4>
                </div>
                <span
                  className={`text-xs font-bold uppercase px-2.5 py-1 rounded-md ${
                    viewedTicket.status === 'resolved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : viewedTicket.status === 'investigating'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  }`}
                >
                  {viewedTicket.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Player</span>
                  <span className="text-white">{viewedTicket.ign}</span>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Category</span>
                  <span className="text-emerald-400 uppercase">{viewedTicket.type}</span>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Priority</span>
                  <span className="text-white capitalize">{viewedTicket.priority}</span>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Submitted</span>
                  <span className="text-slate-300">{new Date(viewedTicket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {viewedTicket.description}
              </div>

              {/* Conversation History */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Staff Responses & Updates
                </h5>
                <div className="space-y-2">
                  {viewedTicket.replies?.map((rep, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl text-xs border ${
                        rep.isAdmin
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                          : 'bg-white/[0.02] border-white/5 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5 font-mono text-[11px]">
                        <span className="font-bold text-white">{rep.author}</span>
                        <span className="text-slate-400">
                          {new Date(rep.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="leading-relaxed">{rep.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Follow-up message */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add follow-up information for staff..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 bg-[#11161B] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={replying || !replyText.trim()}
                    className="px-4 py-2 bg-emerald-500 text-black text-xs font-bold rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
