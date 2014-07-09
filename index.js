/* Hapi Setup */
var Hapi = require("hapi");
var pack = new Hapi.Pack();
var lout = require("lout");
var API = require("./api");

var serverOptions = { cors: true, security: true };
var server = new Hapi.Server("localhost", 8000, serverOptions);

// Register plugins
server.pack.register({
  plugin: require('hapi-auth-basic')
}, function (err) {
  if (err) throw err;
  server.auth.strategy('basic', 'basic', { validateFunc: API.basicValidateFunc });
});

server.pack.register({ plugin: lout }, function(err) {
    if (err) throw err;
});

// Site Routes
server.route({ method: "GET", path: "/", handler: { file: "./site/index.html" } });
server.route({ method: "GET", path: "/static/{path*}", handler: { directory: { path: "./site", listing: false, index: false } } });

// API Routes
server.route(API.routes);

// Start Server
server.start(function() {
  console.log("Hapi server started @", server.info.uri);
});
