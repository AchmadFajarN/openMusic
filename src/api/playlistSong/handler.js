class PlaylistsSongHandler {
  constructor(service, playlistService, validator) {
    this._service = service;
    this._validator = validator;
    this._playlistService = playlistService;

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deletePlaylistSongByIdHandler = this.deletePlaylistSongByIdHandler.bind(this);
  }

  async postPlaylistSongHandler(req, h) {
    try {
      this._validator.validatePlaylistSongPayload(req.payload);
  
      const { id: playlistId } = req.params;
      const { id: credentialId } = req.auth.credentials;
      const { songId } = req.payload;
  
  
      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      await this._service.verifySongExist(songId);
      await this._service.addSongToPlaylist(playlistId, songId, credentialId);
  
  
      const response = h.response({
        status: "success",
        message: "Lagu bserhasil ditambahkan",
        data: {
          playlistId,
        },
      });
  
      response.code(201);
      return response;
    } catch(err) {
      throw err
    }
  }

  async getPlaylistSongsHandler(req, h) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);

    const playlist = await this._service.getPlaylistDetail(playlistId);
    const songs = await this._service.getAllSongFromPlaylist(playlistId);

    const { id, name, username } = playlist;

    const response = h.response({
      status: "success",
      data: {
        playlist: {
          id,
          name,
          username,
          songs,
        },
      },
    });

    return response;
  }

  async deletePlaylistSongByIdHandler(req, h) {
    this._validator.validatePlaylistSongPayload(req.payload);

    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;
    const { songId } = req.payload;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deleteSongPlaylistById(playlistId, songId, credentialId);

    const response = h.response({
      status: "success",
      message: "Lagu berhasil dihapus",
    });

    return response;
  }
}

module.exports = PlaylistsSongHandler;
