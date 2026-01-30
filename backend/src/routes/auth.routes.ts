import { Router } from 'express';
import { authController } from '../controllers/index.js';

const router = Router();

router.post('/login', authController.login);

export default router;
