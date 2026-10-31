import React, { useState } from 'react';
import { MessageSquare, ExternalLink, ShieldAlert, Bug, UserX, HelpCircle, Check, Copy, ArrowRight, ShieldCheck } from 'lucide-react';
import { SeasonId, SEASONS } from '../utils/seasonalTheme.ts';

interface SupportCenterProps {
  seasonId?: SeasonId;
}

export const SupportCenter: React.FC<SupportCenterProps> = ({ seasonId = 'winter' }) => {
  const [selectedCategory, setSelectedCategory] = useState<'bug' | 'player' | 'appeal' | 'general'>('bug');
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const season = SEASONS[seasonId] || SEASONS.winter;

  const DISCORD_URL = 'https://discord.gg/WVXeaXy2Ux';

  const ticketCategories = [
    {
      id: 'bug',
      title: 'Bug & Glitch Reports',
      icon: Bug,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/30',
      description: 'Report in-game anomalies, plugin errors, redstone issues, or economy discrepancies.',
      template: `[BUG REPORT - BukkuzMC]
Minecraft IGN: 
Edition: [Java / Bedrock]
Version: 
Coordinates / Location: 
Bug Description: 
Evidence/Screenshot URL: `,
      instructions: 'Head to #tickets on Discord and click "Create Bug Ticket" to talk directly with our development staff.',
    },
    {
      id: 'player',
      title: 'Player & Griefing Reports',
      icon: ShieldAlert,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10 border-red-500/30',
      description: 'Report hackers, X-Ray users, combat loggers, foul language, or base griefing in survival areas.',
      template: `[PLAYER REPORT - BukkuzMC]
Your IGN: 
Reported Player IGN: 
Infraction Type: [Hacking / Griefing / Toxicity / RMT]
Approximate Time (IST): 
Coordinates: 
Video/Screenshot Proof: `,
      instructions: 'Submit your evidence in a private Discord ticket. All reports are confidential and handled by Senior Moderators.',
    },
    {
      id: 'appeal',
      title: 'Ban & Mute Appeals',
      icon: UserX,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/30',
      description: 'Submit an appeal if you believe your account was falsely flagged, banned, or muted.',
      template: `[BAN APPEAL - BukkuzMC]
Minecraft IGN: 
Discord Username: 
Reason for Ban/Mute: 
Banning Staff Member: 
Why should you be unbanned?: `,
      instructions: 'Be honest and thorough in your appeal. Moderator decisions are reviewed by Owner Bukkuz Bruh & Manager ICONIC OP.',
    },
    {
      id: 'general',
      title: 'General Inquiries & Help',
      icon: HelpCircle,
      color: season.classes.textAccent,
      bgColor: 'bg-sky-500/10 border-sky-500/30',
      description: 'Questions regarding Bedrock crossplay ports, rank perks, events, or creator stream schedules.',
      template: `[GENERAL INQUIRY - BukkuzMC]
IGN: 
Query / Question: `,
      instructions: 'Our community helpers and staff are available 24/7 on Discord to answer questions in English and Malayalam.',
    },
  ];

  const currentCategory = ticketCategories.find((c) => c.id === selectedCategory) || ticketCategories[0];

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(currentCategory.template);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2200);
  };

  return (
    <section id="support" className="py-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${season.classes.textAccent} mb-2`}>
            <ShieldCheck className="w-4 h-4" />
            <span>Community Assistance &amp; Ticket System</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Official Discord Ticket Center
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            To ensure zero latency, real-time push alerts, and direct interaction with Server Owner <strong className="text-white">Bukkuz Bruh</strong> and Developer <strong className="text-white">ICONIC OP</strong>, all player support and tickets are processed through our official Discord.
          </p>
        </div>

        {/* Discord Primary CTA */}
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs shadow-lg shadow-[#5865F2]/25 transition-all active:scale-95 whitespace-nowrap self-start md:self-auto"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span>Open Ticket in Discord</span>
          <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
        </a>
      </div>

      {/* Main Ticket Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Category Selector Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            Select Ticket Category
          </div>

          {ticketCategories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                style={{
                  borderColor: isSelected ? season.colors.badgeBorder : undefined,
                  boxShadow: isSelected ? `0 10px 15px -3px ${season.colors.glow}` : undefined,
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                  isSelected
                    ? 'bg-[#10161D]'
                    : 'bg-[#0B0E12] border-white/5 hover:border-white/20 text-slate-400 hover:text-white'
                }`}
              >
                <div
                  className="p-2.5 rounded-xl shrink-0"
                  style={{
                    backgroundColor: isSelected ? season.colors.badgeBg : 'rgba(255, 255, 255, 0.05)',
                    color: isSelected ? season.colors.accentLight : '#94a3b8',
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {cat.title}
                    </h3>
                    {isSelected && (
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                        style={{
                          backgroundColor: season.colors.badgeBg,
                          borderColor: season.colors.badgeBorder,
                          color: season.colors.accentLight,
                        }}
                      >
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </button>
            );
          })}

          {/* Discord Notice Box */}
          <div className="p-4 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/30 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-bold text-white mb-1">
              <MessageSquare className="w-4 h-4 text-[#5865F2]" />
              <span>discord.gg/WVXeaXy2Ux</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Ticket bot auto-creates a private channel visible only to you, Bukkuz Bruh, and server admins. Typical response time is under 15 minutes.
            </p>
          </div>
        </div>

        {/* Right: Ticket Template & Redirect Launcher */}
        <div className="lg:col-span-7 bg-[#0C1014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${currentCategory.bgColor}`}>
                  <currentCategory.icon className={`w-5 h-5 ${currentCategory.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{currentCategory.title}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Instant routing to #tickets channel
                  </span>
                </div>
              </div>

              <button
                onClick={handleCopyTemplate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200 hover:text-white transition-all"
                title="Copy formatted template to clipboard"
              >
                {copiedTemplate ? (
                  <>
                    <Check className={`w-3.5 h-3.5 ${season.classes.textAccent}`} />
                    <span className={season.classes.textAccent}>Template Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Template</span>
                  </>
                )}
              </button>
            </div>

            {/* Step-by-Step Dispatch flow */}
            <div className="space-y-4 mb-6">
              <div className="text-xs font-medium text-slate-300">How to open your ticket:</div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] mb-2"
                    style={{
                      backgroundColor: season.colors.badgeBg,
                      color: season.colors.accentLight,
                    }}
                  >
                    1
                  </div>
                  <div className="font-semibold text-white mb-0.5">Copy Template</div>
                  <div className="text-slate-400 text-[11px]">Copy the pre-structured info box below.</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] mb-2"
                    style={{
                      backgroundColor: season.colors.badgeBg,
                      color: season.colors.accentLight,
                    }}
                  >
                    2
                  </div>
                  <div className="font-semibold text-white mb-0.5">Join Discord</div>
                  <div className="text-slate-400 text-[11px]">Click button below to open BukkuzMC Discord.</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] mb-2"
                    style={{
                      backgroundColor: season.colors.badgeBg,
                      color: season.colors.accentLight,
                    }}
                  >
                    3
                  </div>
                  <div className="font-semibold text-white mb-0.5">Staff Handles It</div>
                  <div className="text-slate-400 text-[11px]">Paste in #tickets to notify online moderators.</div>
                </div>
              </div>
            </div>

            {/* Template Preview Box */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">
                Ticket Format (Pre-Filled for {currentCategory.title}):
              </label>
              <pre className="bg-[#050709] border border-white/5 rounded-2xl p-4 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
                {currentCategory.template}
              </pre>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>Direct Link:</span>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${season.classes.textAccent} hover:underline font-mono font-semibold`}
              >
                discord.gg/WVXeaXy2Ux
              </a>
            </span>

            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: season.colors.accent,
                boxShadow: `0 4px 14px -2px ${season.colors.glow}`,
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 hover:brightness-110 text-black font-bold text-xs rounded-xl transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 fill-black" />
              <span>Proceed to Discord Tickets</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
