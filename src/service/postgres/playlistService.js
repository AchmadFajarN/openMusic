const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exeptions/InvariantError");
const NotFoundError = require("../../exeptions/NotFoundError");
const AuthorizationError = require("../../exeptions/AuthorizationError");

class PlaylistService {
  constructor(collaboratorService) {
    this._pool = new Pool();
    this._collaboratorSerivice = collaboratorService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlist VALUES($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAllPlaylist(owner) {
    const query = {
      text: `SELECT playlist.id, playlist.name, users.username
      FROM playlist
      LEFT JOIN collaborations ON collaborations.playlist_id = playlist.id
      LEFT JOIN users ON users.id = playlist.owner
      WHERE playlist.owner = $1 OR collaborations.user_id = $1
      GROUP BY playlist.id, users.username
      `,
      values: [owner],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylist(id) {
    const query = {
      text: "DELETE FROM playlist WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = this._pool.query(query);

    if (!(await result).rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlist WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
      return
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw err;
      }

      try {
        await this._collaboratorSerivice.verifyCollaborator(playlistId, userId);
      } catch {
        throw err;
      }
    }
  }
}

module.exports = PlaylistService;
