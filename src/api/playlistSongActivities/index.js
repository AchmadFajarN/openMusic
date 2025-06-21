const PlaylistActivityHandler = require("./handler");
const route = require("./route");

module.exports = {
  name: "activitySongPlaylist",
  version: "1.0.0",
  register: async (server, { playlistService, playlistActivityService }) => {
    const playlistActivityHandler = new PlaylistActivityHandler(
      playlistService,
      playlistActivityService
    );
    server.route(route(playlistActivityHandler));
  },
};
