/* eslint-disable linebreak-style */
import { Router } from 'express';
import validate from '../../middlewares/validate.js';
import authenticateToken from '../../middlewares/auth.js';
import { bookmarkPayloadSchema } from './schema.js';
import { createBookmarks, deleteBookmarkByJobId, getAllBookmarks, getBookmarkById } from './controller.js';

const router = Router();

router.post('/jobs/:jobId/bookmark', validate(bookmarkPayloadSchema), authenticateToken, createBookmarks);
router.delete('/jobs/:jobId/bookmark', authenticateToken, deleteBookmarkByJobId);
router.get('/bookmarks', authenticateToken, getAllBookmarks);
router.get('/jobs/:jobId/bookmark/:id', authenticateToken, getBookmarkById);

export default router;