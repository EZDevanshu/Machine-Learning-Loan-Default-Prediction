'use client';

import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Info, RefreshCw, DollarSign, Award, Percent, Layers } from 'lucide-react';

export default function RiskResult({ result, onReset }) {
  if (!result) return null;

  const { riskProbability, riskLevel, statusColor, badgeText, recommendation, keyFactors, recap } = result;

  // Determine color classes dynamically
  const colorStyles = {
    green: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      text: 'text-emerald-700',
      ring: 'text-emerald-500',
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      text: 'text-amber-700',
      ring: 'text-amber-500',
      icon: <AlertTriangle className="w-8 h-8 text-amber-600" />
    },
    red: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      badge: 'bg-rose-100 text-rose-800 border-rose-300',
      text: 'text-rose-700',
      ring: 'text-rose-500',
      icon: <XCircle className="w-8 h-8 text-rose-600" />
    }
  }[statusColor] || {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    badge: 'bg-slate-100 text-slate-800',
    text: 'text-slate-700',
    ring: 'text-brand-500',
    icon: <ShieldCheck className="w-8 h-8 text-brand-600" />
  };

  return (
    <div id="risk-result" className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Outer Card Container */}
      <div className={`rounded-2xl border ${colorStyles.border} bg-white shadow-xl overflow-hidden`}>
        
        {/* Top Header Banner */}
        <div className={`p-6 sm:p-8 ${colorStyles.bg} border-b ${colorStyles.border} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200/60">
              {colorStyles.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${colorStyles.badge}`}>
                  {badgeText}
                </span>
                {result.isLiveBackend ? (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    FastAPI ML Model Output
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 font-medium">Offline Engine Output</span>
                )}
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Assessment Outcome: <span className={colorStyles.text}>{riskLevel} RISK</span>
              </h3>
            </div>
          </div>

          {/* Reset / Re-assess Button */}
          <button
            onClick={onReset}
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 shadow-xs transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Modify Inputs</span>
          </button>
        </div>

        {/* Card Body Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Progress Ring & Probability */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50/80 rounded-2xl border border-slate-100 text-center space-y-4">
            
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={colorStyles.ring}
                  strokeDasharray={`${riskProbability}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {riskProbability}%
                </span>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Default Probability
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700">Calculated Risk Index</span>
              <p className="text-xs text-slate-500">
                Probability of default over loan lifetime based on submitted financial profile.
              </p>
            </div>
          </div>

          {/* Right Column: Recommendation & Key Factors */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Recommendation Box */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Model Recommendation & Insight
              </h4>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-800 font-medium leading-relaxed">
                {recommendation}
              </div>
            </div>

            {/* Key Inputs Recap Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Key Inputs Recap
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-brand-600" />
                    Credit Score
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-1">{recap.creditScore}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-brand-600" />
                    DTI Ratio
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-1">{recap.dtiRatio}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-brand-600" />
                    Loan Amount
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-1">{recap.loanAmount}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-brand-600" />
                    Income
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-1">{recap.income}</div>
                </div>

              </div>
            </div>

            {/* Contributing Key Drivers */}
            {keyFactors && keyFactors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Primary Risk Drivers
                </h4>
                <div className="flex flex-wrap gap-2">
                  {keyFactors.map((factor, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${
                        factor.positive
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {factor.positive ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      {factor.text}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer Model Information */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200/60 text-xs text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Info className="w-4 h-4 text-brand-600 shrink-0" />
            <span>
              <strong>Engine:</strong>{' '}
              <code className="bg-slate-200 px-2 py-0.5 rounded text-[11px] text-slate-800 font-mono font-bold">
                {result.modelUsed || result.engine || 'HistGradientBoosting (Best)'}
              </code>
            </span>

            {result.modelAccuracy && (
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                {result.modelAccuracy} Accuracy
              </span>
            )}

            {result.isBestModel && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[11px] border border-amber-200">
                ★ Best Performing
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/models"
              className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors underline"
            >
              Compare All 5 Models →
            </a>
            {result.evaluatedAt && (
              <span className="text-[11px] text-slate-400">
                {new Date(result.evaluatedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
