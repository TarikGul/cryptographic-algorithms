// Before reading the playFairCipher code you should make sure you have a good
// understanding of the helper functions involved with the cipher, they are 
// pretty basic but important to understanding the 
function playFairCipher (keyword, message) {
    const alpha = 'abcdefghiklmnopqrstuvwxyz';
    const matrix = matrixCipher(keyword, alpha);
    const pairedChars = splitMessage(message);


}

function splitMessage(message) {
    const joined = message.split(' ').join('').toUpperCase();
    const splitMessage = [];

    let i = 0;
    while (i < joined.length) {

        // If both letters are the same the playfair cipher has you return
        // the first letter with an X following it.
        if (joined[i] === joined[i + 1]) {
            splitMessage.push(joined[i] + 'X');
            i += 1;
            continue;
        } 

        // Check if we are dealing with the last index in a string
        // if we are then attach it to an X. Ever letter needs a pair for the 
        // cipher to work.
        if(joined[i + 1] === undefined) {
            splitMessage.push(joined[i] + 'X');
            break;
        }

        splitMessage.push(joined[i] + (joined[i+ 1]))
        
        i += 2;
    }

    return splitMessage;
}

// Test to make sure you are developing the right return value in your splitMessage
// You want only pairs of 2, no undefineds, and not single letters on their own

// const message = 'secret messages';

// const messageResult = splitMessage(message);
// console.log(messageResult)


// This helper function will take in the keyword which is our ciphery key,
// And the alphabet which we will use to create a 5x5 matrix
// Dont forget to omit the letter J

function matrixCipher(keyword, alpha) {
    const lettersObj = {};
    const letters = keyword.concat(alpha).toUpperCase().split('');

    // this allows us to return multiple values;
    this.matrix = [];
    this.positions = {};

    alpha.split('').forEach((char) => {
        lettersObj[char] = false;
    });

    // Tracks the index of the next letter in the array
    let x = 0;
    for(let i = 0; i < 5; i++) {
        const matrixLayer = [];

        for(let j = 0; j < 5; j++) {
            const cur = letters[x];

            // Check hash if the letter has been used
            if(lettersObj[cur] !== true) {
                // Push the letter in the right position
                matrixLayer.push(letters[x]);
                lettersObj[cur] = true;

                // Save the position of the letter in the matrix for O(1) lookup
                // Instead of having to constantly loop through the matrix
                this.positions[letters[x]] = [i, j];
            } else {
                // If the letter has been used lower the count so we go to the 
                // next letter without losing an iteration
                j--
            }
            x = x + 1;
        }
        this.matrix.push(matrixLayer);
    };
    return this;
}

// Run the following code below to check for yourself, but there should be
// no repeats in the matrix, and the first letters should always start with 
// the cipher key. Also J should not be in there.

const alpha = 'abcdefghiklmnopqrstuvwxyz';
const keyword = 'keyword';

const matrixResult = matrixCipher(keyword, alpha);

console.log(matrixResult.matrix)
console.log(matrixResult.positions)
//   [ ['k', 'e', 'y', 'w', 'o'],
//     ['r', 'd', 'a', 'b', 'c'],
//     ['f', 'g', 'h', 'i', 'l'],
//     ['m', 'n', 'p', 'q', 's'],
//     ['t', 'u', 'v', 'x', 'z'] ]

