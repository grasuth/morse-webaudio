
var MorseGenerator = function () {
  var mg = {}
    , DIT = 1
    , DAH = 3 * DIT
    , WORD_BREAK = -7;

  mg.started = false;

  mg.symbolMs = 100;

  mg.oscillatorFrequency = 400;

  mg.morseEncoding = {
      a: [DIT, DAH],
      b: [DAH, DIT, DIT, DIT],
      c: [DAH, DIT, DAH, DIT],
      d: [DAH, DIT, DIT],
      e: [DIT],
      f: [DIT, DIT, DAH, DIT],
      g: [DAH, DAH, DIT],
      h: [DIT, DIT, DIT, DIT],
      i: [DIT, DIT],
      j: [DIT, DAH, DAH, DAH],
      k: [DAH, DIT, DAH],
      l: [DIT, DAH, DIT, DIT],
      m: [DAH, DAH],
      n: [DAH, DIT],
      o: [DAH, DAH, DAH],
      p: [DIT, DAH, DAH, DIT],
      q: [DAH, DAH, DIT, DAH],
      r: [DIT, DAH, DIT],
      s: [DIT, DIT, DIT],
      t: [DAH],
      u: [DIT, DIT, DAH],
      v: [DIT, DIT, DIT, DAH],
      w: [DIT, DAH, DAH],
      x: [DAH, DIT, DIT, DAH],
      y: [DAH, DIT, DAH, DAH],
      z: [DAH, DAH, DIT, DIT],

      ' ': [WORD_BREAK],

      '1': [DIT, DAH, DAH, DAH, DAH],
      '2': [DIT, DIT, DAH, DAH, DAH],
      '3': [DIT, DIT, DIT, DAH, DAH],
      '4': [DIT, DIT, DIT, DIT, DAH],
      '5': [DIT, DIT, DIT, DIT, DIT],
      '6': [DAH, DIT, DIT, DIT, DIT],
      '7': [DAH, DAH, DIT, DIT, DIT],
      '8': [DAH, DAH, DAH, DIT, DIT],
      '9': [DAH, DAH, DAH, DAH, DIT],
      '0': [DAH, DAH, DAH, DAH, DAH],

      '.': [DIT, DAH, DIT, DAH, DIT, DAH],
      ',': [DAH, DAH, DIT, DIT, DAH, DAH],
      '?': [DIT, DIT, DAH, DAH, DIT, DIT],
      "'": [DIT, DAH, DAH, DAH, DAH, DIT],
      '/': [DAH, DIT, DIT, DAH, DIT],
      '(': [DAH, DIT, DAH, DAH, DIT],
      ')': [DAH, DIT, DAH, DAH, DIT, DAH],
      '&': [DIT, DAH, DIT, DIT, DIT],
      ':': [DAH, DAH, DAH, DIT, DIT, DIT],
      ';': [DAH, DIT, DAH, DIT, DAH],
      '=': [DAH, DIT, DIT, DIT, DAH],
      '+': [DIT, DAH, DIT, DAH, DIT],
      '-': [DAH, DIT, DIT, DIT, DIT, DAH],
      '_': [DIT, DIT, DAH, DAH, DIT, DAH],
      '"': [DIT, DAH, DIT, DIT, DAH, DIT],
      '$': [DIT, DIT, DIT, DAH, DIT, DIT, DAH],
      '!': [DAH, DIT, DAH, DIT, DAH, DAH],
      '@': [DIT, DAH, DAH, DIT, DAH, DIT]
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
    mg.started = true;

    if (mg.audioCtx === null){
      mg.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    mg.oscillator = mg.audioCtx.createOscillator();
    mg.gainNode = mg.audioCtx.createGain();
    mg.oscillator.connect(mg.gainNode);
    mg.oscillator.frequency.value = mg.oscillatorFrequency;
    mg.oscillator.start();

    mg.gainNode.gain.value = 0;

    mg.gainNode.connect(mg.audioCtx.destination);
  };

  mg.setWpm = function(wpm) {
    mg.symbolMs =  6/(wpm * 5) * 1000;
  }

  /**
   * Generate Morse for given data string
   *
   * @returns {object} Promise resolving as true when done.
   */

  mg.key = function(data) {
    var keys = data.split('');

    if (!mg.started) {
      mg.initAudio();
    }

    function doKey() {
      var k = keys.shift();

      if (k) {
        return mg.keyCharacter(k.toLowerCase())
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
        mg.keyer = setTimeout(key, delay);
        return promise.promise;
      } else {
        mg.gainNode.gain.value = 0;

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