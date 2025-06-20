class CollaborationHandler {
  constructor(collaboratorService, playlistService, validator) {
    this._collaboratorService = collaboratorService;
    this._playlistService = playlistService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaboratorHandler = this.deleteCollaboratorHandler.bind(this);
  }

  async postCollaborationHandler(req, h) {
    try {
      this._validator.validateCollaborationPayload(req.payload);
      const { id: credentialId } = req.auth.credentials;
      const { playlistId, userId } = req.payload;
  
      await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
      await this._collaboratorService.verifyUserForCollaboratorExist(userId);
      const collaborationId = await this._collaboratorService.addCollaborator(
        playlistId,
        userId
      );
  
      const response = h.response({
        status: "success",
        message: "Kolaborator berhasil ditambahkan",
        data: {
          collaborationId,
        },
      });
  
      response.code(201);
      return response;
    } catch(err) {
      // console.log(err)
      throw err
    }
  }

  async deleteCollaboratorHandler(req, h) {
    this._validator.validateCollaborationPayload(req.payload);
    const { id: credentialId } = req.auth.credentials;
    const { playlistId, userId } = req.payload;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaboratorService.deleteCollaborator(playlistId, userId);

    return {
      status: "success",
      message: "Kolaborasi berhasil dihapus",
    };
  }
}

module.exports = CollaborationHandler;
