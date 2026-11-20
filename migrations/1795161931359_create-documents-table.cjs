/* eslint-disable indent */
/* eslint-disable camelcase */
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
    pgm.createTable('documents', {
        id: {
            primaryKey: true,
            type: 'VARCHAR(50)',
        },
        filename: {
            notNull: true,
            type: 'TEXT',
        },
        original_name: {
            notNull: true,
            type: 'TEXT',
        },
        size: {
            type: 'INTEGER',
            notNull: true,
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('documents');
};