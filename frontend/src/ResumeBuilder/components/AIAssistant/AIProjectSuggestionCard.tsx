import React, { useState, useEffect } from 'react';
import { Check, X, Edit2, Sparkles, ExternalLink } from 'lucide-react';
import { ParsedProject } from './types';

interface AIProjectSuggestionCardProps {
  suggestion: ParsedProject | null;
  onAccept: (edited: ParsedProject) => void;
  onReject: () => void;
  onRefine?: (type: string) => void;
}

export const AIProjectSuggestionCard: React.FC<AIProjectSuggestionCardProps> = ({
  suggestion,
  onAccept,
  onReject,
  onRefine
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSuggestion, setEditedSuggestion] = useState<ParsedProject | null>(null);

  useEffect(() => {
    if (suggestion) {
      setEditedSuggestion({ ...suggestion });
      setIsEditing(false);
    }
  }, [suggestion]);

  if (!suggestion || !editedSuggestion) return null;

  const handleAccept = () => {
    onAccept(editedSuggestion);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    setEditedSuggestion(prev => {
      if (!prev) return prev;
      const newDesc = [...prev.description];
      newDesc[index] = value;
      return { ...prev, description: newDesc };
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
        {/* Project Title */}
        <div>
          <label className="text-xs text-gray-300 dark:text-gray-400 mb-1 block">Project Title</label>
          {isEditing ? (
            <input
              type="text"
              value={editedSuggestion.title}
              onChange={(e) => setEditedSuggestion(prev => prev ? { ...prev, title: e.target.value } : prev)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-purple-500"
            />
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-white font-medium">{editedSuggestion.title}</p>
              {editedSuggestion.link && (
                <a
                  href={editedSuggestion.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 hover:text-teal-300"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Link */}
        {isEditing && (
          <div>
            <label className="text-xs text-gray-300 dark:text-gray-400 mb-1 block">Project Link (optional)</label>
            <input
              type="url"
              value={editedSuggestion.link || ''}
              onChange={(e) => setEditedSuggestion(prev => prev ? { ...prev, link: e.target.value } : prev)}
              placeholder="https://github.com/username/project"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-purple-500"
            />
          </div>
        )}

        {/* Tech Stack */}
        <div>
          <label className="text-xs text-gray-300 dark:text-gray-400 mb-1 block">Tech Stack</label>
          {isEditing ? (
            <input
              type="text"
              value={editedSuggestion.technologies}
              onChange={(e) => setEditedSuggestion(prev => prev ? { ...prev, technologies: e.target.value } : prev)}
              placeholder="React, Node.js, MongoDB"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-purple-500"
            />
          ) : (
            <p className="text-teal-300 text-sm">{editedSuggestion.technologies}</p>
          )}
        </div>

        {/* Descriptions */}
        <div>
          <label className="text-xs text-gray-300 dark:text-gray-400 mb-2 block">Key Points</label>
          <div className="space-y-3">
            {editedSuggestion.description.map((desc, index) => (
              <div key={index}>
                {isEditing ? (
                  <textarea
                    value={desc}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    rows={2}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-purple-500 resize-none"
                    placeholder={
                      index === 0 ? "What the project does..." :
                      index === 1 ? "How you built it..." :
                      "Impact with metrics..."
                    }
                  />
                ) : (
                  <div className="flex items-start gap-2 text-gray-300">
                    <span className="text-purple-400 mt-1">•</span>
                    <p className="flex-1 text-sm">{desc}</p>
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
          <span className="text-xs text-gray-300 dark:text-gray-400 w-full mb-1">Quick refinements (Select any one):</span>
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