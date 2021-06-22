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
    // $interval(function() {
    //     $http({
    //         method: 'GET',
    //         url: '/manifest/lastjob'
    //     }).then(function successCallback(response) {
    //         last_job = response.data
    //         $scope.last_job_status =last_job['job_run']['state']
    //         // console.log(last_job)
    //         // console.log($scope.last_job_status)
    //     }, function errorCallback(response) {

    //     });
    //     // $scope.last_job_status = "This DIV is refreshed " + c + " time.";
    //     c++;
    // }, 30000);

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


    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function() {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };

    $scope.toggleMin();
    $scope.maxDate = new Date(2020, 5, 22);

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [{
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
    ];

    $scope.getDayClass = function(date, mode) {
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    };

    $scope.jobid = '';

    $scope.chooseDate = function() {

        if (typeof $scope.token !== "undefined") {
            $scope.last_job_status = "Job is sent"
            date_parse = moment($scope.dt).format('DD/MM/YYYY');

            // var text = '{ "Now" :"' + date_parse + '"}'
            // var obj = JSON.parse(text);

            // var token = '{ "Token" :"' + $scope.token + '"}'

            obj_send = '{ "Now" :"' + date_parse + '",' + '"Token" :' + $scope.token + '}'
            console.log(obj_send)
            var obj = JSON.parse(obj_send);
            $http({
                method: 'POST',
                url: "/manifest",
                data: obj_send
            }).then(function successCallback(response) {
                // console.log(response)
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
