(function(exports) {
  // TODO: don't store password in memory
  var auth = {};
  var request = window.superagent;

  function r(method, endpoint, data, callback) {
    var r;

    method = method.toUpperCase();

    switch(method) {
      case "GET":
        r = request.get(endpoint);
        break;
      case "POST":
        r = request.post(endpoint);
        break;
      case "PUT":
        r = request.put(endpoint);
        break;
      case "DEL":
        r = reqeust.del(enpoint);
        break;
      default:
        var err = "request method unrecognized";
        return callback({ok: false});
    }

    // we are signing in
    if (!isEmpty(auth)) {
      r.auth(auth.username, auth.password);
      auth = {};
    } else {
      // TODO read token once so we dont hit the localStorage all the time.
      if (localStorage["token"])
        r.set('Authorization', 'Bearer ' + localStorage["token"]);
      
      if (data)
        r.send(data);
    }

    r.set('X-Requested-With', 'XMLHttpRequest');
    r.end(callback);
  }

  exports.ping = function(callback) {
    r("get", "/api", null, function (res) {
      if (res.error) return callback(res.error.message);
      callback(null, res.text == "pong");
    });
  };

  // Sign in & Register
  exports.signin = function(username, password, callback) {
    auth.username = username;
    auth.password = password;

    r("get", "/api/signin", null, function (res) {
      if (res.error) return callback(res.error.message);
      callback(null, res.body);
    });
  };

  exports.signout = function(callback) {
    r("get", "/api/signout", null, function (res) {
      if (res.error) return callback(res.error.message);
      callback(null, res.body);
    });
  };

  exports.register = function(data, callback) {
    r("post", "/api/register", data, function (res) {
      if (res.error) return callback(res.body);
      callback(null, res.body);
    });
  }

  // Account Resource
  exports.getAccount = function(callback) {
    r("get", "/api/account", null, function (res) {
      if (res.error) return callback(res.body);
      callback(null, res.body);
    });
  }

  exports.updateAccount = function(callback) {
    r("put", "/api/account", null, function (res) {
      if (res.error) return callback(res.body);
      callback(null, res.body);
    });
  }

  exports.deleteAccount = function(callback) {
    r("del", "/api/account", null, function (res) {
      if (res.error) return callback(res.body);
      callback(null, res.body);
    });
  }
  
  // Profile Resource
  exports.getProfile = function(callback) {
    r("get", "/api/profile", null, function (res) {
      if (res.error) return callback(res.body);
      callback(null, res.body);
    });
  }

  exports.createProfile = function(data, callback) {
    r("post", "/api/profile", data, function (res) {
      console.log(res);
    });
  }

  exports.updateProfile = function(data, callback) {
    r("put", "/api/profile", data, function (res) {
      console.log(res);
    });
  }

  exports.deleteProfile = function(callback) {
    r("del", "/api/profile", null, function (res) {
      console.log(res);
    });
  }

  function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
  }

})(typeof exports === 'undefined' ? this['bojap'] = {} : exports);