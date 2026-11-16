/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
/* eslint-disable indent */
import Joi from 'joi';

export const bookmarkPayloadSchema = Joi.object({
    user_id: Joi.string().required(),
    job_id: Joi.string().required(),
});