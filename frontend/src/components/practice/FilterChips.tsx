import React from 'react';
import { t } from '@/i18n';

export interface FilterChipItem {
  id: string;
  label: string;
}

export const DEFAULT_FILTER_CHIPS: FilterChipItem[] = [
  { id: 'all', label: t('practice.filters.all') },
  { id: 'group4', label: t('practice.filters.group4') },
  { id: 'group2', label: t('practice.filters.group2') },
  { id: 'vao', label: t('practice.filters.vao') },
  { id: 'tamil', label: t('practice.filters.tamil') },
];

export interface FilterChipsProps {
  chips?: FilterChipItem[];
  selectedFilter: string;
  onSelectFilter: (id: string) => void;
  className?: string;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  chips = DEFAULT_FILTER_CHIPS,
  selectedFilter,
  onSelectFilter,
  className,
}) => {
  return (
    <div
      className={`flex items-center gap-space-sm overflow-x-auto pb-1 scrollbar-none -mx-space-md px-space-md ${
        className || ''
      }`}
      role="group"
      aria-label="Filter Options"
    >
      {chips.map((chip) => {
        const isActive = selectedFilter === chip.id;
        return (
          <button
            key={chip.id}
            type="button"
            onClick={() => onSelectFilter(chip.id)}
            data-testid={`filter-chip-${chip.id}`}
            aria-pressed={isActive}
            className={`px-3.5 py-1.5 rounded-full text-label-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? 'bg-secondary text-on-secondary shadow-md shadow-secondary/10'
                : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface border border-white/5'
            }`}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterChips;
