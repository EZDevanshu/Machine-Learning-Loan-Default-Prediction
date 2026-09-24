'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, 
  BarChart3, Activity, Cpu, Zap, ArrowLeft, RefreshCw, Layers, Check, Info
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell 
} from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchModelComparison, setActiveModel } from '../../utils/api';
import { DEFAULT_MODELS_COMPARISON } from '../../data/mockData';

export default function ModelsPage() {
  const [comparisonData, setComparisonData] = useState(DEFAULT_MODELS_COMPARISON);
  const [activeModelId, setActiveModelId] = useState('best');
  const [activeModelName, setActiveModelName] = useState('HistGradientBoosting (Auto Best)');
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('accuracy');

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const data = await fetchModelComparison();
      if (isMounted && data) {
        setComparisonData(data);
        setActiveModelId(data.activeModelId || 'best');
        setActiveModelName(data.activeModelName || 'HistGradientBoosting (Auto Best)');
      }
      if (isMounted) setIsLoading(false);
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleSelectModel = async (modelId, modelName) => {
    setActionMessage(`Switching active engine to ${modelName}...`);
    try {
      const res = await setActiveModel(modelId);
      setActiveModelId(modelId);
      setActiveModelName(res.activeModelName || modelName);
      
      // Update local comparisonData models list isActive flag
      setComparisonData(prev => ({
        ...prev,
        activeModelId: modelId,
        activeModelName: res.activeModelName || modelName,
        models: prev.models.map(m => ({
          ...m,
          isActive: (modelId === 'best' ? m.isBest : m.id === modelId)
        }))
      }));

      setActionMessage(`Active prediction model successfully updated to ${res.activeModelName || modelName}!`);
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err) {
      console.error('Error switching model:', err);
      setActionMessage('Failed to update active model.');
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const models = comparisonData?.models || [];
  const bestModel = models.find(m => m.isBest) || models[0] || {};

  // Chart data
  const chartData = models.map(m => ({
    name: m.name,
    Accuracy: Number((m.accuracy * 100).toFixed(2)),
    "ROC-AUC": Number((m.rocAuc * 100).toFixed(2)),
    Precision: Number((m.precision * 100).toFixed(2)),
    Recall: Number((m.recall * 100).toFixed(2)),
    isBest: m.isBest,
    isActive: (activeModelId === 'best' ? m.isBest : m.id === activeModelId)
  }));

  const getRankBadge = (rank) => {
    if (rank === 1) return { bg: 'bg-amber-100 text-amber-800 border-amber-300', label: '1st (Best)', icon: Trophy };
    if (rank === 2) return { bg: 'bg-slate-100 text-slate-700 border-slate-300', label: '2nd', icon: null };
    if (rank === 3) return { bg: 'bg-orange-100 text-orange-800 border-orange-300', label: '3rd', icon: null };
    return { bg: 'bg-slate-50 text-slate-600 border-slate-200', label: `${rank}th`, icon: null };
  };

  return (
    <main className="min-h-screen bg-slatebg flex flex-col">
      <Navbar />

      <div className="pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Breadcrumb & Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link 
              href="/#assessment" 
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Loan Risk Assessment</span>
            </Link>

            {/* Notification message toast */}
            {actionMessage && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold animate-fade-in shadow-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{actionMessage}</span>
              </div>
            )}
          </div>

          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Multi-Model AI Benchmark Suite</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Machine Learning Model Leaderboard
            </h1>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Compare performance metrics across 5 distinct algorithms evaluated on 
              <span className="font-semibold text-slate-800"> 255,347 institutional records</span> with 
              a 20% holdout test partition (51,070 samples). Select any model below to immediately power all live risk predictions.
            </p>
          </div>

          {/* Active Model & Best Model Status Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
            <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              
              {/* Left Column: Trophy & Best Model Highlight */}
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    Overall Champion (#1)
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live Engine Active: {activeModelName}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                  {bestModel.name || 'HistGradientBoosting'}
                  <span className="text-base sm:text-lg font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                    {bestModel.accuracyPercentage || '88.69%'} Accuracy
                  </span>
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {bestModel.description || 'Highest discriminative AUC and classification accuracy across validation partitions.'}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {bestModel.strengths?.map((s, idx) => (
                    <span key={idx} className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-white/10 text-slate-200 border border-white/10">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Quick Activation Controls */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSelectModel('best', `${bestModel.name || 'HistGradientBoosting'} (Auto Best)`)}
                  className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                    activeModelId === 'best'
                      ? 'bg-emerald-500 text-white cursor-default ring-2 ring-emerald-400/50'
                      : 'bg-white text-slate-900 hover:bg-slate-100 hover:scale-[1.02]'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>{activeModelId === 'best' ? 'Active: Using Best Model' : 'Use Best Model (Recommended)'}</span>
                </button>

                <Link
                  href="/#assessment"
                  className="px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-600/80 hover:bg-indigo-600 text-white border border-indigo-400/30 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Test on Borrower Form</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>

          {/* Leaderboard Table Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-brand-600" />
                  <span>Performance Leaderboard</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Models sorted by Accuracy and ROC-AUC score on 51,070 validation records.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSelectModel('best', `${bestModel.name} (Auto Best)`)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                    activeModelId === 'best'
                      ? 'bg-brand-50 text-brand-700 border-brand-200 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Auto Best
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4 sm:px-6">Rank & Model</th>
                    <th className="py-3.5 px-3">Type</th>
                    <th className="py-3.5 px-3 text-right">Accuracy</th>
                    <th className="py-3.5 px-3 text-right">ROC-AUC</th>
                    <th className="py-3.5 px-3 text-right">Precision</th>
                    <th className="py-3.5 px-3 text-right">Recall</th>
                    <th className="py-3.5 px-3 text-right">F1 Score</th>
                    <th className="py-3.5 px-3 text-right">Speed</th>
                    <th className="py-3.5 px-4 sm:px-6 text-center">Prediction Engine</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {models.map((model) => {
                    const isCurrent = activeModelId === 'best' ? model.isBest : activeModelId === model.id;
                    const rankMeta = getRankBadge(model.rank);

                    return (
                      <tr 
                        key={model.id}
                        className={`transition-colors hover:bg-slate-50/60 ${
                          isCurrent ? 'bg-indigo-50/40 font-medium' : ''
                        }`}
                      >
                        {/* Rank & Name */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold border shrink-0 ${rankMeta.bg}`}>
                              {model.rank}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">{model.name}</span>
                                {model.isBest && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                    ★ Best
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 line-clamp-1">
                                {model.bestFor}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="py-4 px-3 text-slate-600 text-xs">
                          {model.type}
                        </td>

                        {/* Accuracy */}
                        <td className="py-4 px-3 text-right">
                          <span className={`font-mono font-bold text-sm ${
                            model.isBest ? 'text-emerald-700' : 'text-slate-900'
                          }`}>
                            {model.accuracyPercentage}
                          </span>
                        </td>

                        {/* ROC-AUC */}
                        <td className="py-4 px-3 text-right font-mono font-medium text-slate-700">
                          {model.rocAuc?.toFixed(4)}
                        </td>

                        {/* Precision */}
                        <td className="py-4 px-3 text-right font-mono text-slate-600">
                          {((model.precision || 0) * 100).toFixed(1)}%
                        </td>

                        {/* Recall */}
                        <td className="py-4 px-3 text-right font-mono text-slate-600">
                          {((model.recall || 0) * 100).toFixed(1)}%
                        </td>

                        {/* F1 */}
                        <td className="py-4 px-3 text-right font-mono text-slate-600">
                          {((model.f1Score || 0) * 100).toFixed(1)}%
                        </td>

                        {/* Latency */}
                        <td className="py-4 px-3 text-right text-slate-500 font-mono text-[11px]">
                          {model.latencyMs}ms
                        </td>

                        {/* Active Selector Action */}
                        <td className="py-4 px-4 sm:px-6 text-center">
                          {isCurrent ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSelectModel(model.id, model.name)}
                              className="px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-300 transition-all shadow-2xs"
                            >
                              Set as Active
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Metric Comparison Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <span>Comparative Accuracy & ROC-AUC Chart</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Side-by-side benchmark comparison across all 5 candidate models.
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">
                <button
                  type="button"
                  onClick={() => setSelectedMetric('accuracy')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    selectedMetric === 'accuracy' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
                  }`}
                >
                  Accuracy & AUC
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMetric('precisionRecall')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    selectedMetric === 'precisionRecall' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
                  }`}
                >
                  Precision & Recall
                </button>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis 
                    domain={selectedMetric === 'accuracy' ? [50, 100] : [0, 80]}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    unit="%"
                  />
                  <Tooltip 
                    formatter={(val) => [`${val}%`]}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  {selectedMetric === 'accuracy' ? (
                    <>
                      <Bar dataKey="Accuracy" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Accuracy (%)" />
                      <Bar dataKey="ROC-AUC" fill="#06b6d4" radius={[6, 6, 0, 0]} name="ROC-AUC (%)" />
                    </>
                  ) : (
                    <>
                      <Bar dataKey="Precision" fill="#10b981" radius={[6, 6, 0, 0]} name="Precision (%)" />
                      <Bar dataKey="Recall" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Recall (%)" />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Deep-Dive Model Architecture Cards */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Model Architectural Overview</h3>
              <p className="text-xs text-slate-500">Technical summary of each algorithm implemented in the LoanGuard engine.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((m) => {
                const isCurrent = activeModelId === 'best' ? m.isBest : activeModelId === m.id;

                return (
                  <div 
                    key={m.id}
                    className={`bg-white rounded-2xl p-6 border transition-all shadow-soft flex flex-col justify-between ${
                      isCurrent 
                        ? 'border-indigo-400 ring-2 ring-indigo-500/20 shadow-md' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Rank #{m.rank}
                        </span>
                        {m.isBest && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            ★ Top Score
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{m.name}</h4>
                        <p className="text-xs font-medium text-brand-600">{m.type}</p>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {m.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Validation Accuracy:</span>
                          <span className="font-bold text-slate-900 font-mono">{m.accuracyPercentage}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">ROC-AUC Benchmark:</span>
                          <span className="font-semibold text-slate-800 font-mono">{m.rocAuc?.toFixed(4)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Inference Latency:</span>
                          <span className="font-medium text-slate-600 font-mono">{m.latencyMs}ms/req</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Strengths</p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.strengths?.map((s, i) => (
                            <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 mt-4 border-t border-slate-100">
                      {isCurrent ? (
                        <div className="w-full py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Active Prediction Engine</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSelectModel(m.id, m.name)}
                          className="w-full py-2 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-xs"
                        >
                          Use {m.name} for Prediction
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Ready to assess loan risk?
              </h3>
              <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
                The selected engine ({activeModelName}) will calibrate borrower probabilities and output risk factors in real-time.
              </p>
            </div>

            <Link
              href="/#assessment"
              className="px-6 py-3.5 rounded-xl bg-white text-brand-700 font-bold text-sm hover:bg-indigo-50 transition-all shrink-0 flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Go to Risk Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
