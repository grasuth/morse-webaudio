
var MorseGenerator = function () {
  var mg = {};

  mg.symbolMs = 100;

  mg.morseEncoding = {
      a: [1, 3],
      b: [3, 1, 1, 1],
      c: [3, 1, 3, 1],
      d: [3, 1, 1],
      e: [1],
      f: [1, 1, 3, 1],
      g: [3, 3, 1],
      h: [1, 1, 1, 1],
      i: [1, 1],
      j: [1, 3, 3, 3],
      k: [3, 1, 3],
      l: [1, 3, 1, 1],
      m: [3, 3],
      n: [3, 1],
      o: [3, 3, 3],
      p: [1, 3, 3, 1],
      q: [3, 3, 1, 3],
      r: [1, 3, 1],
      s: [1, 1, 1],
      t: [3],
      u: [1, 1, 3],
      v: [1, 1, 1, 3],
      w: [1, 3, 3],
      x: [3, 1, 1, 3],
      y: [3, 1, 3, 3],
      z: [3, 3, 1, 1],
      ' ': [-7],
      '1': [1, 3, 3, 3, 3],
      '2': [1, 1, 3, 3, 3],
      '3': [1, 1, 1, 3, 3],
      '4': [1, 1, 1, 1, 3],
      '5': [1, 1, 1, 1, 1],
      '6': [3, 1, 1, 1, 1],
      '7': [3, 3, 1, 1, 1],
      '8': [3, 3, 3, 1, 1],
      '9': [3, 3, 3, 3, 1],
      '0': [3, 3, 3, 3, 3],

      '.': [1, 3, 1, 3, 1, 3],
      ',': [3, 3, 1, 1, 3, 3],
      '?': [1, 1, 3, 3, 1, 1],
      "'": [1, 3, 3, 3, 3, 1],
      '/': [3, 1, 1, 3, 1],
      '(': [3, 1, 3, 3, 1],
      ')': [3, 1, 3, 3, 1, 3],
      '&': [1, 3, 1, 1, 1],
      ':': [3, 3, 3, 1, 1, 1],
      ';': [3, 1, 3, 1, 3],
      '=': [3, 1, 1, 1, 3],
      '+': [1, 3, 1, 3, 1],
      '-': [3, 1, 1, 1, 1, 3],
      '_': [1, 1, 3, 3, 1, 3],
      '"': [1, 3, 1, 1, 3, 1],
      '$': [1, 1, 1, 3, 1, 1, 3],
      // Note: Some operators prefer "!" as "___." and others as "_._.__"
      '!': [3, 1, 3, 1, 3, 3],
      '@': [1, 3, 3, 1, 3, 1]
    };

  mg.keyer = null;

  mg.audioCtx = null;
  mg.oscillator = null;
  mg.gainNode = null;

  /**
   * Init audio setup.
   *
   */
  mg.initAudio = function() {
    if (mg.audioCtx === null){
      mg.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    mg.oscillator = mg.audioCtx.createOscillator();
    mg.gainNode = mg.audioCtx.createGain();
    mg.oscillator.connect(mg.gainNode);
    mg.oscillator.start();

    mg.gainNode.gain.value = 0;

    mg.gainNode.connect(mg.audioCtx.destination);
  };

  /**
   * Generate Morse for given data string
   * 
   * @returns {object} Promise resolving as true when done.
   */

  mg.key = function(data) {
    var keys = data.split('');

    mg.initAudio();

    function doKey() {
      k = keys.shift();
      if (k) {
        return mg.keyCharacter(k)
          .then(function () {
            return doKey();
          });
      } else {
        return Promise.resolve(true);
      };
    }

    return doKey();
  };

  /**
   * Key a single character
   *
   * @returns Promise that is resolved with true when complete.
   */
  mg.keyCharacter = function(c) {
    var morse = mg.morseEncoding[c]
      , cooked = []
      , symbol
      , promise = Promise.defer();

    // add inter-symbol delays
    morse.forEach(function(s) {
      cooked.push(s);
      cooked.push(-1);
    });
    // Add between-symbol delay
    cooked.push(-2);

    function key() {
      var symbol = cooked.shift();
      if (symbol) {
        var delay = Math.abs(symbol) * mg.symbolMs
          , gain = symbol > 0 ? 1 : 0;

        mg.gainNode.gain.value = gain;
        // console.log(gain, delay);
        mg.keyer = setTimeout(key, delay);
        return promise.promise;
      } else {
        mg.gainNode.gain.value = 0;
        // console.log(0);
        return promise.resolve(true);
      }
    };

   return key(); 
  };

  /**
   * Disable all timers and make quiet
   */
  mg.stop = function() {
    if (mg.gainNode) {
      mg.gainNode.gain.value = 0;
    }
    if (mg.keyer) {
      clearTimeout(mg.keyer);
    };
  };

  mg.close = function() {
    mg.stop();
  };

  return mg;
};
