import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders
} from 'lucide-react';
import DiffCodePanel from '../components/common/DiffCodePanel';
import { useApp } from '../context/AppContext';
import { SAMPLE_DESIGNS } from '../data/designs';
import { OPTIMIZATION_DETAILS } from '../data/optimization';

export default function RTLOptimization() {
  const navigate = useNavigate();
  const {
    activeDesign,
    selectDesign,
    state,
    setState,
    activeOptDetails,
    addToast
  } = useApp();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Optimization checkboxes
  const [clockGating, setClockGating] = useState(state.optimizationOptions?.clockGating ?? true);
  const [dataGating, setDataGating] = useState(state.optimizationOptions?.dataGating ?? true);
  const [redundantLogic, setRedundantLogic] = useState(state.optimizationOptions?.redundantLogic ?? true);
  const [switchingReduction, setSwitchingReduction] = useState(state.optimizationOptions?.switchingReduction ?? false);
  const [restructuring, setRestructuring] = useState(true);

  // Get current design details
  const details = OPTIMIZATION_DETAILS[activeDesign.id] || OPTIMIZATION_DETAILS['alu'];
  const originalCode = activeDesign.code;
  const optimizedCode = details.optimizedCode;

  const handleAnalyzeOpportunities = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      addToast({
        title: 'Power Optimization Opportunities Identified',
        message: `Discovered 2 high-yield candidate paths for ${activeDesign.shortName}: ${details.explanation.title}.`,
        type: 'info'
      });
    }, 600);
  };

  const handleApplyOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setState(prev => ({
        ...prev,
        optimizationOptions: {
          clockGating,
          dataGating,
          redundantLogic,
          switchingReduction
        }
      }));
      addToast({
        title: 'RTL Power Transformations Synthesized',
        message: `Applied ${dataGating ? 'Operand Isolation' : ''} ${clockGating ? 'and ICG Clock Gating' : ''}.`,
        type: 'success'
      });
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-eda-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Power-Aware RTL Optimization
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated RTL architectural transformations: Operand Isolation, Glitch-Free Clock Gating, and Switching Suppression.
          </p>
        </div>

        {/* Active Module Selector */}
        <div className="flex items-center gap-2 bg-eda-card px-3 py-1.5 rounded-xl border border-eda-border text-xs">
          <Cpu className="w-4 h-4 text-eda-accent" />
          <span className="text-slate-400">Design:</span>
          <select
            value={activeDesign.id}
            onChange={(e) => selectDesign(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
          >
            <option value="alu" className="bg-eda-surface">ALU (Data Gating Demo)</option>
            <option value="counter" className="bg-eda-surface">Counter (Clock Gating Demo)</option>
            <option value="uart" className="bg-eda-surface">UART (Prescaler Gating)</option>
            <option value="fifo" className="bg-eda-surface">FIFO (Array Bank Gating)</option>
            <option value="fsm" className="bg-eda-surface">FSM (Gray Encoding)</option>
          </select>
        </div>
      </div>

      {/* Control Knobs & Strategy Strip */}
      <div className="p-5 rounded-2xl bg-eda-card border border-eda-border shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-eda-border">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Power Optimization Techniques</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAnalyzeOpportunities}
              disabled={isAnalyzing}
              className="px-3.5 py-1.5 rounded-xl bg-eda-surface hover:bg-slate-800 border border-eda-border text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Opportunities'}</span>
            </button>

            <button
              onClick={handleApplyOptimization}
              disabled={isOptimizing}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md glow-green flex items-center gap-1.5 transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{isOptimizing ? 'Synthesizing...' : 'Optimize RTL'}</span>
            </button>
          </div>
        </div>

        {/* Checkbox Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <label className="p-3 rounded-xl bg-eda-surface border border-eda-border flex items-start gap-2.5 cursor-pointer hover:border-slate-600 transition-colors">
            <input
              type="checkbox"
              checked={clockGating}
              onChange={(e) => setClockGating(e.target.checked)}
              className="mt-0.5 rounded bg-eda-card border-eda-border text-emerald-500 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-white block">Clock Gating</span>
              <span className="text-[11px] text-slate-400">Integrated Clock Gating (ICG) latch insertion</span>
            </div>
          </label>

          <label className="p-3 rounded-xl bg-eda-surface border border-eda-border flex items-start gap-2.5 cursor-pointer hover:border-slate-600 transition-colors">
            <input
              type="checkbox"
              checked={dataGating}
              onChange={(e) => setDataGating(e.target.checked)}
              className="mt-0.5 rounded bg-eda-card border-eda-border text-emerald-500 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-white block">Data Gating</span>
              <span className="text-[11px] text-slate-400">Operand isolation before heavy adders</span>
            </div>
          </label>

          <label className="p-3 rounded-xl bg-eda-surface border border-eda-border flex items-start gap-2.5 cursor-pointer hover:border-slate-600 transition-colors">
            <input
              type="checkbox"
              checked={redundantLogic}
              onChange={(e) => setRedundantLogic(e.target.checked)}
              className="mt-0.5 rounded bg-eda-card border-eda-border text-emerald-500 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-white block">Remove Redundancy</span>
              <span className="text-[11px] text-slate-400">Prune dead paths & unused multiplexers</span>
            </div>
          </label>

          <label className="p-3 rounded-xl bg-eda-surface border border-eda-border flex items-start gap-2.5 cursor-pointer hover:border-slate-600 transition-colors">
            <input
              type="checkbox"
              checked={switchingReduction}
              onChange={(e) => setSwitchingReduction(e.target.checked)}
              className="mt-0.5 rounded bg-eda-card border-eda-border text-emerald-500 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-white block">Switching Cut</span>
              <span className="text-[11px] text-slate-400">Glitch filtering on high toggle nets</span>
            </div>
          </label>

          <label className="p-3 rounded-xl bg-eda-surface border border-eda-border flex items-start gap-2.5 cursor-pointer hover:border-slate-600 transition-colors">
            <input
              type="checkbox"
              checked={restructuring}
              onChange={(e) => setRestructuring(e.target.checked)}
              className="mt-0.5 rounded bg-eda-card border-eda-border text-emerald-500 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-white block">Restructuring</span>
              <span className="text-[11px] text-slate-400">Power-aware expression factorizing</span>
            </div>
          </label>
        </div>
      </div>

      {/* Side-by-Side Dual Code Panel */}
      <DiffCodePanel
        originalCode={originalCode}
        optimizedCode={optimizedCode}
        originalTitle={`Original RTL: ${activeDesign.shortName}`}
        optimizedTitle={`Power-Optimized: ${activeDesign.shortName} (${details.explanation.title})`}
        height="h-[520px]"
      />

      {/* Detailed Engineering Explanation & Trade-Offs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: What Changed and Why it Saves Power (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-eda-card border border-eda-border shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-eda-border">
            <Zap className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">{details.explanation.title}</h3>
          </div>

          <div className="space-y-3 text-xs leading-relaxed">
            <div>
              <span className="font-bold text-slate-200 block mb-0.5">1. What Changed in the RTL:</span>
              <p className="text-slate-400">{details.explanation.whatChanged}</p>
            </div>

            <div>
              <span className="font-bold text-slate-200 block mb-0.5">2. Why the Transformation Saves Dynamic Power:</span>
              <p className="text-slate-400">{details.explanation.whySavesPower}</p>
            </div>

            <div>
              <span className="font-bold text-slate-200 block mb-0.5">3. Expected Engineering Trade-Offs:</span>
              <p className="text-slate-400">{details.explanation.tradeOffs}</p>
            </div>
          </div>
        </div>

        {/* Right: Crucial Safety & Equivalence Disclaimer (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/30 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs pb-2 border-b border-amber-500/20">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Hardware Equivalence & Safety Notice</span>
          </div>

          <p className="text-xs text-amber-200/90 leading-relaxed">
            {details.explanation.disclaimer}
          </p>

          <div className="p-3 rounded-xl bg-eda-darkest/80 border border-eda-border text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 block">Required Production Sign-Off Steps:</span>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>Logic Equivalence Checking (LEC / Formality)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>Static Timing Analysis (STA PrimeTime / OpenSTA)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>Gate-Level Power Profiling (VCD / FSDB Vector Simulation)</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/comparison')}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-eda-accent hover:bg-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <span>Review Results in Benchmark Comparison</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
