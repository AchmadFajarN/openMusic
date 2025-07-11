const PlaylistHandler = require("./handler");
const routes = require("./route");

module.exports = {
  name: "playlist",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const playlistHandler = new PlaylistHandler(service, validator);
    server.route(routes(playlistHandler));
  },
};
