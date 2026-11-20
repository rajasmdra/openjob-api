/* eslint-disable linebreak-style */
/* eslint-disable indent */
import { Pool } from 'pg';

class ProfileRepositories {
    constructor() {
        this.pool = new Pool();
    }

    async getMyApplications(userId) {
        const query = {
            text: `
                SELECT 
                    applications.id, applications.user_id, applications.job_id, jobs.title AS job_title, 
                    jobs.description AS job_description, companies.name AS company_name, 
                    companies.location AS company_location, categories.name AS category_name, 
                    jobs.job_type, jobs.experience_level, jobs.location_type, jobs.location_city, 
                    jobs.salary_min, jobs.salary_max, applications.status
                FROM applications
                JOIN jobs ON applications.job_id = jobs.id
                LEFT JOIN companies ON jobs.company_id = companies.id
                LEFT JOIN categories ON jobs.category_id = categories.id
                WHERE applications.user_id = $1;
            `,
            values: [userId],
        };

        const result = await this.pool.query(query);
        return result.rows;
    }
}

export default new ProfileRepositories();