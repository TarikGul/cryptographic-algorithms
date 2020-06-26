// In order to have a substition cipher work we need to know what each letter maps too
// In this case we are going to memoize an Object that.

const createObjectKey = () => {
    const key = {};

    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const alphaArr = alpha.split('');

    const keys = [];
    const values = [];

    // This will create the first 13 unique key value pairs
    while(alphaArr.length !== 0) {
        const rand1 = Math.floor(Math.random() * alphaArr.length);
        let rand2;
        let unique = false;
        // This is to make sure that variable rand1 and rand2 do not equal eachother
        while(!unique) {
            rand2 = Math.floor(Math.random() * alphaArr.length);
            if (rand2 !== rand1) {
                unique = true
            };
        };
        
        const letter1 = alphaArr[rand1]
        const letter2 = alphaArr[rand2]

        key[letter1] = letter2;

        lastElement(letter1, alphaArr, rand1);
        lastElement(letter2, alphaArr, rand2);

        keys.push(letter1);
        values.push(letter2);
    }

    while (values.length !== 1) {
        const rand3 = Math.floor(Math.random() * values.length);

        let rand;
        let unique = false;

        while(!unique) {
            rand = Math.floor(Math.random() * values.length) 
            if(rand !== rand3) {
                unique = true;
            }
        }
        
        const letterKey = values.splice(rand3, 1);

        const letterValue = keys.splice(rand, 1);
        
        key[letterKey] = letterValue.join('');
    }

    key[values[0]] = key[keys[0]]
    console.log(key)
    return key;
}

const lastElement = (letter, arr, rand) => {
    if(arr.indexOf(letter) === arr.length - 1) {
        arr.splice(-1, 1)
    } else {
        arr.splice(rand, 1)
    }
}

createObjectKey();