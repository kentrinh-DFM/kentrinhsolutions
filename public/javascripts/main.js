// $(document).ready(function() {
//     $('.input-group.date').datepicker({
//         format: 'dd/mm/yyyy',
//         todayBtn: true,
//         todayHighlight: true,
//         clearBtn: true
//     });

// });


var app = angular.module('myApp', ['ui.bootstrap']);
app.controller('myCtrl', function($scope, $http, $interval) {

    $interval(function() {
        $http({
            method: 'GET',
            url: '/manifest/lastjob'
        }).then(function successCallback(response) {
            last_job = response.data
            console.log(last_job)
            $scope.last_job_status = last_job['job_run']['state']
            // console.log(last_job)
            // console.log($scope.last_job_status)
        }, function errorCallback(response) {

        });
        // $scope.last_job_status = "This DIV is refreshed " + c + " time.";
    }, 20000);

    $http({
        method: 'GET',
        url: '/manifest/lastjob'
    }).then(function successCallback(response) {
        last_job = response.data
        $scope.last_job_status = last_job['job_run']['state']
        // console.log(last_job)
        // console.log($scope.last_job_status)
    }, function errorCallback(response) {

    });
    // $http({
    //     method: 'GET',
    //     url: '/manifest/date'
    // }).then(function successCallback(response) {
    //     // this callback will be called asynchronously
    //     // when the response is available
    //     // console.log(response.data)

    //     new_date = moment(response.data, 'DD/MM/YYYY').toDate();

    //     // date_parse = moment(new_date).format('DD/MM/YYYY');

    //     // date_parse = moment($scope.dt).format('DD-MM-YYYY');
    //     // console.log(new_date)
    //     $scope.dt = new_date

    // }, function errorCallback(response) {
    //     console.log("error")
    //     // called asynchronously if an error occurs
    //     // or server returns response with an error status.

    //     // $scope.firstName = "John";
    //     // $scope.lastName = "Doe";
    // });

    $scope.jobid = '';
    obj_send = {
        "method": "Add",
        "params": {
            "typeName": "Audit",
            "entity": {
                "name": "ReportRiskManagement",
                "comment": "Ran report from 2021-07-19T14:30:00.000Z to 2021-07-20T14:29:59.000Z, View by: Device, Run report by: 0, Hide zero distance rows: Yes, Groups: 4WD - Compass Group CB (ID: b396E); 4WD - Compass Group Curtis Island (ID: b3964); 4WD - Compass Group EQ (ID: b3963); 4WD - Compass Group CB (ID: b34A0); 4WD - Compass Group CB (ID: b3489); Delta EQ (ID: b3B77); Delta CB (ID: b3B76); Compass Group EQ (ID: b3958); Compass Group Curtis Island (ID: b3961); Compass Group CB (ID: b345B), Report template: Advanced Risk Management Report, Type: excel"
            },
            "credentials": {
                "database": "santos",
                "sessionId": "ugyAfDW-YZkcFVtKUsAHFg",
                "userName": "kentrinh@compass-group.com.au"
            }
        }
    }
    $http({
        method: 'POST',
        url: "https://securatrak125.geotab.com/apiv1/",
        data: obj_send
    }).then(function successCallback(response) {
        console.log(response)
    });

    $scope.chooseDate = function() {

        if (typeof $scope.token !== "undefined") {
            $scope.last_job_status = "Job is sent"
            date_parse = moment($scope.dt).format('DD/MM/YYYY');

            // var text = '{ "Now" :"' + date_parse + '"}'
            // var obj = JSON.parse(text);

            var obj_send = '{ "Token" :"' + $scope.token + '"}'

            // obj_send = '{"Token" :"' + $scope.token + '"}'
            console.log(obj_send)
            var obj = JSON.parse(obj_send);
            $http({
                method: 'POST',
                url: "/manifest",
                data: obj_send
            }).then(function successCallback(response) {
                console.log(response)
            });
        }

        // console.log(obj)

        // $http({
        //     method: 'POST',
        //     url: "/manifest",
        //     data: obj
        // }).then(function successCallback(response) {
        //     console.log(response)
        // });
    }


})