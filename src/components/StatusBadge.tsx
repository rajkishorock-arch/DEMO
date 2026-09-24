import React from 'react';

export type StatusVariant = 'open' | 'risk' | 'blocked' | 'info' | 'neutral' | 'success';

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'info',
  size = 'md',
  pulse = false,
  className = ''
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'open':
      case 'success':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500'
        };
      case 'risk':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500'
        };
      case 'blocked':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500'
        };
      case 'info':
        return {
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
          dot: 'bg-sky-500'
        };
      case 'neutral':
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400'
        };
    }
  };

  const style = getStyles();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 font-semibold rounded-full border ${style.bg} ${sizeClasses} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${style.dot} ${pulse ? 'animate-ping' : ''}`}
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
};
