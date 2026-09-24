import React from 'react';
import { Link } from 'react-router-dom';
import { Route, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { openCookiePreferences } from './CookieConsent';
import { LegalDocType } from './LegalModal';

interface FooterProps {
  onOpenLegalDoc?: (type: LegalDocType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegalDoc }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs sm:text-sm py-12 sm:py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center space-x-2.5">
              <div className="p-2 bg-sky-500 text-slate-950 rounded-xl shadow-xs">
                <Route className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Smart <span className="text-sky-400">NER</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              AI-Powered Logistics & Route Intelligence engineered specifically for mountainous corridors, seasonal weather hazards, and freight supply chains across the North Eastern Region of India.
            </p>

            <div className="flex items-start space-x-2 text-xs text-slate-400 pt-1">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span className="leading-snug">
                Covering 8 States: Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh & Sikkim
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Platform Modules
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#capabilities" className="hover:text-white transition-colors">
                  Route Accessibility
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-white transition-colors">
                  Logistics Telemetry
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-white transition-colors">
                  Incident Intelligence
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-white transition-colors">
                  Rule-Based Route Advisor
                </a>
              </li>
              <li>
                <a href="#simulator" className="hover:text-white transition-colors">
                  Live Telemetry Simulator
                </a>
              </li>
            </ul>
          </div>

          {/* Architecture / Verification */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Architecture
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#workflow" className="hover:text-white transition-colors">
                  6-Stage Operational Flow
                </a>
              </li>
              <li>
                <a href="#impact" className="hover:text-white transition-colors">
                  Regional Impact Matrix
                </a>
              </li>
              <li className="pt-2">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800 text-emerald-400 rounded-lg text-[11px] font-semibold border border-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Role-Scoped Firestore</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Governance & Privacy
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalDoc?.('privacy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalDoc?.('terms')}
                  className="hover:text-white transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openCookiePreferences}
                  className="hover:text-white transition-colors text-left font-medium text-sky-400"
                >
                  Cookie Preferences
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Area */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Smart NER Logistics & Route Intelligence Platform. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center space-x-1 text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Production Verified Rehearsal Baseline</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
