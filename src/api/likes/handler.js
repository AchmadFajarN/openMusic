const NotFoundError = require("../../exeptions/NotFoundError");

class LikeHandler {
  constructor(service, cacheService) {
    this._service = service;
    this._cacheService = cacheService;

    this.postLikeHandler = this.postLikeHandler.bind(this);
    this.deleteLikeHandler = this.deleteLikeHandler.bind(this);
    this.getLikeHandler = this.getLikeHandler.bind(this);
  }

  async postLikeHandler(req, h) {
    try {
      const { id: albumId } = req.params;
      const { id: userId } = req.auth.credentials;

      await this._service.addLike(albumId, userId);
      await this._cacheService.delete(`likes-${albumId}`);

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
      await this._cacheService.delete(`likes-${albumId}`);

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

    try {
      const cachedLikes = await this._cacheService.get(`likes-${albumId}`);

      const response = h.response({
        status: "success",
        data: {
          likes: parseInt(cachedLikes),
        },
      });

      response.header("X-Data-Source", "cache");
      return response;
    } catch (err) {
      const likes = await this._service.getLikes(albumId);

      await this._cacheService.set(`likes-${albumId}`, likes);

      const response = h.response({
        status: "success",
        data: {
          likes
        }
      });

      return response;
    }
  }
}

module.exports = LikeHandler;
