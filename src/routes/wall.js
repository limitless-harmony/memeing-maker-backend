import { Router } from 'express';

import WallController from '../controllers/WallController';

const router = Router();

router.post('/', WallController.create);
router.get('/', WallController.getMany);
router.get('/:id', WallController.getOne);
router.put('/:wallId/:memeId', WallController.addMeme);
router.delete('/:wallId/:memeId', WallController.removeMeme);

export default router;
