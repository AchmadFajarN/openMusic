class PlaylistActivityHandler {
  constructor(playlistService, playlistActivityService) {
    this._playlistService = playlistService;
    this._playlistActivityService = playlistActivityService;

    this.getPlaylistActivityHandler = this.getPlaylistActivityHandler.bind(this);
  }

  async getPlaylistActivityHandler(req, h) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    const activities = await this._playlistActivityService.getPlaylistActivities(playlistId);

    const response = h.response({
      status: "success",
      data: {
        playlistId,
        activities,
      },
    });

    response.code(200);
    return response;
  }
}

module.exports = PlaylistActivityHandler;
