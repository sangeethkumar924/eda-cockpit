import React, { useEffect, useRef } from 'react';
import { Terminal, Copy, Trash2, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AgentTerminal({
  logs = [],
  isRunning = false,
  title = 'Simulation Console (Icarus Verilog + Cocotb)',
  onClear
}) {
  const terminalEndRef = useRef(null);
  const [copied, setCopied] = React.useState(false);
  const { addToast } = useApp();

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(logs.join('\n'));
      setCopied(true);
      addToast({ title: 'Terminal Copied', message: 'Simulation log copied to clipboard.', type: 'info' });
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      addToast({ title: 'Copy Failed', message: 'Could not copy terminal logs.', type: 'error' });
    }
  };

  return (
    <div className="rounded-2xl border border-eda-border bg-eda-darkest shadow-2xl flex flex-col overflow-hidden font-mono">
      {/* Console Header */}
      <div className="px-4 py-2.5 bg-slate-950 border-b border-eda-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 items-center mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-300 text-[11px]">{title}</span>
          {isRunning && (
            <span className="flex items-center gap-1.5 text-cyan-400 text-[10px] bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
              Simulating
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Copy logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {onClear && (
            <button
              onClick={onClear}
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Clear logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Console Logs Area */}
      <div className="p-4 h-64 overflow-y-auto text-xs space-y-1.5 bg-[#070b14] select-text">
        {logs.length === 0 ? (
          <div className="text-slate-600 italic py-6 text-center">
            Ready. Click "Run Verification" to launch simulation suite.
          </div>
        ) : (
          logs.map((log, index) => {
            let color = 'text-slate-300';
            if (log.includes('[PASS]') || log.includes('[SUCCESS]')) color = 'text-emerald-400';
            else if (log.includes('[WARN]')) color = 'text-amber-400';
            else if (log.includes('[FAIL]') || log.includes('[ERROR]')) color = 'text-rose-400 font-semibold';
            else if (log.includes('[AGENT]')) color = 'text-violet-400 font-semibold';
            else if (log.includes('[INFO]')) color = 'text-sky-300';
            else if (log.includes('[STATUS]')) color = 'text-cyan-300 font-medium';

            return (
              <div key={index} className={`leading-relaxed break-words ${color}`}>
                {log}
              </div>
            );
          })
        )}
        {isRunning && (
          <div className="flex items-center gap-2 text-cyan-400 pt-1">
            <span className="w-2 h-4 bg-cyan-400 animate-pulse inline-block" />
            <span className="text-[11px] text-slate-500">Processing simulation waveform...</span>
          </div>
        )}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
