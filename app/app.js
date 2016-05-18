'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'ngRoute',
  'firebase',
  'dynamicNumber',
  'tabs',
  'sticky',
  'ui.checkbox'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}])

.constant('FirebaseUrl', "https://aborrow-test.firebaseio.com/")
