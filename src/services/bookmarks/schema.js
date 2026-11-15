/* eslint-disable linebreak-style */
/* eslint-disable indent */
import Joi from 'joi';

export const createJobPayloadSchema = Joi.object({
    userId: Joi.string().required(),
    jobId: Joi.string().required(),
});