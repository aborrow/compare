'use strict';

angular.module('app')
    .controller('loansController', function($firebaseObject, $firebaseArray, FirebaseUrl, $scope, cfpLoadingBar, $location) {
        var refLoans = new Firebase(FirebaseUrl + '/loans/loans');
        var refCards = new Firebase(FirebaseUrl + '/loans/cards');
        var refBank = new Firebase(FirebaseUrl + '/loans/banks');

        $scope.data = {
            'loan': $firebaseArray(refLoans),
            'card': $firebaseArray(refCards)
        }
        $scope.templates = {
            'loan': 'app/templates/loans/loan.html',
            'card': 'app/templates/loans/card.html'
        };
        $scope.loan_type = "cash";
        $scope.loan_subtype = "loan";
        $scope.templateURL = $scope.templates[$scope.loan_subtype];
        $scope.setLoanType = function(type) {
            $scope.loan_type = type;
            //$scope.templateURL = $scope.templates[$scope.loan_subtype];
        }
        $scope.setLoanSubType = function(type) {
            $scope.loan_subtype = type;
            $scope.templateURL = $scope.templates[$scope.loan_subtype];
        }
        var obj = $firebaseArray(refBank);
        cfpLoadingBar.start();
        $scope.isLoading = true;
        obj.$loaded().then(function(res) {
            cfpLoadingBar.complete();
            $scope.isLoading = false;
        });
        $scope.save = {};

        $scope.save.loan_subtype = "loan";
        $scope.banks = obj;


        $scope.addingLoan = {};
        $scope.addingLoan.documents = {};
        $scope.addingLoan.documents.employee = {
            "bank_book": "",
            "fin_doc": [],
            "official_doc": ""
        };
        $scope.addingLoan.documents.entrepreneur = {
            "bank_book": "",
            "fin_doc": [],
            "official_doc": ""
        };
        $scope.addingLoan.fees = [{
            "desc": "",
            "name": "",
            "link": ""
        }];
        $scope.addingLoan.highlights = [];
        $scope.addingLoan.interest_tiers = {};
        $scope.addingLoan.interest_tiers.employee = [{
            "rates": [{
                "amount_max": 0,
                "amount_min": 0,
                "rate": 0
            }],
            "salary_max": 0,
            "salary_min": 0
        }, ];
        $scope.addingLoan.interest_tiers.entrepreneur = [{
            "rates": [{
                "amount_max": 0,
                "amount_min": 0,
                "rate": 0
            }],
            "salary_max": 0,
            "salary_min": 0
        }, ];
        $scope.addingLoan.payment_methods = [{
            "fee": "",
            "method": "",
            "remarks": ""
        }];
        $scope.addingLoan.qualifications = {};
        $scope.addingLoan.qualifications.employee = {
            "max_age": 60,
            "min_age": 21,
            "min_salary": 20000,
            "min_work_exp": 4,
            "occupation": "พนักงานประจำ/ข้าราชการ"
        };
        $scope.addingLoan.qualifications.entrepreneur = {
            "max_age": 60,
            "min_age": 21,
            "min_salary": 20000,
            "min_work_exp": 24,
            "occupation": "เจ้าของกิจการ",
            "remarks": "ดำเนินธุรกิจประเภทเดียวกันสำหรับเจ้าของกิจการอย่างน้อย 2 ปี"
        };

        $scope.submitData = function(loan) {
            if ($scope.save.loan_subtype === "loan") {
                $scope.addToLoans(loan);
            } else {
                $scope.addToCards(loan);
            }
            $location.path("/loans");
        };

        $scope.addToLoans = function(loan) {
            loan.bank = {
                bank_name: loan.bank.bank_name,
                eng_name: loan.bank.eng_name,
                logo: loan.bank.logo,
            }
            refLoans.push(loan);
        }
        $scope.addToCards = function(loan) {
            loan.bank = {
                bank_name: loan.bank.bank_name,
                eng_name: loan.bank.eng_name,
                logo: loan.bank.logo,
            }
            refCards.push(loan);
        }


    }).controller('loanController', function($firebaseObject, $firebaseArray, FirebaseUrl, $routeParams, $scope, cfpLoadingBar, $location) {
        var refLoans = new Firebase(FirebaseUrl + '/loans/loans');
        var refBank = new Firebase(FirebaseUrl + '/loans/banks');
        var id = $routeParams.id;
        var obj = $firebaseObject(refLoans.child(id));

        var interest_term = {};
        cfpLoadingBar.start();
        $scope.isLoading = true;
        obj.$loaded().then(function(res) {
            cfpLoadingBar.complete();
            $scope.isLoading = false;
            if (angular.isString(res.interest_term)) {
                var term = res.interest_term;
                $scope.loan.interest_term = {}
                $scope.loan.interest_term.term = term;
            }
        });
        $scope.loan = obj;
        $scope.banks = $firebaseArray(refBank);
        $scope.submitData = function(loan) {

            loan.$save();
            $location.path("/loans");
        };


    }).controller('cardController', function($firebaseObject, $firebaseArray, FirebaseUrl, $routeParams, $scope, cfpLoadingBar, $location) {
        var refCards = new Firebase(FirebaseUrl + '/loans/cards');
        var refBank = new Firebase(FirebaseUrl + '/loans/banks');
        var id = $routeParams.id;
        var obj = $firebaseObject(refCards.child(id));
        cfpLoadingBar.start();
        $scope.isLoading = true;
        obj.$loaded().then(function(res) {
            cfpLoadingBar.complete();
            $scope.isLoading = false;
        });

        $scope.loan = obj;
        $scope.banks = $firebaseArray(refBank);
        $scope.submitData = function(loan) {
            loan.$save();
            $location.path("/loans");
        };
    });