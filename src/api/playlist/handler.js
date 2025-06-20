const ClientError = require("../../exeptions/ClientError");

class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
  }

  async postPlaylistHandler(req, h) {
    try {
      this._validator.validatePlaylistPayload(req.payload);
      const { name } = req.payload;
      const { id: credentialId } = req.auth.credentials;

      const playlistId = await this._service.addPlaylist({
        name,
        owner: credentialId,
      });

      const response = h.response({
        status: "success",
        message: "Playlist berhasil ditambahkan",
        data: {
          playlistId,
        },
      });

      response.code(201);
      return response;
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: err.message,
        });

        response.code(err.statusCode);
        return response;
      }
    }
  }

  async getPlaylistHandler(req) {
    try {
      const { id: credentialId } = req.auth.credentials;
      
      const playlists = await this._service.getAllPlaylist(credentialId);
  
      return {
        status: "success",
        data: {
          playlists,
        },
      };
    } catch(err) {
      console.log(err)
      throw err
    }
  }

  async deletePlaylistHandler(req, h) {
    try {
      const { id } = req.params;
      const { id: credentialId } = req.auth.credentials;

      await this._service.verifyPlaylistOwner(id, credentialId);
      await this._service.deletePlaylist(id);

      return {
        status: "success",
        message: "Playlist berhasil dihapus",
      };
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: err.message,
        });

        response.code(err.statusCode);
        return response;
      }

      const response = h.response({
        status: "fail",
        message: "Maaf, terjadi kesalahan di server kami",
      });

      response.code(500);
      console.log(err);
      return response;
    }
  }
}

module.exports = PlaylistHandler;
