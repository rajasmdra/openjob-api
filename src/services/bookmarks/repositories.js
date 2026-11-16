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
            text: 'SELECT * FROM bookmarks WHERE user_id = $1',
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

    async deleteBookmarkById(id) {
        const query = {
            text: 'DELETE FROM bookmarks WHERE id = $1 RETURNING id',
            values: [id],
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