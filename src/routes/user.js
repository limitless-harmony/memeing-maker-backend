import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';
import tryCatch from '../helpers/try-catch';
import saveImage from '../middlewares/aws';

const router = Router();

router.get('/:userId', tryCatch(ProfileController.get));
router.put(
  '/',
  tryCatch(ProfileController.update),
  tryCatch(saveImage),
  tryCatch(ProfileController.save)
);
router.put('/:userId/react', tryCatch(ProfileController.react));

export default router;
