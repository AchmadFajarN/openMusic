const ExportSongPayloadSchema = require('./schema');
const InvariantError = require('../../exeptions/InvariantError');

const ExportValidator = {
  validateExportSongPayload: (payload) => {
    const validationResult = ExportSongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }  
}

module.exports = ExportValidator;