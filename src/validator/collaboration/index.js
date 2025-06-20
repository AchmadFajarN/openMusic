const InvariantError = require("../../exeptions/InvariantError");
const { validateCollaborationSchema } = require("./schema");

const CollaboratorValidator = {
  validateCollaborationPayload: (payload) => {
    const validationResult = validateCollaborationSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaboratorValidator;
