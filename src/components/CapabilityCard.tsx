import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { StatusBadge, StatusVariant } from './StatusBadge';

export interface CapabilityItem {
  id: string;
  icon: LucideIcon;
  title: string;
  badge: string;
  badgeVariant: StatusVariant;
  whatItDoes: string;
  whyItMatters: string;
  actionText: string;
  actionHref?: string;
  accentColor?: string; // e.g. 'sky', 'emerald', 'amber', 'indigo'
}

interface CapabilityCardProps {
  item: CapabilityItem;
}

export const CapabilityCard: React.FC<CapabilityCardProps> = ({ item }) => {
  const Icon = item.icon;

  return (
    <div className="group relative bg-white border border-slate-200 hover:border-sky-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 group-hover:bg-sky-50 group-hover:border-sky-200 flex items-center justify-center text-slate-700 group-hover:text-sky-600 transition-colors">
            <Icon className="w-5 h-5 transition-transform group-hover:scale-105 duration-200" />
          </div>
          <StatusBadge label={item.badge} variant={item.badgeVariant} size="sm" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
          {item.title}
        </h3>

        {/* What It Does */}
        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {item.whatItDoes}
        </p>

        {/* Why It Matters */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
            Why It Matters
          </span>
          <p className="text-slate-600 leading-normal">
            {item.whyItMatters}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-500">Production Console</span>
        <Link
          to={item.actionHref || '/dashboard'}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 group-hover:translate-x-0.5 transition-all"
        >
          <span>{item.actionText}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};
