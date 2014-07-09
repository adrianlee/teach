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
    });

  //$locationProvider.html5Mode(true);

  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

// create the controller and inject Angular's $scope
App.controller('mainController', function($scope) {
  // create a message to display in our view
  $scope.message = 'Find Teacher';
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

    $http.get(url).
      success(function(data) {
          if (data && data.results && data.results[2]) {
            $scope.formData.location = data.results[2].formatted_address;
          }
      });
  };

  $scope.processForm = function() {
    alert(JSON.stringify($scope.formData));
  };
});

App.controller('signinController', function($scope) {
  $scope.message = 'Contact us! JK. This is just a demo.';
});