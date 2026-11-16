/* eslint-disable linebreak-style */
/* eslint-disable indent */
import { Router } from 'express';
import validate from '../../middlewares/validate.js';
import authenticateToken from '../../middlewares/auth.js';
import { createJobPayloadSchema, updateJobPayloadSchema } from './schema.js';
import {
    createJob,
    deleteJobById,
    editJobById,
    getAllJobs,
    getJobById,
    getJobsByCategoryId,
    getJobsByCompanyId,
} from './controller.js';

const router = Router();

router.post('/jobs', authenticateToken, validate(createJobPayloadSchema), createJob);
router.get('/jobs', getAllJobs);
router.get('/jobs/company/:companyId', getJobsByCompanyId);
router.get('/jobs/category/:categoryId', getJobsByCategoryId);
router.get('/jobs/:id', getJobById);
router.put('/jobs/:id', authenticateToken, validate(updateJobPayloadSchema), editJobById);
router.delete('/jobs/:id', authenticateToken, deleteJobById);

export default router;