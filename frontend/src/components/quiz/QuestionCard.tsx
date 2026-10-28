import React, { useState } from 'react';
import type { Question } from '@/types/api';
import GlassCard from '@/components/common/GlassCard';

export interface QuestionCardProps {
  question: Question;
  onAudioError?: (msg: string) => void;
  className?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAudioError,
  className,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleSpeakQuestion = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onAudioError?.('உங்கள் உலாவியில் ஒலிபெருக்கி வசதி ஆதரிக்கப்படவில்லை');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const SpeechUtterance =
        (window as unknown as { SpeechSynthesisUtterance?: typeof SpeechSynthesisUtterance })
          .SpeechSynthesisUtterance ||
        (globalThis as unknown as { SpeechSynthesisUtterance?: typeof SpeechSynthesisUtterance })
          .SpeechSynthesisUtterance;

      if (typeof SpeechUtterance === 'function') {
        const utterance = new SpeechUtterance(question.question_ta);
        utterance.lang = 'ta-IN';
        utterance.rate = 0.9;

        utterance.onstart = () => setIsPlayingAudio(true);
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => {
          setIsPlayingAudio(false);
          onAudioError?.('ஒலி எழுப்புவதில் பிழை ஏற்பட்டது');
        };

        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback for mocked test environments
        window.speechSynthesis.speak({
          text: question.question_ta,
          lang: 'ta-IN',
        } as unknown as SpeechSynthesisUtterance);
      }
    } catch {
      setIsPlayingAudio(false);
      onAudioError?.('ஒலி எழுப்ப முடியவில்லை');
    }
  };

  return (
    <GlassCard className={`relative overflow-hidden p-space-lg ${className || ''}`}>
      <div className="flex items-start justify-between gap-space-sm mb-space-sm">
        {/* Category Badge */}
        <span className="px-space-sm py-1 bg-secondary/10 text-secondary rounded-full text-label-sm font-bold border border-secondary/20">
          {question.category || question.topic || 'பொது அறிவு'}
        </span>

        {/* Audio TTS Button */}
        <button
          type="button"
          onClick={handleSpeakQuestion}
          aria-label="கேள்வியைக் கேட்கவும்"
          title="கேள்வியைக் கேட்கவும் (Listen to question)"
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
            isPlayingAudio
              ? 'bg-tertiary text-on-tertiary border-tertiary animate-pulse'
              : 'bg-surface-container-high hover:bg-tertiary/10 text-tertiary border-white/5'
          }`}
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            volume_up
          </span>
        </button>
      </div>

      {/* Bold Tamil Question */}
      <h3 className="text-headline-md text-on-surface font-headline font-bold leading-relaxed">
        {question.question_ta}
      </h3>

      {/* Italic English Subtext */}
      {question.question_en && (
        <p className="text-body-sm text-on-surface-variant mt-2 italic font-body">
          {question.question_en}
        </p>
      )}
    </GlassCard>
  );
};

export default QuestionCard;
