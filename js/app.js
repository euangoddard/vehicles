(function (angular, _) {
    "use strict";
angular.module("vehicles.constants", []).constant("VEHICLES", ["bike","boat","bus","car","helicopter","lorry","moped","motorbike","plane","rocket","ship","submarine","train","van"]);
}(window.angular, window._));

(function (angular, _) {
    "use strict";
var speech = angular.module('speech', []);

speech.factory('Speech', ["$log", "$q", function ($log, $q) {

    var is_available = ('speechSynthesis' in window);

    var voices = [];
    speechSynthesis.onvoiceschanged = function (event) {
        voices = speechSynthesis.getVoices();
    };

    var get_voice_for_language = function (language) {
        var voice_matches_language = function (v) { return v.lang === language};
        var voices_for_lang = voices.filter(voice_matches_language);
        var preferred_voice = voices_for_lang.slice(-1)[0];
        if (!preferred_voice) {
            $log.warn('Could not select voice for "%s"', language);
        }
        return preferred_voice;
    };

    var service = {
        say: function (text) {
            var utterance = new SpeechSynthesisUtterance(text);
            var utterance_promise = $q(function (resolve, reject) {
                utterance.onend = resolve;
                utterance.onerror = reject;
            });
            var voice = get_voice_for_language(preferred_language);
            if (voice) {
                utterance.voice = voice;
            } else {
                utterance.lang = preferred_language;
            }
            speechSynthesis.speak(utterance);
            return utterance_promise;
        }
    };

    var preferred_language = null;
    Object.defineProperty(service, 'language', {
        get: function () { return preferred_language; },
        set: function (language) { preferred_language = language; },
        enumerable: true,
        configurable: true
    });

    return service;
}]);
}(window.angular, window._));

(function (angular, _) {
    "use strict";
var storage = angular.module('storage', []);

var build_storage = function (Storage) {
    return function () {
        return {
            get: function (key) {
                var value = Storage.getItem(key);
                return value ? angular.fromJson(value) : value;
            },

            put: function (key, value) {
                Storage.setItem(key, angular.toJson(value));
            },

            remove: function (key) {
                Storage.removeItem(key);
            },

            clear: function () {
                Storage.clear();
            }
        };
    };
};

storage.factory('LocalStore', build_storage(localStorage));
storage.factory('SessionStore', build_storage(sessionStorage));
}(window.angular, window._));

(function (angular, _) {
    "use strict";
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
        controller: ["$scope", "$attrs", "VEHICLES", "Speech", function ($scope, $attrs, VEHICLES, Speech) {
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
        }],
        controllerAs: 'vehicles_controller'
    };
});


directives.directive('nameCapture', function () {
    return {
        templateUrl: '/partials/name_capture.html',
        controller: ["$scope", "SessionStore", function ($scope, SessionStore) {
            $scope.name = SessionStore.get('player.name') || null;
            $scope.is_submitted = false;

            this.read_name = function () {
                SessionStore.put('player.name', $scope.name);
                $scope.game_controller.set_name($scope.name);
                $scope.is_submitted = true;
            };
        }],
        controllerAs: 'name_controller'
    };
});


directives.directive('endGame', function () {
    return {
        templateUrl: '/partials/end.html'
    };
});

}(window.angular, window._));

(function (angular, _) {
    "use strict";
var vehicles = angular.module(
    'vehicles',
    ['ngAnimate', 'speech', 'vehicles.directives']
);
vehicles.config(["$compileProvider", function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}]);
vehicles.run(["Speech", function (Speech) {
    Speech.language = 'en-GB';
    Speech.say('');
}]);

vehicles.controller('GameController', ["$scope", "Speech", "$interval", "VEHICLES", function ($scope, Speech, $interval, VEHICLES) {
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
}]);


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

}(window.angular, window._));
