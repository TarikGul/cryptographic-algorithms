const { ArgumentParser } = require('argparse');
const assert = require('assert');
const fs = require('fs');

const stringToBinary = (string, length) => {
    if (length === 64) {
        assert(string.length === 8, 'Length of the string is not 64 bits');
    } else if (length === 32) {
        assert(string.length === 4, 'Length of the string is not 64 bits');
    }

    const unicodeChars = [];

    for(let i = 0; i < string.length; i++) {
        unicodeChars.push(string.charCodeAt(i).toString(2).padStart(8, '0'));
    }

    return unicodeChars.join('');
}

const binaryToHex = (binary) => {
    const hexcodes = [];

    for(let i = 0; i < binary.length; i += 4) {
        hexcodes.push(parseInt(binary.slice(i, i + 4), 2).toString(16));
    }

    return hexcodes.join('');
}

const hexToBinary = (hex) => {
    const binaries = [];

    for(let i = 0; i < hex.length; i++) {
        binaries.push(parseInt(hex[i], 16).toString(2).padStart(4, '0'));
    }

    return binaries.join('');
}

const binaryToInt = (binary) => {
    return parseInt(binary, 2);
}

const binaryToString = (binary) => {
    let str = '';
    
    for(let i = 0; i < binary.length; i += 8) {
        const bin = binary.slice(i, i + 8);

        convertedBinary = String.fromCharCode(parseInt(bin, 2));
        str += convertedBinary;
    }

    return str;
}

const hexcodeToInteger = (hex) => {
    return parseInt(hex, 16);
}

const _xor = (a, b) => {
    assert(a.length === 32 && b.length === 32, 'lengths of the blocks do not match');

    let binary = '';
    for (let i = 0; i < a.length; i++) {
        const num = parseInt(a[i]) ^ parseInt(b[i]);
        binary = binary + num.toString();
    }
    return binary;
}

const _add = (a, b) => {
    assert(a.length === 32 && b.length === 32, 'Lengths of blocks do not match');

    const sum = binaryToInt(a) + binaryToInt(b);
    const mod = sum % (2**32);

    return mod.toString(2).padStart(32, '0');
}

const _round = (block, key, SBoxes) => {
    assert(block.length === 64, 'Error in round input, length of the block is not 64 bits');
    assert(key.length === 32, 'Length of key is not 32 bits');

    // Setup Left and Right blocks for the fiestel network
    const middle = block.length / 2;
    const L = block.slice(0, middle); 
    const R = block.slice(middle);

    // Flip
    const xoredLeft = _xor(L, key);
    const RightPrime = xoredLeft;

    const LeftSplit = [];

    for(let i = 0; i < xoredLeft.length; i += 8) {
        LeftSplit.push(binaryToInt(xoredLeft.slice(i, i + 8)));
    }

    assert(LeftSplit.length === 4, 'The splitted L has no 4 elements');

    const SValues = [];

    for(let i = 0; i < 4; i++) {
        SValues.push(SBoxes[i][LeftSplit[i]])
    };

    assert(SValues[0].length === 32, 'SValues are not 32 bits');

    const result = _add(SValues[3], _xor(SValues[2], _add(SValues[1], SValues[0])));

    assert(result.length === 32, 'Output of SBoxes operation is not 32 bits');

    const LeftPrime = _xor(result, R);

    return LeftPrime + RightPrime;
}

const encrypt = (block, PArray, SBlocks) => {
    for (let i = 0; i < 16; i++) {
        blockTemp = _round(block, PArray[i], SBlocks);
        block = blockTemp;
    };

    let leftBlock = block.slice(0, 32);
    let rightBlock = block.slice(32);
    // Switch the values
    let temp = leftBlock;
    leftBlock = rightBlock;
    rightBlock = temp;

    return _xor(PArray[17], leftBlock) + _xor(PArray[16], rightBlock);
}

