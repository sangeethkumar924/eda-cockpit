import React, { useState } from 'react';
import {
  FileSearch,
  Cpu,
  Layers,
  Code2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CodePanel from '../components/common/CodePanel';
import StatusBadge from '../components/common/StatusBadge';
import { useApp } from '../context/AppContext';
import { SAMPLE_DESIGNS } from '../data/designs';

export default function RTLAnalysis() {
  const navigate = useNavigate();
  const {
    activeDesign,
    selectDesign,
    currentRtlCode,
    setCurrentRtlCode,
    analysisResult,
    runRtlAnalysis,
    addToast
  } = useApp();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(15);

    const step1 = setTimeout(() => setAnalysisProgress(50), 300);
    const step2 = setTimeout(() => setAnalysisProgress(85), 600);
    const step3 = setTimeout(() => {
      const result = runRtlAnalysis(currentRtlCode);
      setIsAnalyzing(false);
      setAnalysisProgress(100);

      if (result.isValid) {
        addToast({
          title: 'RTL Structural Analysis Complete',
          message: `Module "${result.moduleName}" successfully analyzed. 0 errors detected.`,
          type: 'success'
        });
      } else {
        addToast({
          title: 'Syntax / Lint Diagnostics Flagged',
          message: `Flagged ${result.issues.length} structural or latch issues in "${result.moduleName}".`,
          type: 'warning'
        });
      }
    }, 900);
  };

  const handleResetToClean = () => {
    const cleanDesign = SAMPLE_DESIGNS.find(d => d.id === 'alu') || SAMPLE_DESIGNS[0];
    selectDesign(cleanDesign.id);
  };

  const handleLoadFaulty = () => {
    const faultyDesign = SAMPLE_DESIGNS.find(d => d.id === 'alu_faulty');
    if (faultyDesign) {
      selectDesign(faultyDesign.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-eda-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-blue-500/10 text-eda-accent border border-blue-500/20">
              <FileSearch className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">RTL Analysis & Inspection</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Client-side structural AST parsing, port discovery, combinational vs sequential logic profiling, and latch detection.
          </p>
        </div>

        {/* Quick Sample Switcher Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToClean}
            className="px-3 py-1.5 rounded-xl text-xs font-medium border border-eda-border bg-eda-card text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Load Clean Sample (ALU)
          </button>
          <button
            onClick={handleLoadFaulty}
            className="px-3 py-1.5 rounded-xl text-xs font-medium border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Load Faulty Sample</span>
          </button>
        </div>
      </div>

      {/* Progress Bar (when analysis is running) */}
      {isAnalyzing && (
        <div className="p-4 rounded-xl bg-eda-card border border-eda-accent/30 shadow-lg animate-in fade-in">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-eda-accent animate-spin" />
              RTL Structural Analysis Agent in progress...
            </span>
            <span className="font-mono text-eda-accent font-bold">{analysisProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Editor & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-eda-card border border-eda-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-[220px]">
              <Cpu className="w-4 h-4 text-eda-accent shrink-0" />
              <label className="text-xs font-semibold text-slate-300">Design:</label>
              <select
                value={activeDesign.id}
                onChange={(e) => selectDesign(e.target.value)}
                className="bg-eda-surface border border-eda-border text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-eda-accent cursor-pointer flex-1"
              >
                {SAMPLE_DESIGNS.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.shortName} — {d.name} {d.faulty ? '(Flawed Demo)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="px-4 py-2 rounded-xl bg-eda-accent hover:bg-blue-600 text-white font-semibold text-xs tracking-wide shadow-md glow-blue flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Analyze RTL</span>
              </button>

              <button
                onClick={() => selectDesign(activeDesign.id)}
                className="p-2 rounded-xl border border-eda-border bg-eda-surface text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Reset code to original template"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Verilog Code Panel with real client-side file upload & editing */}
          <CodePanel
            title={`Verilog Source: ${activeDesign.shortName}`}
            code={currentRtlCode}
            language="verilog"
            filename={`${activeDesign.moduleName || 'design'}.v`}
            editable={true}
            onChange={(newCode) => {
              setCurrentRtlCode(newCode);
              runRtlAnalysis(newCode);
            }}
            onUpload={(uploadedCode, filename) => {
              setCurrentRtlCode(uploadedCode);
              runRtlAnalysis(uploadedCode);
            }}
            height="h-[520px]"
          />
        </div>

        {/* Right Panel: Detected Results & Structural Profiling (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Module Structural Header Card */}
          <div className="p-5 rounded-2xl bg-eda-card border border-eda-border shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-eda-border">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Detected Module</span>
                <div className="text-base font-mono font-bold text-white flex items-center gap-2">
                  <span>{analysisResult.moduleName}</span>
                  {activeDesign.faulty && (
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                      Fault Injected
                    </span>
                  )}
                </div>
              </div>

              <StatusBadge
                status={analysisResult.isValid ? 'PASS' : 'WARN'}
                text={analysisResult.isValid ? 'Syntax Valid' : 'Issues Found'}
              />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-eda-surface border border-eda-border">
                <div className="text-slate-400 text-[11px]">Lines of Code (LOC)</div>
                <div className="text-lg font-mono font-bold text-white mt-0.5">{analysisResult.linesOfCode}</div>
              </div>
              <div className="p-3 rounded-xl bg-eda-surface border border-eda-border">
                <div className="text-slate-400 text-[11px]">Complexity Score</div>
                <div className="text-lg font-bold text-eda-accent mt-0.5">{analysisResult.structuralComplexity}</div>
              </div>
              <div className="p-3 rounded-xl bg-eda-surface border border-eda-border">
                <div className="text-slate-400 text-[11px]">Registers (reg)</div>
                <div className="text-lg font-mono font-bold text-white mt-0.5">{analysisResult.registers}</div>
              </div>
              <div className="p-3 rounded-xl bg-eda-surface border border-eda-border">
                <div className="text-slate-400 text-[11px]">Wires & Nets</div>
                <div className="text-lg font-mono font-bold text-white mt-0.5">{analysisResult.wires}</div>
              </div>
            </div>

            {/* Logic Block Breakdown */}
            <div className="p-3 rounded-xl bg-eda-surface border border-eda-border space-y-2">
              <span className="text-xs font-semibold text-slate-300">Logic Partitioning</span>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Combinational Always Blocks (@*):</span>
                <span className="font-mono font-bold text-white">{analysisResult.combinationalBlocks}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Sequential Clocked Always Blocks:</span>
                <span className="font-mono font-bold text-white">{analysisResult.sequentialBlocks}</span>
              </div>
            </div>

            {/* Ports Specification */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Detected I/O Ports</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {analysisResult.ports.inputs.length} In / {analysisResult.ports.outputs.length} Out
                </span>
              </span>

              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px]">
                {analysisResult.ports.inputs.map((p, idx) => (
                  <div key={`in-${idx}`} className="p-1.5 rounded-lg bg-eda-surface border border-eda-border/60 flex items-center justify-between">
                    <span className="text-cyan-400 flex items-center gap-1">
                      <span className="text-[9px] px-1 bg-cyan-950 text-cyan-300 rounded border border-cyan-800">IN</span>
                      <span>{p.name}</span>
                    </span>
                    <span className="text-slate-400">{p.width}</span>
                  </div>
                ))}
                {analysisResult.ports.outputs.map((p, idx) => (
                  <div key={`out-${idx}`} className="p-1.5 rounded-lg bg-eda-surface border border-eda-border/60 flex items-center justify-between">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="text-[9px] px-1 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">OUT</span>
                      <span>{p.name}</span>
                    </span>
                    <span className="text-slate-400">{p.width}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lint Diagnostics & Inferred Latch Warnings Card */}
            <div className="space-y-2 pt-2 border-t border-eda-border">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Structural Lint Diagnostics</span>
              </span>

              <div className="space-y-2">
                {analysisResult.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs leading-relaxed ${
                      issue.severity === 'Error'
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                        : issue.severity === 'Warning'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span className="flex items-center gap-1.5">
                        {issue.severity === 'Error' && <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
                        {issue.severity === 'Warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        {issue.severity === 'Pass' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{issue.severity}: {issue.code || 'Diagnostic'}</span>
                      </span>
                      {issue.line && <span className="font-mono text-[10px]">Line {issue.line}</span>}
                    </div>
                    <p className="text-[11px] opacity-90">{issue.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Stage Navigation CTA */}
            <div className="pt-2">
              <button
                onClick={() => navigate('/testbench')}
                className="w-full py-2.5 px-4 rounded-xl bg-eda-surface hover:bg-slate-800 border border-eda-border text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Proceed to Testbench Generation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
