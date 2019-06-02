import { Router } from 'express';

import MemeController from '../controllers/MemeController';
import saveImage from '../middlewares/aws';
import tryCatch from '../helpers/try-catch';

const router = Router();

router.get('/', tryCatch(MemeController.getMany));
router.get('/:memeId', tryCatch(MemeController.getOne));
router.put('/:memeId/react', tryCatch(MemeController.react));
router.put('/:memeId/flag', tryCatch(MemeController.flag));

router.post(
  '/',
  tryCatch(MemeController.create),
  tryCatch(saveImage),
  tryCatch(MemeController.save)
);

router.put(
  '/:memeId/edit',
  tryCatch(MemeController.edit),
  tryCatch(saveImage),
  tryCatch(MemeController.save)
);

export default router;
