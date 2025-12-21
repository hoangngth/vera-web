import { forwardRef } from 'react';
import MessageBubble from './MessageBubble';
import ThinkingIndicator from './ThinkingIndicator';
import { Message } from './types';

interface MessageThreadProps {
  messages: Message[];
  isProcessing: boolean;
  isVoiceProcessing: boolean;
  onRetry: (messageId: string) => void;
}

const MessageThread = forwardRef<HTMLDivElement, MessageThreadProps>(
  ({ messages, isProcessing, isVoiceProcessing, onRetry }, ref) => {
    return (
      <div 
        ref={ref}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent"
      >
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-cyan-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  What can I help with?
                </h2>
                <p className="text-white text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  Type a message or use voice input to start
                </p>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            {messages.map((message, index) => (
              <MessageBubble 
                key={message.id} 
                message={message}
                onRetry={onRetry}
                isLatest={index === messages.length - 1}
              />
            ))}
            
            {isProcessing && <ThinkingIndicator isVoiceProcessing={isVoiceProcessing} />}
          </div>
        </div>
      </div>
    );
  }
);

MessageThread.displayName = 'MessageThread';

export default MessageThread;
