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
	$routeProvider
        // .when('/clients',{
        //     templateUrl: '/clients.html',
        //     resolve: {
	       //      auth: function(Auth, $location){
		      //       return Auth.auth.$requireAuth().catch(function(){
		      //       	console.log('test');
		      //         $location.path( "/signin" );
		      //       });
		      //    }
      		// }
        // })
        .when('/signin',{
            templateUrl: '/signin.html',
        })
        .otherwise({redirectTo: '/'});
}])

.constant('FirebaseUrl', "https://aborrow-test.firebaseio.com/")