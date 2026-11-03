import React from 'react';
import {
  Settings as SettingsIcon,
  RotateCcw,
  Cpu,
  ShieldCheck,
  Code2,
  Info,
  CheckCircle2,
  Bot,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SAMPLE_DESIGNS } from '../data/designs';

export default function Settings() {
  const {
    state,
    setState,
    resetDemo,
    tbConfig,
    setTbConfig,
    addToast
  } = useApp();

  const handleTargetCoverageChange = (val) => {
    setState(prev => ({ ...prev, targetCoverage: val }));
    addToast({ title: 'Coverage Target Updated', message: `Target threshold set to ${val}%.`, type: 'info' });
  };

  const handleDefaultDesignChange = (val) => {
    setState(prev => ({ ...prev, selectedDesignId: val }));
    addToast({ title: 'Default Design Configured', message: `Default benchmark set to ${val}.`, type: 'info' });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="pb-2 border-b border-eda-border">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-slate-500/10 text-slate-300 border border-slate-500/20">
            <SettingsIcon className="w-4 h-4" />
          </span>
          <h2 className="text-xl font-extrabold text-white tracking-tight">System Settings & Architecture</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Configure default synthesis targets, verification parameters, and review the multi-agent system architecture.
        </p>
      </div>

      {/* Demonstration Notice Card */}
      <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-cyan-300 font-bold">
          <Info className="w-4 h-4 shrink-0" />
          <span>Demonstration-Mode Notice</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          VISION-EDA is an interactive web engineering prototype designed for final-year engineering capstone demonstrations. All verification logs, AST structural inspections, Cocotb test syntheses, and PPA predictions are executed locally in the browser utilizing pre-characterized benchmark models and deterministic rule engines. No proprietary backend EDA licenses are required.
        </p>
      </div>

      {/* Preferences Section */}
      <div className="p-5 rounded-2xl bg-eda-card border border-eda-border shadow-xl space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-eda-border">
          Workflow Preferences
        </h3>

        {/* Default Design Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="text-xs font-semibold text-white">Default RTL Design</label>
            <p className="text-[11px] text-slate-400">Pre-selected benchmark loaded on workspace initialization</p>
          </div>
          <select
            value={state.selectedDesignId}
            onChange={(e) => handleDefaultDesignChange(e.target.value)}
            className="bg-eda-surface border border-eda-border text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-eda-accent cursor-pointer"
          >
            {SAMPLE_DESIGNS.filter(d => !d.faulty).map(d => (
              <option key={d.id} value={d.id}>{d.shortName} — {d.name}</option>
            ))}
          </select>
        </div>

        {/* Preferred Framework */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-3 border-t border-eda-border/60">
          <div>
            <label className="text-xs font-semibold text-white">Preferred Verification Framework</label>
            <p className="text-[11px] text-slate-400">Default testbench synthesis target dialect</p>
          </div>
          <select
            value={tbConfig.framework}
            onChange={(e) => setTbConfig({ ...tbConfig, framework: e.target.value })}
            className="bg-eda-surface border border-eda-border text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-eda-accent cursor-pointer"
          >
            <option value="cocotb">Python Cocotb (Modern Coroutine TB)</option>
            <option value="systemverilog">SystemVerilog (UVM Standard)</option>
          </select>
        </div>

        {/* Coverage Target Threshold */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-3 border-t border-eda-border/60">
          <div>
            <label className="text-xs font-semibold text-white">Verification Coverage Target</label>
            <p className="text-[11px] text-slate-400">Required threshold to consider verification feedback loop closed</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="85"
              max="99"
              value={state.targetCoverage || 95}
              onChange={(e) => handleTargetCoverageChange(Number(e.target.value))}
              className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-eda-accent"
            />
            <span className="font-mono font-bold text-eda-accent text-xs w-12 text-right">
              {state.targetCoverage || 95}%
            </span>
          </div>
        </div>

        {/* Application Theme Accent */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-3 border-t border-eda-border/60">
          <div>
            <label className="text-xs font-semibold text-white">Application Theme</label>
            <p className="text-[11px] text-slate-400">Visual scheme for application shell and editor</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-eda-surface border border-eda-accent text-xs font-semibold text-eda-accent flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              Dark Navy EDA Shell
            </span>
          </div>
        </div>
      </div>

      {/* Reset Session Card */}
      <div className="p-5 rounded-2xl bg-eda-card border border-eda-border shadow-xl flex items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-white">Reset Demo Session Data</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Wipes all LocalStorage cache, restores sample code files, resets test runs and coverage meters.
          </p>
        </div>
        <button
          onClick={resetDemo}
          className="px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-bold flex items-center gap-2 transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Demo Data</span>
        </button>
      </div>

      {/* About Section: Multi-Agent Architecture */}
      <div className="p-6 rounded-2xl bg-eda-card border border-eda-border shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-eda-border">
          <Bot className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            About VISION-EDA Multi-Agent Architecture
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          VISION-EDA addresses the increasing complexity of modern ASIC/FPGA digital design by integrating specialized autonomous software agents across the RTL front-end lifecycle:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-eda-surface border border-eda-border space-y-1">
            <div className="font-semibold text-blue-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>1. Structural Parsing Agent</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Traverses Verilog ASTs, discovers registers/wires, estimates cyclomatic complexity, and warns against inferred hardware latches.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-eda-surface border border-eda-border space-y-1">
            <div className="font-semibold text-violet-400 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              <span>2. Testbench Synthesis Agent</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Synthesizes asynchronous Python Cocotb test fixtures with clock drivers, assertions, scoreboards, and coverage cross-bins.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-eda-surface border border-eda-border space-y-1">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>3. Coverage Feedback Loop Agent</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Monitors uncovered decision branches, generates targeted corner-case stimulus vectors, and elevates overall coverage to 95%+.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-eda-surface border border-eda-border space-y-1">
            <div className="font-semibold text-cyan-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>4. PPA & Power Optimization Agent</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Estimates power/area/delay using benchmark features and applies power-aware transformations (Operand Isolation & ICG Clock Gating).
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-eda-border flex items-center justify-between text-[11px] text-slate-400">
          <span>Project: Final Year Engineering Capstone</span>
          <span className="font-mono text-slate-400">Platform: VISION-EDA v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
