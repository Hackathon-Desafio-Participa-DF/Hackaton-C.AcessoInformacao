import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadService } from './uploadService';
import api from './api';
import { TipoAnexo } from '../types';

vi.mock('./api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('uploadService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('deve enviar arquivo como FormData para /upload', async () => {
      const mockResponse = { url: '/uploads/foto.jpg', tipo: TipoAnexo.IMAGEM };
      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      const file = new File(['conteudo'], 'foto.jpg', { type: 'image/jpeg' });
      const result = await uploadService.uploadFile(file);

      expect(api.post).toHaveBeenCalledWith('/upload', expect.any(FormData), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      expect(result).toEqual(mockResponse);

      // Verifica que o FormData contem o arquivo
      const formData = vi.mocked(api.post).mock.calls[0][1] as FormData;
      expect(formData.get('file')).toBeInstanceOf(File);
    });

    it('deve propagar erro da API', async () => {
      vi.mocked(api.post).mockRejectedValue(new Error('Arquivo muito grande'));

      const file = new File(['x'.repeat(100)], 'grande.mp4', { type: 'video/mp4' });

      await expect(uploadService.uploadFile(file)).rejects.toThrow('Arquivo muito grande');
    });
  });

  describe('uploadAudio', () => {
    it('deve converter Blob em File audio.webm e enviar', async () => {
      const mockResponse = { url: '/uploads/audio.webm', tipo: TipoAnexo.AUDIO };
      vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

      const audioBlob = new Blob(['audio-data'], { type: 'audio/webm' });
      const result = await uploadService.uploadAudio(audioBlob);

      expect(result).toEqual(mockResponse);

      const formData = vi.mocked(api.post).mock.calls[0][1] as FormData;
      const file = formData.get('file') as File;
      expect(file.name).toBe('audio.webm');
      expect(file.type).toBe('audio/webm');
    });
  });
});
