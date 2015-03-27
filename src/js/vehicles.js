var vehicles = angular.module(
    'vehicles',
    ['ngAnimate', 'speech', 'vehicles.directives']
);
vehicles.run(function (Speech) {
    Speech.language = 'en-GB';
});

vehicles.controller('GameController', function ($scope, Speech, $interval) {
    this.name = null;

    this.set_name = function (name) {
        this.name = name;
        Speech.say('Hello ' + name + '. Let\'s play!');
    };

    var levels = get_levels();
    this.levels = [];
    this.advance_level = function () {
        this.levels.shift();
        this.levels.push(levels.shift());
    };
    this.advance_level();
    var c = this;
    $interval(function () {
        c.advance_level();
    }, 3000);
});


vehicles.controller('NameController', function ($scope) {
    $scope.name = null;
    $scope.is_submitted = false;

    this.read_name = function () {
        $scope.game_controller.set_name($scope.name);
        $scope.is_submitted = true;
    };
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