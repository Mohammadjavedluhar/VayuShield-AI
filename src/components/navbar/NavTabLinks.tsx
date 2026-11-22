import React from 'react';

interface TabItem {
  id: string;
  label: string;
}

interface NavTabLinksProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const NavTabLinks: React.FC<NavTabLinksProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none border-t border-slate-100 dark:border-slate-800/60">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 py-2 min-h-[44px] rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center justify-center ${
              isActive
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};
