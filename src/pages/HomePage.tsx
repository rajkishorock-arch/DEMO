import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Truck,
  AlertTriangle,
  Brain,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldAlert
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-sky-50/70 via-slate-50 to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-semibold tracking-wide mb-6 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
              <span className="font-bold text-sky-900">Smart NER Platform</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600">North Eastern Region Connectivity</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
              Smarter Route Intelligence for the{' '}
              <span className="text-sky-600">North Eastern Region</span>
            </h1>

            {/* Short Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              Real-time corridor accessibility, crowd-sourced road hazard telemetry, and rule-based AI route recommendations engineered for mountain supply chains.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-xs transition-all text-sm"
                >
                  <span>Open Operations Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-xs transition-all text-sm group"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-xl shadow-xs transition-all text-sm"
                  >
                    <span>Sign In</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Visual Workflow Stream Section */}
      <section id="workflow" className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600">Operational Process</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              End-to-End Route Intelligence Workflow
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
              <div className="text-xs font-bold text-sky-600 uppercase tracking-wider">01. Monitor</div>
              <div className="text-xs font-bold text-slate-900">Track Corridors</div>
              <div className="text-[11px] text-slate-500">Live corridor status</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
              <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">02. Identify</div>
              <div className="text-xs font-bold text-slate-900">Road Hazard</div>
              <div className="text-[11px] text-slate-500">Report blockage</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
              <div className="text-xs font-bold text-rose-600 uppercase tracking-wider">03. Assess</div>
              <div className="text-xs font-bold text-slate-900">Risk Severity</div>
              <div className="text-[11px] text-slate-500">Calculate delay</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">04. Recommend</div>
              <div className="text-xs font-bold text-slate-900">AI Advisory</div>
              <div className="text-[11px] text-slate-500">Suggest alternate</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">05. Action</div>
              <div className="text-xs font-bold text-slate-900">Dispatch Fleet</div>
              <div className="text-[11px] text-slate-500">Safe re-routing</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">06. Track</div>
              <div className="text-xs font-bold text-slate-900">Firestore Log</div>
              <div className="text-[11px] text-slate-500">Persistent history</div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600">Platform Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              Four Core Logistics Functions
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Everything needed to manage freight dispatches and highway corridor safety in the North East.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-sky-300 transition-all">
              <div>
                <div className="w-12 h-12 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-center text-sky-600 mb-5">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Route Monitoring</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Visual status tracking across key highway corridors with color-coded safety badges (Open, Risk, Blocked).
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-medium">
                <span>Status: 🟢 OPEN</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-sky-300 transition-all">
              <div>
                <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center text-amber-600 mb-5">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Incident Intelligence</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Rapid hazard reporting for landslides, road blockages, and flash floods synced instantly to Cloud Firestore.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-amber-700 font-medium">
                <span>Status: 🟡 AT RISK</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-sky-300 transition-all">
              <div>
                <div className="w-12 h-12 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-center text-rose-600 mb-5">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Risk Assessment</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Dynamic impact calculation evaluating severity levels to project estimated delays across Mountain Pass routes.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-rose-700 font-medium">
                <span>Status: 🔴 BLOCKED</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-sky-300 transition-all">
              <div>
                <div className="w-12 h-12 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-center text-indigo-600 mb-5">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">AI Route Advisory</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Rule-based intelligence evaluating active road hazards to recommend optimal bypass corridors.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-700 font-medium">
                <span>Status: ⚡ LIVE ANALYSIS</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
