var db = require("./db");
var Hapi = require('hapi');
var Bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var API = {};

API.routes = [
  // General
	{ method: 'GET', path: '/api', config: { auth: 'token', handler: ping } },

  // Sign in & Register
  { method: 'GET', path: '/api/signin', config: { auth: 'basic', handler: signin } },
  { method: 'GET', path: '/api/signout', config: { auth: 'token', handler: signout } },
  { method: 'POST', path: '/api/register', handler: register },
  
  // Account Resource
  { method: 'GET', path: '/api/account', config: { auth: 'token', handler: getAccount } },
  { method: 'PUT', path: '/api/account', config: { auth: 'token', handler: updateAccount } },
  { method: 'DELETE', path: '/api/account', config: { auth: 'token', handler: deleteAccount } },

  // Profile Resource
  { method: 'GET', path: '/api/profile', config: { auth: 'token', handler: getProfile } },
  { method: 'POST', path: '/api/profile', handler: createProfile },
  { method: 'PUT', path: '/api/profile', handler: updateProfile },
  { method: 'DELETE', path: '/api/profile', handler: deleteProfile },

  // Admin Resources
  { method: 'GET', path: '/api/accounts', handler: listAccounts },
  { method: 'GET', path: '/api/profiles', handler: listProfiles }
];

API.basicValidateFunc = function (email, password, callback) {
    db.Account.findOne({ email: email }).select("+password").exec(findUserCallback);

    function findUserCallback(err, account) {
      if (err) throw err;
      if (!account) {
        return callback(null, false);
      } else {
        Bcrypt.compare(password, account.password, function (err, isValid) {
          // if valid pass credentials to request handler. access via req.auth.credentials
          // { username: account.username, email: account.email, profiles: account.profiles }
          var token = jwt.sign({ username: account.username, email: account.email }, 'awesome123!');

          callback(err, isValid, { token: token });
        });
      }
    };
};

function ping(req, reply) {
  reply("pong");
}

function signin(req, reply) {
  reply(req.auth.credentials);
}

function signout(req, reply) {
  reply("ok");
}


function register(req, reply) {
  var email = req.payload['email'];
  var password = req.payload['password'];
  var type = req.payload['type'];
  
  if (!email || !password) {
    return reply(Hapi.error.badRequest("Enter valid email and password"));
  }

  db.Account.findOne({ email: email }, function findUserCallback(err, account) {
    if (err) return reply(Hapi.error.badRequest(err));
    if (account) {
      return reply(Hapi.error.badRequest("Account email already exists"));
    } else {
      createAccount();
    }
  });

  function createAccount() {
    var account = new db.Account();
    account.email = email;
    account.type = type;

    Bcrypt.hash(password, 8, function(err, hash) {
      // Store hash in your password DB.
      if (err) return reply(Hapi.error.badRequest(err));
      account.password = hash;
      account.save(function (err, savedAccount) {
        if (err) return reply(Hapi.error.badRequest(err));
        
        var res = {};
        res.email = savedAccount.email;
        res.profiles = savedAccount.profiles;
        res.type = savedAccount.type;

        return reply(res);
      });
    });
  };
}

function getAccount(req, reply) {
  var getAccountWithEmail = req.auth.credentials.email;
  db.Account.findOne({ email: getAccountWithEmail }).exec(function (err, doc) {
    if (err) return reply(Hapi.error.badRequest(err));
    reply(doc);
  });
}

function updateAccount(req, reply) {
  var getAccountWithEmail = req.auth.credentials.email;
  db.Account.findOneAndUpdate({ email: getAccountWithEmail }, req.payload).exec(function (err, doc) {
    if (err) return reply(Hapi.error.badRequest(err));
    reply(doc);
  });
}

function deleteAccount(req, reply) {
  var deleteAccountWithEmail = req.auth.credentials.email;
  db.Account.findOneAndRemove({ email: deleteAccountWithEmail }).exec(function (err, doc) {
    if (err) return reply(Hapi.error.badRequest(err));
    reply("Success");
  });
}

function getProfile(req, reply) {
  var getAccountWithEmail = req.auth.credentials.email;
  db.Account.findOne({ email: getAccountWithEmail }).exec(function (err, doc) {
    if (err) return reply(Hapi.error.badRequest(err));
    reply(doc);
  });
}

function createProfile(req, reply) {
  reply("not implemented")
}

function updateProfile(req, reply) {
  reply("not implemented")
}

function deleteProfile(req, reply) {
  reply("not implemented")
}

function listAccounts(req, reply) {
  db.Account.find().exec(function (err, accounts) {
    if (err) return reply(Hapi.error.badRequest(err));
    reply(accounts);
  });
}

function listProfiles(req, reply) {
  db.Profile.find().exec(function (err, profiles) {
    if (err) return reply(Hapi.error.badRequest(err));
    reply(profiles);
  });
}

module.exports = API;