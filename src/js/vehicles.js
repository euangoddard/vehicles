var vehicles = angular.module('vehicles', ['speech']);


vehicles.controller('test', function ($scope, Speech) {
    $scope.speech = {text: 'This is a test'};
    $scope.is_speaking = false;
    $scope.speak = function () {
        $scope.is_speaking = true;
        Speech.say($scope.speech.text, 'en-GB').then(function () {
            $scope.is_speaking = false;
        });
    };
});