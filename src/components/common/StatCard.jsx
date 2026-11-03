import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({
  title,
  value,
  unit = '',
  subtitle,
  icon: Icon,
  trend,
  trendType = 'up',
  color = 'blue',
  onClick
}) {
  const colorMap = {
    blue: 'border-blue-500/20 bg-blue-500/5 text-blue-400',
    violet: 'border-violet-500/20 bg-violet-500/5 text-violet-400',
    emerald: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',
    amber: 'border-amber-500/20 bg-amber-500/5 text-amber-400',
    cyan: 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400'
  };

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl bg-eda-card border border-eda-border/80 shadow-lg relative overflow-hidden transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-eda-accent/50 hover:translate-y-[-2px]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium tracking-wider uppercase text-slate-400">{title}</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
            {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.blue}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-eda-border/50 flex items-center justify-between text-xs text-slate-400">
          <span>{subtitle}</span>
          {trend && (
            <span className={`inline-flex items-center gap-1 font-semibold ${trendType === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trendType === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
