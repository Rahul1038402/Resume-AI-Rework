import React, { useState, useEffect } from 'react';
import { Check, X, Edit2, Sparkles, Plus, Trash2 } from 'lucide-react';

interface SkillCategory {
  name: string;
  value: string;
}

interface ParsedSkills {
  skills: SkillCategory[];
}

interface AISkillsSuggestionCardProps {
  suggestion: ParsedSkills | null;
  onAccept: (edited: SkillCategory[]) => void;
  onReject: () => void;
  onRefine?: (type: string) => void;
}

export const AISkillsSuggestionCard: React.FC<AISkillsSuggestionCardProps> = ({
  suggestion,
  onAccept,
  onReject,
  onRefine
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSkills, setEditedSkills] = useState<SkillCategory[]>([]);

  useEffect(() => {
    if (suggestion) {
      setEditedSkills([...suggestion.skills]);
      setIsEditing(false);
    }
  }, [suggestion]);

  if (!suggestion) return null;

  const handleAccept = () => {
    onAccept(editedSkills);
  };

  const updateCategory = (index: number, field: 'name' | 'value', value: string) => {
    setEditedSkills(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addCategory = () => {
    setEditedSkills(prev => [...prev, { name: '', value: '' }]);
  };

  const removeCategory = (index: number) => {
    setEditedSkills(prev => prev.filter((_, i) => i !== index));
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
        <label className="text-xs text-gray-300 dark:text-gray-400 mb-2 block">Skill Categories</label>
        
        <div className="space-y-3">
          {editedSkills.map((category, index) => (
            <div key={index} className="space-y-2">
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => updateCategory(index, 'name', e.target.value)}
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-purple-500 text-sm"
                        placeholder="Category name (e.g., Languages)"
                      />
                      <input
                        type="text"
                        value={category.value}
                        onChange={(e) => updateCategory(index, 'value', e.target.value)}
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-purple-500 text-sm"
                        placeholder="Skills (comma-separated)"
                      />
                    </div>
                    {editedSkills.length > 1 && (
                      <button
                        onClick={() => removeCategory(index)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-purple-300 font-medium text-sm">{category.name}:</span>
                    <span className="text-gray-300 text-sm">{category.value}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Category Button (Edit Mode) */}
        {isEditing && (
          <button
            onClick={addCategory}
            className="w-full mt-3 px-3 py-2 border-2 border-dotted border-gray-600 hover:border-purple-500 rounded-lg flex items-center justify-center gap-2 text-gray-400 hover:text-purple-300 transition-colors text-sm"
          >
            <Plus size={16} />
            Add Category
          </button>
        )}
      </div>

      {/* Quick Refinement Buttons */}
      {onRefine && !isEditing && (
        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-700">
          <span className="text-xs text-gray-300 dark:text-gray-400 w-full mb-1">Quick refinements:</span>
          <button
            onClick={() => onRefine('add_categories')}
            className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full transition-colors"
          >
            ➕ Add Categories
          </button>
          <button
            onClick={() => onRefine('match_jd')}
            className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full transition-colors"
          >
            🎯 Match to JD
          </button>
          <button
            onClick={() => onRefine('prioritize')}
            className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full transition-colors"
          >
            ⭐ Prioritize
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
        💡 Review and edit categories before adding to your resume
      </p>
    </div>
  );
};