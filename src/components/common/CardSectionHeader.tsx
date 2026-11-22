import React from 'react';

interface CardSectionHeaderProps {
  icon: React.ReactNode;
  badgeText: string;
  badgeColorClass?: string;
  title: string;
  subtitle: string;
  rightAction?: React.ReactNode;
}

/**
 * CardSectionHeader - Reusable top header for main dashboard feature cards.
 */
export const CardSectionHeader: React.FC<CardSectionHeaderProps> = ({
  icon,
  badgeText,
  badgeColorClass = 'text-cyan-600 dark:text-cyan-400',
  title,
  subtitle,
  rightAction,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
      <div>
        <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${badgeColorClass}`}>
          {icon}
          <span>{badgeText}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          {title}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          {subtitle}
        </p>
      </div>
      {rightAction}
    </div>
  );
};
