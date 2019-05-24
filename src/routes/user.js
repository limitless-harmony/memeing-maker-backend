import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

router.get('/:userId', UserController.getUserProfile);
router.put('/:userId', UserController.updateUserData);

export default router;
