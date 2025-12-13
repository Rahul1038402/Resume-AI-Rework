import React, { useState, useEffect } from 'react';
import { Check, X, Edit2, Sparkles } from 'lucide-react';

export interface ParsedSummary {
  summary: string;
}

interface AISummarySuggestionCardProps {
  suggestion: ParsedSummary | null;
  onAccept: (edited: string) => void;
  onReject: () => void;
  onRefine?: (type: string) => void;
}

export const AISummarySuggestionCard: React.FC<AISummarySuggestionCardProps> = ({
  suggestion,
  onAccept,
  onReject,
  onRefine
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');

  useEffect(() => {
    if (suggestion) {
      setEditedSummary(suggestion.summary);
      setIsEditing(false);
    }
  }, [suggestion]);

  if (!suggestion) return null;

  const handleAccept = () => {
    onAccept(editedSummary);
  };

  const wordCount = editedSummary.trim().split(/\s+/).length;
  const isIdealLength = wordCount >= 40 && wordCount <= 45;
  const isTooShort = wordCount < 40;
  const isTooLong = wordCount > 45;

  return (
    <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border border-purple-700/50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-200 dark:text-purple-300" size={20} />
          <h3 className="font-semibold text-purple-200 dark:text-purple-300">AI Suggestion</h3>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex justify-center items-center gap-2 p-2 text-gray-200 dark:text-gray-400 hover:text-white dark:hover:text-gray-300 rounded-lg transition-colors"
          title={isEditing ? "Preview" : "Edit"}
        >
          <Edit2 size={16} />
          <span className="text-sm">Edit</span>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-xs text-gray-300 dark:text-gray-400 mb-1 block">Professional Summary</label>
          {isEditing ? (
            <textarea
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              rows={4}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-purple-500 resize-none"
              placeholder="Write your professional summary..."
            />
          ) : (
            <p className="text-gray-300 text-sm leading-relaxed">{editedSummary}</p>
          )}
          
          {/* Word Count Indicator */}
          <div className="mt-2 flex items-center justify-between">
            <span className={`text-xs ${
              isIdealLength ? 'text-green-400' :
              isTooShort ? 'text-yellow-400' :
              'text-orange-400'
            }`}>
              {wordCount} words
              {isIdealLength && ' ✓ Ideal length'}
              {isTooShort && ' - Add more detail'}
              {isTooLong && ' - Try to shorten'}
            </span>
            <span className="text-xs text-gray-400">Target: 40-45 words</span>
          </div>
        </div>
      </div>

      {/* Quick Refinement Buttons */}
      {onRefine && !isEditing && (
        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-700">
          <span className="text-xs text-gray-300 dark:text-gray-400 w-full mb-1">Quick refinements:</span>
          <button
            onClick={() => onRefine('impactful')}
            className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full transition-colors"
          >
            💪 More Impactful
          </button>
          <button
            onClick={() => onRefine('keywords')}
            className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full transition-colors"
          >
            🔑 Add Keywords
          </button>
          <button
            onClick={() => onRefine('simplify')}
            className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full transition-colors"
          >
            ✨ Simplify
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleAccept}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
        >
          <Check size={18} />
          Add to Resume
        </button>
        <button
          onClick={onReject}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <X size={18} />
          Reject
        </button>
      </div>

      {/* Tip */}
      <p className="text-xs text-gray-300 dark:text-gray-400 mt-4 text-center">
        💡 You can edit the summary before adding to your resume
      </p>
    </div>
  );
};