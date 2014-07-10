var db = require("./db");
var Hapi = require('hapi');
var Bcrypt = require('bcrypt');
var API = {};

API.routes = [
  // General
	{ method: 'GET', path: '/api', handler: ping },

  // Account
  { method: 'GET', path: '/api/login', config: { auth: 'basic', handler: login } },
  { method: 'POST', path: '/api/register', handler: register },
  { method: 'GET', path: '/api/account', config: { auth: 'basic', handler: getAccount } },
  { method: 'PUT', path: '/api/account', config: { auth: 'basic', handler: updateAccount } },
  { method: 'DELETE', path: '/api/account', config: { auth: 'basic', handler: deleteAccount } },

  // Profile Resource
  { method: 'GET', path: '/api/profile', handler: getProfile },
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
          callback(err, isValid, { username: account.username, email: account.email, profiles: account.profiles });
        });
      }
    };
};

function ping(req, reply) {
  reply("pong");
}

function login(req, reply) {
  reply(req.auth.credentials);
}

function register(req, reply) {
  var email = req.payload['email'];
  var password = req.payload['password'];
  
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

    Bcrypt.hash(password, 8, function(err, hash) {
      // Store hash in your password DB.
      if (err) return reply(Hapi.error.badRequest(err));
      account.password = hash;
      account.save(function (err, savedAccount) {
        if (err) return reply(Hapi.error.badRequest(err));
        return reply("Account registered");
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
  reply("not implemented");
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