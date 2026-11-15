/* eslint-disable linebreak-style */
import { Router } from 'express';
import validate from '../../middlewares/validate.js';
import { createCompany, deleteCompanyById, editCompanyById, getAllCompanies, getCompanyById } from './controller.js';
import { companyPayloadSchema } from './schema.js';
import authenticateToken from '../../middlewares/auth.js';

const router = Router();

router.post('/companies', authenticateToken, validate(companyPayloadSchema), createCompany);
router.get('/companies/', getAllCompanies);
router.get('/companies/:id', getCompanyById);
router.put('/companies/:id', authenticateToken, validate(companyPayloadSchema), editCompanyById);
router.delete('/companies/:id', authenticateToken, deleteCompanyById);

export default router;