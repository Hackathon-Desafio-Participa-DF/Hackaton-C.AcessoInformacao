import type { Request, Response } from 'express';

export const uploadController = {
  async upload(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'Nenhum arquivo enviado' });
        return;
      }

      const file = req.file;
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const url = `${baseUrl}/uploads/${file.filename}`;

      let tipo: string;
      if (file.mimetype.startsWith('image/')) {
        tipo = 'IMAGEM';
      } else if (file.mimetype.startsWith('video/')) {
        tipo = 'VIDEO';
      } else if (file.mimetype.startsWith('audio/')) {
        tipo = 'AUDIO';
      } else {
        tipo = 'IMAGEM';
      }

      res.json({ url, tipo });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao fazer upload';
      res.status(500).json({ error: message });
    }
  },
};
