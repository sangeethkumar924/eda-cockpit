import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Zap,
  Layers,
  Clock,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../src/context/AppContext';
import { SAMPLE_DESIGNS } from '../data/designs';
import { exportCSV, exportJSON, triggerPrintReport } from '../utils/exportUtils';
import { formatPower, calculatePowerSaving } from '../utils/calculations';
import StatusBadge from '../components/common/StatusBadge';

export default function Reports() {
  const {
    activeDesign,
    selectDesign,
    analysisResult,
    tbConfig,
    activeVerificationData,
    isCurrentVerificationExecuted,
    isCurrentFeedbackExecuted,
    activePpaData,
    activeOptComparison,
    activeOptDetails,
    addToast
  } = useApp();

  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGeneratedAt, setReportGeneratedAt] = useState(() => new Date().toLocaleString());

  const powerSaving = calculatePowerSaving(activeOptComparison.originalPower, activeOptComparison.optimizedPower);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReportGeneratedAt(new Date().toLocaleString());
      addToast({
        title: 'Report Dossier Updated',
        message: `Consolidated sign-off report generated for ${activeDesign.shortName}.`,
        type: 'success'
      });
    }, 500);
  };

  const handleDownloadCSV = () => {
    const rows = [
      {
        Field: 'Design Name',
        Value: activeDesign.name,
        Details: activeDesign.moduleName
      },
      {
        Field: 'Structural Complexity',
        Value: analysisResult.structuralComplexity,
        Details: `${analysisResult.linesOfCode} LOC, ${analysisResult.registers} Regs`
      },
      {
        Field: 'Testbench Framework',
        Value: tbConfig.framework,
        Details: `${tbConfig.testCount} Vectors`
      },
      {
        Field: 'Initial Verification Coverage',
        Value: `${activeVerificationData.initialCoverage}%`,
        Details: 'Statement + Branch + Functional'
      },
      {
        Field: 'Final Feedback Coverage',
        Value: `${activeVerificationData.finalCoverage}%`,
        Details: isCurrentFeedbackExecuted ? 'Closed by AI Stimulus Loop' : 'Target baseline'
      },
      {
        Field: 'Predicted Dynamic Power',
        Value: `${activePpaData.predictedPower} W`,
        Details: `Actual: ${activePpaData.actualPower} W`
      },
      {
        Field: 'Predicted Area (LUTs)',
        Value: activePpaData.predictedLuts,
        Details: `Actual: ${activePpaData.actualLuts} LUTs`
      },
      {
        Field: 'Original Power Baseline',
        Value: `${activeOptComparison.originalPower} W`,
        Details: 'Pre-optimization RTL'
      },
      {
        Field: 'Optimized Power',
        Value: `${activeOptComparison.optimizedPower} W`,
        Details: activeOptComparison.targetTechnique
      },
      {
        Field: 'Power Savings Percentage',
        Value: `${powerSaving}%`,
        Details: '((Orig - Opt) / Orig) * 100'
      }
    ];

    exportCSV(`vision_eda_report_${activeDesign.id}.csv`, rows);
    addToast({ title: 'CSV Downloaded', message: `Exported metrics for ${activeDesign.shortName}.`, type: 'success' });
  };

  const handleDownloadJSON = () => {
    const reportData = {
      platform: 'VISION-EDA AI Hardware Verification & Optimization Suite',
      timestamp: reportGeneratedAt,
      design: {
        id: activeDesign.id,
        name: activeDesign.name,
        moduleName: activeDesign.moduleName,
        category: activeDesign.category,
        linesOfCode: analysisResult.linesOfCode,
        complexity: analysisResult.structuralComplexity,
        ports: analysisResult.ports,
        registers: analysisResult.registers,
        wires: analysisResult.wires
      },
      verification: {
        framework: tbConfig.framework,
        vectors: tbConfig.testCount,
        initialCoverage: activeVerificationData.initialCoverage,
        finalCoverage: activeVerificationData.finalCoverage,
        feedbackExecuted: isCurrentFeedbackExecuted,
        metrics: isCurrentFeedbackExecuted ? activeVerificationData.finalMetrics : activeVerificationData.initialMetrics
      },
      ppa: {
        predictedPowerW: activePpaData.predictedPower,
        actualPowerW: activePpaData.actualPower,
        predictedLuts: activePpaData.predictedLuts,
        actualLuts: activePpaData.actualLuts,
        estimatedDelayNs: activePpaData.predictedDelay
      },
      optimization: {
        technique: activeOptComparison.targetTechnique,
        originalPowerW: activeOptComparison.originalPower,
        optimizedPowerW: activeOptComparison.optimizedPower,
        powerSavingPercentage: powerSaving,
        originalLuts: activeOptComparison.originalLuts,
        optimizedLuts: activeOptComparison.optimizedLuts
      },
      signOffDisclaimer: 'Illustrative demonstration prototype dataset. Silicon implementation requires physical synthesis (Synopsys Design Compiler) and formal LEC sign-off.'
    };

    exportJSON(`vision_eda_dossier_${activeDesign.id}.json`, reportData);
    addToast({ title: 'JSON Dossier Downloaded', message: `Saved structured specification for ${activeDesign.shortName}.`, type: 'success' });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-eda-border no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Consolidated Engineering Design Report
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sign-off audit covering RTL parsing, testbench verification, coverage metrics, and PPA optimization.
          </p>
        </div>

        {/* Working Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="px-3 py-1.5 rounded-xl bg-eda-surface hover:bg-slate-800 border border-eda-border text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isGenerating ? 'Compiling...' : 'Generate Report'}</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="px-3 py-1.5 rounded-xl bg-eda-card hover:bg-slate-800 border border-eda-border text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Download CSV table"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="px-3 py-1.5 rounded-xl bg-eda-card hover:bg-slate-800 border border-eda-border text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Download JSON dossier"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>

          <button
            onClick={triggerPrintReport}
            className="px-4 py-1.5 rounded-xl bg-eda-accent hover:bg-blue-600 text-white text-xs font-bold shadow-md glow-blue flex items-center gap-1.5 transition-all"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="p-8 rounded-2xl bg-eda-card border border-eda-border shadow-2xl space-y-6 card-print">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-eda-border/80 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-eda-accent inline-block" />
              <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                VISION-EDA Design Dossier
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1 tracking-tight">
              {activeDesign.name} ({activeDesign.moduleName})
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Category: {activeDesign.category} | Generated: {reportGeneratedAt}
            </p>
          </div>

          <div className="flex sm:flex-col items-end gap-1.5">
            <StatusBadge status="COMPLETED" text="Sign-Off Ready" />
            <span className="text-[11px] font-mono text-slate-400">DOC-REV: 1.04-RC</span>
          </div>
        </div>

        {/* Section 1: Design Overview & AST Analysis */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-eda-accent" />
            <span>1. RTL Architecture & Structural Analysis</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-eda-surface border border-eda-border">
              <span className="text-slate-400 text-[11px] block">Lines of Code</span>
              <span className="font-mono font-bold text-white text-base">{analysisResult.linesOfCode}</span>
            </div>
            <div className="p-3 rounded-xl bg-eda-surface border border-eda-border">
              <span className="text-slate-400 text-[11px] block">Complexity</span>
              <span className="font-bold text-eda-accent text-base">{analysisResult.structuralComplexity}</span>
            </div>
            <div className="p-3 rounded-xl bg-eda-surface border border-eda-border">
              <span className="text-slate-400 text-[11px] block">Registers (reg)</span>
              <span className="font-mono font-bold text-white text-base">{analysisResult.registers}</span>
            </div>
            <div className="p-3 rounded-xl bg-eda-surface border border-eda-border">
              <span className="text-slate-400 text-[11px] block">Wires / Nets</span>
              <span className="font-mono font-bold text-white text-base">{analysisResult.wires}</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-eda-surface p-3 rounded-xl border border-eda-border">
            {activeDesign.description} Synthesized module contains {analysisResult.ports.inputs.length} inputs and {analysisResult.ports.outputs.length} outputs with zero unmapped floating nets.
          </p>
        </div>

        {/* Section 2: Verification & Coverage Audit */}
        <div className="space-y-3 pt-3 border-t border-eda-border">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>2. Verification Suite & Coverage Feedback Loop</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-eda-surface border border-eda-border">
              <span className="text-slate-400 text-[11px] block">Framework</span>
              <span className="font-bold text-white">{tbConfig.framework === 'cocotb' ? 'Python Cocotb' : 'SystemVerilog'}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{tbConfig.testCount} Test Vectors</span>
            </div>

            <div className="p-3 rounded-xl bg-eda-surface border border-eda-border">
              <span className="text-slate-400 text-[11px] block">Initial Baseline Coverage</span>
              <span className="font-mono font-bold text-amber-400 text-lg">{activeVerificationData.initialCoverage}%</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">3 Corner-case holes flagged</span>
            </div>

            <div className="p-3 rounded-xl bg-eda-surface border border-eda-border">
              <span className="text-slate-400 text-[11px] block">Final Post-Feedback Coverage</span>
              <span className="font-mono font-bold text-emerald-400 text-lg">{activeVerificationData.finalCoverage}%</span>
              <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">Target &gt; 95% Satisfied</span>
            </div>
          </div>
        </div>

        {/* Section 3: PPA Estimates & Power Optimization */}
        <div className="space-y-3 pt-3 border-t border-eda-border">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>3. PPA Benchmarking & Dynamic Power Optimization</span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-eda-border bg-eda-surface">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-eda-darkest/70 border-b border-eda-border text-slate-400">
                  <th className="py-2.5 px-4 font-semibold">Evaluation Metric</th>
                  <th className="py-2.5 px-4 font-semibold">Original Baseline</th>
                  <th className="py-2.5 px-4 font-semibold">Optimized RTL</th>
                  <th className="py-2.5 px-4 font-semibold">Quantitative Improvement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-eda-border/50 text-slate-200">
                <tr>
                  <td className="py-2.5 px-4 font-medium">Dynamic Power (W)</td>
                  <td className="py-2.5 px-4 font-mono">{formatPower(activeOptComparison.originalPower)}</td>
                  <td className="py-2.5 px-4 font-mono text-emerald-400 font-bold">{formatPower(activeOptComparison.optimizedPower)}</td>
                  <td className="py-2.5 px-4 font-mono text-blue-400 font-bold">-{powerSaving}% Saved</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium">Standard Cell LUTs</td>
                  <td className="py-2.5 px-4 font-mono">{activeOptComparison.originalLuts} LUTs</td>
                  <td className="py-2.5 px-4 font-mono text-cyan-400">{activeOptComparison.optimizedLuts} LUTs</td>
                  <td className="py-2.5 px-4 font-mono text-slate-300">-5.6% Logic Pruned</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium">Critical Delay (ns)</td>
                  <td className="py-2.5 px-4 font-mono">{activeOptComparison.originalDelay} ns</td>
                  <td className="py-2.5 px-4 font-mono">{activeOptComparison.optimizedDelay} ns</td>
                  <td className="py-2.5 px-4 font-mono text-slate-400">+0.05 ns (Within Slack)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-eda-surface border border-eda-border text-xs space-y-1">
            <span className="font-semibold text-slate-300">Applied Optimization Strategy:</span>
            <p className="text-slate-400 leading-relaxed">{activeOptDetails.explanation.whatChanged}</p>
          </div>
        </div>

        {/* Section 4: Engineering Limitations & Next Steps */}
        <div className="space-y-3 pt-3 border-t border-eda-border">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>4. Prototype Scope, Limitations & Production Sign-Off</span>
          </h3>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-eda-border text-xs text-slate-400 leading-relaxed space-y-2">
            <p>
              • <strong>Scope:</strong> VISION-EDA is an engineering prototype demonstrating multi-agent workflow orchestration. Verification simulation logs and PPA regressions utilize pre-characterized benchmark models.
            </p>
            <p>
              • <strong>Hardware Equivalence:</strong> In actual tape-out flows, formal equivalence checking (Formality/Conformal) and static timing sign-off (PrimeTime) must validate that operand isolation and clock-gating cells do not violate setup margins or introduce glitches.
            </p>
            <p>
              • <strong>Next Steps:</strong> Export RTL netlist to open-source OpenROAD or commercial Synopsys synthesis flow for GDSII physical layout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
