'use strict';

angular.module('app')
    .factory('focus', function($timeout, $window) {
        return function(id) {
            // timeout makes sure that it is invoked after any other event has been triggered.
            // e.g. click events that need to run before the focus or
            // inputs elements that are in a disabled state but are enabled when those events
            // are triggered.
            $timeout(function() {
                var element = $window.document.getElementById(id);
                if (element)
                    element.focus();
            });
        };
    })
    // .config(['$routeProvider', function($routeProvider) {
    //   $routeProvider

//   .when('/kk', {
//     templateUrl: '../index.html',
//     controller: 'mainController'
//   })

//   .when('/clients_list', {
//     templateUrl: '../clients.html',
//     controller: 'clientController',
//     // resolve: {
//     //           auth: function(Auth, $location){
//     //             return Auth.auth.$requireAuth().catch(function(){
//     //              console.log('test');
//     //               $location.path( "/signin" );
//     //             });
//     //          }
//     //        }
//   });
// }])

.controller('mainController', function($firebaseObject, $firebaseArray,
    FirebaseUrl, $scope, $route, $filter,
    $http, focus, $timeout) {
    // var config = {
    //   apiKey: "AIzaSyDg1Hfu7KlBd6u51q8NE80_yet4yDix9Jc",
    //   authDomain: "aborrow-e765a.firebaseapp.com",
    //   databaseURL: "https://aborrow-e765a.firebaseio.com",
    //   storageBucket: "aborrow-e765a.appspot.com",
    // };
    // var fbApp = firebase.initializeApp(config);
    // var fbDb = firebase.database();
    // $scope.test = fbDb.ref("/compare/loans");
    // console.log($scope.test.ref, $scope.test.key);

    var refLoans = new Firebase(FirebaseUrl + '/compare/loans');
    var refCards = new Firebase(FirebaseUrl + '/compare/cards');

    $scope.data = {
        'loan': $firebaseObject(refLoans),
        'card': $firebaseObject(refCards)
    }

    $scope.occupations = [{
        text: "พนักงานประจำ",
        value: "employee"
    }, {
        text: "เจ้าของกิจการ",
        value: "entrepreneur"
    }]

    $scope.loanTypes = [{
        text: "เงินสด",
        value: "loan"
    }, {
        text: "รถ",
        value: "car"
    }, {
        text: "บ้าน",
        value: "house"
    }]
    $scope.$on('$routeChangeSuccess', function(e) {
        focusToElement('loanSelect');
    });


    $scope.focused = false;
    $scope.step = 0;
    $scope.templateUrls = ["app/templates/signup/signup1.html",
        "app/templates/signup/signup2.html",
        "app/templates/signup/signup3.html"
    ]
    $scope.templateUrl = $scope.templateUrls[0];

    $scope.user = {};
    $scope.compare = {};
    $scope.compare.loan_type = "";
    $scope.compare.loanAmount = "";
    $scope.compare.loanTerm = "";
    $scope.compare.occupation = "";
    $scope.compare.salary = "";
    $scope.compare.work_exp = "";
    // $scope.allLoans = $firebaseObject(refLoans);
    // $scope.allCards = $firebaseObject(refCards);
    // var refUser = new Firebase(FirebaseUrl+'/user_data');
    // $scope.user_data = $firebaseObject(refUser);
    $scope.selected = [];
    // console.log($scope.data);

    $scope.inputStep = 0;
    $scope.inputControls = ["loanSelect", "loanAmount", "loanTerm",
        "occupation", "salary", "work_exp"
    ];

    $scope.focusNext = function(event) {
        $timeout(function() {
            findNextFocus(event);
        }, 400)
    }


    function findNextFocus(event) {
        if (event != null && (event.target.id === "loanAmount" || event.target.id === "salary" || event.target.id === "work_exp")) {
            if (event.target.id === "loanAmount" && $scope.compare.loanAmount === "") {
                $scope.focused = true;
            } else if (event.target.id === "salary" && $scope.compare.salary === "") {
                $scope.focused = true;
            } else if (event.target.id === "work_exp" && $scope.compare.work_exp === "") {
                $scope.focused = true;
            }
        }
        if ($scope.inputStep == 0) {
            if ($scope.compare.loan_type !== "") {
                $scope.inputStep = $scope.inputStep + 1;
            }
        }
        if ($scope.inputStep == 1) {
            if ($scope.compare.loanAmount !== "") {
                $scope.inputStep = $scope.inputStep + 1;
            }
        }
        if ($scope.inputStep == 2) {
            if ($scope.compare.loanTerm !== "") {
                $scope.inputStep = $scope.inputStep + 1;
            }
        }
        if ($scope.inputStep == 3) {
            if ($scope.compare.occupation !== "") {
                $scope.inputStep = $scope.inputStep + 1;
            }
        }
        if ($scope.inputStep == 4) {
            if ($scope.compare.salary !== "") {
                $scope.inputStep = $scope.inputStep + 1;
            }
        }
        if ($scope.inputStep == 5) {
            if ($scope.compare.work_exp !== "") {
                $scope.inputStep = $scope.inputStep + 1;
            }
        }
        if ($scope.inputStep < 6) {
            let eleId = $scope.inputControls[$scope.inputStep];
            if (!$scope.focused) {
                focusToElement(eleId);
            }
            $scope.focused = false;
        }
    }

    function focusToElement(eleId) {
        focus(eleId);
    }

    $scope.submitData = function() {
        $scope.step = $scope.step + 1;
        if ($scope.step < 3) {
            $scope.templateUrl = $scope.templateUrls[$scope.step];
        }
        if ($scope.step == 3) {
            $scope.saveUserData();
        }


    }
    $scope.backToPrevious = function() {
        $scope.step = $scope.step - 1;
        if ($scope.step >= 0) {
            $scope.templateUrl = $scope.templateUrls[$scope.step];
        }

    }

    $scope.calLoanAmount = function(monthlyPmt, loanTerm, interest) {
        var monthlyInt = interest / 1200;
        return monthlyPmt * ((1 - Math.pow(1 + monthlyInt, -1 * loanTerm)) / monthlyInt);
    }

    // console.log($scope.calLoanAmount(5387.4567, 24, 26));

    $scope.calRepayment = function(loanAmount, loanTerm, interest) {
        var monthlyInt = interest / 1200;
        return (monthlyInt * loanAmount) / (1 - Math.pow(1 + monthlyInt, -1 * loanTerm));
    }

    // console.log($scope.calRepayment(100000, 24, 26));

    $scope.refreshData = function(loan_type, occupation, salary, work_exp, loanTerm, loanAmount) {
            var filtered = [];

            var allLoans = $scope.data[loan_type];
            angular.forEach(allLoans, function(value, key) {
                if (value.qualifications[occupation] && value.qualifications[occupation].min_salary <= salary && value.qualifications[occupation].min_work_exp <= work_exp && ((loan_type == 'loan' && loanTerm >= value.term.min && loanTerm <= value.term.max) || loan_type == 'card')
                    // && (loanAmount <= value.amount.max)
                ) {
                    var obj = value;
                    //console.log(occupation, obj.preciseInt, $scope.data);
                    if (obj.interest_tiers && obj.interest_tiers[occupation]) {
                        var tiers = obj.interest_tiers[occupation];
                        var preciseInt = $scope.getPreciseInterest(tiers, salary, loanAmount, loanTerm);
                        //console.log(obj.eng_name, preciseInt, loanTerm);
                        obj.monthlyRepayment = 0;
                        if (preciseInt) {
                            obj.preciseInt = preciseInt;
                            if (loan_type == 'loan')
                                obj.monthlyRepayment = $scope.calRepayment(loanAmount, loanTerm, preciseInt);
                        } else {
                            if (loan_type == 'loan')
                                obj.monthlyRepayment = $scope.calRepayment(loanAmount, loanTerm, obj.interest.max);
                        }
                        // console.log(obj.bank_name, obj.preciseInt, obj.interest.max, obj.monthlyRepayment)
                    }
                    filtered.push(obj);
                }
            });
            // console.log(filtered);
            return filtered;
        }
        // console.log($scope.data);
        // $scope.loansByOcc = $filter('filter')($scope.data, {eng_name: 'bay'});
        //     console.log($scope.occupation, $scope.loansByOcc);
        // $scope.registerButtonStatus = "สนใจสมัคร";
    $scope.selectLoan = function(loan) {
        // console.log($scope.selected);
        // var obj = {
        //     'bank': loan.bank_name,
        //     'logo': loan.logo,
        //     'loan_name': loan.loan_name,
        //     'preciseInterest': loan.preciseInt,
        //     'interest_term': loan.interest_term,
        //     'monthlyRepayment': loan.monthlyRepayment,
        //     'docs': loan.documents[$scope.occupation],
        //     'qualifications': loan.qualifications[$scope.occupation],
        //     'payment_methods': loan.payment_methods,
        //     'fees': loan.fees
        // };
        if ($scope.selected.indexOf(loan) >= 0) {
            $scope.selected.splice($scope.selected.indexOf(loan), 1);
            loan.registerButtonStatus = "สนใจสมัคร";
            // $scope.$apply();
        } else {
            $scope.selected.push(loan);
            loan.registerButtonStatus = "เลือกแล้ว";
            // $scope.$apply();
        }

    }

    $scope.saveUserData = function() {
        //console.log($scope.selected);
        var data = {
            user: $scope.user,
            loan_type: $scope.compare.loan_type,
            occupation: $scope.compare.occupation,
            salary: $scope.compare.salary,
            work_exp: $scope.compare.work_exp,
            loanTerm: $scope.compare.loanTerm,
            loanAmount: $scope.compare.loanAmount,
            date: new Date().toString()
        };
        console.log(data);
        var dataRef = new Firebase(FirebaseUrl + "/compare/user_data");
        dataRef.push(angular.copy(data)); //not yet tested

        // dataRef.push(JSON.parse(data)); //not yet tested
        // $http({
        //         // headers:{
        //         //     "Content-Type": "application/x-www-form-urlencoded",
        //         //     "Authorization": "Basic " + window.btoa('api:key-a9ebcb824b4f7dac929448b82a01e9d4'),
        //         //     'Access-Control-Allow-Origin': '*',
        //         //     'Accept': 'application/json',
        //         //     'Access-Control-Allow-Credentials': 'true',
        //         //     'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
        //         //     'Access-Control-Allow-Headers': 'X-HTTP-Method-Override, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,If-Modified-Since',
        //         //     'Access-Control-Expose-Headers': 'Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,If-Modified-Since',
        //         // },            
        //         transformRequest: function(obj) {
        //             var str = [];
        //             for(var p in obj)
        //             str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        //             return str.join("&");
        //         },
        //         // transformResponse: function(data, headers){
        //         //     var response = {}
        //         //     response.data = data;
        //         //     response.headers = headers();
        //         //     return response;
        //         // },
        //         url: 'https://crossorigin.me/https://api.mailgun.net/v3/mg.aborrow.com/messages',
        //         method: 'POST',
        //         data: {
        //             'from': 'noreply@mg.aborrow.com',
        //             'to': ['cholathit@aborrow.com'],
        //             'subject': 'aBorrow Compare - K.' + data.user.name + ' Tel. ' + data.user.phone,
        //             'text': angular.toJson(data, true)
        //         }
        // }).success(function (res, status, headers, config) {
        //             //handle success
        //             console.log(res);  
        //             // alert("เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด");
        //             window.location.reload();
        // }).error(function (res, status, headers, config) {
        //             //handle error
        //             console.log(res);  
        // });
        alert("เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด");
        //window.location.reload();
    }

    //   $scope.sendMail = function(a){
    //   console.log(a.toEmail);
    //   var mailJSON ={
    //       "key": "api:key-a9ebcb824b4f7dac929448b82a01e9d4",
    //       "message": {
    //         "text": a,
    //         "subject": "Compare Data",
    //         "from_email": "postmaster@mg.aborrow.com",
    //         "from_name": "Postmaster at aBorrow",
    //         "to": [
    //           {
    //             "email": "cholathit@aborrow.com",
    //             "name": "Cholathit K",
    //             "type": "to"
    //           }
    //         ],
    //         // "important": false,
    //         // "track_opens": null,
    //         // "track_clicks": null,
    //         // "auto_text": null,
    //         // "auto_html": null,
    //         // "inline_css": null,
    //         // "url_strip_qs": null,
    //         // "preserve_recipients": null,
    //         // "view_content_link": null,
    //         // "tracking_domain": null,
    //         // "signing_domain": null,
    //         // "return_path_domain": null
    //       },
    //       "async": false
    //   };
    //   var apiURL = 'https://api.mailgun.net/v3/mg.aborrow.com/messages';
    //   $http.post(apiURL, mailJSON).
    //     success(function(data, status, headers, config) {
    //       alert('successful email send.');
    //       $scope.form={};
    //       console.log('successful email send.');
    //       console.log('status: ' + status);
    //       console.log('data: ' + data);
    //       console.log('headers: ' + headers);
    //       console.log('config: ' + config);
    //     }).error(function(data, status, headers, config) {
    //       console.log('error sending email.');
    //       console.log('status: ' + status);
    //     });
    // }

    $scope.getPreciseInterest = function(tiers, salary, loanAmount, loanTerm) {
        var x;
        // var occ_tier = tiers[occupation];

        angular.forEach(tiers, function(value, key) {
            if ((salary >= value.salary_min && salary <= value.salary_max) || (!value.salary_max && salary >= value.salary_min) || (loanTerm >= value.term_min && loanTerm <= value.term_max) || (!value.salary_max && !value.salary_min && !value.term_max && !value.term_min)) {
                angular.forEach(value.rates, function(v, k) {
                    console.log();
                    if ((v.amount_max == 'undefined' && loanAmount >= v.amount_min) || (v.amount_min == 'undefined' && loanAmount <= v.amount_max) || (loanAmount >= v.amount_min && loanAmount <= v.amount_max)) {
                        //console.log(v.rate, k);
                        x = v.rate;
                    }
                });
            }
        });

        return x;
    };

})

.controller('clientController', function($firebaseObject, $firebaseArray, FirebaseUrl, $scope) {
    var ref = new Firebase(FirebaseUrl);
    console.log($scope.authData);

    var refUser = new Firebase(FirebaseUrl + '/compare/user_data');

    $scope.login = function() {
        ref.authWithPassword({
            email: $scope.email,
            password: $scope.password
        }, function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                $scope.authData = authData;
                $scope.user_data = $firebaseObject(refUser);
                $scope.$apply();
            }
        });
    }

    var $load = $('<div align="center"><h1>Loading...</h1></div>').appendTo('main-list');
    refUser.on('value', function() {
        $load.hide();
    })

});