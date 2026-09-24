'use client';

import { useState } from 'react';
import { Sliders, Search, Filter, Hash, Type, CheckCircle2, BookOpen } from 'lucide-react';
import { FEATURES_LIST } from '../../data/mockData';

export default function FeatureExplorer() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['ALL', 'Financial', 'Demographic', 'Loan Attributes'];

  const filteredFeatures = FEATURES_LIST.filter((feat) => {
    const matchesCat = selectedCategory === 'ALL' || feat.category === selectedCategory;
    const matchesSearch =
      feat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feat.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="features" className="py-16 md:py-24 bg-slatebg border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Feature Dictionary & Schema</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Predictive Feature Information
          </h2>
          <p className="text-base text-slate-600 font-normal">
            Complete data schema for all 16 input features ingested by the risk evaluation engine.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs w-full sm:w-auto overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {cat} {cat === 'ALL' ? `(${FEATURES_LIST.length})` : ''}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search feature name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
            />
          </div>

        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFeatures.map((feat) => (
            <div
              key={feat.name}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {feat.name}
                  </span>
                  
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      feat.type === 'Numerical'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}
                  >
                    {feat.type === 'Numerical' ? (
                      <Hash className="w-3 h-3" />
                    ) : (
                      <Type className="w-3 h-3" />
                    )}
                    {feat.type}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-normal leading-relaxed mt-2">
                  {feat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Category:</span>
                <span className="font-semibold text-slate-700">{feat.category}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Note at bottom */}
        <div className="mt-8 text-center text-xs text-slate-500 font-medium">
          Showing {filteredFeatures.length} of 16 input features (excluding <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px] font-mono">LoanID</code>).
        </div>

      </div>
    </section>
  );
}
