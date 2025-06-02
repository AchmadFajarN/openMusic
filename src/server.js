require("dotenv").config();
const hapi = require("@hapi/hapi");
const albums = require("./api/albums");
const AlbumService = require("./service/inMemory/albumService");
const AlbumValidator = require("./validator/album");
const ClientError = require("./exeptions/ClientError");
const song = require('./api/songs');
const SongService = require('./service/inMemory/songService');
const SongValidator = require('./validator/song');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();

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
        valdator: SongValidator
      }
    }
  ]
);

  server.ext('onPreResponse', (req, h) => {
    const { response } =  req;

    if (response instanceof ClientError) {
        const newResponse = h.response({
            status: 'fail',
            message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log('Server berjalan di', server.info.uri)
};

init();
