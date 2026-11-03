import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Zap,
  Layers,
  Clock,
  TrendingDown,
  Filter,
  ArrowRight,
  ShieldCheck,
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
import DataTable from '../components/common/DataTable';
import { useApp } from '../context/AppContext';
import { OPTIMIZATION_COMPARISON_DATA } from '../data/optimization';
import { calculatePowerSaving, calculateLutReduction, formatPower, formatDelay } from '../utils/calculations';

export default function ResultsComparison() {
  const navigate = useNavigate();
  const { selectDesign } = useApp();
  const [filterDesign, setFilterDesign] = useState('all');

  // Compute exact dynamic percentages and LUT reductions
  const processedData = OPTIMIZATION_COMPARISON_DATA.map(item => {
    const powerSavingPct = calculatePowerSaving(item.originalPower, item.optimizedPower);
    const lutReductionPct = calculateLutReduction(item.originalLuts, item.optimizedLuts);
    return {
      ...item,
      powerSavingPct,
      lutReductionPct
    };
  });

  // Filtered dataset
  const filteredData = filterDesign === 'all'
    ? processedData
    : processedData.filter(d => d.designId === filterDesign);

  // Overall averages across all designs
  const totalOrigPower = processedData.reduce((acc, d) => acc + d.originalPower, 0);
  const totalOptPower = processedData.reduce((acc, d) => acc + d.optimizedPower, 0);
  const avgPowerSaving = calculatePowerSaving(totalOrigPower, totalOptPower);

  const totalOrigLuts = processedData.reduce((acc, d) => acc + d.originalLuts, 0);
  const totalOptLuts = processedData.reduce((acc, d) => acc + d.optimizedLuts, 0);
  const avgLutReduction = calculateLutReduction(totalOrigLuts, totalOptLuts);

  // Chart datasets
  const powerComparisonChart = filteredData.map(d => ({
    name: d.design,
    Original: d.originalPower,
    Optimized: d.optimizedPower,
    SavingPct: d.powerSavingPct
  }));

  const lutComparisonChart = filteredData.map(d => ({
    name: d.design,
    Original: d.originalLuts,
    Optimized: d.optimizedLuts,
    ReductionPct: d.lutReductionPct
  }));

  const delayComparisonChart = filteredData.map(d => ({
    name: d.design,
    Original: d.originalDelay,
    Optimized: d.optimizedDelay
  }));

  const columns = [
    {
      header: 'Design Module',
      accessor: 'design',
      render: (row) => (
        <div>
          <div className="font-bold text-white">{row.design}</div>
          <div className="text-[10px] text-slate-400">{row.targetTechnique}</div>
        </div>
      )
    },
    {
      header: 'Original Power (W)',
      accessor: 'originalPower',
      render: (row) => <span className="font-mono text-slate-300">{formatPower(row.originalPower)}</span>
    },
    {
      header: 'Optimized Power (W)',
      accessor: 'optimizedPower',
      render: (row) => <span className="font-mono font-semibold text-emerald-400">{formatPower(row.optimizedPower)}</span>
    },
    {
      header: 'Original LUTs',
      accessor: 'originalLuts',
      render: (row) => <span className="font-mono text-slate-300">{row.originalLuts}</span>
    },
    {
      header: 'Optimized LUTs',
      accessor: 'optimizedLuts',
      render: (row) => <span className="font-mono font-semibold text-cyan-400">{row.optimizedLuts}</span>
    },
    {
      header: 'Dynamically Computed Power Saving',
      accessor: 'powerSavingPct',
      render: (row) => (
        <span className="font-mono font-extrabold text-blue-400 flex items-center gap-1">
          <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
          {row.powerSavingPct}%
        </span>
      )
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            selectDesign(row.designId);
            navigate('/optimization');
          }}
          className="text-xs text-eda-accent hover:underline font-semibold"
        >
          View RTL Diff
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-eda-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-blue-500/10 text-eda-accent border border-blue-500/20">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Results & Benchmark Trade-Off Comparison
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quantitative before-and-after audit across dynamic switching power, standard cell area, and propagation delay.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 bg-eda-card px-3 py-1.5 rounded-xl border border-eda-border text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Filter:</span>
          <select
            value={filterDesign}
            onChange={(e) => setFilterDesign(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-eda-surface">All 5 Benchmark Modules</option>
            <option value="alu" className="bg-eda-surface">ALU Only</option>
            <option value="counter" className="bg-eda-surface">Counter Only</option>
            <option value="uart" className="bg-eda-surface">UART Only</option>
            <option value="fifo" className="bg-eda-surface">FIFO Only</option>
            <option value="fsm" className="bg-eda-surface">FSM Only</option>
          </select>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Average Power Reduction"
          value={avgPowerSaving}
          unit="%"
          subtitle={`Computed: ((${totalOrigPower.toFixed(2)} - ${totalOptPower.toFixed(2)}) / ${totalOrigPower.toFixed(2)}) * 100`}
          icon={Zap}
          color="emerald"
          trend={`${avgPowerSaving}% Dynamic Cut`}
          trendType="up"
        />
        <StatCard
          title="Area Logic Pruning"
          value={avgLutReduction}
          unit="%"
          subtitle={`Reduced from ${totalOrigLuts} to ${totalOptLuts} total LUTs`}
          icon={Layers}
          color="blue"
          trend="Pruned dead paths"
          trendType="up"
        />
        <StatCard
          title="Critical Path Impact"
          value="+0.04"
          unit="ns"
          subtitle="Minimal mux insertion penalty on delay"
          icon={Clock}
          color="cyan"
          trend="< 1.8% delay change"
          trendType="up"
        />
      </div>

      {/* Benchmark Data Table with exact dynamic calculation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-wide">
            Before vs After Benchmark Metrics Table
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Formula: ((Orig - Opt) / Orig) * 100
          </span>
        </div>

        <DataTable
          columns={columns}
          data={filteredData}
        />
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Power Before vs After */}
        <ChartCard
          title="Dynamic Power (W): Original vs Optimized"
          subtitle="Direct comparison showing significant switching power reductions"
          badge="Power (W)"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={powerComparisonChart} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
              <YAxis domain={[0, 1.0]} stroke="#64748B" fontSize={11} unit="W" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                formatter={(val, name) => [`${val} W`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Original" name="Original RTL Power (W)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Optimized" name="Optimized RTL Power (W)" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* LUT Utilization Before vs After */}
        <ChartCard
          title="Standard Cell LUT Utilization: Before vs After"
          subtitle="Area overhead or reduction after clock gating cell insertion & operand isolation"
          badge="LUT Count"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={lutComparisonChart} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
              <YAxis domain={[0, 250]} stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                formatter={(val, name) => [`${val} LUTs`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Original" name="Original LUTs" fill="#64748B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Optimized" name="Optimized LUTs" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Delay Comparison Bar Chart */}
      <ChartCard
        title="Critical Path Delay (ns) Impact Analysis"
        subtitle="Verifying that power reduction optimizations preserve timing closure budgets"
        badge="Timing Margin"
      >
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={delayComparisonChart} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
            <YAxis domain={[0, 4.0]} stroke="#64748B" fontSize={11} unit="ns" />
            <Tooltip
              contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
              formatter={(val, name) => [`${val} ns`, name]}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Bar dataKey="Original" name="Original Delay (ns)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Optimized" name="Optimized Delay (ns)" fill="#06B6D4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Action to Reports */}
      <div className="p-4 rounded-2xl bg-eda-card border border-eda-border flex items-center justify-between">
        <div className="text-xs">
          <span className="font-semibold text-white">Generate Sign-Off Engineering Report</span>
          <p className="text-slate-400 text-[11px]">Compile complete metrics into an exportable PDF, CSV, or JSON design dossier.</p>
        </div>
        <button
          onClick={() => navigate('/reports')}
          className="px-4 py-2 rounded-xl bg-eda-accent hover:bg-blue-600 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all"
        >
          <span>Generate Full Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
