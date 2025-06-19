/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */


/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Tambahkan foreign key ke album_id terhadap kolom id di tabel album 
  pgm.addConstraint('song', 'fk_song.album_id_album.id', 'FOREIGN KEY(album_id) REFERENCES album(id) ON DELETE CASCADE');  
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('song', 'fk_song.album_id_album.id');  
};
