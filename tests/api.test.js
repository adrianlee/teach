var request = require('superagent');
var assert = require("assert")
var port = 8080;
var server = require("../")(port);

function endpoint(endpoint) {
  return "http://localhost:" + port + endpoint;
}

suite('Ping', function() {
  suite('/api', function() {
    test('should return pong', function(done) {
      request
      .get(endpoint('/api'))
      .end(function(res) {
        assert(200 == res.status);
        done();
      });
    });
  });
});

suite('Account', function() {
  var fakeAccount = {
    email: 'test@gmail.com',
    password: '123123123'
  };

  suiteSetup(function(done) {
    // delete account
    request
    .del(endpoint('/api/account'))
    .auth(fakeAccount.email + ':' + fakeAccount.password)
    .end(function(res) {
      done();
    });
  });

  suite('/api/login', function() {
    test('should not be able to login', function(done) {
      request
      .get(endpoint('/api/login'))
      .end(function(res) {
        assert(401 == res.status);
        assert(res.body.error == "Unauthorized");
        done();
      });
    });

    test('should not be able to login with creds', function(done) {
      request
      .get(endpoint('/api/login'))
      .auth(fakeAccount.email + ':' + fakeAccount.password)
      .end(function(res) {
        assert(401 == res.status);
        done();
      });
    });

    test('should not be able to register without details', function(done) {
      request
      .post(endpoint('/api/register'))
      .end(function(res) {
        assert(400 == res.status);
        done();
      });
    });

    test('should not be able to register with email only', function(done) {
      request
      .post(endpoint('/api/register'))
      .send({ email: fakeAccount.email })
      .end(function(res) {
        assert(400 == res.status);
        done();
      });
    });

    test('should be able to register', function(done) {
      request
      .post(endpoint('/api/register'))
      .send({ email: fakeAccount.email, password: fakeAccount.password })
      .end(function(res) {
        assert(200 == res.status);
        done();
      });
    });

    test('should be able to login with creds', function(done) {
      request
      .get(endpoint('/api/login'))
      .auth(fakeAccount.email + ':' + fakeAccount.password)
      .end(function(res) {
        assert(200 == res.status);
        done();
      });
    });

    test('should be able to account details', function(done) {
      request
      .get(endpoint('/api/account'))
      .auth(fakeAccount.email + ':' + fakeAccount.password)
      .end(function(res) {
        assert(200 == res.status);
        assert(res.body._id);
        assert(res.body.email == fakeAccount.email);
        done();
      });
    });
  });

  suiteTeardown(function (done) {
    // delete account
    request
    .del(endpoint('/api/account'))
    .auth({ email: fakeAccount.email, password: fakeAccount.password })
    .end(function(res) {
      done();
    });
  });
});