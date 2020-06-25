// In order to have a substition cipher work we need to know what each letter maps too
// In this case we are going to memoize an Object that.

const createObjectKey = () => {
    const key = {};

    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const alphaArr = alpha.split('');

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
        const index1 = alphaArr.indexOf(rand1);
        const letter1 = alphaArr.splice(index1, 1);

        const index2 = alphaArr.indexOf(rand2);
        const letter2 = alphaArr.splice(index2, 1);

        key[letter1] = letter2;
    }
    console.log(key);
    return key;
}

createObjectKey();