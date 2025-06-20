const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const mapDbToModel = require("../../utils");
const InvariantError = require("../../exeptions/InvariantError");
const NotFoundError = require("../../exeptions/NotFoundError");

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO song VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Gagal menambahkan lagu");
    }

    return result.rows[0].id;
  }

  async getAllSongs() {
    const result = await this._pool.query(
      "SELECT id, title, performer FROM song"
    );
    return result.rows.map(mapDbToModel);
  }

  async getSongsDetail(title, performer) {
    let baseQuery = "SELECT id, title, performer FROM song WHERE 1=1";
    const values = [];
    let index = 1;

    if (title) {
      baseQuery += ` AND LOWER(title) LIKE LOWER($${index++})`;
      values.push(`%${title}%`);
    }

    if (performer) {
      baseQuery += ` AND LOWER(performer) LIKE LOWER($${index++})`;
      values.push(`%${performer}%`);
    }

    const query = {
      text: baseQuery,
      values,
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    return result.rows
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM song WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    return result.rows[0];
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: "UPDATE song SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id",
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("gagal update, lagu tidak ditemukan");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM song WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("gagal menghapus, lagu tidak ditemukan");
    }
  }
}

module.exports = SongService;
