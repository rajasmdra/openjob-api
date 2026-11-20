/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable camelcase */
import { nanoid } from 'nanoid';
import { Pool } from 'pg';

class JobRepositories {
    constructor() {
        this.pool = new Pool();
    }

    async createJob({
        company_id,
        category_id,
        title,
        description,
        job_type,
        experience_level,
        location_type,
        location_city = null,
        salary_min = null,
        salary_max = null,
        is_salary_visible = true,
        status = 'open',
    }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: `INSERT INTO jobs(
                id, company_id, category_id, title, description, 
                job_type, experience_level, location_type, location_city, 
                salary_min, salary_max, is_salary_visible, status, 
                created_at, updated_at
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
            RETURNING id, company_id, category_id, title, description, job_type, experience_level, location_type, location_city, salary_min, salary_max, is_salary_visible, status, created_at, updated_at`,
            values: [
                id, company_id, category_id, title, description,
                job_type, experience_level, location_type, location_city,
                salary_min, salary_max, is_salary_visible, status,
                createdAt, updatedAt,
            ],
        };

        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async getAllJobs({ title, companyName, companyId, categoryName, categoryId } = {}) {
        const conditions = [];
        const values = [];

        if (title) {
            values.push(`%${title}%`);
            conditions.push(`jobs.title ILIKE $${values.length}`);
        }

        if (companyName) {
            values.push(`%${companyName}%`);
            conditions.push(`companies.name ILIKE $${values.length}`);
        }

        if (companyId) {
            values.push(companyId);
            conditions.push(`jobs.company_id = $${values.length}`);
        }

        if (categoryName) {
            values.push(`%${categoryName}%`);
            conditions.push(`categories.name ILIKE $${values.length}`);
        }

        if (categoryId) {
            values.push(categoryId);
            conditions.push(`jobs.category_id = $${values.length}`);
        }

        let text = `
            SELECT 
                jobs.id, jobs.company_id, companies.name AS company_name, jobs.category_id, 
                categories.name AS category_name, jobs.title, jobs.description, jobs.job_type, 
                jobs.experience_level, jobs.location_type, 
                jobs.location_city, jobs.salary_min, jobs.salary_max
            FROM jobs
            LEFT JOIN companies ON jobs.company_id = companies.id
            LEFT JOIN categories ON jobs.category_id = categories.id
        `;

        if (conditions.length > 0) {
            text += ` WHERE ${conditions.join(' AND ')}`;
        }

        const result = await this.pool.query({ text, values });
        return result.rows;
    }

    async getJobsByCompanyId(companyId) {
        const query = {
            text: 'SELECT * FROM jobs WHERE company_id = $1',
            values: [companyId],
        };

        const result = await this.pool.query(query);
        return result.rows;
    }

    async getJobsByCategoryId(categoryId) {
        const query = {
            text: 'SELECT * FROM jobs WHERE category_id = $1',
            values: [categoryId],
        };

        const result = await this.pool.query(query);
        return result.rows;
    }

    async getJobById(id) {
        const query = {
            text: 'SELECT * FROM jobs WHERE id = $1',
            values: [id],
        };

        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async editJobById({
        id,
        company_id,
        category_id,
        title,
        description,
        job_type,
        experience_level,
        location_type,
        location_city = null,
        salary_min = null,
        salary_max = null,
        is_salary_visible = true,
        status,
    }) {
        const updatedAt = new Date().toISOString();

        const query = {
            text: `UPDATE jobs SET 
                company_id = COALESCE($1, company_id),
                category_id = $2, 
                title = $3, 
                description = $4, 
                job_type = $5, 
                experience_level = $6, 
                location_type = $7, 
                location_city = $8, 
                salary_min = $9, 
                salary_max = $10, 
                is_salary_visible = $11, 
                status = $12, 
                updated_at = $13 
            WHERE id = $14 RETURNING id`,
            values: [
                company_id || null, category_id, title, description,
                job_type, experience_level, location_type, location_city,
                salary_min, salary_max, is_salary_visible, status,
                updatedAt, id,
            ],
        };

        const result = await this.pool.query(query);

        if (!result.rowCount) {
            return null;
        }

        return result.rows[0];
    }

    async deleteJobById(id) {
        const query = {
            text: 'DELETE FROM jobs WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this.pool.query(query);

        if (!result.rowCount) {
            return null;
        }

        return result.rows[0].id;
    }

    async verifyJobOwner(id, owner) {
        const query = {
            text: `
                SELECT companies.owner_id 
                FROM jobs 
                INNER JOIN companies ON jobs.company_id = companies.id 
                WHERE jobs.id = $1
            `,
            values: [id],
        };

        const result = await this.pool.query(query);

        if (!result.rows.length) {
            return false;
        }

        const job = result.rows[0];
        return job.owner_id === owner;
    }
}

export default new JobRepositories();