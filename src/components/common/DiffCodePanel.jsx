import React, { useState } from 'react';
import { Columns, Eye, Zap, Copy, Download, Check } from 'lucide-react';
import { downloadFile } from '../../utils/exportUtils';
import { useApp } from '../../context/AppContext';

export default function DiffCodePanel({
  originalCode = '',
  optimizedCode = '',
  originalTitle = 'Original RTL Baseline',
  optimizedTitle = 'Power-Optimized RTL Transformation',
  height = 'h-[500px]'
}) {
  const [viewMode, setViewMode] = useState('sideBySide'); // 'sideBySide' | 'optimizedOnly' | 'originalOnly'
  const [copied, setCopied] = useState(false);
  const { addToast } = useApp();

  const handleCopy = async (code, name) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      addToast({
        title: 'Code Copied',
        message: `${name} copied to clipboard.`,
        type: 'success'
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      addToast({ title: 'Copy Failed', message: 'Unable to access clipboard.', type: 'error' });
    }
  };

  const handleDownload = (code, filename) => {
    downloadFile(filename, code, 'text/x-verilog');
    addToast({
      title: 'Verilog File Saved',
      message: `${filename} downloaded.`,
      type: 'success'
    });
  };

  const origLines = originalCode.split('\n');
  const optLines = optimizedCode.split('\n');

  return (
    <div className="rounded-2xl border border-eda-border bg-eda-surface shadow-xl flex flex-col overflow-hidden">
      {/* View Switcher Bar */}
      <div className="px-4 py-3 bg-eda-darkest/95 border-b border-eda-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-white tracking-wide">RTL Optimization Code Inspector</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode selector */}
          <div className="flex items-center bg-eda-card p-1 rounded-lg border border-eda-border text-xs">
            <button
              onClick={() => setViewMode('sideBySide')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                viewMode === 'sideBySide' ? 'bg-eda-accent text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Side-by-Side</span>
            </button>
            <button
              onClick={() => setViewMode('optimizedOnly')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                viewMode === 'optimizedOnly' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Optimized RTL</span>
            </button>
            <button
              onClick={() => setViewMode('originalOnly')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                viewMode === 'originalOnly' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Original Only</span>
            </button>
          </div>

          {/* Action buttons */}
          <button
            onClick={() => handleCopy(optimizedCode, 'Optimized RTL')}
            className="p-1.5 rounded-lg border bg-eda-card text-slate-300 border-eda-border hover:bg-eda-muted/50 flex items-center gap-1 text-xs"
            title="Copy optimized RTL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[11px] hidden md:inline">Copy Opt RTL</span>
          </button>

          <button
            onClick={() => handleDownload(optimizedCode, 'optimized_rtl.v')}
            className="p-1.5 rounded-lg border bg-eda-card text-slate-300 border-eda-border hover:bg-eda-muted/50 flex items-center gap-1 text-xs"
            title="Download optimized RTL"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden md:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      <div className={`grid ${viewMode === 'sideBySide' ? 'grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-eda-border' : 'grid-cols-1'} ${height} bg-eda-navy-950 overflow-hidden`}>
        {/* Left: Original */}
        {(viewMode === 'sideBySide' || viewMode === 'originalOnly') && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="px-3 py-2 bg-slate-900/80 border-b border-eda-border/60 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">{originalTitle}</span>
              <span className="text-[11px] font-mono text-slate-500">{origLines.length} lines</span>
            </div>
            <div className="flex-1 overflow-auto p-3 font-mono text-xs select-text">
              <div className="table w-full">
                {origLines.map((line, idx) => (
                  <div key={idx} className="table-row hover:bg-slate-800/40">
                    <span className="table-cell select-none pr-3 text-right text-slate-600 w-8 text-[11px]">{idx + 1}</span>
                    <span className="table-cell whitespace-pre text-slate-300 leading-relaxed">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Right: Optimized */}
        {(viewMode === 'sideBySide' || viewMode === 'optimizedOnly') && (
          <div className="flex flex-col h-full overflow-hidden bg-emerald-950/5">
            <div className="px-3 py-2 bg-emerald-950/20 border-b border-emerald-500/20 flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                {optimizedTitle}
              </span>
              <span className="text-[11px] font-mono text-emerald-400/70">{optLines.length} lines</span>
            </div>
            <div className="flex-1 overflow-auto p-3 font-mono text-xs select-text">
              <div className="table w-full">
                {optLines.map((line, idx) => {
                  const isPowerAnnotated = line.includes('POWER OPTIMIZATION') || line.includes('_gated') || line.includes('gated_clk') || line.includes('en_latched');
                  return (
                    <div
                      key={idx}
                      className={`table-row hover:bg-emerald-900/20 ${
                        isPowerAnnotated ? 'bg-emerald-500/10 font-semibold text-emerald-200' : ''
                      }`}
                    >
                      <span className="table-cell select-none pr-3 text-right text-slate-600 w-8 text-[11px]">{idx + 1}</span>
                      <span className={`table-cell whitespace-pre leading-relaxed ${isPowerAnnotated ? 'text-emerald-300' : 'text-slate-200'}`}>
                        {line}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
