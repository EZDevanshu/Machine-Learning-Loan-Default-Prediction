'use client';

import { useState } from 'react';
import { Database, FileSpreadsheet, Layers, Target, CheckCircle2, AlertTriangle, Search, Filter } from 'lucide-react';
import { SAMPLE_DATASET } from '../../data/mockData';

export default function DatasetInsights() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDefault, setFilterDefault] = useState('ALL');

  // Filter sample rows based on search input & target dropdown
  const filteredRows = SAMPLE_DATASET.filter((row) => {
    const matchesSearch =
      row.LoanID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.Education.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.EmploymentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.LoanPurpose.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterDefault === 'DEFAULT') return matchesSearch && row.Default === 1;
    if (filterDefault === 'NON_DEFAULT') return matchesSearch && row.Default === 0;
    return matchesSearch;
  });

  return (
    <section id="insights" className="py-16 md:py-24 bg-slatebg border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold">
            <Database className="w-3.5 h-3.5" />
            <span>Dataset Overview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Dataset Insights & Architecture
          </h2>
          <p className="text-base text-slate-600 font-normal">
            Structured borrower records utilized for model training, feature transformation, and supervised classification.
          </p>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Data Volume</span>
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">255K+</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Borrower Records</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Feature Space</span>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">17</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Predictive Features</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Variable</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">Binary</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Target Class (0 / 1)</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Task Type</span>
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">Classification</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Loan Default Risk</p>
          </div>

        </div>

        {/* Target Variable Definition Banner */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Target Variable Definition: <code className="text-brand-600 bg-brand-50 px-2 py-0.5 rounded font-mono">Default</code></h3>
              <p className="text-xs text-slate-600 mt-1">
                The machine learning model is trained to predict the supervised binary class <code className="font-semibold text-slate-800">Default</code>:
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span><strong>0</strong> = Non-Default (Paid)</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span><strong>1</strong> = Default (Unpaid)</span>
            </div>
          </div>
        </div>

        {/* Sample Dataset Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          
          {/* Table Header Controls */}
          <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Representative Dataset Sample Rows</h3>
              <p className="text-xs text-slate-500 font-medium">Displaying sample borrower vectors from the training pool</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Search input */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search ID, Purpose..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Filter dropdown */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
                <Filter className="w-3.5 h-3.5 text-slate-500 ml-1" />
                <select
                  value={filterDefault}
                  onChange={(e) => setFilterDefault(e.target.value)}
                  className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer pr-1"
                >
                  <option value="ALL">All Targets</option>
                  <option value="NON_DEFAULT">Default = 0</option>
                  <option value="DEFAULT">Default = 1</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-3.5 px-4 font-semibold">Loan ID</th>
                  <th className="py-3.5 px-4 font-semibold">Age</th>
                  <th className="py-3.5 px-4 font-semibold">Income</th>
                  <th className="py-3.5 px-4 font-semibold">Loan Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Credit Score</th>
                  <th className="py-3.5 px-4 font-semibold">DTI Ratio</th>
                  <th className="py-3.5 px-4 font-semibold">Employment</th>
                  <th className="py-3.5 px-4 font-semibold">Purpose</th>
                  <th className="py-3.5 px-4 font-semibold">Co-Signer</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Target (Default)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRows.map((row) => (
                  <tr key={row.LoanID} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">{row.LoanID}</td>
                    <td className="py-3.5 px-4">{row.Age} yrs</td>
                    <td className="py-3.5 px-4 font-medium">${row.Income.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-medium">${row.LoanAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{row.CreditScore}</td>
                    <td className="py-3.5 px-4">{(row.DTIRatio * 100).toFixed(0)}%</td>
                    <td className="py-3.5 px-4">{row.EmploymentType}</td>
                    <td className="py-3.5 px-4">{row.LoanPurpose}</td>
                    <td className="py-3.5 px-4">{row.HasCoSigner}</td>
                    <td className="py-3.5 px-4 text-right">
                      {row.Default === 1 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          1 (Default)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          0 (No Default)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer stats */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
            <span>Showing {filteredRows.length} representative rows</span>
            <span className="text-[11px] font-mono">Dataset source: Kaggle Loan Default Risk Corpus</span>
          </div>

        </div>

      </div>
    </section>
  );
}
