import { Router } from 'express';

import user from './user';
import meme from './meme';
import admin from './admin';
import wall from './wall';
import auth from './auth';
import MemeController from '../controllers/MemeController';
import tryCatch from '../helpers/try-catch';
import isLoggedIn from '../middlewares/auth';
import isAdmin from '../middlewares/admin';

const router = Router();

// Public routes
router.get('/memes/featured', tryCatch(MemeController.getFeatured));
router.get('/rules', tryCatch(MemeController.getRules));
router.use('/auth', auth);

// Users routes (require login)
router.use('/users', isLoggedIn, user);
router.use('/memes', isLoggedIn, meme);
router.use('/walls', isLoggedIn, wall);

// Admin routes (require admin or SuperAdmin roles)
router.use('/admin', isLoggedIn, isAdmin, admin);

export default router;
