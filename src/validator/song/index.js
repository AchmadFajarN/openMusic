const InvariantError = require("../../exeptions/InvariantError");
const SongSchema = require("./schema");

const SongValidator = {
  validateSongPayload: (payload) => {
    const validateResult = SongSchema.validate(payload);

    if (validateResult.error) {
        throw new InvariantError(validateResult.error.message)
    }
  },
};

module.exports = SongValidator;
