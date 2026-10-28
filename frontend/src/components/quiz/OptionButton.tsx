import React from 'react';
import type { QuestionOption, OptionId } from '@/types/api';

export interface OptionButtonProps {
  option: QuestionOption;
  selectedOptionId?: OptionId;
  correctAnswerId?: OptionId;
  isAnswered: boolean;
  onSelect: (optionId: OptionId) => void;
  disabled?: boolean;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  option,
  selectedOptionId,
  correctAnswerId,
  isAnswered,
  onSelect,
  disabled = false,
}) => {
  const isSelected = selectedOptionId === option.id;
  const isCorrect = option.id === correctAnswerId;

  // Determine appearance based on whether question is answered
  let containerClasses =
    'group w-full p-space-md rounded-xl transition-all flex items-center justify-between text-left cursor-pointer border ';
  let letterClasses =
    'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-label-md shrink-0 transition-colors ';
  let indicatorIcon: React.ReactNode = null;

  if (isAnswered) {
    if (isCorrect) {
      // Emerald correct state
      containerClasses +=
        'bg-tertiary/10 border-tertiary shadow-lg shadow-tertiary/10 relative overflow-hidden';
      letterClasses += 'bg-tertiary/20 text-tertiary';
      indicatorIcon = (
        <div className="w-6 h-6 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary shrink-0">
          <span className="material-symbols-outlined text-[16px] font-bold">check</span>
        </div>
      );
    } else if (isSelected && !isCorrect) {
      // Red incorrect selection state
      containerClasses +=
        'bg-error/10 border-error shadow-lg shadow-error/10 relative overflow-hidden';
      letterClasses += 'bg-error/20 text-error';
      indicatorIcon = (
        <div className="w-6 h-6 rounded-full bg-error flex items-center justify-center text-on-error shrink-0">
          <span className="material-symbols-outlined text-[16px] font-bold">close</span>
        </div>
      );
    } else {
      // Muted unselected options after answer
      containerClasses +=
        'bg-surface-container/40 border-white/5 opacity-50 cursor-default';
      letterClasses += 'bg-surface-container-high text-on-surface-variant';
      indicatorIcon = (
        <div className="w-6 h-6 rounded-full border border-outline/30 shrink-0" />
      );
    }
  } else {
    // Unanswered interactive state
    containerClasses +=
      'bg-surface-container/60 hover:bg-surface-container-high/80 border-white/5 hover:border-secondary/30 active:scale-[0.99]';
    letterClasses +=
      'bg-surface-container-high text-on-surface-variant group-hover:text-on-surface group-hover:bg-surface-container-highest';
    indicatorIcon = (
      <div className="w-6 h-6 rounded-full border-2 border-outline/40 flex items-center justify-center group-hover:border-secondary/60 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-secondary scale-0 group-hover:scale-75 transition-transform" />
      </div>
    );
  }

  const handleClick = () => {
    if (!isAnswered && !disabled) {
      onSelect(option.id);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isAnswered || disabled}
      aria-label={`Option ${option.label}: ${option.text_ta}`}
      data-testid={`option-${option.id}`}
      data-correct={isCorrect ? 'true' : 'false'}
      data-selected={isSelected ? 'true' : 'false'}
      className={containerClasses}
    >
      {/* Decorative vertical indicator bar for answered state */}
      {isAnswered && isCorrect && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary" />
      )}
      {isAnswered && isSelected && !isCorrect && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-error" />
      )}

      <div className="flex items-center gap-space-md mr-2">
        <div className={letterClasses}>{option.label}</div>
        <div className="flex flex-col">
          <span className="text-body-lg text-on-surface font-medium leading-snug">
            {option.text_ta}
          </span>
          {option.text_en && (
            <span className="text-body-sm text-on-surface-variant/80 italic mt-0.5">
              {option.text_en}
            </span>
          )}
        </div>
      </div>

      {indicatorIcon}
    </button>
  );
};

export default OptionButton;
