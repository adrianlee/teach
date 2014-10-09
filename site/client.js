(function(exports) {
  // TODO: don't store password in memory
  var auth = {};
  var request = window.superagent;

  function r(method, endpoint, data, callback) {
    var r;

    switch(method) {
      case "get":
        r = request.get(endpoint);
        break;
      case "post":
        r = request.post(endpoint);
        break;
      case "put":
        r = request.put(endpoint);
        break;
      case "del":
        r = reqeust.del(enpoint);
        break;
      default:
        var err = "request method unrecognized";
        return callback({ok: false});
    }

    if (auth)
      r.auth(auth.username, auth.password);

    if (data)
      r.send(data);

    r.set('X-Requested-With', 'XMLHttpRequest');
    r.end(callback);
  }

  // email, password
  exports.signin = function(username, password, callback) {
    auth.username = username;
    auth.password = password;

    r("get", "/api/signin", null, function (res) {
      if (res.error) return callback(res.error.message);
      callback(null, res.body);
    });
  };

  // email, password
  exports.register = function(data, callback) {
    r("post", "/api/register", data, function (res) {
      if (res.error) return callback(res.body);
      callback(null, res.body);
    });
  }

})(typeof exports === 'undefined' ? this['bojap'] = {} : exports);