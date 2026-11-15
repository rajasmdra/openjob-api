/* eslint-disable linebreak-style */
/* eslint-disable indent */
import Joi from 'joi';

export const companyPayloadSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
});