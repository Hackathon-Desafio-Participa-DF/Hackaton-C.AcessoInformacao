import api from './api';
import type { TipoAnexo } from '../types';

interface UploadResponse {
  url: string;
  tipo: TipoAnexo;
}

export const uploadService = {
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async uploadAudio(audioBlob: Blob): Promise<UploadResponse> {
    const formData = new FormData();
    const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
    formData.append('file', file);

    const response = await api.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
