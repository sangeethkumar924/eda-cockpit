import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Repeat,
  Zap,
  BarChart2,
  TrendingUp,
  Cpu
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import StatCard from '../components/common/StatCard';
import ChartCard from '../components/common/ChartCard';
import StatusBadge from '../components/common/StatusBadge';
import AgentTerminal from '../components/common/AgentTerminal';
import DataTable from '../components/common/DataTable';
import { useApp } from '../context/AppContext';

export default function VerificationCoverage() {
  const navigate = useNavigate();
  const {
    activeDesign,
    activeVerificationData,
    isCurrentVerificationExecuted,
    isCurrentFeedbackExecuted,
    markVerificationRun,
    markFeedbackRun,
    addToast
  } = useApp();

  const [isSimulating, setIsSimulating] = useState(false);
  const [isFeedbackRunning, setIsFeedbackRunning] = useState(false);
  const [logs, setLogs] = useState(() => {
    if (isCurrentFeedbackExecuted) {
      return [...activeVerificationData.initialLogs, ...activeVerificationData.feedbackLogs];
    } else if (isCurrentVerificationExecuted) {
      return activeVerificationData.initialLogs;
    }
    return [];
  });

  // Calculate active test cases
  const displayedTests = isCurrentFeedbackExecuted
    ? [...activeVerificationData.initialTests, ...activeVerificationData.feedbackTests]
    : isCurrentVerificationExecuted
    ? activeVerificationData.initialTests
    : [];

  // Determine coverage metrics
  const currentCoverage = isCurrentFeedbackExecuted
    ? activeVerificationData.finalCoverage
    : isCurrentVerificationExecuted
    ? activeVerificationData.initialCoverage
    : 0;

  const currentMetrics = isCurrentFeedbackExecuted
    ? activeVerificationData.finalMetrics
    : isCurrentVerificationExecuted
    ? activeVerificationData.initialMetrics
    : { statement: 0, branch: 0, functional: 0 };

  const totalTestsCount = displayedTests.length;
  const passedTestsCount = displayedTests.filter(t => t.status === 'PASS').length;
  const failedTestsCount = totalTestsCount - passedTestsCount;

  // Run initial simulation
  const handleRunVerification = () => {
    setIsSimulating(true);
    setLogs([]);
    markVerificationRun(activeDesign.id, true);

    const steps = [
      activeVerificationData.initialLogs[0],
      activeVerificationData.initialLogs[1],
      activeVerificationData.initialLogs[2],
      activeVerificationData.initialLogs[3],
      activeVerificationData.initialLogs[4],
      activeVerificationData.initialLogs[5] || activeVerificationData.initialLogs[3],
      activeVerificationData.initialLogs[activeVerificationData.initialLogs.length - 2],
      activeVerificationData.initialLogs[activeVerificationData.initialLogs.length - 1]
    ].filter(Boolean);

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < steps.length) {
        setLogs(prev => [...prev, steps[idx]]);
        idx++;
      } else {
        clearInterval(interval);
        setLogs(activeVerificationData.initialLogs);
        setIsSimulating(false);
        addToast({
          title: 'Verification Run Finished',
          message: `${activeVerificationData.designName}: Initial Coverage at ${activeVerificationData.initialCoverage}%.`,
          type: 'info'
        });
      }
    }, 60);
  };

  // Run AI coverage feedback loop
  const handleRunFeedbackLoop = () => {
    setIsFeedbackRunning(true);
    markFeedbackRun(activeDesign.id, true);
    const feedbackSteps = activeVerificationData.feedbackLogs;

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < feedbackSteps.length) {
        setLogs(prev => [...prev, feedbackSteps[idx]]);
        idx++;
      } else {
        clearInterval(interval);
        setLogs([...activeVerificationData.initialLogs, ...activeVerificationData.feedbackLogs]);
        setIsFeedbackRunning(false);
        addToast({
          title: 'Coverage Feedback Loop Succeeded',
          message: `Coverage elevated from ${activeVerificationData.initialCoverage}% to ${activeVerificationData.finalCoverage}%!`,
          type: 'success'
        });
      }
    }, 70);
  };

  const handleResetVerification = () => {
    markVerificationRun(activeDesign.id, false);
    markFeedbackRun(activeDesign.id, false);
    setLogs([]);
    addToast({ title: 'Simulation Console Cleared', message: 'Cleared test results and logs.', type: 'info' });
  };

  // Chart data for before/after coverage
  const coverageComparisonChart = [
    {
      metric: 'Statement',
      initial: activeVerificationData.initialMetrics.statement,
      final: activeVerificationData.finalMetrics.statement
    },
    {
      metric: 'Branch',
      initial: activeVerificationData.initialMetrics.branch,
      final: activeVerificationData.finalMetrics.branch
    },
    {
      metric: 'Functional',
      initial: activeVerificationData.initialMetrics.functional,
      final: activeVerificationData.finalMetrics.functional
    },
    {
      metric: 'Overall',
      initial: activeVerificationData.initialCoverage,
      final: activeVerificationData.finalCoverage
    }
  ];

  const columns = [
    {
      header: 'Test ID',
      accessor: 'id',
      render: (row) => (
        <span className="font-mono font-bold text-slate-300">
          {row.id}
          {row.generatedBy && (
            <span className="ml-1.5 text-[9px] bg-violet-500/20 text-violet-300 px-1 py-0.5 rounded border border-violet-500/30">
              AI Gen
            </span>
          )}
        </span>
      )
    },
    { header: 'Test Scenario Name', accessor: 'name' },
    { header: 'Opcode / Trigger', accessor: 'opcode', render: (row) => <span className="font-mono text-cyan-400">{row.opcode}</span> },
    { header: 'Stimulus Inputs', accessor: 'inputs', render: (row) => <span className="font-mono text-slate-400 text-[11px]">{row.inputs}</span> },
    { header: 'Expected Output', accessor: 'expected', render: (row) => <span className="font-mono text-slate-300 text-[11px]">{row.expected}</span> },
    { header: 'Latency', accessor: 'time', render: (row) => <span className="font-mono text-slate-400">{row.time}</span> },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-eda-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Verification & Coverage Console
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulated Cocotb test runner with live waveform logs, PASS/FAIL checks, and coverage-driven feedback loops.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            id="run-verification-btn"
            onClick={handleRunVerification}
            disabled={isSimulating || isFeedbackRunning}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md glow-blue flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isSimulating ? 'Simulating...' : 'Run Verification'}</span>
          </button>

          {isCurrentVerificationExecuted && (
            <button
              id="run-feedback-loop-btn"
              onClick={handleRunFeedbackLoop}
              disabled={isFeedbackRunning || isCurrentFeedbackExecuted}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                isCurrentFeedbackExecuted
                  ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-600/50 cursor-default'
                  : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white glow-violet'
              }`}
            >
              <Repeat className={`w-3.5 h-3.5 ${isFeedbackRunning ? 'animate-spin' : ''}`} />
              <span>
                {isCurrentFeedbackExecuted
                  ? 'Coverage Closed (96%)'
                  : isFeedbackRunning
                  ? 'Synthesizing Corner Vectors...'
                  : 'Generate Additional Tests (Feedback Loop)'}
              </span>
            </button>
          )}

          <button
            onClick={handleResetVerification}
            className="p-2 rounded-xl border border-eda-border bg-eda-card text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset verification state"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Verification KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Coverage"
          value={currentCoverage ? `${currentCoverage}` : '--'}
          unit="%"
          subtitle={`Target: 95.0% | Status: ${currentCoverage >= 95 ? 'Met' : currentCoverage > 0 ? 'Holes Detected' : 'Not Run'}`}
          icon={ShieldCheck}
          color={currentCoverage >= 95 ? 'emerald' : currentCoverage > 0 ? 'amber' : 'blue'}
        />
        <StatCard
          title="Statement Coverage"
          value={currentMetrics.statement ? `${currentMetrics.statement}` : '--'}
          unit="%"
          subtitle="Verilog statements traversed"
          icon={Cpu}
          color="blue"
        />
        <StatCard
          title="Branch Coverage"
          value={currentMetrics.branch ? `${currentMetrics.branch}` : '--'}
          unit="%"
          subtitle="Decision control paths"
          icon={BarChart2}
          color="violet"
        />
        <StatCard
          title="Test Cases Passed"
          value={totalTestsCount ? `${passedTestsCount}/${totalTestsCount}` : '--'}
          subtitle={`${failedTestsCount} test failures`}
          icon={CheckCircle}
          color={failedTestsCount === 0 && totalTestsCount > 0 ? 'emerald' : 'amber'}
        />
      </div>

      {/* Simulator Terminal & Progress */}
      <AgentTerminal
        logs={logs}
        isRunning={isSimulating || isFeedbackRunning}
        title={`Cocotb Simulator Console — [DUT: ${activeDesign.moduleName}]`}
        onClear={() => setLogs([])}
      />

      {/* Test Cases Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Verification Test Suite Results</h3>
            <p className="text-xs text-slate-400">
              {displayedTests.length > 0
                ? `Showing ${displayedTests.length} executed test vectors across directed, randomized, and feedback runs.`
                : 'Click "Run Verification" above to execute the synthesized testbench.'}
            </p>
          </div>
          {isCurrentFeedbackExecuted && (
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-medium">
              Feedback Loop Completed (+4 Corner Tests)
            </span>
          )}
        </div>

        <DataTable
          columns={columns}
          data={displayedTests}
          emptyMessage="No tests executed yet. Click 'Run Verification' to start simulation."
        />
      </div>

      {/* Uncovered Scenarios & Before-After Coverage Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Uncovered Scenarios List */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-eda-card border border-eda-border shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-eda-border">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Coverage Hole Identification</span>
            </span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {isCurrentFeedbackExecuted ? '0 Holes Remaining' : `${activeVerificationData.uncoveredScenarios.length} Holes Detected`}
            </span>
          </div>

          <div className="space-y-2.5">
            {activeVerificationData.uncoveredScenarios.map((hole, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  isCurrentFeedbackExecuted
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300 line-through opacity-70'
                    : 'bg-eda-surface border-eda-border text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-semibold mb-1">
                  <span className="font-mono text-amber-400">{hole.code}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                    {hole.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{hole.desc}</p>
                {isCurrentFeedbackExecuted && (
                  <div className="mt-1 text-[10px] text-emerald-400 font-semibold not-italic">
                    ✓ Closed by AI Generated Feedback Test
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action to proceed to PPA */}
          <div className="pt-2">
            <button
              onClick={() => navigate('/ppa')}
              className="w-full py-2.5 px-4 rounded-xl bg-eda-surface hover:bg-slate-800 border border-eda-border text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Proceed to PPA Prediction</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Coverage Elevation Chart */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Coverage Elevation: Initial Baseline vs AI Feedback"
            subtitle="Demonstration of closed-loop stimulus synthesis elevating metrics to 95%+ target"
            badge="Demonstration Data"
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={coverageComparisonChart} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="metric" stroke="#64748B" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="initial" name="Initial Coverage (%)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="final" name="Post-Feedback Coverage (%)" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
