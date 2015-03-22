var directives = angular.module('vehicles.directives', ['vehicles.constants']);

directives.directive('vehicles', function () {
	return {
		scope: {
			rows: '&',
			columns: '&'
		},
		templateUrl: '../partials/vehicles.html',
		controller: function ($scope, VEHICLES) {
			var get_vehicles = function () {
				var selected_vehicle = _.choice(VEHICLES);
				var other_vehicles = _.difference(VEHICLES, [selected_vehicle]);
			};

			this.vehicles = get_vehicles();
		},
		controllerAs: 'vehicles_controller'
	}
});