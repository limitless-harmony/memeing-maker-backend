import { Router } from 'express';
import passport from 'passport';

import UserController from '../controllers/UserController';
import tryCatch from '../helpers/try-catch';

const router = Router();

router.route('/google').get(passport.authenticate('google'));
router
  .route('/google/success')
  .get(
    passport.authenticate('google', { session: false }),
    tryCatch(UserController.loginSuccess)
  );

router.route('/linkedin').get(passport.authenticate('linkedin'));
router
  .route('/linkedin/success')
  .get(
    passport.authenticate('linkedin', { session: false }),
    tryCatch(UserController.loginSuccess)
  );

router.route('/facebook').get(passport.authenticate('facebook'));
router
  .route('/facebook/success')
  .get(
    passport.authenticate('facebook', { session: false }),
    tryCatch(UserController.loginSuccess)
  );

export default router;
