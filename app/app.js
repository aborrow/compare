'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
        'ngRoute',
        'firebase',
        'dynamicNumber',
        'tabs',
        'sticky',
        'ui.checkbox',
        'ngOrderObjectBy',
        'cfp.loadingBar',
        'ng.jsoneditor'
    ])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'compare.html',
                controller: "mainController"
            })
            .when('/loans', {
                templateUrl: 'loans.html',
                controller: "loansController"
            })
            .when('/loans/create', {
                templateUrl: 'app/templates/loans/add_loan.html',
                controller: "loansController",
            }).when('/loans/loan/:id', {
                templateUrl: 'app/templates/loans/edit_loan.html',
                controller: "loanController",
            }).when('/loans/card/:id', {
                templateUrl: 'app/templates/loans/edit_loan.html',
                controller: "cardController"
            })

        .otherwise({
            redirectTo: '/'
        });
    }])

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