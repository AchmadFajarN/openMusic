const Joi = require("joi");

const validateCollaborationSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = { validateCollaborationSchema };