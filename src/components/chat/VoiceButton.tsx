import { useState, useRef, useEffect } from 'react';
import { Mic, Square } from 'lucide-react';
import AudioWaveform from './AudioWaveform';

interface VoiceButtonProps {
  onTranscriptComplete: (transcript: string) => void;
  disabled: boolean;
}

export default function VoiceButton({ onTranscriptComplete, disabled }: VoiceButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio analysis
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Start recording
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        // In a real implementation, send blob to transcription service
        // For now, simulate transcription
        setTimeout(() => {
          onTranscriptComplete('This is a simulated voice transcription. In a real implementation, this would be the actual transcribed text from your speech.');
        }, 500);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start audio level monitoring
      monitorAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateLevel = () => {
      if (!analyserRef.current || !isRecording) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average / 255);
      
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  };

  const handleClick = () => {
    if (disabled) return;
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`relative p-3 rounded-full transition-all duration-200 ${
          isRecording
            ? 'bg-red-500/20 border-2 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse'
            : disabled
            ? 'bg-white/5 border border-white/10 opacity-50 cursor-not-allowed'
            : 'bg-violet-500/20 border border-violet-500/50 hover:bg-violet-500/30 hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]'
        }`}
      >
        {isRecording ? (
          <Square className="w-5 h-5 text-red-400" />
        ) : (
          <Mic className={`w-5 h-5 ${disabled ? 'text-gray-500' : 'text-violet-400'}`} />
        )}
      </button>

      {/* Audio Waveform Visualizer */}
      {isRecording && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <AudioWaveform audioLevel={audioLevel} />
        </div>
      )}
    </div>
  );
}
