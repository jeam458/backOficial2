angular.module('MyApp')
    .controller('SignupCtrl', function ($scope, $location, $auth, toastr) {
        $scope.tipos=['administrador','descarga'];
        $scope.estados=['activo','inactivo'];
        $scope.signup = function () {
            $auth.signup($scope.user)
                .then(function () {
                    $location.path('/login');
                    toastr.clear();
                    toastr.info('Ha creado una cuenta nueva correctamente');
                    $scope.user={};
                })
                .catch(function (response) {
                    toastr.clear();
                    toastr.error(response.data.message);
                });
        };
    });