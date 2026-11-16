/* eslint-disable camelcase */
/* eslint-disable indent */
exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('companies', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'VARCHAR(100)',
            notNull: true,
        },
        location: {
            type: 'TEXT',
            notNull: true,
        },
        description: {
            type: 'TEXT',
            notNull: true,
        },
        owner_id: {
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

    pgm.addConstraint('companies', 'fk_companies.owner_id_users.id', 'FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    pgm.dropTable('companies');
};