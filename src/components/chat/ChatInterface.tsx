import { useState, useRef, useEffect } from 'react';
import MessageThread from './MessageThread';
import InputDock from './InputDock';
import { Message } from './types';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVoiceProcessing, setIsVoiceProcessing] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (content: string, isVoice: boolean = false) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      isVoice,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setIsVoiceProcessing(isVoice);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a simulated response. In a real implementation, this would connect to an AI service.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
      setIsVoiceProcessing(false);
    }, 1500);
  };

  const handleRetry = (messageId: string) => {
    // Find the message and retry
    const message = messages.find(m => m.id === messageId);
    if (message && message.role === 'user') {
      handleSendMessage(message.content, message.isVoice);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTo({
        top: threadRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#1a0f2e]">
      {/* Background mesh gradient effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-violet-500/10 pointer-events-none" />
      
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-5">
          <h1 
            className="text-2xl font-bold tracking-[0.15em] bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            VERA
          </h1>
        </div>

        <MessageThread 
          ref={threadRef}
          messages={messages} 
          isProcessing={isProcessing}
          isVoiceProcessing={isVoiceProcessing}
          onRetry={handleRetry}
        />
        <InputDock 
          onSendMessage={handleSendMessage} 
          disabled={isProcessing}
        />
      </div>
    </div>
  );
}
