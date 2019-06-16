import { Router } from 'express';

import WallController from '../controllers/WallController';
import tryCatch from '../helpers/try-catch';

const router = Router();

router.post('/', tryCatch(WallController.create));
router.get('/', tryCatch(WallController.getAll));
router.get('/:id', tryCatch(WallController.getOne));
router.put('/:wallId/:memeId', tryCatch(WallController.addMeme));
router.delete('/:wallId/:memeId', tryCatch(WallController.removeMeme));

export default router;
