import CodeTable from './code-table';

export class MorseGenerator {
    started: boolean = false;
    symbolMs: number = 100;
    oscillatorFrequency: number = 400;
    keyer = null;
    audioCtx = null;
    oscillator = null;
    gainNode = null;

    /**
     * Init audio setup.
     *
     */
    initAudio() {
        this.started = true;

        if (this.audioCtx === null){
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        this.oscillator = this.audioCtx.createOscillator();
        this.gainNode = this.audioCtx.createGain();
        this.oscillator.connect(this.gainNode);
        this.oscillator.frequency.value = this.oscillatorFrequency;
        this.oscillator.start();

        this.gainNode.gain.value = 0;

        this.gainNode.connect(this.audioCtx.destination);
    }

    setWpm = function(wpm) {
        this.symbolMs =  6/(wpm * 5) * 1000;
    }

    /**
     * Generate Morse for given data string
     * 
     * @returns {object} Promise resolving as true when done.
     */
    key(data) {
        var keys = data.split('');

        if (!this.started) {
            this.initAudio();
        }

        function doKey() {
            var k = keys.shift();

            if (k) {
                return this.keyCharacter(k.toLowerCase())
                    .then(function () {
                        return doKey();
                    });
            } else {
                return Promise.resolve(true);
            };
        }

        return doKey();
    }

    /**
     * Key a single character
     *
     * @returns Promise that is resolved with true when complete.
     */
    keyCharacter(c) {
        var morse = this.morseEncoding[c]
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
                var delay = Math.abs(symbol) * this.symbolMs
                    , gain = symbol > 0 ? 1 : 0;

                this.gainNode.gain.value = gain;
                this.keyer = setTimeout(key, delay);
                return promise.promise;
            } else {
                this.gainNode.gain.value = 0;

                return promise.resolve(true);
            }
        };

        return key(); 
    }

    /**
     * Disable all timers and make quiet
     */
    stop() {
        if (this.gainNode) {
            this.gainNode.gain.value = 0;
        }
        if (this.keyer) {
            clearTimeout(this.keyer);
        };
    };

    close() {
        this.stop();
    };
};
