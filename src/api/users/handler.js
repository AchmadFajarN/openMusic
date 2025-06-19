class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.addUserHandler = this.addUserHandler.bind(this);
  }

  async addUserHandler(req, h) {
    this._validator.validateUserPayload(req.payload);
    const { username, password, fullname } = req.payload;

    const userId = await this._service.addUser({ username, password, fullname });

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahakan',
      data: {
        userId
      }
    });
    response.code(201);
    return response;
  }
}

module.exports = UserHandler;



