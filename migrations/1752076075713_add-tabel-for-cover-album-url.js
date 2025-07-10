/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("cover_url", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    album_id: {
      type: "TEXT",
      notNull: true,
      references: "album(id)",
      onDelete: "cascade",
      onUpdate: "cascade",
    },
    url: {
      type: "TEXT",
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
  pgm.dropTable("cover_url");
};
