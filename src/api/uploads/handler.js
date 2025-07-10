class UploadsHandler {
  constructor(storageservice, validator) {
    this._storageService = storageservice;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(req, h) {
    const { cover } = req.payload;
    const { id } = req.params;

    this._validator.validateImageHeader(cover.hapi.headers);

    await this._storageService.writeFile(cover, cover.hapi, id);

    const response = h.response({
      status: "success",
      message: "sampul berhasil diunggah"
    });

    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
