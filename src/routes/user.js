import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

// TODO: FLESH THIS OUT
router.get('/:userId', UserController.getUserProfile);

export default router;
