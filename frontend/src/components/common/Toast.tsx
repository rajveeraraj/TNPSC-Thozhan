import React, { useEffect } from 'react';
import { cn } from '@/utils/cn';

export interface ToastProps {
  message: string;
  icon?: string;
  isVisible: boolean;
  onClose?: () => void;
  duration?: number;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  icon = 'bookmark',
  isVisible,
  onClose,
  duration = 2500,
  className,
}) => {
  useEffect(() => {
    if (!isVisible || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-28 left-1/2 -translate-x-1/2 z-50',
        'bg-surface-container-highest text-on-surface px-space-md py-3 rounded-xl shadow-2xl',
        'border border-secondary/30 flex items-center gap-space-sm transition-all duration-300 animate-fade-in',
        'max-w-[90vw] whitespace-nowrap',
        className
      )}
    >
      <span
        className="material-symbols-outlined text-secondary text-[20px]"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
      <span className="text-label-md font-bold">{message}</span>
    </div>
  );
};

export default Toast;
