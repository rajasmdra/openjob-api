/* eslint-disable linebreak-style */
/* eslint-disable indent */
import Joi from 'joi';

export const CategoryPayloadSchema = Joi.object({
    name: Joi.string().required(),
});