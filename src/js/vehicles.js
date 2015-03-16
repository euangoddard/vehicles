var vehicles = angular.module('vehicles', ['speech']);


vehicles.controller('test', function ($scope, Speech) {
    $scope.speech = {text: 'This is a test'};
    $scope.speak = function () {
        Speech.say($scope.speech.text, 'en-GB');
    };
});