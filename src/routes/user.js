import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

// TODO: FLESH THIS OUT
router.get('/users', UserController.getUsers);

export default router;
