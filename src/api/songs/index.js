const SongsHandler = require("./handler");
const routes = require("./route");

module.exports = {
  name: "song",
  version: "1.0.1",
  register: async (server, { service, validator }) => {
    const songHandler = new SongsHandler(service, validator);
    server.route(routes(songHandler));
  },
};
