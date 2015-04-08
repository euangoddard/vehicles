var vehicles = angular.module(
    'vehicles',
    ['ngAnimate', 'speech', 'vehicles.directives']
);
vehicles.config(function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
});
vehicles.run(function (Speech) {
    Speech.language = 'en-GB';
    Speech.say('');
});

vehicles.controller('GameController', function ($scope, Speech, $interval, VEHICLES) {
    var controller = this;

    controller.set_name = function (name) {
        controller.name = name;
        Speech.say('Hello ' + name + '. Let\'s play!').then(function () {
            controller.advance_level();
        });
    };

    var levels = []
    controller.levels = [];
    controller.advance_level = function () {
        controller.levels.shift();
        var next_level = levels.shift();
        if (next_level) {
            controller.levels.push(next_level);
        } else {
            controller.is_complete = true;
        }
    };

    controller.restart = function () {
        controller.name = null;
        controller.is_complete = false;
        levels = get_levels(VEHICLES);
    };
    controller.restart();
});


// Utilities
var MAX_LEVELS = 3;

var get_levels = function (vehicles) {
    var levels = [];
    var candidate_vehicles = _.shuffle(vehicles);
    _.range(1, MAX_LEVELS + 1).forEach(function (rows) {
        _.range(1, MAX_LEVELS + 1).forEach(function (columns) {
            levels.push({
                rows: rows,
                columns: columns,
                vehicle: candidate_vehicles.pop()
            });
        });
    });
    levels.sort(function (a, b) {
        return multiply_values(a) - multiply_values(b);
    });
    return levels;
};

var multiply_values = function (obj) {
    var values = _.filter(_.values(obj), _.isFinite);
    var sum = _.reduce(values, function (a, b) {
        return a * b;
    });
    return sum;
};
