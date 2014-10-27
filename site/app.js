var App = angular.module('App', []);

// configure our routes
App.config(function($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider

    // route for the home page
    .when('/', {
      templateUrl : 'static/pages/home.html',
      controller  : 'mainController'
    })

    // route for the about page
    .when('/join', {
      templateUrl : 'static/pages/join.html',
      controller  : 'joinController'
    })

    // route for the contact page
    .when('/signin', {
      templateUrl : 'static/pages/signin.html',
      controller  : 'signinController'
    })

    .when('/settings', {
      templateUrl : 'static/pages/settings.html',
      controller  : 'settingsController'
    });

  //$locationProvider.html5Mode(true);

  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

// create the controller and inject Angular's $scope
App.controller('mainController', function($scope) {
  // create a message to display in our view
  $scope.message = 'Find Teacher';

  // Check to see if we are logged in using our token to make a request.
  if (localStorage["token"]) {
    console.log(localStorage["token"]);
    // bojap.getProfile()
  }
});


App.controller('joinController', function($scope, $http) {
  $scope.message = 'Look! I am an about page.';

  var x = document.getElementById("demo");

  $scope.formData = {};
  
  $scope.getLocation = function() {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition($scope.showPosition);
      } else {
          x.innerHTML = "Geolocation is not supported by this browser.";
      }
  };

  $scope.showPosition = function(position) {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude;

    $http.get(url)
      .success(function(data) {
          if (data && data.results && data.results[2]) {
            $scope.formData.location = data.results[2].formatted_address;
          }
      });
  };

  $scope.processForm = function() {
    bojap.register($scope.formData, function (err, res) {
      if (err) return console.log(err);
      console.log(res);
    });
  };
});

App.controller('signinController', function($scope, $rootScope, $location) {
  $scope.credentials = {};

  $scope.processForm = function() {
    bojap.signin($scope.credentials.email, $scope.credentials.password, function (err, res) {
      if (err) return console.log(err);

      // save token
      if (res && res.token) {
        localStorage["token"] = res.token;
      }

      // redirect to homepage
      $rootScope.loggedIn = true;
      $location.path('/');
      $scope.$apply();
    });
  };
});

App.controller('settingsController', function($scope) {
  $scope.formData = {};
  $scope.credentials = {};

  bojap.getAccount(function (err, res) {
    console.log(err);
    console.log(res);
  });

  $scope.processForm = function() {
    console.log($scope.formData);
  };

  $scope.changePassword = function() {
    if ($scope.credentials.oldPassword == $scope.credentials.newPassword) {
      return console.log("correct");
    }
  };
});