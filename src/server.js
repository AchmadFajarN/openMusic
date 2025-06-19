require("dotenv").config();
const hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const ClientError = require("./exeptions/ClientError");
// album
const albums = require("./api/albums");
const AlbumService = require("./service/postgres/albumService");
const AlbumValidator = require("./validator/album");
// song
const song = require("./api/songs");
const SongService = require("./service/postgres/songService");
const SongValidator = require("./validator/song");
//user
const user = require("./api/users");
const UserService = require("./service/postgres/userService");
const UserValidator = require("./validator/users");
// authentications
const authentications = require("./api/authentications");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationValidator = require("./validator/authentication");
const AuthenticationService = require("./service/postgres/authenticationService");
// Playlist
const playlist = require("./api/playlist");
const PlaylistService = require("./service/postgres/playlistService");
const PlaylistValidator = require("./validator/playlist");
// playlist song
const playlistSong = require("./api/playlistSong");
const PlaylistSongService = require("./service/postgres/playlistSongService");
const PlaylistSongValidator = require("./validator/playlistSong");

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const playlistService = new PlaylistService();
  const playlistSongService = new PlaylistSongService();
  const userService = new UserService();
  const authenticationService = new AuthenticationService();

  const server = hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy("openmusic_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: song,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: playlist,
      options: {
        service: playlistService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: playlistSong,
      options: {
        service: playlistSongService,
        playlistService: playlistService,
        validator: PlaylistSongValidator,
      },
    },
    {
      plugin: user,
      options: {
        service: userService,
        validator: UserValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationService,
        userService,
        tokenManager: TokenManager,
        validator: AuthenticationValidator,
      },
    },
  ]);

  server.ext("onPreResponse", (req, h) => {
    const { response } = req;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log("Server berjalan di", server.info.uri);
};

init();
