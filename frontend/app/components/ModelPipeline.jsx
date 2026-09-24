'use client';

import { Layers, FileInput, Settings2, Sparkles, Cpu, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';

export default function ModelPipeline() {
  const steps = [
    {
      num: '01',
      title: 'Data Input',
      icon: <FileInput className="w-6 h-6 text-brand-600" />,
      description: 'Raw demographic, financial, and loan parameters provided via frontend form or API payload.',
      details: 'Accepts 16 attributes including Credit Score, Income, Loan Amount, and DTI Ratio.'
    },
    {
      num: '02',
      title: 'Preprocessing',
      icon: <Settings2 className="w-6 h-6 text-indigo-600" />,
      description: 'Validation, missing value imputation, and outlier detection across continuous variables.',
      details: 'Ensures numerical parameters adhere to plausible range bounds.'
    },
    {
      num: '03',
      title: 'Feature Transformation',
      icon: <Sparkles className="w-6 h-6 text-violet-600" />,
      description: 'One-hot encoding for categorical variables and Standard/MinMax scaling for numerical inputs.',
      details: 'Transforms raw inputs into normalized mathematical vectors.'
    },
    {
      num: '04',
      title: 'Model Prediction',
      icon: <Cpu className="w-6 h-6 text-emerald-600" />,
      description: 'Vector passed into binary classification model engine to generate probabilistic default score.',
      details: 'Outputs raw probability estimation score between 0.00 and 1.00.'
    },
    {
      num: '05',
      title: 'Risk Classification',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-700" />,
      description: 'Score categorized into LOW, MEDIUM, or HIGH risk tiers with structured recommendations.',
      details: 'Generates decision report, progress ring visualization, and key risk indicators.'
    }
  ];

  return (
    <section id="pipeline" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Machine Learning Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How The Model Works
          </h2>
          <p className="text-base text-slate-600 font-normal leading-relaxed">
            Borrower information is transformed into model-ready features and passed through a classification model to estimate default risk.
          </p>
        </div>

        {/* Step-by-Step Pipeline Flow */}
        <div className="relative">
          
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-200 via-indigo-200 to-emerald-200 -translate-y-6 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((step, idx) => (
              <div
                key={step.num}
                className="bg-slatebg rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold text-slate-400 font-mono group-hover:text-brand-600 transition-colors">
                      STEP {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">{step.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 font-medium leading-normal flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{step.details}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Summary Caption Banner */}
        <div className="mt-12 max-w-4xl mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-600 font-medium">
          💡 <strong>Pipeline Summary:</strong> Borrower attributes undergo standardization and encoding before inference. The prediction outcome is returned in real time with transparent risk factors.
        </div>

      </div>
    </section>
  );
}
