// Just to clarify vigeneres ciphers key and str that is inputed need to 
// share the same length for it to work.

// If an attacker wanted to understand how to decode a vigeneres cipher,
// they would use an plaintext attack. Which is basically sending your own plaintext through
// the algorithm, and decoding it yourself before it is sent out.
// Basically intercepting your own message

const vigeneresCipher = (str, key) => {
    if(str.length !== key.length) {
        console.log('Key and string length need to be the same for this cipher');
        return;
    }

    const realKey = key.toLowerCase();
    const realStr = str.toLowerCase();

    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const cipher = [];

    for(let i = 0; i < str.length; i++) {
        const strIndex = alpha.indexOf(realStr[i]);
        const keyIndex = alpha.indexOf(realKey[i]);

        const cipherIndex = (strIndex + keyIndex) % 26;

        cipher.push(alpha[cipherIndex]);
    };

    console.log(cipher.join('').toUpperCase());
    return cipher.join('')
}

// Decrypting this is pretty easy so i dont need to do it, but you do the exact
// same thing as above, and you would need the key in order to decrypt it. 
// just minus the strIndex, by the keyIndex in order to reverse engineer it.

vigeneresCipher('THISISATEST', 'VECTORVECTO') // => OLKLWJVXGLH
