import { Router } from 'express';
import passport from 'passport';

import Auth from '../controllers/Auth';

const router = Router();

router.route('/google')
  .get(passport.authenticate('google'));
router.route('/google/success')
  .get(passport.authenticate('google', { session: false }), Auth.loginSuccess);

router.route('/linkedin')
  .get(passport.authenticate('linkedin'));
router.route('/linkedin/success')
  .get(passport.authenticate('linkedin', { session: false }), Auth.loginSuccess);

router.route('/facebook')
  .get(passport.authenticate('facebook'));
router.route('/facebook/success')
  .get(passport.authenticate('facebook', { session: false }), Auth.loginSuccess);

export default router;
