class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.addSongHandler = this.addSongHandler.bind(this);
    this.getAllSongsHandler = this.getAllSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.editSongByIdHandler = this.editSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async addSongHandler(req, h) {
    this._validator.validateSongPayload(req.payload);
    const {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    } = req.payload;

    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    const response = h.response({
      status: "success",
      data: {
        songId,
      },
    });

    response.code(201);
    return response;
  }

  async getAllSongsHandler() {
    const songs = await this._service.getAllSongs();

    return {
      status: "success",
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(req) {
    const { id } = req.params;

    const song = await this._service.getSongById(id);

    return {
      status: "success",
      data: {
        song,
      },
    };
  }

  async editSongByIdHandler(req) {
    this._validator.validateSongPayload(req.payload);
    const { id } = req.params;

    await this._service.editSongById(id, req.payload);
    return {
      status: "success",
      message: "Lagu berhasil di edit",
    };
  }

  async deleteSongByIdHandler(req) {
    const { id } = req.params;

    await this._service.deleteSongById(id);
    return {
      status: "success",
      message: "Lagu berhasil dihapus",
    };
  }
}

module.exports = SongsHandler;
