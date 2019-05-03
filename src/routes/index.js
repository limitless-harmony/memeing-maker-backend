import { Router } from 'express';

import user from './user';
import meme from './meme';
import wall from './wall';
import auth from './auth';

const router = Router();

router.use('/users', user);
router.use('/memes', meme);
router.use('/auth', auth);
router.use('/meme-walls', wall);

export default router;
