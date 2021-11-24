var app = angular.module('myApp', []);
app.controller('myCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
    $scope.SelectedFileForUpload = null;

    $scope.UploadFile = function(files) {
        $scope.$apply(function() { //I have used $scope.$apply because I will call this function from File input type control which is not supported 2 way binding
            $scope.Message = "";
            $scope.SelectedFileForUpload = files[0];


        })
    }

    //Parse Excel Data 
    $scope.ParseExcelDataAndSave = function() {
        var file = $scope.SelectedFileForUpload;


        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var data = e.target.result;
                //XLSX from js-xlsx library , which I will add in page view page
                var workbook = XLSX.read(data, { type: 'binary' });
                var sheetName = workbook.SheetNames[0];
                var excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                if (excelData.length > 0) {
                    var fileinfo = { 'filename': file.name, 'data': excelData }
                    //Save data 
                    $scope.SaveData(fileinfo);
                } else {
                    $scope.Message = "No data found";
                }
            }
            reader.onerror = function(ex) {
                console.log(ex);
            }

            reader.readAsBinaryString(file);
        }
    }

    // Save excel data to our database
    $scope.SaveData = function(fileinfo) {
        // console.log(fileinfo)
        $http({
            method: "POST",
            url: "/manifest",
            data: JSON.stringify(fileinfo),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            console.log("success")
            $window.location.reload();
        }, function errorCallback(response) {

        });
    }

    $http({
        method: 'GET',
        url: '/manifest/'
    }).then(function successCallback(response) {

        $scope.files = response.data

    }, function errorCallback(response) {

    });

    $http({
        method: 'GET',
        url: '/manifest/user'
    }).then(function successCallback(response) {


        $scope.login = response.data;

    }, function errorCallback(response) {

    });

    $scope.Login = function() {

        var obj_send = '{ "username" :"' + $scope.username + '",' + '"password" : "' + $scope.password + '"}'

        // obj_send = '{"Token" :"' + $scope.token + '"}'
        // console.log(obj_send)
        var obj = JSON.parse(obj_send);
        $http({
            method: 'POST',
            url: "/manifest/user",
            data: obj_send
        }).then(function successCallback(response) {
            $scope.login = response.data
        });
    }

    $scope.Logout = function() {

        console.log("logout")
        $http({
            method: 'GET',
            url: "/manifest/logout",
        }).then(function successCallback(response) {
            $window.location.reload();
        });
    }

    $scope.DeleteFile = function(file) {

        console.log(file)

        // var obj = JSON.parse(file);
        $http({
            method: 'POST',
            url: "/manifest/removefile",
            data: file
        }).then(function successCallback(response) {
            // $scope.login = response.data
        });
        //  $http({
        //      method: 'GET',
        //      url: "/manifest/logout",
        //  }).then(function successCallback(response) {
        //       $window.location.reload();
        //  });
    }
}])