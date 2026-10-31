import React, { useState } from 'react';
import { Calendar, Shield, Trophy, ChevronDown, Bell } from 'lucide-react';
import { SeasonId, SEASONS } from '../utils/seasonalTheme.ts';

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

interface RuleCategory {
  category: string;
  icon: string;
  items: string[];
}

interface EventsAndRulesProps {
  events: EventItem[];
  announcements: ServerAnnouncement[];
  rules: RuleCategory[];
  seasonId?: SeasonId;
}

export const EventsAndRules: React.FC<EventsAndRulesProps> = ({
  events,
  announcements,
  rules,
  seasonId = 'winter',
}) => {
  const [selectedRuleCategory, setSelectedRuleCategory] = useState<string>(rules[0]?.category || 'General Behavior');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const season = SEASONS[seasonId] || SEASONS.winter;

  const faqs = [
    {
      q: 'Can I join with TLauncher or a cracked launcher?',
      a: 'Yes, absolutely! BukkuzMC is 100% Cracked + Premium compatible. Players using TLauncher, SKlauncher, Salwyrr, or official Mojang/Microsoft accounts can join seamlessly. On first join, register your account using /register <password> <password>.',
    },
    {
      q: 'Is BukkuzMC free to play?',
      a: 'Yes! BukkuzMC is 100% free to join for everyone on both Minecraft Java Edition and Bedrock Edition. Ranks and cosmetics are optional perks to support server hosting costs.',
    },
    {
      q: 'How do I claim land on the SMP to protect my builds?',
      a: 'Equip a Golden Shovel and right-click two opposite corners of your plot. You receive bonus claim blocks automatically the longer you play!',
    },
    {
      q: 'Can Bedrock players fight and chat with Java players?',
      a: 'Yes! Our custom GeyserMC and Floodgate pipeline synchronizes combat mechanics, inventory, voice proximity, and clan chat seamlessly across platforms.',
    },
    {
      q: 'When does Bukkuz Bruh stream on BukkuzMC?',
      a: 'Bukkuz streams regularly on weekends and hosts community raid nights on Saturdays at 7:30 PM IST. Join our Discord to get notified when he goes live.',
    },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto space-y-20">
      {/* 1. Announcements & Events Grid */}
      <div>
        <div className="mb-10 pb-6 border-b border-white/10">
          <div className={`text-xs font-semibold uppercase tracking-wider ${season.classes.textAccent} mb-2`}>
            Stay Updated
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Announcements &amp; Tournaments
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Official patch notes, scheduled SMP events, BedWars tournaments, and giveaway milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Announcements Feed (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Bell className={`w-4 h-4 ${season.classes.textAccent}`} />
              <span>Official Announcements</span>
            </h3>

            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-6 rounded-2xl bg-[#0C1014] border border-white/10 hover:border-sky-500/30 transition-all shadow-lg"
              >
                <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold px-2.5 py-0.5 rounded border"
                      style={{
                        backgroundColor: season.colors.badgeBg,
                        borderColor: season.colors.badgeBorder,
                        color: season.colors.accentLight,
                      }}
                    >
                      {ann.category}
                    </span>
                    {ann.pinned && (
                      <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                        PINNED
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    {ann.date} · By <span className="text-slate-200">{ann.author}</span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-white mb-2">{ann.title}</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>

          {/* Events Calendar (1 column) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Calendar className={`w-4 h-4 ${season.classes.textAccent}`} />
              <span>Upcoming Events</span>
            </h3>

            <div className="space-y-4">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-5 rounded-2xl bg-[#0E1318] border border-white/10 hover:border-sky-500/30 transition-all"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                    <span className={`${season.classes.textAccent} font-bold uppercase`}>
                      {evt.type.replace('_', ' ')}
                    </span>
                    <span>{evt.date} · {evt.time}</span>
                  </div>

                  <h5 className="font-bold text-white text-sm mb-2">{evt.title}</h5>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{evt.description}</p>

                  {evt.prizePool && (
                    <div
                      className="flex items-center gap-2 p-2 rounded-lg border text-xs font-mono"
                      style={{
                        backgroundColor: season.colors.badgeBg,
                        borderColor: season.colors.badgeBorder,
                        color: season.colors.accentLight,
                      }}
                    >
                      <Trophy className="w-3.5 h-3.5 shrink-0" />
                      <span>{evt.prizePool}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Server Rules Section */}
      <div>
        <div className="mb-10 pb-6 border-b border-white/10">
          <div className={`text-xs font-semibold uppercase tracking-wider ${season.classes.textAccent} mb-2`}>
            Community Guidelines
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Server Rules &amp; Fair Play
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Enforced by staff and automated anti-cheat systems to maintain a friendly, competitive environment for all players.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rule Category Selector */}
          <div className="space-y-2">
            {rules.map((rc) => {
              const isSelected = selectedRuleCategory === rc.category;
              return (
                <button
                  key={rc.category}
                  onClick={() => setSelectedRuleCategory(rc.category)}
                  style={{
                    backgroundColor: isSelected ? season.colors.accent : undefined,
                    color: isSelected ? '#000000' : undefined,
                    boxShadow: isSelected ? `0 4px 14px -2px ${season.colors.glow}` : undefined,
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'font-bold'
                      : 'bg-[#0C1014] text-slate-300 hover:text-white hover:bg-white/5 border border-white/5 font-semibold'
                  }`}
                >
                  <span>{rc.category}</span>
                  <Shield className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>

          {/* Active Rules List */}
          <div className="md:col-span-2 bg-[#0C1014] border border-white/10 rounded-2xl p-6 sm:p-8">
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Shield className={`w-5 h-5 ${season.classes.textAccent}`} />
              <span>{selectedRuleCategory}</span>
            </h4>

            <div className="space-y-4">
              {rules
                .find((r) => r.category === selectedRuleCategory)
                ?.items.map((ruleText, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3 text-xs sm:text-sm text-slate-200"
                  >
                    <span
                      className="w-5 h-5 rounded-md font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        backgroundColor: season.colors.badgeBg,
                        color: season.colors.accentLight,
                      }}
                    >
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{ruleText}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Frequently Asked Questions Accordion */}
      <div>
        <div className="mb-10 pb-6 border-b border-white/10">
          <div className={`text-xs font-semibold uppercase tracking-wider ${season.classes.textAccent} mb-2`}>
            Common Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-[#0C1014] border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-sky-500/30 transition-all"
                onClick={() => setOpenFaqIndex(isOpen ? null : index)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h5 className="font-bold text-sm text-white">{faq.q}</h5>
                  <ChevronDown
                    className={`w-4 h-4 ${season.classes.textAccent} shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {isOpen && (
                  <p className="mt-3 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
