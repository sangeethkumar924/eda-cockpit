import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gauge,
  Cpu,
  Zap,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
  TrendingDown
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
import { useApp } from '../context/AppContext';
import { SAMPLE_DESIGNS } from '../data/designs';
import { PPA_BENCHMARK_DATA, TECH_NODES, FREQUENCIES, DATA_WIDTHS } from '../data/ppa';
import { calculateErrorRate } from '../utils/calculations';

export default function PPAPrediction() {
  const navigate = useNavigate();
  const {
    activeDesign,
    selectDesign,
    state,
    setState,
    activePpaData,
    addToast
  } = useApp();

  const [isPredicting, setIsPredicting] = useState(false);
  const [hasPredicted, setHasPredicted] = useState(true);

  // Selected parameters
  const [techNode, setTechNode] = useState(state.selectedTechNode || '45nm');
  const [freq, setFreq] = useState(state.targetFrequency || '100');
  const [width, setWidth] = useState(state.dataWidth || '8');

  const selectedNodeObj = TECH_NODES.find(n => n.id === techNode) || TECH_NODES[0];

  const handlePredict = () => {
    setIsPredicting(true);
    setTimeout(() => {
      setIsPredicting(false);
      setHasPredicted(true);
      setState(prev => ({
        ...prev,
        selectedTechNode: techNode,
        targetFrequency: freq,
        dataWidth: width
      }));
      addToast({
        title: 'PPA Inference Generated',
        message: `Estimated metrics for ${activeDesign.shortName} at ${techNode} node (${freq} MHz).`,
        type: 'success'
      });
    }, 600);
  };

  // Grouped chart data for all 5 designs (Actual vs Predicted Power)
  const powerChartData = PPA_BENCHMARK_DATA.map(d => ({
    name: d.design,
    actual: d.actualPower,
    predicted: d.predictedPower,
    error: d.powerError
  }));

  // Grouped chart data for LUTs (Actual vs Predicted)
  const lutChartData = PPA_BENCHMARK_DATA.map(d => ({
    name: d.design,
    actual: d.actualLuts,
    predicted: d.predictedLuts,
    error: d.lutError
  }));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-eda-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Gauge className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              PPA Estimation & Feature Analysis
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Predict synthesis Power (W), Area (LUTs), and Critical Path Delay (ns) across standard technology nodes.
          </p>
        </div>

        {/* Prototype Static Notice */}
        <div className="flex items-center gap-2 bg-eda-card px-3 py-1.5 rounded-xl border border-eda-border text-xs text-slate-400">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Predefined Demonstration Dataset</span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Prediction Knobs & Feature Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-eda-card border border-eda-border shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-eda-border">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                PPA Model Inputs
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Inference Mode</span>
            </div>

            {/* Design Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Design Module</label>
              <select
                value={activeDesign.id}
                onChange={(e) => selectDesign(e.target.value)}
                className="w-full bg-eda-surface border border-eda-border text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-eda-accent cursor-pointer"
              >
                {SAMPLE_DESIGNS.filter(d => !d.faulty).map(d => (
                  <option key={d.id} value={d.id}>
                    {d.shortName} — {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Technology Node Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Technology Node & Cell Library</label>
              <select
                value={techNode}
                onChange={(e) => setTechNode(e.target.value)}
                className="w-full bg-eda-surface border border-eda-border text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-eda-accent cursor-pointer"
              >
                {TECH_NODES.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.name} (Vdd: {n.vdd})
                  </option>
                ))}
              </select>
            </div>

            {/* Clock Frequency */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Target Clock Frequency</label>
              <select
                value={freq}
                onChange={(e) => setFreq(e.target.value)}
                className="w-full bg-eda-surface border border-eda-border text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-eda-accent cursor-pointer"
              >
                {FREQUENCIES.map(f => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Data Bus Width */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Datapath Bus Width</label>
              <select
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full bg-eda-surface border border-eda-border text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-eda-accent cursor-pointer"
              >
                {DATA_WIDTHS.map(w => (
                  <option key={w.value} value={w.value}>
                    {w.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Feature Extraction Summary */}
            <div className="p-3.5 rounded-xl bg-eda-surface border border-eda-border space-y-2 text-xs">
              <span className="font-semibold text-slate-300 block mb-1">Synthesized Feature Vector</span>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>AST Complexity:</span>
                <span className="font-mono text-white">{activeDesign.complexity}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Registered Bits:</span>
                <span className="font-mono text-white">{activeDesign.registers} FF</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Operating Voltage:</span>
                <span className="font-mono text-cyan-400">{selectedNodeObj.vdd}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handlePredict}
              disabled={isPredicting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs tracking-wide shadow-lg glow-blue flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isPredicting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Evaluating Feature Regressors...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Predict PPA Metrics</span>
                </>
              )}
            </button>
          </div>

          {/* Prototype Scope Note */}
          <div className="p-4 rounded-2xl bg-eda-card/60 border border-eda-border text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-300">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Demonstration Dataset Scope</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              VISION-EDA demonstrates how predictive surrogate models can assist hardware architects prior to prolonged logic synthesis runs. The benchmark values displayed reflect static demonstration profiles.
            </p>
          </div>
        </div>

        {/* Right Column: Prediction Results & Charts (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Result Cards for Active Design */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Predicted Power"
              value={activePpaData.predictedPower}
              unit="W"
              subtitle={`Actual: ${activePpaData.actualPower} W`}
              icon={Zap}
              color="blue"
              trend={`${activePpaData.powerError}% Error`}
              trendType="up"
            />
            <StatCard
              title="Predicted Area (LUTs)"
              value={activePpaData.predictedLuts}
              unit="LUTs"
              subtitle={`Actual: ${activePpaData.actualLuts} LUTs`}
              icon={Layers}
              color="violet"
              trend={`${activePpaData.lutError}% Error`}
              trendType="up"
            />
            <StatCard
              title="Estimated Delay"
              value={activePpaData.predictedDelay}
              unit="ns"
              subtitle={`Actual: ${activePpaData.actualDelay} ns`}
              icon={Clock}
              color="cyan"
              trend={`${activePpaData.delayError}% Error`}
              trendType="up"
            />
          </div>

          {/* Power Comparison Bar Chart */}
          <ChartCard
            title="Surrogate Model Power Prediction vs Actual Synthesis (W)"
            subtitle="Evaluating prediction accuracy across all 5 benchmark designs (Average error < 5.5%)"
            badge="Benchmark Comparison"
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={powerChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis domain={[0, 1.0]} stroke="#64748B" fontSize={11} unit="W" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  formatter={(val, name) => [`${val} W`, name]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="actual" name="Actual Synthesis Power (W)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="predicted" name="Predicted Power (W)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* LUT Utilization Comparison Chart */}
          <ChartCard
            title="Area Utilization: Actual vs Predicted Standard Cell LUTs"
            subtitle="Comparing predicted logic gate count against post-mapping netlist"
            badge="Logic Synthesis Area"
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={lutChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis domain={[0, 250]} stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  formatter={(val, name) => [`${val} LUTs`, name]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="actual" name="Actual LUT Utilization" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="predicted" name="Predicted LUTs" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Action CTA */}
          <div className="p-4 rounded-2xl bg-eda-card border border-eda-border flex items-center justify-between">
            <div className="text-xs">
              <span className="font-semibold text-white">Optimize Dynamic Power Consumption</span>
              <p className="text-slate-400 text-[11px]">Evaluate clock gating and operand isolation optimizations on this design.</p>
            </div>
            <button
              onClick={() => navigate('/optimization')}
              className="px-4 py-2 rounded-xl bg-eda-accent hover:bg-blue-600 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <span>Explore RTL Optimization</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
