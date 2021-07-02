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

    var c = 0;
    $interval(function() {
        $http({
            method: 'GET',
            url: '/manifest/lastjob'
        }).then(function successCallback(response) {
            last_job = response.data
            console.log(last_job)
            $scope.last_job_status =last_job['job_run']['state']
            // console.log(last_job)
            // console.log($scope.last_job_status)
        }, function errorCallback(response) {

        });
        // $scope.last_job_status = "This DIV is refreshed " + c + " time.";
        c++;
    }, 60000);

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
    $scope.success = '';

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
                $scope.success = response.status
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
