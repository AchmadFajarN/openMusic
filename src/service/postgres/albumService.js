const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exeptions/InvariantError");
const NotFoundError = require("../../exeptions/NotFoundError");

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO album VALUES($1, $2, $3) RETURNING id",
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: `SELECT 
              album.id, 
              album.name, 
              album.year,
              cover_url.url 
             FROM album 
             LEFT JOIN cover_url ON album.id = cover_url.album_id
             WHERE album.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    const songQuery = {
      text: "SELECT * FROM song WHERE album_id = $1",
      values: [id]
    }

    const songs = await this._pool.query(songQuery);
    const resulAlbumWithSong = {
      ...result.rows[0],
      songs: songs.rows
    }
  

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return resulAlbumWithSong
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE album SET name = $1, year = $2 WHERE id = $3 RETURNING id",
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal update album tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM album WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal menghapus album tidak ditemukan");
    }
  }
}

module.exports = AlbumService;
