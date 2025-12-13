import React, { useState, useEffect } from 'react';
import { Check, X, Edit2, Sparkles } from 'lucide-react';

interface ParsedExperience {
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  achievements: string[];
}

interface AIExperienceSuggestionCardProps {
  suggestion: ParsedExperience | null;
  onAccept: (edited: ParsedExperience) => void;
  onReject: () => void;
  onRefine?: (type: string) => void;
}

export const AIExperienceSuggestionCard: React.FC<AIExperienceSuggestionCardProps> = ({
  suggestion,
  onAccept,
  onReject,
  onRefine
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExperience, setEditedExperience] = useState<ParsedExperience | null>(null);

  useEffect(() => {
    if (suggestion) {
      setEditedExperience({ ...suggestion });
      setIsEditing(false);
    }
  }, [suggestion]);

  if (!suggestion || !editedExperience) return null;

  const handleAccept = () => {
    onAccept(editedExperience);
  };

  const handleAchievementChange = (index: number, value: string) => {
    setEditedExperience(prev => {
      if (!prev) return prev;
      const newAchievements = [...prev.achievements];
      newAchievements[index] = value;
      return { ...prev, achievements: newAchievements };
    });
  };

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
        {/* Position */}
        <div>
          <label className="text-xs text-gray-300 dark:text-gray-400 mb-1 block">Position</label>
          {isEditing ? (
            <input
              type="text"
              value={editedExperience.position}
              onChange={(e) => setEditedExperience(prev => prev ? { ...prev, position: e.target.value } : prev)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-purple-500"
            />
          ) : (
            <p className="text-white font-medium">{editedExperience.position}</p>
          )}
        </div>

        {/* Company & Location */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-300 dark:text-gray-400 mb-1 block">Company</label>
            {isEditing ? (
              <input
                type="text"
                value={editedExperience.company}
                onChange={(e) => setEditedExperience(prev => prev ? { ...prev, company: e.target.value } : prev)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-purple-500"
              />
            ) : (
              <p className="text-teal-300 text-sm">{editedExperience.company}</p>
            )}
          </div>
          
          <div>
            <label className="text-xs text-gray-300 dark:text-gray-400 mb-1 block">Location</label>
            {isEditing ? (
              <input
                type="text"
                value={editedExperience.location}
                onChange={(e) => setEditedExperience(prev => prev ? { ...prev, location: e.target.value } : prev)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-purple-500"
              />
            ) : (
              <p className="text-gray-300 text-sm">{editedExperience.location}</p>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-300 dark:text-gray-400 mb-1 block">Start Date</label>
            {isEditing ? (
              <input
                type="text"
                value={editedExperience.startDate}
                onChange={(e) => setEditedExperience(prev => prev ? { ...prev, startDate: e.target.value } : prev)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-purple-500"
                placeholder="Jan 2023"
              />
            ) : (
              <p className="text-gray-300 text-sm">{editedExperience.startDate}</p>
            )}
          </div>
          
          <div>
            <label className="text-xs text-gray-300 dark:text-gray-400 mb-1 block">End Date</label>
            {isEditing ? (
              <input
                type="text"
                value={editedExperience.endDate}
                onChange={(e) => setEditedExperience(prev => prev ? { ...prev, endDate: e.target.value } : prev)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-purple-500"
                placeholder="Present"
              />
            ) : (
              <p className="text-gray-300 text-sm">{editedExperience.endDate}</p>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <label className="text-xs text-gray-300 dark:text-gray-400 mb-2 block">Key Achievements</label>
          <div className="space-y-3">
            {editedExperience.achievements.map((achievement, index) => (
              <div key={index}>
                {isEditing ? (
                  <textarea
                    value={achievement}
                    onChange={(e) => handleAchievementChange(index, e.target.value)}
                    rows={2}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-purple-500 resize-none"
                  />
                ) : (
                  <div className="flex items-start gap-2 text-gray-300">
                    <span className="text-purple-400 mt-1">•</span>
                    <p className="flex-1 text-sm">{achievement}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Refinement Buttons */}
      {onRefine && !isEditing && (
        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-700">
          <span className="text-xs text-gray-300 dark:text-gray-400 w-full mb-1">Quick refinements:</span>
          <button
            onClick={() => onRefine('quantify')}
            className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full transition-colors"
          >
            📊 Add Metrics
          </button>
          <button
            onClick={() => onRefine('technical')}
            className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full transition-colors"
          >
            ⚙️ More Technical
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
        💡 You can edit any field before adding to your resume
      </p>
    </div>
  );
};