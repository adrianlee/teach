/* Hapi Setup */
var Hapi = require("hapi");
var pack = new Hapi.Pack();
var lout = require("lout");
var API = require("./api");
var jwt = require('hapi-auth-jwt');

var serverOptions = { cors: true, security: true };

if (!module.parent) {
  start();
}

module.exports = function (port) {
  start(port);
};

function start(port) {
  var server = new Hapi.Server("localhost", port || 8000, serverOptions);

  // Register plugins
  server.pack.register({
    plugin: require('hapi-auth-basic')
  }, function (err) {
    if (err) throw err;
    server.auth.strategy('basic', 'basic', { validateFunc: API.basicValidateFunc });
  });

  // API documentation generator plugin for hapi
  server.pack.register({ plugin: lout }, function(err) {
      if (err) throw err;
  });

  // hapi-auth-jwt
  var validate = function (decodedToken, callback) {

    console.log("decoded token", decodedToken);
    
    if (!decodedToken) {
        return callback(null, false);
    }

    // returns err, isValid, credentials
    callback(null, true, decodedToken);
  };

  server.pack.register(require('hapi-auth-jwt'), function (err) {
    var privateKey = 'awesome123!';

    server.auth.strategy('token', 'jwt', { key: privateKey,  validateFunc: validate });
  });

  // Site Routes
  server.route({ method: "GET", path: "/", handler: { file: "./site/index.html" } });
  server.route({ method: "GET", path: "/static/{path*}", handler: { directory: { path: "./site", listing: false, index: false } } });

  // API Routes
  server.route(API.routes);

  server.start(function() {
    console.log("Hapi server started @", server.info.uri);
  });
}