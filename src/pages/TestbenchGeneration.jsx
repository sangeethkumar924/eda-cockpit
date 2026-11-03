import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  Cpu,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Layers,
  Terminal
} from 'lucide-react';
import CodePanel from '../components/common/CodePanel';
import { useApp } from '../context/AppContext';
import { SAMPLE_DESIGNS } from '../data/designs';

export default function TestbenchGeneration() {
  const navigate = useNavigate();
  const {
    activeDesign,
    selectDesign,
    tbConfig,
    setTbConfig,
    generatedTestbench,
    regenerateTestbench,
    addToast
  } = useApp();

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      regenerateTestbench(tbConfig);
      setIsGenerating(false);
      addToast({
        title: 'Cocotb Testbench Synthesized',
        message: `Generated testbench for ${activeDesign.shortName} with ${tbConfig.testCount} vectors.`,
        type: 'success'
      });
    }, 700);
  };

  const handleReset = () => {
    const defaultConfig = {
      framework: 'cocotb',
      testCount: 50,
      includeDirected: true,
      includeRandom: true,
      includeEdgeCases: true,
      includeCoverage: true
    };
    setTbConfig(defaultConfig);
    regenerateTestbench(defaultConfig);
    addToast({ title: 'Testbench Config Reset', message: 'Restored default settings.', type: 'info' });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-eda-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Code2 className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Testbench Generation</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Synthesize Python Cocotb test suites with clock generation, scoreboards, corner-case assertions, and coverage points.
          </p>
        </div>

        {/* Top Active Module Badge */}
        <div className="flex items-center gap-2 bg-eda-card px-3 py-1.5 rounded-xl border border-eda-border text-xs">
          <Cpu className="w-4 h-4 text-eda-accent" />
          <span className="text-slate-400">Target Module:</span>
          <span className="font-mono font-bold text-white">{activeDesign.moduleName}</span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Generation Controls & Knobs (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-eda-card border border-eda-border shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-eda-border">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-violet-400" />
                <span>Synthesis Knobs</span>
              </span>
              <button
                onClick={handleReset}
                className="text-slate-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
                title="Reset to defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Framework Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Verification Framework</label>
              <select
                value={tbConfig.framework}
                onChange={(e) => setTbConfig({ ...tbConfig, framework: e.target.value })}
                className="w-full bg-eda-surface border border-eda-border text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-eda-accent cursor-pointer"
              >
                <option value="cocotb">Python Cocotb (Modern Coroutine TB)</option>
                <option value="systemverilog">SystemVerilog (UVM Standard)</option>
              </select>
              <p className="text-[11px] text-slate-500">
                Cocotb executes async Python coroutines using standard simulators.
              </p>
            </div>

            {/* Test Vector Count */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-300">Vector Count</label>
                <span className="font-mono font-bold text-eda-accent">{tbConfig.testCount} cycles</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="10"
                value={tbConfig.testCount}
                onChange={(e) => setTbConfig({ ...tbConfig, testCount: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-eda-accent"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>10</span>
                <span>50</span>
                <span>100</span>
                <span>200</span>
              </div>
            </div>

            {/* Test Feature Toggles */}
            <div className="space-y-2.5 pt-2 border-t border-eda-border">
              <span className="text-xs font-semibold text-slate-300 block mb-2">Stimulus Features</span>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-eda-surface border border-eda-border cursor-pointer hover:border-slate-600 transition-colors">
                <div>
                  <div className="text-xs font-medium text-white">Directed Tests</div>
                  <div className="text-[11px] text-slate-400">Sanity operations and specific opcodes</div>
                </div>
                <input
                  type="checkbox"
                  checked={tbConfig.includeDirected}
                  onChange={(e) => setTbConfig({ ...tbConfig, includeDirected: e.target.checked })}
                  className="rounded bg-eda-card border-eda-border text-eda-accent focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-eda-surface border border-eda-border cursor-pointer hover:border-slate-600 transition-colors">
                <div>
                  <div className="text-xs font-medium text-white">Constrained Random Tests</div>
                  <div className="text-[11px] text-slate-400">Pseudo-random input vector campaign</div>
                </div>
                <input
                  type="checkbox"
                  checked={tbConfig.includeRandom}
                  onChange={(e) => setTbConfig({ ...tbConfig, includeRandom: e.target.checked })}
                  className="rounded bg-eda-card border-eda-border text-eda-accent focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-eda-surface border border-eda-border cursor-pointer hover:border-slate-600 transition-colors">
                <div>
                  <div className="text-xs font-medium text-white">Edge-Case Boundaries</div>
                  <div className="text-[11px] text-slate-400">Overflow, zero, wrap-around, and max values</div>
                </div>
                <input
                  type="checkbox"
                  checked={tbConfig.includeEdgeCases}
                  onChange={(e) => setTbConfig({ ...tbConfig, includeEdgeCases: e.target.checked })}
                  className="rounded bg-eda-card border-eda-border text-eda-accent focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-eda-surface border border-eda-border cursor-pointer hover:border-slate-600 transition-colors">
                <div>
                  <div className="text-xs font-medium text-white">Coverage Instrumentation</div>
                  <div className="text-[11px] text-slate-400">Branch, functional bins, and cross coverage</div>
                </div>
                <input
                  type="checkbox"
                  checked={tbConfig.includeCoverage}
                  onChange={(e) => setTbConfig({ ...tbConfig, includeCoverage: e.target.checked })}
                  className="rounded bg-eda-card border-eda-border text-eda-accent focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide shadow-lg glow-violet flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Testbench...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Testbench</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Generated Code Panel (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <CodePanel
            title={`Generated Testbench: test_${activeDesign.moduleName}.${tbConfig.framework === 'cocotb' ? 'py' : 'sv'}`}
            code={generatedTestbench}
            language={tbConfig.framework === 'cocotb' ? 'python' : 'verilog'}
            filename={`test_${activeDesign.moduleName}.${tbConfig.framework === 'cocotb' ? 'py' : 'sv'}`}
            editable={false}
            height="h-[580px]"
          />

          {/* Action to proceed to verification */}
          <div className="p-4 rounded-2xl bg-eda-card border border-eda-border flex items-center justify-between">
            <div className="text-xs">
              <span className="font-semibold text-white">Ready for Simulation?</span>
              <p className="text-slate-400 text-[11px]">Send this synthesized testbench to the Verification & Coverage console.</p>
            </div>
            <button
              onClick={() => navigate('/verification')}
              className="px-4 py-2 rounded-xl bg-eda-accent hover:bg-blue-600 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <span>Run in Verification Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
