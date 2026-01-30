import { Router } from 'express';
import { manifestacaoController } from '../controllers/index.js';

const router = Router();

router.post('/', manifestacaoController.create);
router.get('/:protocolo', manifestacaoController.getByProtocolo);

export default router;
