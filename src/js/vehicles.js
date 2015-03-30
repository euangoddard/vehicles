var vehicles = angular.module(
    'vehicles',
    ['ngAnimate', 'speech', 'vehicles.directives']
);
vehicles.run(function (Speech) {
    Speech.language = 'en-GB';
    Speech.say('');
});

vehicles.controller('GameController', function ($scope, Speech, $interval) {
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
        levels = get_levels();
    };
    controller.restart();
});


// Utilities
var get_levels = function () {
    var levels = [];
    _.range(1, 4).forEach(function (rows) {
        _.range(1, 4).forEach(function (columns) {
            levels.push({rows: rows, columns: columns});
        });
    });
    levels.sort(function (a, b) {
        return multiply_values(a) - multiply_values(b);
    });
    return levels;
};

var multiply_values = function (obj) {
    var values = _.values(obj);
    var sum = _.reduce(values, function (a, b) {
        return a * b;
    });
    return sum
}