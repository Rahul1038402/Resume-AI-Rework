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
      <div className="flex items-center gap-2 p-1 bg-gray-600 dark:bg-gray-800 rounded-lg border border-gray-700">
        <button
          onClick={onToggle}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all flex-1
            ${!isAIMode 
              ? 'bg-black text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-700'
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
              ? 'bg-black text-white shadow-lg' 
              : 'text-gray-400 hover:bg-gray-700'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Sparkles size={18} />
          <ShinyText text="AI Assisted" disabled={false} speed={5} className="custom-class" />
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

      {/* Mode Description */}
      <div className="text-sm text-gray-700 dark:text-gray-400 px-2">
        {isAIMode ? (
          <div className="flex items-start gap-2">
            <Sparkles size={16} className="text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
            <p>
              AI will help you create ATS-friendly content following best practices. 
              Chat naturally and get structured suggestions you can edit before adding.
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <Edit3 size={16} className="text-teal-400 mt-0.5 flex-shrink-0" />
            <p>
              Manually enter your project details using the form below. 
              Perfect if you already have your content ready.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};