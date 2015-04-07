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