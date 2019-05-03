import { Router } from 'express';
import passport from 'passport';

import Auth from '../controllers/Auth';
import { isLoggedIn } from '../middlewares/auth';

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

// Testing the middleware
router.route('/protected')
  .get(isLoggedIn, (req, res) => res.status(200).json(req.user));

export default router;
