import { Router } from 'express';
import { uploadController } from '../controllers/index.js';
import { upload } from '../middlewares/index.js';

const router = Router();

router.post('/', upload.single('file'), uploadController.upload);

export default router;
