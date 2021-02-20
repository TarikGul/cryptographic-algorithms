// ChaCha20 cipher created by D.J.Berstein. This is a cipher influenced from the Salsa20 cipher
// This is based on thesimj implementation
// https://github.com/thesimj/js-chacha20/blob/master/src/jschacha20.js

class ChaCha20 {
    constructor(key, nonce, counter=0) {
        this._rounds = 20;
        this._sigma = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574];
        this._param = [
            this._sigma[0],
            this._sigma[1],
            this._sigma[2],
            this._sigma[3],
            // key
            this._get32(key, 0),
            this._get32(key, 4),
            this._get32(key, 8),
            this._get32(key, 12),
            this._get32(key, 16),
            this._get32(key, 20),
            this._get32(key, 24),
            this._get32(key, 28),
            // counter
            counter,
            // nonce
            this._get32(nonce, 0),
            this._get32(nonce, 4),
            this._get32(nonce, 8),
        ];
        this._keystream = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];
        this._byteCounter = 0;
    }

    _chacha() {
        let mix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let i = 0,
            b = 0;
        
        for (i = 0; i < 16; i++) {
            mix[i] = this._param[i];
        }

        // mix rounds //
        for (i = 0; i < this._rounds; i += 2) {
            this._quarterround(mix, 0, 4, 8, 12)
            this._quarterround(mix, 1, 5, 9, 13)
            this._quarterround(mix, 2, 6, 10, 14)
            this._quarterround(mix, 3, 7, 11, 15)

            this._quarterround(mix, 0, 5, 10, 15)
            this._quarterround(mix, 1, 6, 11, 12)
            this._quarterround(mix, 2, 7, 8, 13)
            this._quarterround(mix, 3, 4, 9, 14)
        }

        for (i = 0; i < 16; i++) {
            // add
            mix[i] += this._param[i]

            // store keystream
            this._keystream[b++] = mix[i] & 0xFF
            this._keystream[b++] = (mix[i] >>> 8) & 0xFF
            this._keystream[b++] = (mix[i] >>> 16) & 0xFF
            this._keystream[b++] = (mix[i] >>> 24) & 0xFF
        }
    }

    _get32() {

    }
}