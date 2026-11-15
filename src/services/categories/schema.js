/* eslint-disable linebreak-style */
/* eslint-disable indent */
import Joi from 'joi';

export const notePayloadSchema = Joi.object({
    name: Joi.string().required(),
});