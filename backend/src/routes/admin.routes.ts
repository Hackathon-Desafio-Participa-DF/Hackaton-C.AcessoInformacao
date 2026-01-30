import { Router } from 'express';
import { manifestacaoController, respostaController } from '../controllers/index.js';
import { authMiddleware } from '../middlewares/index.js';

const router = Router();

router.use(authMiddleware);

router.get('/dashboard', manifestacaoController.getStats);
router.get('/manifestacoes', manifestacaoController.list);
router.get('/manifestacoes/:id', manifestacaoController.getById);
router.patch('/manifestacoes/:id/status', manifestacaoController.updateStatus);
router.post('/manifestacoes/:id/resposta', respostaController.create);

export default router;
