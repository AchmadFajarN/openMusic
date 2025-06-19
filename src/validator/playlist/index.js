const InvariantError = require("../../exeptions/InvariantError");
const { validatePlaylistSchema } = require("./schema");

const PlaylistValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = validatePlaylistSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;
