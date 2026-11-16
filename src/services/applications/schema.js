/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable camelcase */
import Joi from 'joi';

export const createApplicationPayloadSchema = Joi.object({
    user_id: Joi.string().optional(),
    job_id: Joi.string().required(),
    status: Joi.string().valid('pending', 'reviewed', 'accepted', 'rejected').default('pending').optional(),
});

export const updateApplicationStatusPayloadSchema = Joi.object({
    status: Joi.string().valid('pending', 'reviewed', 'accepted', 'rejected').required(),
});