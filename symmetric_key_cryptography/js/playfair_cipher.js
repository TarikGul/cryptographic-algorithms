// This helper function will take in the keyword which is our ciphery key,
// And the alphabet which we will use to create a 5x5 matrix
// Dont forget to omit the letter J

function matrixCipher(keyword, alpha) {
    const lettersObj = {};
    const letters = keyword.concat(alpha).split('');
    const matrix = [];

    alpha.split('').forEach((char) => {
        lettersObj[char] = false;
    });

    // Tracks the index of the next letter in the array
    let x = 0;
    for(let i = 0; i < 5; i++) {
        const matrixLayer = [];

        for(let i = 0; i < 5; i++) {
            const cur = letters[x];

            // Check hash if the letter has been used
            if(lettersObj[cur] !== true) {
                matrixLayer.push(letters[x]);
                lettersObj[cur] = true;
            } else {
                // If the letter hasnt been used lower the count so we go to the 
                // next letter
                i--
            }
            x = x + 1;
        }
        matrix.push(matrixLayer);
    };
    return matrix;
}

// Run the following code below to check for yourself, but there should be
// no repeats in the matrix, and the first letters should always start with 
// the cipher key. Also J should not be in there.

// const alpha = 'abcdefghiklmnopqrstuvwxyz';
// const keyword = 'keyword';

// const result = matrixCipher(keyword, alpha);

// console.log(result)
//   [ ['k', 'e', 'y', 'w', 'o'],
//     ['r', 'd', 'a', 'b', 'c'],
//     ['f', 'g', 'h', 'i', 'l'],
//     ['m', 'n', 'p', 'q', 's'],
//     ['t', 'u', 'v', 'x', 'z'] ]

