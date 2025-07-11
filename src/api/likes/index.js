const routes = require("./routes");
const LikeHandler = require("./handler");

module.exports = {
  name: "likes",
  version: "1.0.0",
  register: async (server, { likesService, cacheService }) => {
    const likeHandler = new LikeHandler(likesService, cacheService);
    server.route(routes(likeHandler));
  },
};
