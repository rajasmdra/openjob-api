/* eslint-disable linebreak-style */
/* eslint-disable indent */
import { Router } from 'express';
import validate from '../../middlewares/validate.js';
import authenticateToken from '../../middlewares/auth.js';
import {
    createApplicationPayloadSchema,
    updateApplicationStatusPayloadSchema,
} from './schema.js';
import {
    createApplication,
    deleteApplicationById,
    editApplicationStatusById,
    getAllApplications,
    getApplicationById,
    getApplicationsByJob,
    getApplicationsByUser,
} from './controller.js';

const router = Router();

router.post('/applications', authenticateToken, validate(createApplicationPayloadSchema), createApplication);
router.get('/applications', authenticateToken, getAllApplications);
router.get('/applications/user/:userId', authenticateToken, getApplicationsByUser);
router.get('/applications/job/:jobId', authenticateToken, getApplicationsByJob);
router.get('/applications/:id', authenticateToken, getApplicationById);
router.put('/applications/:id', authenticateToken, validate(updateApplicationStatusPayloadSchema), editApplicationStatusById);
router.delete('/applications/:id', authenticateToken, deleteApplicationById);

export default router;