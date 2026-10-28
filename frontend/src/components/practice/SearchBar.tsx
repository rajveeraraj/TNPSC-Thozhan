import React from 'react';
import { t } from '@/i18n';

export interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = t('practice.search_placeholder'),
  className,
}) => {
  return (
    <div className={`relative flex items-center ${className || ''}`}>
      <span className="absolute left-3 text-on-surface-variant/70 material-symbols-outlined text-[20px] pointer-events-none">
        search
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-surface-container-high text-on-surface placeholder-on-surface-variant/60 rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-white/5 transition-all shadow-inner"
        aria-label="Search topics and questions"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          aria-label="Clear search"
          className="absolute right-3 w-6 h-6 rounded-full bg-surface-container-highest hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
