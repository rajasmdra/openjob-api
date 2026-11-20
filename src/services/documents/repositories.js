/* eslint-disable linebreak-style */
/* eslint-disable indent */
import { Pool } from 'pg';

class DocumentRepositories {
    constructor() {
        this.pool = new Pool();
    }

    async createDocument({ id, filename, originalName, size }) {
        const query = {
            text: 'INSERT INTO documents (id, filename, original_name, size) VALUES ($1, $2, $3, $4) RETURNING id',
            values: [id, filename, originalName, size],
        };

        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async getAllDocuments() {
        const query = {
            text: 'SELECT * FROM documents',
        };

        const result = await this.pool.query(query);
        return result.rows;
    }

    async getDocumentById(id) {
        const query = {
            text: 'SELECT * FROM documents WHERE id = $1',
            values: [id],
        };

        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async deleteDocumentById(id) {
        const query = {
            text: 'DELETE FROM documents WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this.pool.query(query);

        if (!result.rowCount) {
            return null;
        }

        return result.rows[0].id;
    }
}

export default new DocumentRepositories();