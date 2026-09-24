import React from 'react';
import { Route, ShieldCheck, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-sky-600 rounded-lg text-white">
                <Route className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                Smart <span className="text-sky-600">NER</span>
              </span>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm max-w-md leading-relaxed">
              AI-Powered Logistics & Route Intelligence engineered specifically for the mountainous terrain, corridors, and supply chains of the North Eastern Region of India.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh & Sikkim</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="#capabilities" className="hover:text-sky-600 transition-colors">Routes & Corridor Telemetry</a></li>
              <li><a href="#capabilities" className="hover:text-sky-600 transition-colors">Incident Intelligence</a></li>
              <li><a href="#capabilities" className="hover:text-sky-600 transition-colors">AI Route Advisor</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="#platform" className="hover:text-sky-600 transition-colors">About Smart NER</a></li>
              <li><a href="#workflow" className="hover:text-sky-600 transition-colors">How It Works</a></li>
              <li>
                <div className="flex items-center space-x-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded w-fit text-[11px] font-medium mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Firebase Auth Verified</span>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Legal & Security</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><span className="text-slate-500">Privacy Policy</span></li>
              <li><span className="text-slate-500">Terms of Service</span></li>
              <li><span className="text-slate-500">Role-Scoped Security</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Smart NER Logistics & Accessibility Platform. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Built for Smart Logistics & Regional Connectivity in North East India.</p>
        </div>
      </div>
    </footer>
  );
};
