import { Router } from 'express';
import UserController from '../controllers/UserController';
import tryCatch from '../helpers/try-catch';

const router = Router();

router.get('/:userId', tryCatch(UserController.getUserProfile));
router.put('/', tryCatch(UserController.updateUserData));
router.get('/:email/:username', tryCatch(UserController.getText));

export default router;
