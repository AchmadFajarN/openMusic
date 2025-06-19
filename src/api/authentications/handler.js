class AuthenticationsHandler {
  constructor(authenticationService, userService, tokenManager, validator) {
    this._authenticationService = authenticationService;
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(req, h) {
    this._validator.validatePostAuthenticationPayload(req.payload);

    const { username, password } = req.payload;
    const id = await this._userService.verifyUserCredential(username, password);

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authenticationService.addRefreshToken(refreshToken);

    const response = h.response({
      status: "success",
      message: "Authentication berhasil ditambahkan",
      data: {
        accessToken,
        refreshToken,
      },
    });

    response.code(201);
    return response;
  }

  async putAuthenticationHandler(req) {
    this._validator.validatePutAuthenticationPayload(req.payload);

    const { refreshToken } = req.payload;
    await this._authenticationService.verifyRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({ id });
    return {
      status: "success",
      message: "Access token berhasil diperbarui",
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(req, h) {
    this._validator.validateDeleteAuthenticationPayload(req.payload);

    const { refreshToken } = req.payload;
    await this._authenticationService.verifyRefreshToken(refreshToken);
    await this._authenticationService.deleteRefreshToken(refreshToken);

    return {
      status: "success",
      message: "Refresh Token berhasil dihapus",
    };
  }
}

module.exports = AuthenticationsHandler;
