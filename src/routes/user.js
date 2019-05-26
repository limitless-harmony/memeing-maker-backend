import { Router } from 'express';
import UserController from '../controllers/UserController';
import tryCatch from '../helpers/try-catch';
import saveImage from '../middlewares/aws';

const router = Router();

router.get('/:userId', tryCatch(UserController.getUserProfile));
router.put(
  '/',
  tryCatch(UserController.updateProfile),
  tryCatch(saveImage),
  tryCatch(UserController.saveProfile)
);

export default router;
