/* eslint-disable linebreak-style */
/* eslint-disable indent */
import { nanoid } from 'nanoid';
import { Pool } from 'pg';

class JobRepositories {
    constructor() {
        this.pool = new Pool();
    }

    async createJob({ title, description, companyId, categoryId }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: 'INSERT INTO jobs(id, title, description, company_id, category_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, title, description, company_id, category_id, created_at, updated_at',
            values: [id, title, description, companyId, categoryId, createdAt, updatedAt],
        };

        const result = await this.pool.query(query);

        return result.rows[0];
    }

    async getAllJobs({ title, companyId, categoryId } = {}) {
        const conditions = [];
        const values = [];

        if (title) {
            values.push(`%${title}%`);
            conditions.push(`title ILIKE $${values.length}`);
        }

        if (companyId) {
            values.push(companyId);
            conditions.push(`company_id = $${values.length}`);
        }

        if (categoryId) {
            values.push(categoryId);
            conditions.push(`category_id = $${values.length}`);
        }

        let text = 'SELECT * FROM jobs';
        if (conditions.length > 0) {
            text += ` WHERE ${conditions.join(' AND ')}`;
        }

        const result = await this.pool.query({ text, values });
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

    async editJobById({ id, title, description, categoryId }) {
        const updatedAt = new Date().toISOString();

        const query = {
            text: 'UPDATE jobs SET title = $1, description = $2, category_id = $3, updated_at = $4 WHERE id = $5 RETURNING id',
            values: [title, description, categoryId, updatedAt, id],
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