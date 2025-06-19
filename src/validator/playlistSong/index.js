const InvariantError = require("../../exeptions/InvariantError");
const { validatePlaylistSongSchema } = require("./schema");

const PlaylistSongValidator = {
  validatePlaylistSongPayload: (payload) => {
    const validationResult = validatePlaylistSongSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistSongValidator;
