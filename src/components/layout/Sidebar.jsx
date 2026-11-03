import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSearch,
  Code2,
  CheckCircle,
  Gauge,
  Zap,
  BarChart3,
  FileText,
  Settings,
  Cpu,
  Bot,
  Activity
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/rtl-analysis', label: 'RTL Analysis', icon: FileSearch },
  { path: '/testbench', label: 'Testbench Generation', icon: Code2 },
  { path: '/verification', label: 'Verification & Coverage', icon: CheckCircle },
  { path: '/ppa', label: 'PPA Prediction', icon: Gauge },
  { path: '/optimization', label: 'RTL Optimization', icon: Zap },
  { path: '/comparison', label: 'Results Comparison', icon: BarChart3 },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen = true, onClose }) {
  return (
    <aside className="w-64 bg-eda-darkest border-r border-eda-border flex flex-col h-screen select-none shrink-0 z-40">
      {/* Brand & Logo Header */}
      <div className="h-16 px-5 border-b border-eda-border flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 p-0.5 shadow-lg glow-blue group-hover:scale-105 transition-transform flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-base font-extrabold tracking-wider text-white flex items-center gap-1.5">
              VISION<span className="text-eda-accent">-EDA</span>
            </div>
            <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              AI Hardware Suite
            </div>
          </div>
        </NavLink>
      </div>

      {/* Navigation Routes List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Core Workflows
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-eda-accent/15 text-white font-semibold border border-eda-accent/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-eda-surface/70 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-eda-accent' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-eda-accent shadow-sm" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Multi-Agent Engine Status Card */}
      <div className="p-3 m-3 rounded-xl bg-eda-card/70 border border-eda-border text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
          <Bot className="w-3.5 h-3.5 text-violet-400" />
          <span>Multi-Agent Engine</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
          Parser, Verification, PPA & Optimization agents synchronized.
        </p>
        <div className="flex items-center gap-2 pt-1 border-t border-eda-border/50 text-[10px] text-emerald-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Online (Local Node)</span>
        </div>
      </div>

      {/* Footer Version Tag */}
      <div className="p-3 border-t border-eda-border text-[11px] text-slate-400 flex items-center justify-between">
        <span>VISION-EDA v1.0</span>
        <span className="font-mono text-slate-400">Final Year Demo</span>
      </div>
    </aside>
  );
}
