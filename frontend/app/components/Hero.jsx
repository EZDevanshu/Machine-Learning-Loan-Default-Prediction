'use client';

import { ShieldCheck, ArrowRight, Activity, Database, CheckCircle2, TrendingUp, BarChart2, Zap, Layers } from 'lucide-react';

export default function Hero() {
  const handleScroll = (id) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="pt-32 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-slatebg relative">
      {/* Background decoration grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Action CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-brand-600 text-brand-600" />
              <span>AI-Powered Loan Default Risk Assessment</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Predict Loan Default Risk with <span className="gradient-text">Machine Learning</span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
              Evaluate borrower risk using machine learning and make smarter lending decisions. Analyze financial, demographic, and credit metrics to estimate the probability of loan default.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => handleScroll('#assessment')}
                className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Assess Borrower</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleScroll('#pipeline')}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-sm border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4 text-brand-600" />
                <span>Explore Model</span>
              </button>
            </div>

            {/* Key Value Points */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">255K+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Borrower Records</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">17</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Predictive Features</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-brand-600">0 - 100%</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Risk Probability</div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual CSS + Lucide Illustration */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-3xl blur-xl opacity-20 animate-pulse-slow" />

              {/* Main Illustration Card */}
              <div className="relative rounded-2xl bg-white p-6 shadow-card border border-slate-200/90 space-y-6">
                
                {/* Header inside illustration */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Risk Analysis</h3>
                      <p className="text-[11px] text-slate-500 font-medium">Model Engine Active</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Model Ready
                  </span>
                </div>

                {/* Simulated Borrower Risk Score Ring Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 font-medium">Evaluated Default Risk</span>
                    <div className="text-2xl font-extrabold text-emerald-600 flex items-center gap-2">
                      18.4%
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        LOW RISK
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Credit Score: 740 | DTI: 28%</p>
                  </div>

                  {/* Circular visual progress representation */}
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-200"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-500"
                        strokeDasharray="18.4, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-bold text-slate-700">18%</span>
                  </div>
                </div>

                {/* Simulated Feature Breakdown Bars */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">Credit Score Standing</span>
                    <span className="font-semibold text-slate-900">Optimal (740)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[85%]" />
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">Debt-to-Income Burden</span>
                    <span className="font-semibold text-slate-900">Low (28%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full w-[35%]" />
                  </div>
                </div>

                {/* Floating summary chips */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1">
                    <Database className="w-3 h-3 text-brand-600" />
                    255K Dataset
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    17 Features
                  </span>
                </div>

              </div>

              {/* Floating Badge top right */}
              <div className="absolute -top-4 -right-4 bg-white px-3.5 py-2 rounded-xl shadow-lg border border-slate-200/80 flex items-center gap-2 text-xs font-bold text-slate-800 animate-float">
                <TrendingUp className="w-4 h-4 text-brand-600" />
                <span>Instant Risk Score</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
