
var MorseGenerator = function () {
  var me = {};

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

  };

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

    mg.oscillator = audioCtx.createOscillator();
    mg.gainNode = audioCtx.createGain();
    mg.oscillator.connect(mg.gainNode);

    //TODO set gain to 0

    mg.gainNode.connect(mg.audioCtx.destination);
  };

  /**
   * Generate Morse for given data string
   */

  mg.key = function(data) {
    mg.initAudio();
    // for each character, set up vol and timer
  };

  /**
   * Key a single character
   */
  mg.keyCharacter = function(c) {
    var morse = mg.morseEncoding[c] + ','
      , symbol;
    
    symbol = morse.pop();

  };

  /**
   * Disable all timers and make quiet
   */
  mg.stop = function() {
    //TODO gain to zero
    //turn off timers
  };

  mg.close = function() {
    mg.stop();
  }

  return mg;
};
