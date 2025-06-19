const Joi = require("joi");

const validatePlaylistSchema = Joi.object({
  name: Joi.string().required()  
});

module.exports = { validatePlaylistSchema };