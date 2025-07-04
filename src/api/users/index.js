const UserHandler = require("./handler");
const routes = require("./route");

module.exports = {
  name: "user",
	version: '1.0.0',
	register: async(server, { service, validator }) => {
		const userHandler = new UserHandler(service, validator);
		server.route(routes(userHandler));
	}
};
