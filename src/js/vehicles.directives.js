var THEME_COLOURS = [
    'red',
    'pink',
    'indigo',
    'purple',
    'blue',
    'light-blue',
    'teal',
    'green',
    'light-green',
    'orange',
    'deep-orange',
    'brown',
    'grey'
];

var directives = angular.module('vehicles.directives', ['vehicles.constants']);

directives.directive('vehicles', function () {
    return {
        templateUrl: '../partials/vehicles.html',
        controller: function ($scope, $attrs, VEHICLES, Speech) {
            var controller = this;

            this.theme = _.sample(THEME_COLOURS);

            controller.rows = $scope.$eval($attrs.rows);
            controller.columns = $scope.$eval($attrs.columns);

            controller.selected_vehicle = _.sample(VEHICLES);
            var vehicles_pool = [controller.selected_vehicle];
            var other_vehicles = _.difference(VEHICLES, vehicles_pool);

            var required_vehicle_count = controller.rows * controller.columns;
            for (var i = required_vehicle_count - 1; i > 0; i--) {
                vehicles_pool.push(_.sample(other_vehicles));
            };
            vehicles_pool = _.shuffle(vehicles_pool);

            controller.vehicles = _.chunk(vehicles_pool, controller.columns);

            Speech.say($scope.game_controller.name + ', can you find the ' + controller.selected_vehicle);
        },
        controllerAs: 'vehicles_controller'
    };
});


directives.directive('nameCapture', function () {
    return {
        templateUrl: '../partials/name_capture.html',
        controller: function ($scope) {
            $scope.name = null;
            $scope.is_submitted = false;

            this.read_name = function () {
                $scope.game_controller.set_name($scope.name);
                $scope.is_submitted = true;
            };
        },
        controllerAs: 'name_controller'
    }
});