/**
 * @TODO
 * -import argparser
 */
const assert = require('assert');

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
        binaries.push(parseInt(hex[i]).toString(2).padStart(4, '0'));
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
    assert(key.length === 32, 'Length of key is not 64 bits');

    // Setup Left and Right blocks for the fiestel network
    const middle = block.length / 2;
    const L = block.slice(0, middle); 
    const R = block.slice(middle);

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
    console.log(SValues)
    assert(SValues[0].length === 32, 'SValues are not 32 bits');

    const result = _add(SValues[3], _xor(SValues[2], _add(SValues[1], SValues[0])));

    assert(result.length === 32, 'Output of SBoxes operation is not 32 bits');

    const LeftPrime = _xor(result, R);

    return LeftPrime + RightPrime
}








/**
 * TEST CASES BELOW
 */

let binary = stringToBinary('aassddff', 64);
let hexcode = binaryToHex(binary);
let backToBin = hexToBinary(hexcode);
let binaryNumber = binaryToInt(binary);
let string = binaryToString(binary);
let int = hexcodeToInteger(hexcode);
// console.log()
let a = '10010011111001010011100011101000';
let b = '11100000101101110000110111001110';
let x = _xor(a, b)
let add = _add(a, b)
let block = '1010000011011110011111010111000000110110101001000000110010110101';
let key = '00001010110000100011010100001101';
console.log(_round(block, key, s_boxes))





