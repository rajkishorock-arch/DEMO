import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Route, Menu, X, LogIn, LayoutDashboard, ChevronRight, Compass } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs'
          : 'bg-white/80 backdrop-blur-xs border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl p-1"
          >
            <div className="p-2.5 bg-sky-600 group-hover:bg-sky-700 text-white rounded-xl shadow-xs transition-colors">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Smart <span className="text-sky-600">NER</span>
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-sky-50 text-sky-800 border border-sky-200 rounded-md">
                  Logistics OS
                </span>
              </div>
              <p className="hidden md:block text-[10px] text-slate-500 font-medium tracking-tight">
                North Eastern Region Route Intelligence
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-600"
          >
            <Link
              to="/"
              className={`hover:text-sky-600 transition-colors ${
                isHome ? 'text-sky-600 font-bold' : ''
              }`}
            >
              Platform
            </Link>
            <a href="#capabilities" className="hover:text-sky-600 transition-colors">
              Capabilities
            </a>
            <a href="#workflow" className="hover:text-sky-600 transition-colors">
              How It Works
            </a>
            <a href="#simulator" className="hover:text-sky-600 transition-colors">
              Live Preview
            </a>
            <a href="#impact" className="hover:text-sky-600 transition-colors">
              Regional Value
            </a>
          </nav>

          {/* Auth Actions */}
          <div className="hidden sm:flex items-center space-x-3">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-all active:scale-[0.98]"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Operations Dashboard</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-sky-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-all group active:scale-[0.98]"
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-lg">
          <nav className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:text-sky-600 hover:bg-sky-50"
            >
              Platform Overview
            </Link>
            <a
              href="#capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:text-sky-600 hover:bg-sky-50"
            >
              Capabilities
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:text-sky-600 hover:bg-sky-50"
            >
              How It Works
            </a>
            <a
              href="#simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:text-sky-600 hover:bg-sky-50"
            >
              Live Telemetry Preview
            </a>
            <a
              href="#impact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:text-sky-600 hover:bg-sky-50"
            >
              Regional Value
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs"
                >
                  <span>Get Started Free</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
