/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable indent */
import { nanoid } from "nanoid";
import { Pool } from "pg";

class BookmarkRepositories {
    constructor() {
        this.pool = new Pool();
    }

    async createBookmarks({ userId, jobId }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();

        const query = {
            text: 'INSERT INTO bookmarks(id, user_id, job_id, created_at) VALUES($1, $2, $3, $4) RETURNING id, user_id, job_id, created_at',
            values: [id, userId, jobId, createdAt],
        };

        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async getAllBookmarks(userId) {
        const query = {
            text: `
                SELECT 
                    bookmarks.id,bookmarks.user_id,bookmarks.job_id,bookmarks.created_at,
                    jobs.company_id,companies.name AS company_name,jobs.category_id,
                    categories.name AS category_name,jobs.title,jobs.description,jobs.job_type,
                    jobs.experience_level,jobs.location_type,jobs.location_city,jobs.salary_min,
                    jobs.salary_max,jobs.is_salary_visible,jobs.status AS job_status
                FROM bookmarks
                JOIN jobs ON bookmarks.job_id = jobs.id
                LEFT JOIN companies ON jobs.company_id = companies.id
                LEFT JOIN categories ON jobs.category_id = categories.id
                WHERE bookmarks.user_id = $1;
            `,
            values: [userId],
        };
        const result = await this.pool.query(query);
        return result.rows;
    }

    async getBookmarkById(id) {
        const query = {
            text: 'SELECT * FROM bookmarks WHERE id = $1',
            values: [id],
        };
        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async deleteBookmarkByJobAndUser(jobId, userId) {
        const query = {
            text: 'DELETE FROM bookmarks WHERE job_id = $1 AND user_id = $2 RETURNING id',
            values: [jobId, userId],
        };

        const result = await this.pool.query(query);
        if (!result.rowCount) {
            return null;
        }

        return result.rows[0].id;
    }

    async verifyBookmarkOwner(id, userId) {
        const query = {
            text: 'SELECT user_id FROM bookmarks WHERE id = $1',
            values: [id],
        };

        const result = await this.pool.query(query);
        if (!result.rows.length) {
            return false;
        }

        return result.rows[0].user_id === userId;
    }

    async verifyBookmarkExists(userId, jobId) {
        const query = {
            text: 'SELECT id FROM bookmarks WHERE user_id = $1 AND job_id = $2',
            values: [userId, jobId],
        };

        const result = await this.pool.query(query);
        return result.rowCount > 0;
    }
}

export default new BookmarkRepositories();