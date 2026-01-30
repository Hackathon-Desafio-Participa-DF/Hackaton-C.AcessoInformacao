import { useCallback, useState } from 'react';
import { CloudArrowUpIcon, XMarkIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui';

interface UploadedFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptImages?: boolean;
  acceptVideos?: boolean;
  disabled?: boolean;
}

export default function FileUpload({
  onFilesChange,
  maxFiles = 5,
  maxSizeMB = 50,
  acceptImages = true,
  acceptVideos = true,
  disabled = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const acceptedTypes: string[] = [];
  if (acceptImages) acceptedTypes.push('image/*');
  if (acceptVideos) acceptedTypes.push('video/*');

  const validateFile = useCallback((file: File): string | null => {
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      return `Arquivo ${file.name} excede o tamanho máximo de ${maxSizeMB}MB`;
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      return `Tipo de arquivo não suportado: ${file.type}`;
    }

    if (isImage && !acceptImages) {
      return 'Imagens não são aceitas';
    }

    if (isVideo && !acceptVideos) {
      return 'Vídeos não são aceitos';
    }

    return null;
  }, [maxSizeMB, acceptImages, acceptVideos]);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles: UploadedFile[] = [];

    for (const file of fileArray) {
      if (files.length + validFiles.length >= maxFiles) {
        setError(`Máximo de ${maxFiles} arquivos permitidos`);
        break;
      }

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        continue;
      }

      const isImage = file.type.startsWith('image/');
      validFiles.push({
        file,
        preview: URL.createObjectURL(file),
        type: isImage ? 'image' : 'video',
      });
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles.map((f) => f.file));
      setError(null);
    }
  }, [files, maxFiles, validateFile, onFilesChange]);

  const removeFile = useCallback((index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    URL.revokeObjectURL(files[index].preview);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles.map((f) => f.file));
  }, [files, onFilesChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, [disabled, addFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
    e.target.value = '';
  }, [addFiles]);

  return (
    <div className="space-y-4">
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary-400'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Área de upload de arquivos"
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            document.getElementById('file-upload-input')?.click();
          }
        }}
      >
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
        <p className="mt-2 text-sm text-gray-600">
          Arraste arquivos aqui ou{' '}
          <label htmlFor="file-upload-input" className="text-primary-500 hover:text-primary-600 cursor-pointer font-medium">
            clique para selecionar
          </label>
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {acceptImages && acceptVideos && 'Imagens e vídeos'}
          {acceptImages && !acceptVideos && 'Apenas imagens'}
          {!acceptImages && acceptVideos && 'Apenas vídeos'}
          {' - '}Máximo {maxSizeMB}MB por arquivo
        </p>
        <input
          id="file-upload-input"
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          disabled={disabled}
          className="sr-only"
          aria-describedby={error ? 'file-upload-error' : undefined}
        />
      </div>

      {error && (
        <p id="file-upload-error" className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div
              key={`${file.file.name}-${index}`}
              className="relative group rounded-lg overflow-hidden border border-gray-200"
            >
              {file.type === 'image' ? (
                <img
                  src={file.preview}
                  alt={`Preview de ${file.file.name}`}
                  className="w-full h-24 object-cover"
                />
              ) : (
                <div className="w-full h-24 bg-gray-100 flex items-center justify-center">
                  <VideoCameraIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  onClick={() => removeFile(index)}
                  aria-label={`Remover ${file.file.name}`}
                >
                  <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                <p className="text-xs text-white truncate">{file.file.name}</p>
              </div>
              <div className="absolute top-1 left-1">
                {file.type === 'image' ? (
                  <PhotoIcon className="h-4 w-4 text-white drop-shadow" aria-hidden="true" />
                ) : (
                  <VideoCameraIcon className="h-4 w-4 text-white drop-shadow" aria-hidden="true" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
