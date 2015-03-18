var vehicles = angular.module('vehicles', ['ngAnimate', 'speech']);
vehicles.run(function (Speech) {
	Speech.language = 'en-GB';
});

vehicles.controller('GameController', function ($scope, Speech) {
	this.name = null;

	this.set_name = function (name) {
		this.name = name;
		Speech.say('Hello ' + name + '. Let\'s play!', 'en-GB');
	};
});


vehicles.controller('NameController', function ($scope) {
    $scope.name = null;
    $scope.is_submitted = false;

    this.read_name = function () {
    	$scope.game_controller.set_name($scope.name);
    	$scope.is_submitted = true;
    };
});