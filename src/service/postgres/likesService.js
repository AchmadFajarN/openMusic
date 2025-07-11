const { Pool } = require("pg");
const { nanoid } = require("nanoid");

class LikeService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLike(albumId, userId) {
    const id = `likes-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO likes VALUES($1, $2, $3) RETURNING id`,
      values: [id, albumId, userId],
    };

    await this._cacheService.delete(`likes-${albumId}`);

    return await this._pool.query(query);
  }

  async deleteLikes(albumId, userId) {
    const query = {
      text: `DELETE FROM likes WHERE user_id = $1 AND album_id = $2`,
      values: [userId, albumId],
    };

    await this._cacheService.delete(`likes-${albumId}`);

    return await this._pool.query(query);
  }

  async getLikes(albumId) {
    const query = {
      text: "SELECT * FROM Likes WHERE album_id = $1",
      values: [albumId],
    };

    const result = await this._pool.query(query);
    const likes = result.rows.length;

    await this._cacheService.set(`likes-${albumId}`, likes);

    return likes;
  }
}

module.exports = LikeService;
