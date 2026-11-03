import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import StatCard from '../components/common/StatCard';
import ChartCard from '../components/common/ChartCard';
import StatusBadge from '../components/common/StatusBadge';
import WorkflowStepper from '../components/workflow/WorkflowStepper';
import DataTable from '../components/common/DataTable';
import { useApp } from '../context/AppContext';
import { SAMPLE_DESIGNS } from '../data/designs';
import { VERIFICATION_DATA } from '../data/verification';
import { OPTIMIZATION_COMPARISON_DATA } from '../data/optimization';

export default function Dashboard() {
  const navigate = useNavigate();
  const { selectDesign } = useApp();

  // Recent Designs Summary Data
  const recentDesignsData = [
    { design: 'ALU', id: 'alu', status: 'Completed', coverage: '96%', powerSaving: '16.1%', lutSaving: '5.6%', type: 'Datapath' },
    { design: 'Counter', id: 'counter', status: 'Completed', coverage: '97%', powerSaving: '17.1%', lutSaving: '6.7%', type: 'Sequential' },
    { design: 'UART', id: 'uart', status: 'Completed', coverage: '94%', powerSaving: '16.5%', lutSaving: '8.3%', type: 'Comm IO' },
    { design: 'FIFO', id: 'fifo', status: 'Completed', coverage: '96%', powerSaving: '16.0%', lutSaving: '6.8%', type: 'Memory' },
    { design: 'FSM', id: 'fsm', status: 'Completed', coverage: '95%', powerSaving: '15.7%', lutSaving: '9.1%', type: 'Control' }
  ];

  // Coverage Comparison Chart Data (Initial vs Final)
  const coverageChartData = [
    { name: 'ALU', initial: 72, final: 96 },
    { name: 'Counter', initial: 75, final: 97 },
    { name: 'UART', initial: 68, final: 94 },
    { name: 'FIFO', initial: 70, final: 96 },
    { name: 'FSM', initial: 73, final: 95 }
  ];

  // Power Savings Chart Data
  const powerSavingsData = [
    { name: 'ALU', saving: 16.1, original: 0.62, optimized: 0.52 },
    { name: 'Counter', saving: 17.1, original: 0.41, optimized: 0.34 },
    { name: 'UART', saving: 16.5, original: 0.85, optimized: 0.71 },
    { name: 'FIFO', saving: 16.0, original: 0.81, optimized: 0.68 },
    { name: 'FSM', saving: 15.7, original: 0.51, optimized: 0.43 }
  ];

  // Status Distribution Data
  const statusPieData = [
    { name: 'Verified (Passed)', value: 5, color: '#10B981' },
    { name: 'Power Optimized', value: 5, color: '#3B82F6' },
    { name: 'PPA Modeled', value: 5, color: '#8B5CF6' }
  ];

  // Multi-Agent Activity Timeline Data
  const activityData = [
    { cycle: 'Run 1', rtlCheck: 4, tbGen: 2, simRuns: 3, ppaInferences: 2 },
    { cycle: 'Run 2', rtlCheck: 7, tbGen: 5, simRuns: 6, ppaInferences: 4 },
    { cycle: 'Run 3', rtlCheck: 11, tbGen: 9, simRuns: 10, ppaInferences: 8 },
    { cycle: 'Run 4', rtlCheck: 15, tbGen: 14, simRuns: 14, ppaInferences: 12 },
    { cycle: 'Run 5', rtlCheck: 20, tbGen: 18, simRuns: 19, ppaInferences: 16 }
  ];

  const handleRowClick = (row) => {
    selectDesign(row.id);
    navigate('/rtl-analysis');
  };

  const columns = [
    {
      header: 'Design Module',
      accessor: 'design',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-eda-card border border-eda-border flex items-center justify-center font-bold text-eda-accent">
            {row.design[0]}
          </div>
          <div>
            <div className="font-semibold text-white">{row.design}</div>
            <div className="text-[10px] text-slate-400">{row.type}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Final Coverage',
      accessor: 'coverage',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: row.coverage }}
            />
          </div>
          <span className="font-mono font-semibold text-emerald-400">{row.coverage}</span>
        </div>
      )
    },
    {
      header: 'Estimated Power Saving',
      accessor: 'powerSaving',
      render: (row) => (
        <span className="font-mono font-semibold text-blue-400 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          {row.powerSaving}
        </span>
      )
    },
    {
      header: 'LUT Reduction',
      accessor: 'lutSaving',
      render: (row) => <span className="font-mono text-slate-300">{row.lutSaving}</span>
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row) => (
        <span className="text-xs text-eda-accent hover:underline flex items-center gap-1 font-medium">
          Open Analysis <ArrowRight className="w-3 h-3" />
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Action */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-eda-card via-eda-surface to-eda-card border border-eda-border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-eda-accent/15 text-eda-accent border border-eda-accent/30 font-semibold">
              Autonomous Hardware EDA Platform
            </span>
            <span className="text-xs text-slate-400">• Final Year Project Prototype</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1 tracking-tight">
            VISION-EDA Architecture Cockpit
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Multi-agent framework unifying structural AST parsing, Cocotb testbench synthesis, closed-loop coverage feedback, and power-aware RTL operand/clock gating.
          </p>
        </div>

        <button
          onClick={() => navigate('/rtl-analysis')}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wide shadow-lg glow-blue flex items-center gap-2 transition-all transform hover:scale-102 shrink-0"
        >
          <span>Start New Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Summary KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Designs Analyzed"
          value="5"
          subtitle="All standard benchmarks verified"
          icon={Cpu}
          color="blue"
          trend="100% active"
          trendType="up"
          onClick={() => navigate('/rtl-analysis')}
        />
        <StatCard
          title="Avg Final Coverage"
          value="95.6"
          unit="%"
          subtitle="Baseline improved from 71.6%"
          icon={ShieldCheck}
          color="emerald"
          trend="+24.0% via feedback"
          trendType="up"
          onClick={() => navigate('/verification')}
        />
        <StatCard
          title="Avg Power Saving"
          value="~16.2"
          unit="%"
          subtitle="Via Operand & Clock Gating"
          icon={Zap}
          color="cyan"
          trend="16.2% dynamic cut"
          trendType="up"
          onClick={() => navigate('/comparison')}
        />
        <StatCard
          title="Workflow Stages"
          value="7"
          subtitle="Analysis to Trade-Off Comparison"
          icon={Layers}
          color="violet"
          trend="Integrated loop"
          trendType="up"
        />
      </div>

      {/* Interactive 7-Stage Workflow Pipeline */}
      <WorkflowStepper currentStep="dashboard" />

      {/* Primary Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coverage Comparison Chart */}
        <ChartCard
          title="Verification Coverage: Initial vs Final AI Feedback"
          subtitle="Comparison of baseline coverage vs autonomous closed-loop test synthesis"
          badge="Coverage Driven"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={coverageChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                labelStyle={{ color: '#F8FAFC', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="initial" name="Initial Baseline (%)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="final" name="Final AI Feedback (%)" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Estimated Power Savings Chart */}
        <ChartCard
          title="Estimated Dynamic Power Savings by Design"
          subtitle="Illustrative dynamic switching reduction via RTL transformations"
          badge="Power-Aware RTL"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={powerSavingsData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
              <YAxis domain={[0, 25]} stroke="#64748B" fontSize={11} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                formatter={(val) => [`${val}%`, 'Power Saved']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="saving" name="Power Saving (%)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Designs Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold tracking-wide text-white">Recent Hardware Design Benchmark Runs</h3>
            <p className="text-xs text-slate-400">Click any row to open its detailed structural and verification analysis</p>
          </div>
          <button
            onClick={() => navigate('/rtl-analysis')}
            className="text-xs text-eda-accent hover:text-blue-400 font-medium flex items-center gap-1"
          >
            <span>View All in RTL Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <DataTable
          columns={columns}
          data={recentDesignsData}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Secondary Analytics: Activity & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Multi-Agent Pipeline Activity Cycles"
            subtitle="Autonomous actions executed across AST parse, TB generation, and simulation iterations"
            badge="Agent Telemetry"
          >
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={activityData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSim" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="cycle" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="simRuns" name="Simulation Executions" stroke="#10B981" fillOpacity={1} fill="url(#colorSim)" />
                <Area type="monotone" dataKey="tbGen" name="Testbenches Synthesized" stroke="#3B82F6" fillOpacity={1} fill="url(#colorTb)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div>
          <ChartCard
            title="Design Verification Status"
            subtitle="Pipeline stage completion across benchmark suite"
            badge="5 Designs"
          >
            <div className="flex flex-col items-center justify-center pt-2">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full space-y-1.5 pt-2 text-xs">
                {statusPieData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-mono font-semibold">{item.value}/5 (100%)</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