const generateSubKeys = (key) => {
    // Repeating our key until we have a 72 byte long key
    // Which means our password length can only be 72 characters
    key = key.repeat(72 / key.length) + key;
    key = key.slice(0, 72);
    const keys = [];

    for(let i = 0; i < key.length; i += 4) {
        keys.push(stringToBinary(key.slice(i, i + 4), 32))
    }

    let P = [];
    let S = [];
    let msg = '00000000';
    msg = stringToBinary(msg, 64);

    // Read the txt file
    const data = fs.readFileSync('./pihex64k.txt', 'utf8');
    
    // i, j -> counters
    let i = 0; 
    let j = 0;
    while(i < 18) {
        P.push(data.slice(j, j + 8));
        i+= 1;
        j+= 8;
    };

    // x, y -> counters
    let x = 0;
    // Reuse the j -> counter to read file from where we left off
    while(x < 4) {
        let arr = [];
        let y = 0;
        while(y < 256) {  
            arr.push(data.slice(j, j + 8));
            y += 1;
            j += 8;
        }

        S.push(arr);
        x += 1;
    };

    // Convert all the hexes in P to binary
    P = P.map((hex) => hexToBinary(hex))

    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 256; j++) {
            S[i][j] = hexToBinary(S[i][j])
        };
    };
    
    // xor the 32 bit blocks in P with the keys
    P = P.map((ele, i) => {
        return _xor(keys[i], ele)
    });

    for(let i = 0; i < P.length; i += 2) {
        msg = encrypt(msg, P, S);
        P[i] = msg.slice(0, 32);
        P[i + 1] = msg.slice(32);
    }

    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 256; j += 2) {
            msg = encrypt(msg, P, S);
            S[i][j] = msg.slice(0, 32);
            S[i][j + 1] = msg.slice(32);
        }
    }

    return [P, S];
}

const encryption = (msg, subKeys, SBoxes, mode) => {
    const values = [];

    if(mode === 'e') {

        for(let i = 0; i < msg.length; i += 8) {
            values.push(msg.slice(i, i + 8))
        }

        const len = values.length - 1;

        if(values[len].length < 8) {
            values[len] = values[len].padEnd(8, ' ');
        }
        msg = values.map(ele => stringToBinary(ele));

    } else if (mode === 'd') {

        for(let i = 0; i < msg.length; i += 16) {
            values.push(hexToBinary(msg.slice(i, i + 16)));
        }
        msg = values;
    }

    let cipherText = '';
    let cipher;
    
    for (snippet of msg) {
        cipherText += encrypt(snippet, subKeys, SBoxes);
    }

    if (mode === 'e') {
        cipher = binaryToHex(cipherText);
    }

    if (mode === 'd') {
        cipher = binaryToString(cipherText);
    }

    return cipher
}

const parser = new ArgumentParser({})

parser.add_argument('-m', '--mode', { choices: ['e', 'd'], required: true, help: 'Encryption(e) / Decryption(d)'});
parser.add_argument('-k', '--key', { required: true, help: 'key for encryption or decryption' });
parser.add_argument('-s', '--string', { required: true, help: 'String to be encrypted or decrypted' });

const args = parser.parse_args();

const message = args.string;
const password = args.key;

const subKeys = generateSubKeys(password);

if(args.mode === 'e') {
    let enc = encryption(message, subKeys[0], subKeys[1], 'e');
    console.log('hex digest:', enc);
} else if(args.mode === 'd') {
    let dec = encryption(message, subKeys[0].reverse(), subKeys[1], 'd');
    console.log(dec);
} else {
    console.log('Invalid Choice');
}

/**
 * EASY TEST CASES BELOW
 */

// let binary = stringToBinary('aassddff', 64);
// let hexcode = binaryToHex(binary);
// let backToBin = hexToBinary('d1310ba6');
// let binaryNumber = binaryToInt(binary);
// let string = binaryToString(binary);
// let int = hexcodeToInteger(hexcode);
// // console.log()
// let a = '10010011111001010011100011101000';
// let b = '11100000101101110000110111001110';
// let x = _xor(a, b)
// let add = _add(a, b)
// let block = '1010000011011110011111010111000000110110101001000000110010110101';
// let key = '00001010110000100011010100001101';
// let gen = generateSubKeys('password')
// console.log(gen)
// console.log(backToBin, 'd1310ba6')




