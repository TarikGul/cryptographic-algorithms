// A classic ceasar cipher only does 3 places, when n is given as an option it is then known more as
// a shift cipher

const ceasarCipher = (string, n) => {
    const alpha = "abcdefghijklmnopqrstuvwxyz";
    const str = string.toLowerCase().split('');
    const encryptedString = [];

    for(let i = 0; i < string.length; i++) {
        const index = alpha.split('').indexOf(str[i]);
        const newLetter = alpha[(index+n) % 26]
        encryptedString.push(newLetter);
    }
    // Whether you want the message to come out in all caps or not is up to you
    // I just put it here to visualize the letters easier
    console.log(encryptedString.join('').toUpperCase())
    return encryptedString.join('');
};

// Test cases
ceasarCipher('abc', 1) // => BCD
ceasarCipher('CAESARMESSAGE', 3) // => FDGVDUPHVVDJH
ceasarCipher('asiknxh', 8) // => IAQSVFP


