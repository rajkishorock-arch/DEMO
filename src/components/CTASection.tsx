import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryActionText?: string;
  secondaryActionText?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  title = "Ready to optimize corridor logistics across North East India?",
  description = "Access real-time route accessibility metrics, crowd-sourced hazard telemetry, and rule-based dispatch intelligence.",
  primaryActionText = "Launch Operations Console",
  secondaryActionText = "Sign In to Account"
}) => {
  const { user } = useAuth();

  return (
    <section className="py-16 bg-white border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-semibold mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Production-Ready Logistics Intelligence</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {title}
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {description}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow-md transition-all text-sm group"
                >
                  <span>{primaryActionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow-md transition-all text-sm group"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold rounded-xl transition-all text-sm"
                  >
                    <span>{secondaryActionText}</span>
                  </Link>
                </>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Deterministic Rule-Based Advice</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Encrypted Role-Scoped Firestore Isolation</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>8 North East States Monitored</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
