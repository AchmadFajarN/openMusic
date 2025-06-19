const PlaylistsSongHandler = require("./handler");
const routes = require("./route");

module.exports = {
  name: "playlistSong",
  version: "1.0.0",
  register: async (server, { service, playlistService, validator }) => {
    const playlistsSongHandler = new PlaylistsSongHandler(
      service,
      playlistService,
      validator
    );

    server.route(routes(playlistsSongHandler));
  },
};
