import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import VoiceButton from './VoiceButton';

interface InputDockProps {
  onSendMessage: (content: string, isVoice?: boolean) => void;
  disabled: boolean;
}

export default function InputDock({ onSendMessage, disabled }: InputDockProps) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceComplete = (transcript: string) => {
    // Populate the text input with the transcribed text instead of sending directly
    setInputValue(transcript);
    // Focus the textarea so user can edit or send
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 24 * 4; // 4 lines max
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [inputValue]);

  const canSend = inputValue.trim().length > 0 && !disabled;

  return (
    <div className="relative border-t border-white/10 backdrop-blur-xl bg-white/5">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-end gap-3">
          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={disabled}
              rows={1}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl resize-none outline-none transition-all duration-200 focus:border-cyan-500/50 focus:shadow-[0_0_20px_rgba(0,217,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed scrollbar-hide"
              style={{ 
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '15px',
                maxHeight: '96px',
                color: '#e5e7eb',
              }}
            />
          </div>

          {/* Voice Button */}
          <VoiceButton 
            onTranscriptComplete={handleVoiceComplete}
            disabled={disabled}
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`p-3 rounded-xl transition-all duration-200 ${
              canSend
                ? 'bg-cyan-500/20 border border-cyan-500/50 hover:bg-cyan-500/30 hover:scale-110 hover:shadow-[0_0_20px_rgba(0,217,255,0.6)] active:scale-95 active:rotate-45'
                : 'bg-white/5 border border-white/10 opacity-50 cursor-not-allowed'
            }`}
          >
            <Send 
              className={`w-5 h-5 transition-colors ${
                canSend ? 'text-cyan-400' : 'text-gray-500'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
