import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSearch,
  Code2,
  CheckCircle,
  Repeat,
  Gauge,
  Zap,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function WorkflowStepper({ currentStep = 'dashboard' }) {
  const navigate = useNavigate();
  const { isCurrentVerificationExecuted, isCurrentFeedbackExecuted } = useApp();

  const steps = [
    { id: 'rtl-analysis', path: '/rtl-analysis', label: 'RTL Analysis', icon: FileSearch, completed: true },
    { id: 'testbench', path: '/testbench', label: 'Testbench Gen', icon: Code2, completed: true },
    { id: 'verification', path: '/verification', label: 'Verification', icon: CheckCircle, completed: isCurrentVerificationExecuted },
    { id: 'coverage-feedback', path: '/verification', label: 'Coverage Loop', icon: Repeat, completed: isCurrentFeedbackExecuted },
    { id: 'ppa', path: '/ppa', label: 'PPA Prediction', icon: Gauge, completed: true },
    { id: 'optimization', path: '/optimization', label: 'RTL Optimization', icon: Zap, completed: true },
    { id: 'comparison', path: '/comparison', label: 'Comparison', icon: BarChart3, completed: true }
  ];

  return (
    <div className="w-full bg-eda-surface border border-eda-border/80 rounded-2xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
          Automated Multi-Agent Verification & Optimization Pipeline
        </span>
        <span className="text-[11px] font-mono text-eda-accent bg-eda-accent/10 px-2 py-0.5 rounded border border-eda-accent/20">
          7 Stages
        </span>
      </div>

      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => navigate(step.path)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all shrink-0 border ${
                  isActive
                    ? 'bg-eda-accent text-white border-eda-accent shadow-md glow-blue'
                    : step.completed
                    ? 'bg-eda-card text-emerald-300 border-emerald-500/30 hover:border-emerald-500/60'
                    : 'bg-eda-card/50 text-slate-400 border-eda-border hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : step.completed ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{step.label}</span>
              </button>

              {idx < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
