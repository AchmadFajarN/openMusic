const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const NotFoundError = require("../../exeptions/NotFoundError");

class LikeService {
  constructor() {
    this._pool = new Pool();
  }

  async addLike(albumId, userId) {
    const id = `likes-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO likes VALUES($1, $2, $3) RETURNING id`,
      values: [id, albumId, userId],
    };

    return await this._pool.query(query);
  }

  async deleteLikes(albumId, userId) {
    const query = {
      text: `DELETE FROM likes WHERE user_id = $1 AND album_id = $2`,
      values: [userId, albumId],
    };

    return await this._pool.query(query);
  }

  async getLikes(albumId) {
    const query = {
      text: "SELECT * FROM Likes WHERE album_id = $1",
      values: [albumId],
    };

    const result = await this._pool.query(query);
    return result.rows.length;
  }
}

module.exports = LikeService;
