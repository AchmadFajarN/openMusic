const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exeptions/InvariantError");
const NotFoundError = require("../../exeptions/NotFoundError");

class PlaylistSongService {
  constructor(activityService) {
    this._activityService = activityService;
    this._pool = new Pool();
  }

  async addSongToPlaylist(playlistId, songId, userId) {
    const id = `playlistSong-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Lagu gagal ditambahkan");
    }

    await this._activityService.addPlaylistActivity(
      playlistId,
      songId,
      userId,
      "add"
    );

    return result.rows[0].id;
  }

  async getAllSongFromPlaylist(playlistId) {
    const query = {
      text: `SELECT song.id, song.title, song.performer
      FROM playlist_songs
      JOIN song ON song.id = playlist_songs.song_id
      WHERE playlist_songs.playlist_id = $1
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteSongPlaylistById(playlistId, songId, userId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan dalam playlist");
    }

    await this._activityService.addPlaylistActivity(
      playlistId,
      songId,
      userId,
      "delete"
    );
  }

  async verifySongExist(songId) {
    const query = {
      text: "SELECT * FROM song WHERE id = $1",
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }
  }

  async getPlaylistDetail(playlistId) {
    const query = {
      text: `SELECT playlist.id, playlist.name, users.username
      FROM playlist
      JOIN users ON users.id = playlist.owner
      WHERE playlist.id = $1        
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    return result.rows[0];
  }
}

module.exports = PlaylistSongService;
