/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable indent */
import { nanoid } from "nanoid";
import { Pool } from "pg";

class CompanyRepositories {
    constructor() {
        this.pool = new Pool();
    }

    async createCompany({ name, description, owner }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: 'INSERT INTO companies(id, name, description, created_at, updated_at, owner_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, name, description, created_at, updated_at, owner_id',
            values: [id, name, description, createdAt, updatedAt, owner],
        };

        const result = await this.pool.query(query);

        return result.rows[0];
    }

    async getAllCompanies() {
        const query = {
            text: 'SELECT * FROM companies',
        };

        const result = await this.pool.query(query);
        return result.rows;
    }

    async getCompanyById(id) {
        const query = {
            text: 'SELECT * FROM companies WHERE id = $1',
            values: [id],
        };
        const result = await this.pool.query(query);

        return result.rows[0];
    }

    async editCompanyById({ id, name, description }) {
        const updatedAt = new Date().toISOString();

        const query = {
            text: 'UPDATE companies SET name = $1, description = $2, updated_at = $3 WHERE id = $4 RETURNING id',
            values: [name, description, updatedAt, id],
        };

        const result = await this.pool.query(query);

        if (!result.rowCount) {
            return null;
        }

        return result.rows[0];
    }

    async deleteCompanyById(id) {
        const query = {
            text: 'DELETE FROM companies WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this.pool.query(query);

        if (!result.rowCount) {
            return null;
        }

        return result.rows[0].id;
    }

    async verifyCompanyOwner(id, owner) {
        const query = {
            text: 'SELECT owner_id FROM companies WHERE id = $1',
            values: [id],
        };

        const result = await this.pool.query(query);

        if (!result.rows.length) {
            return false;
        }

        const company = result.rows[0];
        return company.owner_id === owner;
    }
}

export default new CompanyRepositories();