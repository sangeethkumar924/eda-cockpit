import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, Clock } from 'lucide-react';

export default function StatusBadge({ status, text, size = 'sm' }) {
  const normalized = (status || '').toUpperCase();

  const configs = {
    PASS: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      defaultText: 'PASS'
    },
    COMPLETED: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      defaultText: 'Completed'
    },
    FAIL: {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      icon: <XCircle className="w-3.5 h-3.5" />,
      defaultText: 'FAIL'
    },
    ERROR: {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      icon: <XCircle className="w-3.5 h-3.5" />,
      defaultText: 'Error'
    },
    WARN: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      defaultText: 'WARN'
    },
    WARNING: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      defaultText: 'Warning'
    },
    PENDING: {
      bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      icon: <Clock className="w-3.5 h-3.5" />,
      defaultText: 'Pending'
    },
    RUNNING: {
      bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse',
      icon: <Info className="w-3.5 h-3.5" />,
      defaultText: 'Running'
    }
  };

  const current = configs[normalized] || {
    bg: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
    icon: <Info className="w-3.5 h-3.5" />,
    defaultText: text || status
  };

  const sizeClasses = size === 'xs' ? 'text-[10px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${current.bg} ${sizeClasses}`}>
      {current.icon}
      <span>{text || current.defaultText}</span>
    </span>
  );
}
