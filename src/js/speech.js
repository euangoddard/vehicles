var speech = angular.module('speech', []);

speech.factory('Speech', function ($log) {

    var is_available = ('speechSynthesis' in window);

    var voices = [];
    speechSynthesis.onvoiceschanged = function (event) {
        voices = speechSynthesis.getVoices();
    };

    var get_voice_for_language = function (language) {
        var preferred_voice = null;
        angular.forEach(voices, function (voice) {
            if (language === voice.lang) {
                preferred_voice = voice;
            }
        });

        if (!preferred_voice) {
            $log.warn('Could not select voice for "%s"', language);
        }
        return preferred_voice;
    };

    var service = {
        say: function (text, language) {
            var utterance = new SpeechSynthesisUtterance(text);
            var voice = get_voice_for_language(language);
            if (voice) {
                utterance.voice = voice;
            } else {
                utterance.lang = language;
            }
            window.speechSynthesis.speak(utterance);
        }

    };
    return service;
});