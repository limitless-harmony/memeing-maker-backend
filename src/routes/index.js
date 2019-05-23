import { Router } from 'express';

import user from './user';
import meme from './meme';
import wall from './wall';
import auth from './auth';
import { isLoggedIn } from '../middlewares/auth';

const router = Router();

router.use('/users', isLoggedIn, user);
router.use('/memes', meme);
router.use('/auth', auth);
router.use('/walls', isLoggedIn, wall);

export default router;
