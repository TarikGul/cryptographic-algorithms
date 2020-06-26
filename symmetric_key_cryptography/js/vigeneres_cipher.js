// Just to clarify vigeneres ciphers key and str that is inputed need to 
// share the same length for it to work.

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

vigeneresCipher('THISISATEST', 'VECTORVECTO');
