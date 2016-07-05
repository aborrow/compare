'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
        'ui.router',
        'firebase',
        'dynamicNumber',
        'tabs',
        'sticky',
        'ui.checkbox',
        'ngOrderObjectBy',
        'cfp.loadingBar',
        'ng.jsoneditor'
    ])
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('compare', {
                url: '/',
                templateUrl: 'compare.html',
                controller: "mainController"
            })
            .state('loans', {
                url: '/loans',
                templateUrl: 'loans.html',
                controller: "loansController"
            })
             .state('loan/create', {
                url: '/loans',
                 templateUrl: 'app/templates/loans/add_loan.html',
                controller: "loansController",
            })
            .state('loan', {
                url: '/loans/loan/:id',
                templateUrl: 'app/templates/loans/edit_loan.html',
                controller: "loanController",
            }).state('card', {
                url: '/loans/card/:id',
                templateUrl: 'app/templates/loans/edit_loan.html',
                controller: "cardController",
            });

         $urlRouterProvider.otherwise("/");
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