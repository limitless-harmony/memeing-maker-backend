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

export default router;
