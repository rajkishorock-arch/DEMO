import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ProcessStepItem {
  number: string;
  phaseTag: string; // 'Input' | 'Analysis' | 'Result' | 'Action' | 'Persistence'
  title: string;
  description: string;
  icon?: LucideIcon;
  accent?: string;
}

interface ProcessStepsProps {
  steps: ProcessStepItem[];
  className?: string;
}

export const ProcessSteps: React.FC<ProcessStepsProps> = ({ steps, className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Workflow Phase Indicator Line */}
      <div className="hidden lg:flex items-center justify-between px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 shadow-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Flow Architecture:</span>
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="px-2 py-0.5 bg-sky-50 text-sky-800 rounded border border-sky-200">1. Data Ingestion</span>
          <span className="text-slate-400">→</span>
          <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded border border-amber-200">2. Incident Triage</span>
          <span className="text-slate-400">→</span>
          <span className="px-2 py-0.5 bg-rose-50 text-rose-800 rounded border border-rose-200">3. Risk Scoring</span>
          <span className="text-slate-400">→</span>
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded border border-indigo-200">4. Rule Advisory</span>
          <span className="text-slate-400">→</span>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">5. Fleet Action</span>
          <span className="text-slate-400">→</span>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-300">6. Cloud Persistence</span>
        </div>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-sky-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black tracking-widest text-sky-600">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {step.phaseTag}
                  </span>
                </div>

                {Icon && (
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                )}

                <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
