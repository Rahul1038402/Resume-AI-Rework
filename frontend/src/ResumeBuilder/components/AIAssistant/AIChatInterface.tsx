import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, AlertCircle, Trash2, X, Download, ArrowRight } from 'lucide-react';
import { AIMessage } from './types';

interface AIChatInterfaceProps {
    messages: AIMessage[];
    isLoading: boolean;
    error: string | null;
    onSendMessage: (message: string) => void;
    onClearMessages: () => void;
    onCancelRequest?: () => void;
    onExportConversation?: () => void;
    showWelcome?: boolean;
    onDismissWelcome?: () => void;
    rateLimits?: {
        remaining_section: number;
        remaining_session: number;
    };
    currentSuggestion?: any | null;
    onAcceptSuggestion?: (suggestion: any) => void;
    onRejectSuggestion?: () => void;
    onRefineSuggestion?: (type: string) => void;
    suggestionCardComponent?: React.ComponentType<any>;
}

export const AIChatInterface: React.FC<AIChatInterfaceProps> = ({
    messages,
    isLoading,
    error,
    onSendMessage,
    onClearMessages,
    onCancelRequest,
    onExportConversation,
    showWelcome = false,
    onDismissWelcome,
    rateLimits,
    currentSuggestion,
    onAcceptSuggestion,
    onRejectSuggestion,
    onRefineSuggestion,
    suggestionCardComponent: SuggestionCardComponent,
}) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, currentSuggestion]);

    // Auto-focus input
    useEffect(() => {
        if (!isLoading) {
            inputRef.current?.focus();
        }
    }, [isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        onSendMessage(inputValue);
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const isRateLimitLow = rateLimits && rateLimits.remaining_section <= 3;
    const isRateLimitExhausted = rateLimits && rateLimits.remaining_section === 0;

    return (
        <div className="flex flex-col h-[570px] dark:bg-black rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-end p-2 border-b border-gray-300 dark:border-gray-700 dark:bg-black">
                <div className="flex items-center gap-2">
                    {onExportConversation && messages.length > 0 && (
                        <button
                            onClick={onExportConversation}
                            className="p-2 text-gray-700 hover:text-gray-800 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            title="Export conversation"
                        >
                            <Download size={18} />
                        </button>
                    )}
                    {messages.length > 0 && (
                        <button
                            onClick={onClearMessages}
                            className="p-2 text-gray-700 hover:text-red-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            title="Clear conversation"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Welcome Message */}
            {showWelcome && messages.length === 0 && (
                <div className="relative m-4 p-4 bg-gradient-to-r from-purple-900/80 to-pink-900/80 border border-purple-700/50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
                    <button
                        onClick={onDismissWelcome}
                        className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                    <h4 className="font-semibold text-purple-300 mb-2">Hi There!</h4>
                    <p className="text-sm text-gray-300 mb-3">
                        Tell me about yourself naturally, and I'll create professionally formatted content for your resume.
                    </p>
                    <div className="bg-gray-800/50 p-3 rounded text-xs text-gray-300 space-y-2">
                        <p><strong className="text-purple-300">Example:</strong></p>
                        <p className="italic">"I have 3 years of experience building web apps with React and Node.js"</p>
                    </div>
                    <p className="text-sm text-gray-400 mt-3">
                        💡 <strong>Tip:</strong> I'll ask follow-up questions to get the best details!
                    </p>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && !showWelcome && (
                    <div className="flex items-center justify-center h-[95%] text-gray-800 dark:text-gray-500">
                        <div className="text-center max-w-md">
                            <p className="text-2xl mb-4">Hello! How can I help you?</p>
                        </div>
                    </div>
                )}

                {messages.map(message => {
                    const isUser = message.role === 'user';

                    return (
                        <div
                            key={message.id}
                            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg p-4 ${
                                    isUser
                                        ? 'bg-teal-500 dark:bg-teal-600 text-white'
                                        : 'bg-gray-800 text-gray-100 border border-gray-700'
                                }`}
                            >
                                <div className="text-sm whitespace-pre-wrap break-words">
                                    {message.content}
                                </div>
                                <div className="text-xs opacity-60 mt-2">
                                    {message.timestamp.toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Suggestion Card - Rendered if currentSuggestion exists and component provided */}
                {currentSuggestion && SuggestionCardComponent && onAcceptSuggestion && onRejectSuggestion && (
                    <div className="flex justify-start">
                        <div className="max-w-[90%] w-full">
                            <SuggestionCardComponent
                                suggestion={currentSuggestion}
                                onAccept={onAcceptSuggestion}
                                onReject={onRejectSuggestion}
                                onRefine={onRefineSuggestion}
                            />
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Loader2 size={16} className="animate-spin" />
                                <span className="text-sm">AI is thinking...</span>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex justify-center">
                        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 max-w-md">
                            <div className="flex items-start gap-2 text-red-300">
                                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-semibold mb-1">Error</p>
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-300 dark:border-gray-700 p-4 dark:bg-black">
                {isRateLimitLow && !isRateLimitExhausted && (
                    <div className="mb-3 p-2 bg-yellow-900/20 border border-yellow-700 rounded text-xs text-yellow-700 dark:text-yellow-300">
                        ⚠️ Only {rateLimits?.remaining_section} requests remaining for this section
                    </div>
                )}

                {isRateLimitExhausted && (
                    <div className="mb-3 p-3 bg-red-900/20 border border-red-700 rounded text-sm text-red-700 dark:text-red-300">
                        <AlertCircle size={16} className="inline mr-2" />
                        Rate limit reached. Please switch to Manual mode or refresh the page.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            isRateLimitExhausted 
                                ? "Rate limit reached" 
                                : "Tell me about yourself..."
                        }
                        disabled={isLoading || isRateLimitExhausted}
                        className="flex-1 bg-gray-100 dark:bg-gray-950 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 resize-none focus:outline-none focus:border-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        rows={2}
                    />
                    <div className="flex flex-col gap-2">
                        {isLoading && onCancelRequest ? (
                            <button
                                type="button"
                                onClick={onCancelRequest}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 h-full"
                            >
                                <X size={18} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading || isRateLimitExhausted}
                                className="px-4 py-2 bg-resume-primary hover:bg-resume-primary/90 dark:bg-teal-600 dark:hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 h-full"
                            >
                                <ArrowRight size={18} />
                            </button>
                        )}
                    </div>
                </form>

                <p className="text-xs text-gray-800 dark:text-gray-300 mt-2">
                    💡 Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </div>
    );
};