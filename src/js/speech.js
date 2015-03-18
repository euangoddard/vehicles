var speech = angular.module('speech', []);

speech.factory('Speech', function ($log, $q) {

    var is_available = ('speechSynthesis' in window);

    var voices = [];
    speechSynthesis.onvoiceschanged = function (event) {
        voices = speechSynthesis.getVoices();
    };

    var get_voice_for_language = function (language) {
        var voice_matches_language = function (v) { return v.lang === language};
        var voices_for_lang = voices.filter(voice_matches_language);
        var preferred_voice = voices_for_lang.slice(-1);

        if (!preferred_voice) {
            $log.warn('Could not select voice for "%s"', language);
        }
        return preferred_voice;
    };

    var service = {
        say: function (text, language) {
            var utterance = new SpeechSynthesisUtterance(text);
            var utterance_promise = $q(function (resolve, reject) {
                utterance.onend = resolve;
                utterance.onerror = reject;
            });
            var voice = get_voice_for_language(language);
            if (voice) {
                utterance.voice = voice;
            } else {
                utterance.lang = language;
            }
            speechSynthesis.speak(utterance);
            return utterance_promise;
        }

    };
    return service;
});