'use client';

import { ShieldCheck, ArrowUp, Github, Sparkles, Layers, Info } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Branding & Subtext */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  LoanGuard <span className="text-brand-400">AI</span>
                </span>
                <p className="text-[11px] font-medium text-slate-400 leading-none mt-0.5">
                  ML Risk Intelligence Engine
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-normal leading-relaxed max-w-sm">
              Machine Learning based Loan Default Risk Assessment platform. Evaluate borrower financial capacity, credit metrics, and loan risk probability in real time.
            </p>

            <div className="flex items-center gap-2 text-xs text-brand-400 font-semibold bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>College ML Project Showcase Demo</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="hover:text-white transition-colors">
                  Dashboard Overview
                </a>
              </li>
              <li>
                <a href="#assessment" onClick={(e) => handleNavClick(e, '#assessment')} className="hover:text-white transition-colors">
                  Borrower Risk Assessment
                </a>
              </li>
              <li>
                <a href="#insights" onClick={(e) => handleNavClick(e, '#insights')} className="hover:text-white transition-colors">
                  Dataset Insights
                </a>
              </li>
              <li>
                <a href="#analytics" onClick={(e) => handleNavClick(e, '#analytics')} className="hover:text-white transition-colors">
                  Visual Analytics
                </a>
              </li>
              <li>
                <a href="#performance" onClick={(e) => handleNavClick(e, '#performance')} className="hover:text-white transition-colors">
                  Model Performance
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Tech Stack & Architecture */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Tech Stack</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                Next.js 14 App Router
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                React 18
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                Tailwind CSS
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                Recharts
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                Lucide React
              </span>
            </div>

            <div className="pt-2 text-xs text-amber-400/90 flex items-start gap-2 bg-amber-950/40 p-3 rounded-xl border border-amber-900/50">
              <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                <strong>Frontend prototype</strong> — ML model integration coming next.
              </span>
            </div>
          </div>

        </div>

        {/* Bottom copyright & back to top button */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LoanGuard AI. Built for ML Loan Default Risk Prediction.</p>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-2 font-semibold"
            aria-label="Back to Top"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
