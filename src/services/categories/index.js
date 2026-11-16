/* eslint-disable linebreak-style */
import { Router } from 'express';
import validate from '../../middlewares/validate.js';
import authenticateToken from '../../middlewares/auth.js';
import { CategoryPayloadSchema } from './schema.js';
import { createCategory, deleteCategoryById, editCategoryById, getAllCategories, getCategoryById } from './controller.js';

const router = Router();

router.post('/categories', authenticateToken, validate(CategoryPayloadSchema), createCategory);
router.get('/categories', getAllCategories);
router.get('/categories/:id', getCategoryById);
router.put('/categories/:id', authenticateToken, validate(CategoryPayloadSchema), editCategoryById);
router.delete('/categories/:id', authenticateToken, deleteCategoryById);

export default router;