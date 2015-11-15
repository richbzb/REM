angular.module('umApp', ['ui.router', 'ngResource', 'umApp.controllers', 'umApp.services']).config(function($stateProvider) {
    $stateProvider.state('users', {
        url: '/users',
        templateUrl: 'users/list.html',
        controller: 'UserListController'
    }).state('viewUser', {
        url: '/users/:id/view',
        templateUrl: 'users/view.html',
        controller: 'UserViewController'
    }).state('newUser', {
        url: '/users/new',
        templateUrl: 'users/create.html',
        controller: 'UserCreateController'
    }).state('editUser', {
        url: '/users/:id/edit',
        templateUrl: 'users/update.html',
        controller: 'UserEditController'
    });
}).run(function($state) {
    $state.go('users');
});

var app = angular.module('umApp.controllers', []);

app.controller('UserListController', function($scope, $state, $window, User) {
  $scope.users = User.query(); //fetch all. Issues a GET to /api/users
  $scope.deleteUser = function(user) { // Delete. Issues a DELETE to /api/users/:id
    user.$delete(function() {
      $window.location.href = ''; //redirect to home
    });
  };
});

app.controller('UserViewController', function($scope, $stateParams, User) {
  $scope.user = User.get({ id: $stateParams.id }); //Get a single .Issues a GET to /api/users/:id
})

app.controller('UserCreateController', function($scope, $state, $stateParams, User) {
  $scope.user = new User();  //create new  instance. Properties will be set via ng-model on UI
  $scope.addUser = function() { //create a new . Issues a POST to /api/users
    $scope.user.$save(function() {
      $state.go('users'); // on success go back to home i.e. list state.
    });
  };
});

app.controller('UserEditController', function($scope, $state, $stateParams, User) {
  $scope.updateUser = function() { //Update the edited . Issues a PUT to /api/users/:id
    $scope.user.$update(function() {
      $state.go('users'); // on success go back to home i.e. list state.
    });
  };

  $scope.loadUser = function() { //Issues a GET request to get a movie to update
    $scope.user = User.get({ id: $stateParams.id });
  };

  $scope.loadUser(); // Load a user which can be edited on UI
});

angular.module('umApp.services', []).factory('User', function($resource) {
  var APIHOME;
  if (window.location.hostname === 'localhost')
    APIHOME = "http://localhost:3000/api/";
  else
    APIHOME = "http://smartgridtools-pakra.rhcloud.com/api/";
  return $resource(APIHOME + 'users/:id', { id: '@_id' }, {
    update: {
      method: 'PUT'
    }
  });
});