const fs = require("fs");
const { Pool } = require('pg');

class StorageService {
  constructor(folder, coverService) {
    this._folder = folder;
    this._coverService = coverService;
    this._pool = new Pool();

    // Mengecek apakah path dari file ada/tidak
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  async writeFile(file, meta, albumId) {
    try{
      const fileName = +new Date() + meta.filename;
      const path = `${this._folder}/${fileName}`;
      const pathUrl = `http://${process.env.HOST}:${process.env.PORT}/covers/${fileName}`
  
      await this._coverService.addCover(albumId, pathUrl);
  
      const fileStream = fs.createWriteStream(path);
  
      return new Promise((resolve, reject) => {
        fileStream.on("error", (err) => reject(err));
        file.pipe(fileStream);
        file.on("end", () => resolve(fileName));
      });
    } catch(err) {
      console.log(err);
    }
  }
}

module.exports = StorageService;
