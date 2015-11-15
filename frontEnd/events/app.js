angular.module('emApp', ['ui.router', 'ngResource', 'emApp.controllers', 'emApp.services']).config(function($stateProvider) {
    $stateProvider.state('events', {
        url: '/events',
        templateUrl: 'events/list.html',
        controller: 'EventListController'
    }).state('viewEvent', {
        url: '/events/:id/view',
        templateUrl: 'events/view.html',
        controller: 'EventViewController'
    }).state('newEvent', {
        url: '/events/new',
        templateUrl: 'events/create.html',
        controller: 'EventCreateController'
    }).state('editEvent', {
        url: '/events/:id/edit',
        templateUrl: 'events/update.html',
        controller: 'EventEditController'
    });
}).run(function($state) {
    $state.go('events');
});

var app = angular.module('emApp.controllers', []);

app.controller('EventListController', function($scope, $state, $window, Event) {
  $scope.events = Event.query(); //fetch all. Issues a GET to /api/events
  $scope.deleteEvent = function(event) { // Delete. Issues a DELETE to /api/events/:id
    event.$delete(function() {
      $window.location.href = ''; //redirect to home
    });
  };
});

app.controller('EventViewController', function($scope, $stateParams, Event) {
  $scope.event = Event.get({ id: $stateParams.id }); //Get a single .Issues a GET to /api/events/:id
})

app.controller('EventCreateController', function($scope, $state, $stateParams, Event) {
  $scope.event = new Event();  //create new  instance. Properties will be set via ng-model on UI
  $scope.addEvent = function() { //create a new . Issues a POST to /api/events
    $scope.event.$save(function() {
      $state.go('events'); // on success go back to home i.e. list state.
    });
  };
});

app.controller('EventEditController', function($scope, $state, $stateParams, Event) {
  $scope.updateEvent = function() { //Update the edited . Issues a PUT to /api/events/:id
    $scope.event.$update(function() {
      $state.go('events'); // on success go back to home i.e. list state.
    });
  };

  $scope.loadEvent = function() { //Issues a GET request to get a movie to update
    $scope.event = Event.get({ id: $stateParams.id });
  };

  $scope.loadEvent(); // Load a event which can be edited on UI
});

angular.module('emApp.services', []).factory('Event', function($resource) {
  var APIHOME;
  if (window.location.hostname === 'localhost')
    APIHOME = "http://localhost:3000/api/";
  else
    APIHOME = "http://smartgridtools-pakra.rhcloud.com/api/";
  return $resource(APIHOME + 'events/:id', { id: '@_id' }, {
    update: {
      method: 'PUT'
    }
  });
});