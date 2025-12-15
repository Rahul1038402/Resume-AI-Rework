import React from 'react';
import { Sparkles, Edit3 } from 'lucide-react';
import ShinyText from '@/components/ui/ShinyText';

interface AIModeToggleProps {
  mode: 'manual' | 'ai';
  onToggle: () => void;
  disabled?: boolean;
  rateLimits?: {
    remaining_section: number;
    remaining_session: number;
  };
}

export const AIModeToggle: React.FC<AIModeToggleProps> = ({ 
  mode, 
  onToggle, 
  disabled = false,
  rateLimits 
}) => {
  const isAIMode = mode === 'ai';

  return (
    <div className="flex flex-col gap-2 mb-6">
      {/* Toggle Buttons */}
      <div className="flex items-center gap-3 rounded-md bg-white dark:bg-black">
        <button
          onClick={onToggle}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all flex-1
            ${!isAIMode 
              ? 'dark:text-white shadow-lg border-2 dark:border-gray-500' 
              : 'bg-gray-200 dark:bg-black border dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900/80'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Edit3 size={18} />
          <span>Manual</span>
        </button>

        <button
          onClick={onToggle}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all flex-1
            ${isAIMode 
              ? 'dark:text-white shadow-lg border-2 dark:border-gray-500' 
              : 'bg-gray-200 dark:bg-black border dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900/80'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Sparkles size={18} />
          <span>AI Assisted</span>
        </button>
      </div>

      {/* Rate Limit Display */}
      {isAIMode && rateLimits && (
        <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-400 px-2">
          <span>
            {rateLimits.remaining_section}/15 requests remaining for this section
          </span>
          {rateLimits.remaining_section <= 3 && (
            <span className="text-yellow-700 dark:text-yellow-500 font-medium">
              ⚠️ Low
            </span>
          )}
        </div>
      )}
    </div>
  );
};