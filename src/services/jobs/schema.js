/* eslint-disable linebreak-style */
/* eslint-disable indent */
import Joi from 'joi';

export const jobPayloadSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    company: Joi.string().required(),
    category: Joi.string().required(),
});