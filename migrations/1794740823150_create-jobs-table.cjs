/* eslint-disable camelcase */
/* eslint-disable indent */
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('jobs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'TEXT',
            notNull: true,
        },
        company_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        category_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        created_at: {
            type: 'TEXT',
            notNull: true,
        },
        updated_at: {
            type: 'TEXT',
            notNull: true,
        },
    });
    pgm.addConstraint('jobs', 'fk_collaborations.company_id_companies.id', 'FOREIGN KEY(company_id) REFERENCES companies(id) ON DELETE CASCADE');
    pgm.addConstraint('jobs', 'fk_collaborations.category_id_categories.id', 'FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('jobs');
};
