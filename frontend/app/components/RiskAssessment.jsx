'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, User, DollarSign, FileText, Loader2, Sparkles, Sliders, Check, HelpCircle, Wifi, WifiOff, Trophy, Cpu, Layers } from 'lucide-react';
import { predictBorrowerRisk, checkBackendHealth, fetchModelComparison, setActiveModel } from '../../utils/api';
import { PRESET_PROFILES, DEFAULT_MODELS_COMPARISON } from '../../data/mockData';
import RiskResult from './RiskResult';

export default function RiskAssessment() {
  // Pre-fill realistic sample values on initial load
  const [formData, setFormData] = useState({
    Age: 35,
    Education: "Bachelor's",
    MaritalStatus: "Single",
    HasDependents: "No",
    Income: 65000,
    CreditScore: 680,
    EmploymentType: "Full-time",
    MonthsEmployed: 42,
    HasMortgage: "Yes",
    LoanAmount: 25000,
    InterestRate: 9.5,
    LoanTerm: 36,
    LoanPurpose: "Auto",
    NumCreditLines: 4,
    DTIRatio: 0.35,
    HasCoSigner: "No"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [backendStatus, setBackendStatus] = useState({ checked: false, online: false, version: '' });
  const [selectedModelId, setSelectedModelId] = useState('best');
  const [availableModels, setAvailableModels] = useState(DEFAULT_MODELS_COMPARISON.models);
  const [bestModelId, setBestModelId] = useState('hist_gradient_boosting');

  // Probe FastAPI backend health and models comparison on mount
  useEffect(() => {
    let isMounted = true;
    async function checkHealthAndModels() {
      const res = await checkBackendHealth();
      if (isMounted) {
        setBackendStatus({
          checked: true,
          online: res.online,
          version: res.data?.version || '1.0.0'
        });
      }

      const compRes = await fetchModelComparison();
      if (isMounted && compRes?.models) {
        setAvailableModels(compRes.models);
        setBestModelId(compRes.bestModelId || 'hist_gradient_boosting');
        if (compRes.activeModelId) {
          setSelectedModelId(compRes.activeModelId);
        }
      }
    }
    checkHealthAndModels();
    return () => { isMounted = false; };
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleModelChange = async (newModelId) => {
    setSelectedModelId(newModelId);
    setPredictionResult(null);
    try {
      await setActiveModel(newModelId);
    } catch (e) {
      console.warn('Could not sync active model to backend:', e);
    }
  };

  const handlePresetSelect = (presetKey) => {
    if (PRESET_PROFILES[presetKey]) {
      setFormData(PRESET_PROFILES[presetKey]);
      setPredictionResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPredictionResult(null);

    const startTime = Date.now();
    try {
      const result = await predictBorrowerRisk(formData, selectedModelId);

      // Smooth UX transition
      const elapsed = Date.now() - startTime;
      if (elapsed < 350) {
        await new Promise(r => setTimeout(r, 350 - elapsed));
      }

      setPredictionResult(result);
    } catch (err) {
      console.error('Prediction submission error:', err);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        const el = document.getElementById('risk-result');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  return (
    <section id="assessment" className="py-16 md:py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold">
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Assessment Form</span>
            </div>

            {backendStatus.checked && (
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  backendStatus.online
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                {backendStatus.online ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>FastAPI ML Engine Connected (v{backendStatus.version})</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Local Engine Mode (Backend Offline)</span>
                  </>
                )}
              </div>
            )}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Loan Default Risk Assessment
          </h2>
          <p className="text-base text-slate-600 font-normal">
            Input borrower details across personal, financial, and loan parameter fieldsets to evaluate estimated default probability.
          </p>

          {/* Preset Buttons for Quick Demo Testing */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 font-medium mr-1">Quick Sample Presets:</span>
            <button
              type="button"
              onClick={() => handlePresetSelect('lowRisk')}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Low Risk Borrower
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('mediumRisk')}
              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-semibold transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Medium Risk Borrower
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('highRisk')}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              High Risk Borrower
            </button>
          </div>
        </div>

        {/* Prediction Engine Selector Banner */}
        <div className="max-w-5xl mx-auto mb-6 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Prediction Engine</span>
                {selectedModelId === 'best' ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    ★ Auto Best Model Active
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                    Custom Model Active
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>
                  {availableModels.find(m => m.id === (selectedModelId === 'best' ? bestModelId : selectedModelId))?.name || 'HistGradientBoosting'}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {availableModels.find(m => m.id === (selectedModelId === 'best' ? bestModelId : selectedModelId))?.accuracyPercentage || '88.69%'} Accuracy
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <label className="text-xs font-semibold text-slate-500">Active Algorithm:</label>
            <select
              value={selectedModelId}
              onChange={(e) => handleModelChange(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
            >
              <option value="best">🏆 Use Best Model (Auto: 88.69%)</option>
              {availableModels.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.accuracyPercentage} {m.isBest ? '• Best' : ''})
                </option>
              ))}
            </select>

            <a
              href="/models"
              className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors ml-1 underline flex items-center gap-1"
            >
              <span>Compare All 5 Models →</span>
            </a>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-5xl mx-auto bg-slatebg p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* GROUP 1: Personal Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Group 1 — Personal Information</h3>
                  <p className="text-xs text-slate-500 font-medium">Demographic and household metrics</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Age */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    required
                    value={formData.Age}
                    onChange={(e) => handleChange('Age', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  />
                </div>

                {/* Education */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Education Level
                  </label>
                  <select
                    value={formData.Education}
                    onChange={(e) => handleChange('Education', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  >
                    <option value="High School">High School</option>
                    <option value="Bachelor's">Bachelor's</option>
                    <option value="Master's">Master's</option>
                    <option value="Doctorate">Doctorate</option>
                  </select>
                </div>

                {/* MaritalStatus */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    value={formData.MaritalStatus}
                    onChange={(e) => handleChange('MaritalStatus', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>

                {/* HasDependents */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Has Dependents
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-white p-1 rounded-xl border border-slate-300">
                    {['No', 'Yes'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChange('HasDependents', opt)}
                        className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          formData.HasDependents === opt
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* GROUP 2: Financial Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Group 2 — Financial Information</h3>
                  <p className="text-xs text-slate-500 font-medium">Income, credit history, and employment stability</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Income */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Annual Income ($)
                  </label>
                  <input
                    type="number"
                    min="10000"
                    step="1000"
                    required
                    value={formData.Income}
                    onChange={(e) => handleChange('Income', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  />
                </div>

                {/* CreditScore */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
                    <span>Credit Score (300 - 850)</span>
                    <span className="text-[11px] font-semibold text-brand-600">
                      {formData.CreditScore} FICO
                    </span>
                  </label>
                  <input
                    type="number"
                    min="300"
                    max="850"
                    required
                    value={formData.CreditScore}
                    onChange={(e) => handleChange('CreditScore', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  />
                </div>

                {/* EmploymentType */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Employment Type
                  </label>
                  <select
                    value={formData.EmploymentType}
                    onChange={(e) => handleChange('EmploymentType', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Self-employed">Self-employed</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                </div>

                {/* MonthsEmployed */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Months Employed
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="600"
                    required
                    value={formData.MonthsEmployed}
                    onChange={(e) => handleChange('MonthsEmployed', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  />
                </div>

                {/* HasMortgage */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Has Mortgage
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-white p-1 rounded-xl border border-slate-300">
                    {['No', 'Yes'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChange('HasMortgage', opt)}
                        className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          formData.HasMortgage === opt
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* GROUP 3: Loan Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Group 3 — Loan Information</h3>
                  <p className="text-xs text-slate-500 font-medium">Loan terms, APR, DTI ratio, and co-signer details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* LoanAmount */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Loan Amount ($)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={formData.LoanAmount}
                    onChange={(e) => handleChange('LoanAmount', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  />
                </div>

                {/* InterestRate */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="35"
                    step="0.1"
                    required
                    value={formData.InterestRate}
                    onChange={(e) => handleChange('InterestRate', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  />
                </div>

                {/* LoanTerm */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Loan Term (Months)
                  </label>
                  <select
                    value={formData.LoanTerm}
                    onChange={(e) => handleChange('LoanTerm', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  >
                    <option value={12}>12 Months (1 Year)</option>
                    <option value={24}>24 Months (2 Years)</option>
                    <option value={36}>36 Months (3 Years)</option>
                    <option value={48}>48 Months (4 Years)</option>
                    <option value={60}>60 Months (5 Years)</option>
                  </select>
                </div>

                {/* LoanPurpose */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Loan Purpose
                  </label>
                  <select
                    value={formData.LoanPurpose}
                    onChange={(e) => handleChange('LoanPurpose', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  >
                    <option value="Auto">Auto</option>
                    <option value="Business">Business</option>
                    <option value="Education">Education</option>
                    <option value="Home Improvement">Home Improvement</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                {/* NumCreditLines */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Num Credit Lines
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={formData.NumCreditLines}
                    onChange={(e) => handleChange('NumCreditLines', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  />
                </div>

                {/* DTIRatio */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
                    <span>DTI Ratio (0.0 - 1.0)</span>
                    <span className="text-[11px] font-semibold text-brand-600">
                      {(formData.DTIRatio * 100).toFixed(0)}% DTI
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    required
                    value={formData.DTIRatio}
                    onChange={(e) => handleChange('DTIRatio', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                  />
                </div>

                {/* HasCoSigner */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Has Co-Signer
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-white p-1 rounded-xl border border-slate-300">
                    {['No', 'Yes'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChange('HasCoSigner', opt)}
                        className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          formData.HasCoSigner === opt
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Form Submit Action */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
                * Note: Identifier field <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px] font-mono">LoanID</code> excluded as per ML dataset contract.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-base shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/35 transition-all flex items-center justify-center gap-3 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing Borrower Profile...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                    <span>Analyze Default Risk</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Prediction Outcome Revealed Here */}
        {predictionResult && (
          <RiskResult
            result={predictionResult}
            onReset={() => setPredictionResult(null)}
          />
        )}

      </div>
    </section>
  );
}
