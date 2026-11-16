/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable camelcase */
import Joi from 'joi';

export const createJobPayloadSchema = Joi.object({
    company_id: Joi.string().required(),
    category_id: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    job_type: Joi.string().valid('full-time', 'part-time', 'contract', 'internship', 'freelance').required(),
    experience_level: Joi.string().valid('entry', 'mid', 'senior', 'lead').required(),
    location_type: Joi.string().valid('onsite', 'remote', 'hybrid').required(),
    location_city: Joi.string().allow('', null).optional(),
    salary_min: Joi.number().min(0).allow(null).optional(),
    salary_max: Joi.number().min(Joi.ref('salary_min')).allow(null).optional(),
    is_salary_visible: Joi.boolean().default(true).optional(),
    status: Joi.string().valid('open', 'close').default('open').optional(),
});

export const updateJobPayloadSchema = Joi.object({
    company_id: Joi.string().optional(),
    category_id: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    job_type: Joi.string().valid('full-time', 'part-time', 'contract', 'internship', 'freelance').required(),
    experience_level: Joi.string().valid('entry', 'mid', 'senior', 'lead').required(),
    location_type: Joi.string().valid('onsite', 'remote', 'hybrid').required(),
    location_city: Joi.string().allow('', null).optional(),
    salary_min: Joi.number().min(0).allow(null).optional(),
    salary_max: Joi.number().min(Joi.ref('salary_min')).allow(null).optional(),
    is_salary_visible: Joi.boolean().optional(),
    status: Joi.string().valid('open', 'close').required(),
});