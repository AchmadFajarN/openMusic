/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('playlist', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true  
    },
    name: {
      type: 'TEXT',
      notNull: true  
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true  
    }
  });
  
  pgm.addConstraint('playlist', 'fk_playlist.owner_user.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('playlist');  
};
