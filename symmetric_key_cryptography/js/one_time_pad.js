// A common method for encoding letters in binary is the (ASCII) protocol
// I am going to write out the binary equivelent for all the letters so you understand
// This comes from the ASCII
// check the /util/ASCII_protocol for the list

// This out of all the ciphers is the only one to be mathematically proven to be 
// un decryptable. The reason being is because the one time pad we generate is 
// completely random and serves zero patterns. But the caveat is that you can 
// never lose the one time pad or else you cant decrypt the message.

// ASCII protocol
const binaries = require('../../util/ASCII_protocol');

// This will create or encryption, and return the onetimepad and the encryption,
// as well as the original message
function generateEncryption(message) {
    this.oneTimePad = generateOneTimePad(message);
    this.message = message;
    this.oneTimePadBinary = createBinary(this.oneTimePad);
    this.messageBinary = createBinary(this.message);
    this.encryption = [];

    if (oneTimePadBinary.length !== messageBinary.length) {
        console.error('Message and onetime pad must be the same length')
        return;
    }

    for(let i = 0; i < messageBinary.length; i++) {
        const newBinary = xor(messageBinary[i], oneTimePadBinary[i]);
        this.encryption.push(newBinary);
    }

    // We just want to make sure that we join the encryption before returning
    // the value of this
    this.encryption = this.encryption.join('');

    return this;
}

function xor(a, b) {
    let binary = '';
    // n here will never be larger than 8;
    // that because were dealing with 8 bit signatures
    for(let i = 0; i < a.length; i++) {
        const num = parseInt(a[i]) ^ parseInt(b[i]);
        binary = binary + num.toString();
    }
    return binary;
}

function createBinary(message) {
    const binary = [];

    for(let i = 0; i < message.length; i++) {
        binary.push(binaries[message[i]]);
    }

    return binary;
}

// This function we are going to create a onetime pad that is random, and 
// completely un guessable.
function generateOneTimePad (message) {
    // We are adding a space at the end, 
    const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz';
    const copy = message.split(' ');
    const oneTimePad = [];

    for (let i = 0; i < copy.length; i++) {
        const randomWord = generateRandomWord(copy[i].length, alpha);
        const random = Math.floor(Math.random() * alpha.length);

        oneTimePad.push(randomWord);
        // This if statement is basically counting for the spacing in which we
        // split the original message on. We just dont want to add an extra character
        // so when we are on the last word in the message we dont add a space.
        if (i < copy.length - 1) {
            oneTimePad.push(alpha[random]);
        }
    };

    return oneTimePad.join('');
}

function generateRandomWord(length, alpha) {
    const a = alpha.split('');
    let word = [];

    for (let i = 0; i < length; i++) {
        const random = Math.floor(Math.random() * a.length);

        // This is my own caveat im bringing to the cipher. For me I dont want
        // any repeated spaces, or a space at the front or the begining of the
        // one time pad. Its just isnt readable in my opinion. 
        if((i === 0 && random === 26) || (i === length - 1 && random === 26)) {
            i--
            continue;
        } else if (random === 26 && word[word.length - 1] === ' ') {
            i--
            continue;
        }
        word.push(a[random]);
    }

    return word.join('');
}

const message = 'hey there kiddo my name is tarik what is your name';
const result = generateEncryption(message);

console.log(result);
