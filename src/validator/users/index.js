const InvariantError = require('../../exeptions/InvariantError');
const { userSchema } = require('./schema');

const UserValidator = {
  validateUserPayload: (payload) => {
    const validateResult = userSchema.validate(payload);

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  }  
};

module.exports = UserValidator;