/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true
    }
  });

  // Aturan id unik berdasarkan playlis_id dan song_id
  pgm.addConstraint('playlist_songs', 'unique_playlist_id_song_id', 'UNIQUE(playlist_id, song_id)');

  // foreign key pada playlist_id terhadap id di tabel playlist
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE');

  // foreign key pada song_id terhadap id di tabel song
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.song_id_song.id', 'FOREIGN KEY(song_id) REFERENCES song(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
