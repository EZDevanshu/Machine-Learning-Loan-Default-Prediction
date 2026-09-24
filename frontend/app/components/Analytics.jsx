'use client';

import { useState } from 'react';
import { BarChart3, PieChart as PieIcon, TrendingUp, ScatterChart as ScatterIcon, Layers } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import {
  DEFAULT_DISTRIBUTION,
  CREDIT_SCORE_DISTRIBUTION,
  INCOME_VS_LOAN,
  LOAN_AMOUNT_DEFAULT,
  EMPLOYMENT_VS_DEFAULT
} from '../../data/mockData';

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-800 text-xs space-y-1">
        <p className="font-bold text-slate-200">{label || payload[0].name}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-slate-300 flex items-center justify-between gap-4">
            <span style={{ color: entry.color || '#818cf8' }}>{entry.name}:</span>
            <span className="font-semibold text-white">
              {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
              {entry.unit || ''}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('ALL');

  return (
    <section id="analytics" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Exploratory Visual Analytics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Visual Feature Analytics
          </h2>
          <p className="text-base text-slate-600 font-normal">
            Statistical distributions and feature correlations derived from historical borrower data.
          </p>
        </div>

        {/* Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* CHART A: Default Distribution (Donut Chart) */}
          <div className="bg-slatebg p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <PieIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">A. Target Class Distribution</h3>
                  <p className="text-xs text-slate-500 font-medium">Non-Default vs Default Ratio</p>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-white rounded-md border border-slate-200 text-slate-600">
                255K Records
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DEFAULT_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {DEFAULT_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry) => (
                      <span className="text-xs font-semibold text-slate-700">{value} ({entry.payload.percentage}%)</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 text-center pt-1 border-t border-slate-200/60">
              Dataset exhibits an imbalanced ~78.4% Non-Default vs 21.6% Default distribution ratio.
            </p>
          </div>

          {/* CHART B: Credit Score Distribution */}
          <div className="bg-slatebg p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">B. Credit Score Tiers vs Default Rate</h3>
                  <p className="text-xs text-slate-500 font-medium">FICO score brackets vs default percentage</p>
                </div>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CREDIT_SCORE_DISTRIBUTION}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="bucket" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis unit="%" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="defaultRate" name="Default Rate (%)" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 text-center pt-1 border-t border-slate-200/60">
              Strong negative correlation: Default rate drops from 42.8% in poor credit tier to 2.8% in top tier.
            </p>
          </div>

          {/* CHART C: Income vs Loan Amount Scatter Plot */}
          <div className="bg-slatebg p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                  <ScatterIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">C. Income vs Loan Amount Scatter</h3>
                  <p className="text-xs text-slate-500 font-medium">Borrower financial capacity mapping</p>
                </div>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="income" name="Annual Income" unit="$" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis dataKey="loanAmount" name="Loan Amount" unit="$" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <ZAxis range={[60, 60]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Borrowers" data={INCOME_VS_LOAN} fill="#6366f1" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 text-center pt-1 border-t border-slate-200/60">
              Higher loan amounts combined with lower annual income significantly increase default risk.
            </p>
          </div>

          {/* CHART D: Loan Amount Tiers vs Default Rate */}
          <div className="bg-slatebg p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">D. Loan Amount Tier vs Default Rate</h3>
                  <p className="text-xs text-slate-500 font-medium">Principal size impact on default probability</p>
                </div>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={LOAN_AMOUNT_DEFAULT}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="tier" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis unit="%" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="averageDefaultRate" name="Avg Default Rate (%)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 text-center pt-1 border-t border-slate-200/60">
              Loans over $80K display higher default rates (38.6%) compared to smaller micro-loans (14.5%).
            </p>
          </div>

        </div>

        {/* CHART E: Employment Type vs Default Rate (Full Width) */}
        <div className="mt-8 bg-slatebg p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">E. Employment Type Breakdown & Default Comparison</h3>
                <p className="text-xs text-slate-500 font-medium">Job category default rates across dataset cohorts</p>
              </div>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EMPLOYMENT_VS_DEFAULT} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" unit="%" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="employment" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="nonDefaultRate" name="Non-Default Rate (%)" fill="#10b981" radius={[0, 4, 4, 0]} />
                <Bar dataKey="defaultRate" name="Default Rate (%)" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 text-center pt-1 border-t border-slate-200/60">
            Unemployed status correlates with highest default probability (46.4%), whereas Full-time employment shows lowest default rate (16.2%).
          </p>
        </div>

      </div>
    </section>
  );
}
