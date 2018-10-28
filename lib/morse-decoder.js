//TODO finish this implementation

var MorseDecoder = function () {

  var md = {}
    , mg = MorseGenerator(); // for symbol table

  // TODO: sorted-flipped symbol table

  // narrow bandpass filter
  md.centreFrequency = 400;

  //threshold on output
  md.symbolOnThreshold = 50;

};