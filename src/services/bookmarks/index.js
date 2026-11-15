/* eslint-disable linebreak-style */
import { Router } from 'express';
import validate from '../../middlewares/validate.js';
import authenticateToken from '../../middlewares/auth.js';
import { bookmarkPayloadSchema } from './schema.js';
import { createBookmarks, deleteBookmarkById, getAllBookmarks, getBookmarkById } from './controller.js';

const router = Router();

router.post('/bookmarks', authenticateToken, validate(bookmarkPayloadSchema), createBookmarks);
router.get('/bookmarks', authenticateToken, getAllBookmarks);
router.get('/bookmarks/:id', authenticateToken, getBookmarkById);
router.delete('/bookmarks/:id', authenticateToken, deleteBookmarkById);

export default router;