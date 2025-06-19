const Joi = require("joi");

const validatePlaylistSongSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { validatePlaylistSongSchema };
