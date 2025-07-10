const UploadsHandler = require('./handler');
const routes = require('./route');

module.exports = {
  name: "uploads",
  version: "1.0.0",
  register: async (server, { storageService, validator }) => {
    const uploadHandler = new UploadsHandler(storageService, validator);
    server.route(routes(uploadHandler));
  },
};
