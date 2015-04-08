var THEME_COLOURS = [
    'red',
    'pink',
    'indigo',
    'purple',
    'blue',
    'light-blue',
    'cyan',
    'teal',
    'green',
    'lime',
    'yellow',
    'amber',
    'orange',
    'deep-orange',
    'brown'
];

var directives = angular.module(
    'vehicles.directives',
    ['vehicles.constants', 'speech', 'storage']
);

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

    var WRONG_ANSWER_TEMPLATE = _.template('Try again. Where\'s the ${vehicle}?');

    return {
        templateUrl: '/partials/vehicles.html',
        controller: function ($scope, $attrs, VEHICLES, Speech) {
            var controller = this;

            controller.init = function () {

                controller.theme = _.sample(THEME_COLOURS);

                controller.rows = $scope.$eval($attrs.rows);
                controller.columns = $scope.$eval($attrs.columns);

                var selected_vehicle_name = $scope.$eval($attrs.selectedVehicle);
                var other_vehicle_names = _.difference(VEHICLES, [selected_vehicle_name]);

                var required_vehicle_count = (controller.rows * controller.columns) - 1;
                var vehicle_names_pool = _.sample(other_vehicle_names, required_vehicle_count);
                var vehicles_pool = _.map(vehicle_names_pool, build_vehicle);

                controller.selected_vehicle = build_vehicle(selected_vehicle_name);

                vehicles_pool.push(controller.selected_vehicle);
                vehicles_pool = _.shuffle(vehicles_pool);

                controller.vehicles = _.chunk(vehicles_pool, controller.columns);

                controller.is_winner_guessed = false;
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
                if (vehicle.is_selected || controller.is_winner_guessed) {
                    return;
                }
                if (vehicle.id === controller.selected_vehicle.id) {
                    vehicle.is_winner = true;
                    controller.is_winner_guessed = true;
                    Speech.say('That\s right!').then(function () {
                        $scope.game_controller.advance_level();
                    });
                } else {
                    vehicle.is_selected = true;
                    Speech.say(WRONG_ANSWER_TEMPLATE({
                        vehicle: controller.selected_vehicle.name
                    }));
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
        controller: function ($scope, SessionStore) {
            $scope.name = SessionStore.get('player.name') || null;
            $scope.is_submitted = false;

            this.read_name = function () {
                SessionStore.put('player.name', $scope.name);
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
