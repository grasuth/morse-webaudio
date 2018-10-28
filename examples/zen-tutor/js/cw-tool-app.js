angular.module('cwTool', ['ngRoute'])

/**
 * MorseGenerator as a service
 */
.factory('morseAudio', function() {
    var generator = MorseGenerator();

    return generator;
})

/**
 * Service holding data for tutor lessons and tests
 */
.factory('morseTutor', function() {


});

