import { MicrophoneIcon, StopIcon, PauseIcon, PlayIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useAudioRecorder } from '../../hooks';
import { Button } from '../ui';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  disabled?: boolean;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function AudioRecorder({ onRecordingComplete, disabled }: AudioRecorderProps) {
  const {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useAudioRecorder();

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleConfirmRecording = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
    }
  };

  const handleReset = () => {
    resetRecording();
  };

  if (audioUrl && audioBlob) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm font-medium text-gray-700">Áudio gravado</p>
          <audio
            controls
            src={audioUrl}
            className="w-full max-w-md"
            aria-label="Reproduzir áudio gravado"
          >
            Seu navegador não suporta reprodução de áudio.
          </audio>
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              leftIcon={<TrashIcon className="h-4 w-4" aria-hidden="true" />}
            >
              Descartar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmRecording}
            >
              Usar este áudio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
      <div className="flex flex-col items-center space-y-4">
        {!isRecording ? (
          <>
            <MicrophoneIcon className="h-12 w-12 text-gray-400" aria-hidden="true" />
            <p className="text-sm text-gray-600 text-center">
              Clique para gravar sua mensagem em áudio
            </p>
            <Button
              type="button"
              onClick={startRecording}
              disabled={disabled}
              leftIcon={<MicrophoneIcon className="h-4 w-4" aria-hidden="true" />}
              aria-label="Iniciar gravação de áudio"
            >
              Iniciar Gravação
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <span
                className="h-3 w-3 rounded-full bg-red-500 animate-pulse"
                aria-hidden="true"
              />
              <span className="text-lg font-mono font-semibold" aria-live="polite">
                {formatTime(recordingTime)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {isPaused ? 'Gravação pausada' : 'Gravando...'}
            </p>
            <div className="flex space-x-3">
              {isPaused ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resumeRecording}
                  leftIcon={<PlayIcon className="h-4 w-4" aria-hidden="true" />}
                  aria-label="Continuar gravação"
                >
                  Continuar
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={pauseRecording}
                  leftIcon={<PauseIcon className="h-4 w-4" aria-hidden="true" />}
                  aria-label="Pausar gravação"
                >
                  Pausar
                </Button>
              )}
              <Button
                type="button"
                variant="danger"
                onClick={handleStopRecording}
                leftIcon={<StopIcon className="h-4 w-4" aria-hidden="true" />}
                aria-label="Parar gravação"
              >
                Parar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
