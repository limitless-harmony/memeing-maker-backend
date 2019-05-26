import { Router } from 'express';

import MemeController from '../controllers/MemeController';
import saveImage from '../middlewares/aws';
import { isLoggedIn } from '../middlewares/auth';
import tryCatch from '../helpers/try-catch';

const router = Router();

router.get('/featured', tryCatch(MemeController.getFeaturedMemes));

router.get('/', isLoggedIn, tryCatch(MemeController.getMany));
router.get('/:memeId', isLoggedIn, tryCatch(MemeController.getOne));
router.put('/:memeId/react', isLoggedIn, tryCatch(MemeController.react));
router.put('/:memeId/flag', isLoggedIn, tryCatch(MemeController.flag));
router.post(
  '/',
  isLoggedIn,
  tryCatch(MemeController.create),
  tryCatch(saveImage),
  tryCatch(MemeController.save)
);

router.put(
  '/:memeId/edit',
  isLoggedIn,
  tryCatch(MemeController.edit),
  tryCatch(saveImage),
  tryCatch(MemeController.save)
);

export default router;
