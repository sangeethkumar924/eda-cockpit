import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Cpu,
  Search,
  Bell,
  RotateCcw,
  User,
  ChevronDown,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_DESIGNS } from '../../data/designs';

export default function Header({ onToggleSidebar }) {
  const {
    activeDesign,
    selectDesign,
    resetDemo,
    isCurrentVerificationExecuted,
    isCurrentFeedbackExecuted
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Page titles map
  const pageTitles = {
    '/': 'Executive Dashboard',
    '/rtl-analysis': 'RTL Structural Analysis & Linting',
    '/testbench': 'Automated Testbench Synthesis',
    '/verification': 'Verification & Coverage Feedback Console',
    '/ppa': 'PPA Estimation & Feature Analysis',
    '/optimization': 'Power-Aware RTL Optimization Workspace',
    '/comparison': 'Benchmark Results & Trade-Off Comparison',
    '/reports': 'Consolidated Engineering Reports',
    '/settings': 'System Settings & Architecture'
  };

  const currentTitle = pageTitles[location.pathname] || 'VISION-EDA';

  const notifications = [
    {
      id: 1,
      title: 'Coverage Feedback Loop Ready',
      desc: isCurrentFeedbackExecuted ? 'All corner cases closed (96% achieved).' : 'Holes detected in ALU overflow branches.',
      time: 'Just now',
      unread: !isCurrentFeedbackExecuted
    },
    {
      id: 2,
      title: 'Power Optimization Identified',
      desc: 'Operand isolation can save ~16.1% dynamic power on ALU.',
      time: '5m ago',
      unread: false
    },
    {
      id: 3,
      title: 'PPA Benchmark Engine Online',
      desc: 'TSMC 45nm & FinFET 14nm cell models loaded.',
      time: '1h ago',
      unread: false
    }
  ];

  return (
    <header className="h-16 px-6 bg-eda-bg/90 backdrop-blur-md border-b border-eda-border flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Current Page Breadcrumb & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>VISION-EDA</span>
            <span>/</span>
            <span className="text-slate-300 font-medium capitalize">{location.pathname.replace('/', '') || 'Dashboard'}</span>
          </div>
          <h1 className="text-base font-bold text-white tracking-tight truncate">{currentTitle}</h1>
        </div>
      </div>

      {/* Center: Active Design Quick Switcher Dropdown */}
      <div className="hidden md:flex items-center gap-2 bg-eda-card px-3 py-1.5 rounded-xl border border-eda-border">
        <Cpu className="w-4 h-4 text-eda-accent" />
        <span className="text-xs text-slate-400">Design:</span>
        <select
          value={activeDesign.id}
          onChange={(e) => selectDesign(e.target.value)}
          className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-1"
        >
          {SAMPLE_DESIGNS.map(d => (
            <option key={d.id} value={d.id} className="bg-eda-surface text-slate-100">
              {d.shortName} — {d.name} {d.faulty ? '(Flawed Demo)' : ''}
            </option>
          ))}
        </select>
        {activeDesign.faulty && (
          <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30">
            Faulty
          </span>
        )}
      </div>

      {/* Right: Actions, Notifications, Profile, Reset */}
      <div className="flex items-center gap-2.5">
        {/* Reset Demo Button */}
        <button
          onClick={resetDemo}
          className="p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 transition-all text-xs flex items-center gap-1.5"
          title="Restore Demo to Initial State"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden xl:inline text-[11px]">Reset Demo</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-eda-card border border-transparent hover:border-eda-border transition-all relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-eda-accent" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-eda-card border border-eda-border rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-eda-border text-xs">
                <span className="font-semibold text-white">Agent Notifications</span>
                <span className="text-[10px] text-eda-accent">3 updates</span>
              </div>
              <div className="space-y-2 mt-2">
                {notifications.map(n => (
                  <div key={n.id} className="p-2.5 rounded-xl hover:bg-eda-surface/80 transition-colors text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{n.title}</span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-eda-border/80">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
            EDA
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-200 leading-tight">Lead RTL Engineer</div>
            <div className="text-[10px] text-emerald-400 font-medium">Demo Mode Active</div>
          </div>
        </div>
      </div>
    </header>
  );
}
