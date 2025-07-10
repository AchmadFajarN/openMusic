const NotFoundError = require("../../exeptions/NotFoundError");

class LikeHandler {
  constructor(service) {
    this._service = service;

    this.postLikeHandler = this.postLikeHandler.bind(this);
    this.deleteLikeHandler = this.deleteLikeHandler.bind(this);
    this.getLikeHandler = this.getLikeHandler.bind(this);
  }

  async postLikeHandler(req, h) {
    try {
      const { id: albumId } = req.params;
      const { id: userId } = req.auth.credentials;

      await this._service.addLike(albumId, userId);

      const response = h.response({
        status: "success",
        message: "like berhasil ditambahkan",
      });

      response.code(201);
      return response;
    } catch (err) {
      if (err.code === "23503") {
        throw new NotFoundError("album tidak ditemukan");
      }

      if (err.code === "23505") {
        const response = h.response({
          status: "fail",
          message: "Anda sudah menyukainya",
        });

        response.code(400);
        return response;
      }
    }
  }

  async deleteLikeHandler(req, h) {
    try {
      const { id: albumId } = req.params;
      const { id: userId } = req.auth.credentials;

      await this._service.deleteLikes(albumId, userId);

      const response = h.response({
        status: "success",
        message: "like berhasil dihapus",
      });

      response.code(200);
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async getLikeHandler(req, h) {
    const { id: albumId } = req.params;

    const likes = await this._service.getLikes(albumId);

    const response = h.response({
      status: "success",
      data: {
        likes,
      },
    });

    response.code(200);
    return response;
  }
}

module.exports = LikeHandler;
