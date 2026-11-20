/* eslint-disable linebreak-style */
import { Router } from 'express';
import authenticateToken from '../../middlewares/auth.js';
import { upload } from './storage-config.js';
import { createDocument, deleteDocumentById, getAllDocuments, getDocumentById } from './controller.js';

const router = Router();

router.post('/documents', authenticateToken, upload.single('document'), createDocument);
router.get('/documents', getAllDocuments);
router.get('/documents/:id', getDocumentById);
router.delete('/documents/:id', authenticateToken, deleteDocumentById);

export default router;