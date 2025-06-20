const routes = (handler) => [
  {
    method: "POST",
    path: "/collaborations",
    handler: handler.postCollaborationHandler,
    options: {
      auth: "openmusic_jwt"
    }
  },
  {
    method: "DELETE",
    path: "/collaborations",
    handler: handler.deleteCollaboratorHandler,
    options: {
      auth: "openmusic_jwt"
    }
  },
];


module.exports = routes;