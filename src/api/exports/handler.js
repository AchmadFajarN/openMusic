class ExportsHandler {
  constructor(service, validator, playlistService) {
    this._service = service;
    this._validator = validator;
    this._playlistService = playlistService;

    this.postExportSongHandler = this.postExportSongHandler.bind(this);
  }

  async postExportSongHandler(req, h) {
    this._validator.validateExportSongPayload(req.payload);
    const { id: userId } = req.auth.credentials;
    const { playlistId } = req.params;

    await this._playlistService.verifyPlaylistOwner(playlistId, userId)

    const message = {
      playlistId,
      targetEmail: req.payload.targetEmail 
    }

    await this._service.sendMessage('export:song', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan anda sedang diproses'
    });
    
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;