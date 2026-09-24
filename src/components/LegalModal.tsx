import React from 'react';
import { X, Shield, FileText } from 'lucide-react';

export type LegalDocType = 'privacy' | 'terms' | null;

interface LegalModalProps {
  type: LegalDocType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-2.5">
            {isPrivacy ? (
              <Shield className="w-5 h-5 text-sky-600" />
            ) : (
              <FileText className="w-5 h-5 text-sky-600" />
            )}
            <h3 id="legal-modal-title" className="text-lg font-bold text-slate-900">
              {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            aria-label="Close legal modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed pr-2">
          {isPrivacy ? (
            <>
              <p className="font-semibold text-slate-800">
                Effective Date: September 2026 | Smart NER Logistics & Route Intelligence
              </p>
              <h4 className="font-bold text-slate-900 text-sm">1. Data Architecture & User Isolation</h4>
              <p>
                Smart NER uses Firebase Authentication and Cloud Firestore. User activities, incident submissions, and telemetry data are isolated under individual user records with strict Firestore Security Rules.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">2. Route & Telemetry Information</h4>
              <p>
                Operational reports submitted through the incident portal (such as rockfall notices or flooded highway updates) are utilized solely to update real-time risk scores and inform logistics routing in the North Eastern Region.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">3. Storage & Encryption</h4>
              <p>
                All data transmitted between the client interface and Cloud Firestore utilizes TLS 1.3 encryption. Passwords and credentials are never stored in plaintext and are managed strictly via Google Firebase Identity Platform.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-slate-800">
                Terms of Use | Smart NER Platform Operations
              </p>
              <h4 className="font-bold text-slate-900 text-sm">1. Permitted Operational Use</h4>
              <p>
                The Smart NER platform is designed for route accessibility assessment, fleet telemetry, and hazard monitoring in the North Eastern Region of India. Users agree to report genuine, field-verified hazards.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">2. Deterministic Rule-Based Intelligence</h4>
              <p>
                Corridor recommendations provided by the AI Route Advisor are computed via deterministic safety rules evaluating verified road blockage data, bridge status, and elevation weather conditions. Dispatchers remain responsible for final fleet routing decisions.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">3. Availability & SLA</h4>
              <p>
                The platform is architected for high resilience across mountain connectivity limits with client-side caching and automatic reconnection retry mechanisms.
              </p>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-xs"
          >
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
};
