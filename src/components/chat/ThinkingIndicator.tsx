import { Mic } from 'lucide-react';

interface ThinkingIndicatorProps {
  isVoiceProcessing?: boolean;
}

export default function ThinkingIndicator({ isVoiceProcessing = false }: ThinkingIndicatorProps) {
  return (
    <div className="flex justify-start" style={{ marginRight: '20%' }}>
      <div className="max-w-[680px] rounded-2xl px-6 py-4 backdrop-blur-xl border bg-white/8 border-violet-500/20 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
        <div className="flex items-center gap-3">
          {isVoiceProcessing ? (
            <>
              {/* Audio processing animation */}
              <div className="flex items-end gap-1 h-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-red-500 to-red-400 rounded-full"
                    style={{
                      animation: `audioBar 0.8s ease-in-out infinite`,
                      animationDelay: `${i * 0.1}s`,
                      height: '40%',
                    }}
                  />
                ))}
              </div>
              <Mic className="w-4 h-4 text-red-400 animate-pulse" />
              <span 
                className="text-sm text-white"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                Processing audio...
              </span>
            </>
          ) : (
            <>
              {/* Thinking dots animation */}
              <div className="flex gap-1">
                <div 
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 animate-pulse"
                  style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
                />
                <div 
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 animate-pulse"
                  style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
                />
                <div 
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 animate-pulse"
                  style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
                />
              </div>
              <span 
                className="text-sm text-white"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                Thinking...
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
