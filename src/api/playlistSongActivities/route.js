const route = (handler) => [
  {
    method: "GET",
    path: "/playlists/{id}/activities",
    handler: handler.getPlaylistActivityHandler,
    options: {
      auth: "openmusic_jwt"
    }
  },
];

module.exports = route
