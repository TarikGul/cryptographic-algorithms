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
ceasarCipher('CEASARMESSAGE', 3) // => FHDVDUPHVVDJH
ceasarCipher('asiknxh', 8) // => IAQSVFP


// In this case we will take a string, and brute force all 26 shift possibilites
// You can add a ton of other methods where you can parse real words from gibberish
const decodeCipher = (string) => {
    const alpha = "abcdefghijklmnopqrstuvwxyz";
    const str = string.toLowerCase().split('');
    const possibleWords = [];

    for(let i = 0; i < alpha.length; i++) {
        const decryptedString = [];

        for(let j = 0; j < str.length; j++) {
            const index = alpha.split('').indexOf(str[j]);
            // This cipher is used if the shifting is done to the right originally
            const newLetter = alpha[(index + i) % 26];

            decryptedString.push(newLetter);
        };

        possibleWords.push(decryptedString.join(''));
    };
    return possibleWords
};

const decoded1 = decodeCipher('bcd'); 
const decoded2 = decodeCipher('FHDVDUPHVVDJH'); 
const decoded3 = decodeCipher('asiknxh');

console.log(decoded1.includes('abc')); // => true
console.log(decoded2.includes('ceasarmessage')); // => true
console.log(decoded3.includes('asiknxh')); // => true

// In order to break a shift cipher one of the most common ways is identifying 
// the most commonly used letter in the encryption. In this case of english the most
// commonly used letter is E. Which would mean in the message it is very possuble the most
// common letter used can map to E. And os on and so forth. 
