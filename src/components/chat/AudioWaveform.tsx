interface AudioWaveformProps {
  audioLevel: number;
}

export default function AudioWaveform({ audioLevel }: AudioWaveformProps) {
  const bars = 12;
  
  return (
    <div className="flex items-center gap-1 px-4 py-2 rounded-lg backdrop-blur-xl bg-white/10 border border-violet-500/30">
      {Array.from({ length: bars }).map((_, i) => {
        const delay = i * 50;
        const baseHeight = 4;
        const maxHeight = 24;
        const height = baseHeight + (audioLevel * maxHeight * (0.5 + Math.random() * 0.5));
        
        return (
          <div
            key={i}
            className="w-1 bg-gradient-to-t from-cyan-400 to-violet-400 rounded-full transition-all duration-100"
            style={{
              height: `${height}px`,
              animationDelay: `${delay}ms`,
            }}
          />
        );
      })}
    </div>
  );
}
