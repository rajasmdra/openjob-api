/* eslint-disable linebreak-style */
/* eslint-disable indent */
import Joi from 'joi';

export const createJobPayloadSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    companyId: Joi.string().required(),
    categoryId: Joi.string().required(),
});

export const updateJobPayloadSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    categoryId: Joi.string().required(),
});