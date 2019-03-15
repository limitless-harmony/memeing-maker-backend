import { Router } from 'express';
import passport from 'passport';

import Auth from '../controllers/Auth';

const router = Router();

router.route('/google')
  .get(passport.authenticate('google', {
    scope: [
      'profile',
      'email'
    ]
  }));

router.route('/google/success')
  .get(passport.authenticate('google', { session: false }), Auth.loginSuccess);

router.route('/linkedin')
  .get(passport.authenticate('linkedin', {
    scope: [
      'r_emailaddress',
      'r_basicprofile'
    ]
  }));

router.route('/linkedin/success')
  .get(passport.authenticate('linkedin', { session: false }), Auth.loginSuccess);

export default router;
