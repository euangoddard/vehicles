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

var directives = angular.module('vehicles.directives', ['vehicles.constants', 'speech']);

directives.directive('vehicles', function () {
    var build_vehicle = function (vehicle_name) {
        return {
            name: vehicle_name,
            id: _.uniqueId(),
            is_selected: false,
            is_winner: false
        };
    };

    var QUESTION_TEMPLATE_STRINGS = [
        '${name}, can you find the ${vehicle}?',
        '${name}, where is the ${vehicle}?'
    ];

    var QUESTION_TEMPLATES = _.map(QUESTION_TEMPLATE_STRINGS, _.template);

    return {
        templateUrl: '/partials/vehicles.html',
        controller: function ($scope, $attrs, VEHICLES, Speech) {
            var controller = this;

            controller.init = function () {
                controller.theme = _.sample(THEME_COLOURS);

                controller.rows = $scope.$eval($attrs.rows);
                controller.columns = $scope.$eval($attrs.columns);

                var selected_vehicle_name = _.sample(VEHICLES);
                var other_vehicle_names = _.difference(VEHICLES, [selected_vehicle_name]);

                var vehicle_names_pool = [];
                var required_vehicle_count = controller.rows * controller.columns;
                for (var i = required_vehicle_count - 1; i > 0; i--) {
                    vehicle_names_pool.push(_.sample(other_vehicle_names));
                };
                var vehicles_pool = _.map(vehicle_names_pool, build_vehicle);

                controller.selected_vehicle = build_vehicle(selected_vehicle_name);

                vehicles_pool.push(controller.selected_vehicle);
                vehicles_pool = _.shuffle(vehicles_pool);

                controller.vehicles = _.chunk(vehicles_pool, controller.columns);

                controller.speak_clue();
            };

            controller.speak_clue = function () {
                var template = _.sample(QUESTION_TEMPLATES);
                Speech.say(template({
                    name: $scope.game_controller.name,
                    vehicle: controller.selected_vehicle.name
                }));
            };

            controller.guess = function (vehicle) {
                if (vehicle.is_selected) {
                    return;
                }
                if (vehicle.id === controller.selected_vehicle.id) {
                    vehicle.is_winner = true;
                    Speech.say('That\s right!').then(function () {
                        $scope.game_controller.advance_level();
                    });
                } else {
                    vehicle.is_selected = true;
                    Speech.say('Try again');
                }
            };

            controller.init();
        },
        controllerAs: 'vehicles_controller'
    };
});


directives.directive('nameCapture', function () {
    return {
        templateUrl: '/partials/name_capture.html',
        controller: function ($scope) {
            $scope.name = null;
            $scope.is_submitted = false;

            this.read_name = function () {
                $scope.game_controller.set_name($scope.name);
                $scope.is_submitted = true;
            };
        },
        controllerAs: 'name_controller'
    };
});


directives.directive('endGame', function () {
    return {
        templateUrl: '/partials/end.html'
    };
});
