const routes = (handler) => [
  {
    path: "/playlists/{id}/songs",
    method: "POST",
    handler: handler.postPlaylistSongHandler,
    options: {
      auth: "openmusic_jwt",
    },
  },
  {
    path: "/playlists/{id}/songs",
    method: "GET",
    handler: handler.getPlaylistSongsHandler,
    options: {
      auth: "openmusic_jwt",
    },
  },
  {
    path: "/playlists/{id}/songs",
    method: "DELETE",
    handler: handler.deletePlaylistSongByIdHandler,
    options: {
      auth: "openmusic_jwt",
    },
  },
];

module.exports = routes;
