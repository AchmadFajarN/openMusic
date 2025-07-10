const { Pool } = require("pg");
const { nanoid } = require("nanoid");

class CoverUrlService {
  constructor() {
    this._Pool = new Pool();
  }

  async addCover(albumId, path) {
    try{
        const id = `cover-${nanoid(16)}`;
        const query = {
            text: "INSERT INTO cover_url VALUES ($1, $2, $3) RETURNING id",
            values: [id, albumId, path],
          };
          
      return this._Pool.query(query);
    } catch(err) {
        console.log(err);
    }
  }
}

module.exports = CoverUrlService