/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable indent */
import { nanoid } from "nanoid";
import { Pool } from "pg";

class ApplicationRepositories {
    constructor() {
        this.pool = new Pool();
    }

    async createApplication({ userId, jobId, status }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: 'INSERT INTO applications(id, user_id, job_id, status, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, user_id, job_id, status, created_at, updated_at',
            values: [id, userId, jobId, status, createdAt, updatedAt],
        };

        const result = await this.pool.query(query);

        return result.rows[0];
    }

    async getAllApplications() {
        const query = {
            text: 'SELECT * FROM applications',
            values: [],
        };

        const result = await this.pool.query(query);
        return result.rows;
    }

    async getApplicationById(id) {
        const query = {
            text: 'SELECT * FROM applications WHERE id = $1',
            values: [id],
        };
        const result = await this.pool.query(query);

        return result.rows[0];
    }

    async getApplicationsByUser(userId) {
        const query = {
            text: 'SELECT * FROM applications WHERE user_id = $1',
            values: [userId],
        };

        const result = await this.pool.query(query);
        return result.rows;
    }

    async getApplicationsByJob(jobId) {
        const query = {
            text: 'SELECT * FROM applications WHERE job_id = $1',
            values: [jobId],
        };

        const result = await this.pool.query(query);
        return result.rows;
    }

    async editApplicationStatusById({ id, status }) {
        const updatedAt = new Date().toISOString();

        const query = {
            text: 'UPDATE applications SET status = $1, updated_at = $2 WHERE id = $3 RETURNING id',
            values: [status, updatedAt, id],
        };

        const result = await this.pool.query(query);

        if (!result.rowCount) {
            return null;
        }

        return result.rows[0];
    }

    async deleteApplicationById(id) {
        const query = {
            text: 'DELETE FROM applications WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this.pool.query(query);

        if (!result.rowCount) {
            return null;
        }

        return result.rows[0].id;
    }

    async verifyApplicationOwner(id, userId) {
        const query = {
            text: 'SELECT user_id FROM applications WHERE id = $1',
            values: [id],
        };

        const result = await this.pool.query(query);
        if (!result.rows.length) {
            return false;
        }

        return result.rows[0].user_id === userId;
    }

    async verifyApplicationJobOwner(id, ownerId) {
        const query = {
            text: `
                SELECT companies.owner_id
                FROM applications
                INNER JOIN jobs ON applications.job_id = jobs.id
                INNER JOIN companies ON jobs.company_id = companies.id
                WHERE applications.id = $1
            `,
            values: [id],
        };

        const result = await this.pool.query(query);
        if (!result.rows.length) {
            return false;
        }

        return result.rows[0].owner_id === ownerId;
    }

    async verifyApplicationExists(userId, jobId) {
        const query = {
            text: 'SELECT id FROM applications WHERE user_id = $1 AND job_id = $2',
            values: [userId, jobId],
        };

        const result = await this.pool.query(query);
        return result.rowCount > 0;
    }
}

export default new ApplicationRepositories();