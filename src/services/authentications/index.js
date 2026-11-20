/* eslint-disable linebreak-style */
/* eslint-disable indent */
import { Router } from 'express';
import { login, logout, refreshToken } from './controller.js';
import authenticateToken from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import {
    deleteAuthenticationPayloadSchema,
    postAuthenticationPayloadSchema,
    putAuthenticationPayloadSchema
} from './schema.js';

const router = Router();

router.post('/authentications', validate(postAuthenticationPayloadSchema), login);
router.put('/authentications', validate(putAuthenticationPayloadSchema), refreshToken);
router.delete('/authentications', authenticateToken, validate(deleteAuthenticationPayloadSchema), logout);

export default router;