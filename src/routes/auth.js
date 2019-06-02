import { Router } from 'express';
import passport from 'passport';

import ProfileController from '../controllers/ProfileController';
import tryCatch from '../helpers/try-catch';

const router = Router();

router.route('/google').get(passport.authenticate('google'));
router
  .route('/google/success')
  .get(
    passport.authenticate('google', { session: false }),
    tryCatch(ProfileController.finishLogin)
  );

router.route('/linkedin').get(passport.authenticate('linkedin'));
router
  .route('/linkedin/success')
  .get(
    passport.authenticate('linkedin', { session: false }),
    tryCatch(ProfileController.finishLogin)
  );

router.route('/facebook').get(passport.authenticate('facebook'));
router
  .route('/facebook/success')
  .get(
    passport.authenticate('facebook', { session: false }),
    tryCatch(ProfileController.finishLogin)
  );

export default router;
