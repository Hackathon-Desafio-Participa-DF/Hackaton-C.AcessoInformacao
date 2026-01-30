import { Router } from 'express';
import manifestacaoRoutes from './manifestacao.routes.js';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import uploadRoutes from './upload.routes.js';

const router = Router();

router.use('/manifestacoes', manifestacaoRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);

export default router;
