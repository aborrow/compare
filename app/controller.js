'use strict';

angular.module('app')

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'index.html',
    controller: 'mainController'
  });
}])

.controller('mainController', function($firebaseObject, $firebaseArray, FirebaseUrl, $scope, $filter, $http) {
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

	  var ref = new Firebase(FirebaseUrl+'/compare/loans');
    $scope.data = $firebaseObject(ref);
    var refUser = new Firebase(FirebaseUrl+'/user_data');
    $scope.user_data = $firebaseObject(refUser);
    $scope.selected = [];
    // console.log($scope.data);



    $scope.calLoanAmount = function(monthlyPmt, loanTerm, interest){
    	var monthlyInt = interest/1200;
    	return monthlyPmt*((1-Math.pow(1+monthlyInt, -1*loanTerm)) / monthlyInt);
    }

    // console.log($scope.calLoanAmount(5387.4567, 24, 26));

    $scope.calRepayment = function(loanAmount, loanTerm, interest){
    	var monthlyInt = interest/1200;
    	return (monthlyInt*loanAmount)/(1-Math.pow(1+monthlyInt, -1*loanTerm));
    }

    // console.log($scope.calRepayment(100000, 24, 26));

    $scope.refreshData = function(occupation,salary,work_exp,loanTerm, loanAmount){
        var filtered = [];
        var allLoans = $scope.data;
        angular.forEach(allLoans, function(value, key) {
          if(value.qualifications[occupation]
            && value.qualifications[occupation].min_salary <= salary
            && value.qualifications[occupation].min_work_exp <= work_exp
            && loanTerm >= value.term.min && loanTerm <= value.term.max
            // && (loanAmount <= value.amount.max)
            ) {
                var obj = value;
                //console.log(occupation, obj.preciseInt, $scope.data);
                if(obj.interest_tiers && obj.interest_tiers[occupation]) {
                  var tiers = obj.interest_tiers[occupation];
                  var preciseInt = $scope.getPreciseInterest(tiers, salary, loanAmount, loanTerm);
                  //console.log(obj.eng_name, preciseInt, loanTerm);
                  
                  if(preciseInt){
                    obj.preciseInt = preciseInt;
                    obj.monthlyRepayment = $scope.calRepayment(loanAmount, loanTerm, preciseInt);
                  }else{
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
    $scope.selectLoan = function(loan){
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
        if($scope.selected.indexOf(loan) >= 0) {
            $scope.selected.splice($scope.selected.indexOf(loan),1);
            loan.registerButtonStatus = "สนใจสมัคร";
            // $scope.$apply();
        }
        else {
            $scope.selected.push(loan);
            loan.registerButtonStatus = "เลือกแล้ว";
            // $scope.$apply();
        }

    }

    $scope.saveUserData = function(){
        //console.log($scope.selected);
        var data = {user: $scope.user,
            occupation: $scope.occupation,
            salary: $scope.salary,
            work_exp: $scope.work_exp,
            loanTerm: $scope.loanTerm,
            loanAmount: $scope.loanAmount,
            selectedLoans: $scope.selected,
            date: new Date()
        };
        var dataRef = new Firebase(FirebaseUrl+"/user_data");
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
        window.location.reload();
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

    $scope.getPreciseInterest = function(tiers, salary, loanAmount, loanTerm){
      var x;
      // var occ_tier = tiers[occupation];
        angular.forEach(tiers, function(value, key) {
            if((salary >= value.salary_min && salary <= value.salary_max)
                || (!value.salary_max && salary >= value.salary_min)
                || (loanTerm >= value.term_min && loanTerm <= value.term_max) ) {
                angular.forEach(value.rates, function(v, k) {
                  if((loanAmount >= v.amount_min && loanAmount <= v.amount_max)
                      || (v.amount_max == 'undefined' && loanAmount >= v.amount_min)) {
                        //console.log(v.rate, k);
                        x = v.rate;
                  }
                });
            }
        });

      return x;
    };

});
