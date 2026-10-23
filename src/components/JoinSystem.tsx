import React, { useState } from 'react';
import { Copy, Check, Monitor, Smartphone, Gamepad2, Laptop, ArrowRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface JoinSystemProps {
  onCopyJava: () => void;
  onCopyBedrock: () => void;
  copiedJava: boolean;
  copiedBedrock: boolean;
}

export const JoinSystem: React.FC<JoinSystemProps> = ({
  onCopyJava,
  onCopyBedrock,
  copiedJava,
  copiedBedrock,
}) => {
  const [activeTab, setActiveTab] = useState<'java' | 'bedrock_mobile' | 'bedrock_windows' | 'consoles'>('java');

  const triggerConfetti = () => {
    confetti({
      particleCount: 35,
      spread: 55,
      origin: { y: 0.8 },
      colors: ['#10b981', '#34d399', '#ffffff'],
    });
  };

  return (
    <section id="join" className="py-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
          Crossplay Connection Guide
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How to Join BukkuzMC
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Step-by-step connection guides for every platform. Play together on PC, smartphone, or console.
        </p>
      </div>

      {/* Main Connection Container */}
      <div className="bg-[#0C1014] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
        {/* Quick Connection Cards Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Java Edition Quick Card */}
          <div className="p-6 rounded-2xl bg-[#11161C] border border-white/10 hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Minecraft Java Edition (Cracked + Premium)
              </span>
              <span className="text-xs font-mono text-slate-400">PC / Mac / Linux</span>
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-white mb-2 select-all">
              play.bukkuzmc.fun
            </div>
            <div className="text-xs text-slate-400 mb-5">
              Port: <span className="font-mono text-slate-200">25565</span> · <span className="text-emerald-400 font-semibold">Cracked + Premium (1.8 to 1.21.x)</span>
            </div>
            <button
              onClick={() => {
                onCopyJava();
                triggerConfetti();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-xl transition-all active:scale-98 shadow-md shadow-emerald-500/20"
            >
              {copiedJava ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>Copied Java IP to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-black" />
                  <span>Copy Java IP (Cracked & Premium)</span>
                </>
              )}
            </button>
          </div>

          {/* Bedrock Edition Quick Card */}
          <div className="p-6 rounded-2xl bg-[#11161C] border border-white/10 hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Minecraft Bedrock Edition
              </span>
              <span className="text-xs font-mono text-slate-400">Mobile / Windows / Console</span>
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-white mb-2 select-all">
              play.bukkuzmc.fun
            </div>
            <div className="text-xs text-slate-400 mb-5">
              Bedrock Port: <span className="font-mono font-bold text-emerald-400">19132</span> (UDP) · <span className="text-emerald-400 font-semibold">All Bedrock Versions</span>
            </div>
            <button
              onClick={() => {
                onCopyBedrock();
                triggerConfetti();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-xl transition-all active:scale-98 shadow-md shadow-emerald-500/20"
            >
              {copiedBedrock ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>Copied Bedrock IP & Port!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-black" />
                  <span>Copy Bedrock Port (19132)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5 mb-8">
          <button
            onClick={() => setActiveTab('java')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'java'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Java (PC / Mac)</span>
          </button>

          <button
            onClick={() => setActiveTab('bedrock_mobile')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'bedrock_mobile'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile (Android / iOS)</span>
          </button>

          <button
            onClick={() => setActiveTab('bedrock_windows')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'bedrock_windows'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Windows 10 / 11 Bedrock</span>
          </button>

          <button
            onClick={() => setActiveTab('consoles')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'consoles'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Consoles (PS5 / Xbox / Switch)</span>
          </button>
        </div>

        {/* Tab Content Instructions */}
        <div className="bg-[#101419] border border-white/5 rounded-2xl p-6 sm:p-8">
          {activeTab === 'java' && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white mb-2">Joining on Minecraft Java Edition</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center mb-2">
                    1
                  </span>
                  <div className="font-semibold text-white mb-1">Launch Minecraft</div>
                  <p className="text-slate-400">Open Minecraft Java Edition (Any version from 1.8.x through 1.21.x).</p>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center mb-2">
                    2
                  </span>
                  <div className="font-semibold text-white mb-1">Multiplayer Menu</div>
                  <p className="text-slate-400">Select "Multiplayer" and click the "Add Server" button.</p>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center mb-2">
                    3
                  </span>
                  <div className="font-semibold text-white mb-1">Enter Address</div>
                  <p className="text-slate-400">Server Name: <strong className="text-white">BukkuzMC</strong><br />Server Address: <strong className="text-emerald-400 font-mono">play.bukkuzmc.fun</strong></p>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center mb-2">
                    4
                  </span>
                  <div className="font-semibold text-white mb-1">Done & Join</div>
                  <p className="text-slate-400">Click "Done", select BukkuzMC, and connect!</p>
                </div>
              </div>

              {/* Cracked Player Auth Helper Banner */}
              <div className="mt-4 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-emerald-400 block mb-0.5">
                    Playing on TLauncher, SKlauncher, Salwyrr, or Offline Mode?
                  </span>
                  <span>
                    When you first join, type <code className="bg-black/60 px-2 py-0.5 rounded text-emerald-300 font-mono">/register &lt;password&gt; &lt;password&gt;</code>. On future visits, log in with <code className="bg-black/60 px-2 py-0.5 rounded text-emerald-300 font-mono">/login &lt;password&gt;</code>. Premium accounts are also fully supported!
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-1 rounded shrink-0">
                  Cracked + Premium
                </span>
              </div>
            </div>
          )}

          {activeTab === 'bedrock_mobile' && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white mb-2">Joining on Android or iPhone (iOS)</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center mb-2">
                    1
                  </span>
                  <div className="font-semibold text-white mb-1">Open Minecraft App</div>
                  <p className="text-slate-400">Ensure your game is updated to the latest Bedrock build from Play Store / App Store.</p>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center mb-2">
                    2
                  </span>
                  <div className="font-semibold text-white mb-1">Servers Tab</div>
                  <p className="text-slate-400">Tap "Play", swipe over to the "Servers" tab, and scroll down to "Add Server".</p>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center mb-2">
                    3
                  </span>
                  <div className="font-semibold text-white mb-1">Server Info & Port</div>
                  <p className="text-slate-400">Server Name: <strong className="text-white">BukkuzMC</strong><br />IP: <strong className="text-emerald-400 font-mono">play.bukkuzmc.fun</strong><br />Port: <strong className="text-emerald-400 font-mono">19132</strong></p>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center mb-2">
                    4
                  </span>
                  <div className="font-semibold text-white mb-1">Play Now</div>
                  <p className="text-slate-400">Tap "Save" or "Play". You'll connect through GeyserMC crossplay!</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bedrock_windows' && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white mb-2">Joining on Windows 10/11 Bedrock Edition</h4>
              <p className="text-xs text-slate-300">
                1. Launch Minecraft for Windows.<br />
                2. Click Play &gt; Servers &gt; Add Server.<br />
                3. Enter Server Name: <strong className="text-white">BukkuzMC</strong>, Server Address: <strong className="text-emerald-400 font-mono">play.bukkuzmc.fun</strong>, Port: <strong className="text-emerald-400 font-mono">19132</strong>.<br />
                4. Click Play to start exploring with Kerala players!
              </p>
            </div>
          )}

          {activeTab === 'consoles' && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white mb-2">Joining on PlayStation, Xbox, and Nintendo Switch</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Consoles do not feature an "Add Server" button out-of-the-box, but you can easily join via BedrockConnect or custom DNS:
              </p>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-xs space-y-2 font-mono text-slate-300">
                <div>Option A (BedrockConnect DNS): Change your console DNS settings to Primary: <strong className="text-emerald-400">104.238.130.180</strong></div>
                <div>Option B (BedrockTogether App): Download the free "BedrockTogether" app on your smartphone on the same Wi-Fi, enter <strong className="text-emerald-400">play.bukkuzmc.fun:19132</strong>, tap Run, and BukkuzMC appears in LAN games!</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
