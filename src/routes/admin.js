import { Router } from 'express';

import AdminController from '../controllers/AdminController';
import saveImage from '../middlewares/aws';
import tryCatch from '../helpers/try-catch';

const router = Router();

router.post(
  '/rules',
  tryCatch(AdminController.createRule),
  tryCatch(saveImage),
  tryCatch(AdminController.saveRule)
);

router.put('/memes/:memeId/feature', tryCatch(AdminController.featureAMeme));
router.put(
  '/memes/:memeId/un-feature',
  tryCatch(AdminController.unFeatureAMeme)
);
router.delete('/memes/:memeId/delete', tryCatch(AdminController.deleteMeme));

export default router;
