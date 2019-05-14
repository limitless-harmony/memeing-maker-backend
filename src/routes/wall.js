import { Router } from 'express';

import MemeController from '../controllers/MemeController';


const router = Router();

router.post('/', MemeController.createMemeWall);
router.get('/', MemeController.getMemeWalls);
router.get('/:id', MemeController.getAMemeWall);
router.put('/:wallId/:memeId', MemeController.addToMemeWall);
router.delete('/:wallId/:memeId', MemeController.removeFromMemeWall);

export default router;
