/* eslint-disable linebreak-style */
import { Router } from 'express';
import { createUser, getUserById } from './controller.js';
import validate from '../../middlewares/validate.js';
import { userPayloadSchema } from './schema.js';

const router = Router();

router.post('/users', validate(userPayloadSchema), createUser);
router.get('/users/:id', getUserById);

export default router;