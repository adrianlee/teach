var db = require("./db");
var Bcrypt = require('bcrypt');
var API = {};

API.routes = [
  // General
	{ method: 'GET', path: '/api', handler: ping },

  // Account
  { method: 'GET', path: '/api/login', config: { auth: 'basic', handler: login } },
  { method: 'POST', path: '/api/register', handler: register },

  // Profile Resource
  { method: 'GET', path: '/api/profile', handler: getProfile },
  { method: 'POST', path: '/api/profile', handler: createProfile },
  { method: 'PUT', path: '/api/profile', handler: updateProfile },
  { method: 'DELETE', path: '/api/profile', handler: deleteProfile },

  // Admin Resources
  { method: 'GET', path: '/api/accounts', handler: listAccount },
  { method: 'GET', path: '/api/profiles', handler: listProfile }
];

API.basicValidateFunc = function (email, password, callback) {
    db.Account.findOne({ email: email }).select("+password").exec(findUserCallback);

    function findUserCallback(err, account) {
      if (err) throw err;
      if (!account) {
        return callback(null, false);
      } else {
        Bcrypt.compare(password, account.password, function (err, isValid) {
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

  db.Account.findOne({ email: email }, findUserCallback);

  function findUserCallback(err, account) {
    if (err) throw err;
    if (account) {
      return reply("user already exists");
    } else {
      return createAccount();
    }
  };

  function createAccount() {
    var account = new db.Account();
    account.email = email;

    Bcrypt.hash(password, 8, function(err, hash) {
      // Store hash in your password DB.
      if (err) throw err;
      account.password = hash;
      account.save(function (err, savedAccount) {
        return reply(savedAccount);
      });
    });
  };
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

function listAccount(req, reply) {
  db.Account.find().exec(function (err, accounts) {
    if (err) throw err;
    reply(accounts);
  });
}

function listProfile(req, reply) {
  db.Profile.find().exec(function (err, profiles) {
    if (err) throw err;
    reply(profiles);
  });
}

module.exports = API;