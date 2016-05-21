'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'ngRoute',
  'firebase',
  'dynamicNumber',
  'tabs',
  'sticky',
  'ui.checkbox',
  'ngOrderObjectBy'
])
// .config(['$routeProvider', function($routeProvider) {
// 	$routeProvider
//         // .when('/clients',{
//         //     templateUrl: '/clients.html',
//         //     resolve: {
// 	       //      auth: function(Auth, $location){
// 		      //       return Auth.auth.$requireAuth().catch(function(){
// 		      //       	console.log('test');
// 		      //         $location.path( "/signin" );
// 		      //       });
// 		      //    }
//       		// }
//         // })
//         .when('/signin',{
//             templateUrl: '/signin.html',
//         })
//         .otherwise({redirectTo: '/'});
// }])

.constant('FirebaseUrl', "https://aborrow-test.firebaseio.com/")


// .filter('orderObjectBy', function(){
//     return function(input, attribute) {
//         if (!angular.isObject(input)) return input;
//         var array = [];
//         for(var objectKey in input) {
//             array.push(input[objectKey]);
//         }
//         array.sort(function(a, b){
//             a = parseInt(a[attribute]);
//             b = parseInt(b[attribute]);
//             return a - b;
//         });
//         return array;
//     }
//})