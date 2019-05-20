import { Router } from 'express';

import WallController from '../controllers/WallController';


const router = Router();

router.post('/', WallController.createMemeWall);
router.get('/', WallController.getMemeWalls);
router.get('/:id', WallController.getAMemeWall);
router.put('/:wallId/:memeId', WallController.addToMemeWall);
router.delete('/:wallId/:memeId', WallController.removeFromMemeWall);

export default router;
