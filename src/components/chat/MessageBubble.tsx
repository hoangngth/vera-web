import { useState, useEffect } from 'react';
import { AlertCircle, RotateCw } from 'lucide-react';
import { Message } from './types';

interface MessageBubbleProps {
  message: Message;
  onRetry: (messageId: string) => void;
  isLatest: boolean;
}

export default function MessageBubble({ message, onRetry, isLatest }: MessageBubbleProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Typewriter effect for assistant messages
  useEffect(() => {
    if (message.role === 'assistant' && isLatest) {
      setIsTyping(true);
      setDisplayedContent('');
      
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < message.content.length) {
          setDisplayedContent(message.content.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    } else {
      setDisplayedContent(message.content);
    }
  }, [message.content, message.role, isLatest]);

  const isUser = message.role === 'user';
  
  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-5 duration-400`}
      style={{ 
        animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        marginLeft: isUser ? '20%' : '0',
        marginRight: isUser ? '0' : '20%',
      }}
    >
      <div 
        className={`max-w-[680px] rounded-2xl px-6 py-4 backdrop-blur-xl border ${
          isUser 
            ? 'bg-white/8 border-cyan-500/20 shadow-[0_0_20px_rgba(0,217,255,0.15)]' 
            : 'bg-white/8 border-violet-500/20 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
        }`}
      >
        <div 
          className="text-[15px] leading-relaxed whitespace-pre-wrap break-words text-white"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {displayedContent}
          {isTyping && (
            <span className="inline-block w-[2px] h-[18px] bg-cyan-400 ml-1 animate-pulse" />
          )}
        </div>
        
        <div 
          className="mt-2 text-[11px] opacity-60 text-white"
          style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 300 }}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {message.isVoice && ' • Voice'}
        </div>

        {message.error && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>Failed to send</span>
            <button
              onClick={() => onRetry(message.id)}
              className="ml-2 flex items-center gap-1 px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 transition-colors"
            >
              <RotateCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
