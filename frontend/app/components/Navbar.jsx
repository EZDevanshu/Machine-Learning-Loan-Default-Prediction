'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Menu, X, Sparkles, Trophy, Cpu, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Overview', href: '/#hero' },
    { label: 'Risk Assessment', href: '/#assessment' },
    { label: 'All Models (Leaderboard)', href: '/models', isHighlight: true },
    { label: 'Dataset Insights', href: '/#insights' },
    { label: 'Analytics', href: '/#analytics' },
    { label: 'Performance', href: '/#performance' },
    { label: 'Pipeline', href: '/#pipeline' },
  ];

  const handleNavClick = (e, href) => {
    if (href.startsWith('/#')) {
      if (pathname === '/') {
        e.preventDefault();
        setMobileMenuOpen(false);
        const hash = href.replace('/', '');
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-3'
          : 'bg-white border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Brand Logo & Subtitle */}
          <Link
            href="/"
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                  LoanGuard <span className="text-brand-600">AI</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200/60">
                  <Sparkles className="w-2.5 h-2.5" />
                  v1.2 Multi-Model
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-none mt-0.5">
                ML Risk Intelligence
              </p>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-50/80 p-1.5 rounded-full border border-slate-200/60 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-semibold flex items-center gap-1.5 ${
                  item.isHighlight
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs hover:bg-amber-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-xs'
                }`}
              >
                {item.isHighlight && <Trophy className="w-3.5 h-3.5 text-amber-600" />}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right: Badge & Action */}
          <div className="flex items-center gap-3">
            <Link
              href="/models"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-xs font-semibold hover:bg-indigo-100 transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>5 Models Benchmarked</span>
            </Link>

            <Link
              href="/#assessment"
              onClick={(e) => handleNavClick(e, '/#assessment')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm hover:shadow transition-all"
            >
              Assess Risk
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <Link
            href="/models"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-2"
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>Explore 5 Models Leaderboard</span>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-600" />
          </Link>
          
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleNavClick(e, item.href);
              }}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/#assessment"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleNavClick(e, '/#assessment');
              }}
              className="block w-full text-center py-2.5 rounded-lg bg-brand-600 text-white font-semibold text-sm shadow-sm"
            >
              Start Risk Assessment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
