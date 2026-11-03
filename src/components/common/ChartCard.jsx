import React from 'react';

export default function ChartCard({
  title,
  subtitle,
  badge,
  action,
  children,
  className = ''
}) {
  return (
    <div className={`p-5 rounded-2xl bg-eda-card border border-eda-border/80 shadow-xl flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-wide text-white">{title}</h3>
            {badge && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-eda-border bg-eda-muted/30 text-slate-300">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        {action && <div>{action}</div>}
      </div>

      {/* Chart Canvas Area */}
      <div className="flex-1 w-full min-h-[260px] relative">
        {children}
      </div>
    </div>
  );
}
