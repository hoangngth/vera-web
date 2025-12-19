import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, MicOff } from 'lucide-react';
import AudioWaveform from './AudioWaveform';

interface VoiceButtonProps {
  onTranscriptComplete: (transcript: string) => void;
  disabled: boolean;
}

export default function VoiceButton({ onTranscriptComplete, disabled }: VoiceButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    // Clear any previous error
    setMicError(null);
    
    // Check if getUserMedia is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError('Microphone not supported in this browser');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
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
      
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        
        // Send to transcription API
        await sendToTranscriptionAPI(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start audio level monitoring
      monitorAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      
      // Handle specific error types
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
          case 'PermissionDeniedError':
            setMicError('Microphone access denied. Please allow microphone permission.');
            break;
          case 'NotFoundError':
          case 'DevicesNotFoundError':
            setMicError('No microphone found. Please connect a microphone.');
            break;
          case 'NotReadableError':
          case 'TrackStartError':
            setMicError('Microphone is in use by another application.');
            break;
          case 'OverconstrainedError':
            setMicError('Microphone configuration error.');
            break;
          case 'SecurityError':
            setMicError('Microphone access blocked for security reasons.');
            break;
          default:
            setMicError('Unable to access microphone. Please try again.');
        }
      } else {
        setMicError('Unable to access microphone. Please try again.');
      }
    }
  };

  const sendToTranscriptionAPI = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');

      const response = await fetch(`${import.meta.env.VITE_VERA_API_URL}/transcribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_VERA_API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.status}`);
      }

      const data = await response.json();
      const transcript = data.message || data.text || data.transcript || '';
      
      if (transcript) {
        onTranscriptComplete(transcript);
      }
    } catch (error) {
      console.error('Transcription error:', error);
    } finally {
      setIsTranscribing(false);
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
    if (disabled || isTranscribing) return;
    
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
        disabled={disabled || isTranscribing}
        className={`relative p-3 rounded-full transition-all duration-200 ${
          isRecording
            ? 'bg-red-500/20 border-2 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse'
            : isTranscribing
            ? 'bg-cyan-500/20 border border-cyan-500/50 cursor-wait'
            : disabled
            ? 'bg-white/5 border border-white/10 opacity-50 cursor-not-allowed'
            : 'bg-violet-500/20 border border-violet-500/50 hover:bg-violet-500/30 hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]'
        }`}
      >
        {isTranscribing ? (
          <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
        ) : isRecording ? (
          <Square className="w-5 h-5 text-red-400" />
        ) : (
          <Mic className={`w-5 h-5 ${disabled ? 'text-gray-500' : 'text-violet-400'}`} />
        )}
      </button>

      {/* Recording Status Label */}
      {isRecording && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-xs text-red-400 font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Recording...
          </span>
        </div>
      )}

      {/* Transcribing Status Label */}
      {isTranscribing && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-xs text-cyan-400 font-medium">
            Transcribing...
          </span>
        </div>
      )}

      {/* Microphone Error Message */}
      {micError && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <MicOff className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs text-red-400 font-medium">{micError}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMicError(null);
              }}
              className="text-red-400 hover:text-red-300 ml-1"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Audio Waveform Visualizer */}
      {isRecording && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2">
          <AudioWaveform audioLevel={audioLevel} />
        </div>
      )}
    </div>
  );
}
