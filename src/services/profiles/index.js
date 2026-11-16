/* eslint-disable linebreak-style */
/* eslint-disable indent */
import { Router } from 'express';
import authenticateToken from '../../middlewares/auth.js';
import {
    getMyProfile,
    getMyApplications,
    getMyBookmarks,
} from './controller.js';

const router = Router();

router.get('/profile', authenticateToken, getMyProfile);
router.get('/profile/applications', authenticateToken, getMyApplications);
router.get('/profile/bookmarks', authenticateToken, getMyBookmarks);

export default router;