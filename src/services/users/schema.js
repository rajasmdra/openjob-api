/* eslint-disable linebreak-style */
/* eslint-disable indent */
import Joi from 'joi';

export const userPayloadSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
});