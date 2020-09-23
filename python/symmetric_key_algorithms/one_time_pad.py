import math
import random
# -------------------------------------------------------
# TODO
# Need to create a new binary file to read ASCII binaries,
# file got lost in the new restructure.
from binaries import binaries


def generate_encryption(message):
    one_time_pad = generate_one_time_pad(message)
    one_time_pad_bin = string2bin(one_time_pad)
    message_bin = string2bin(message)
    encryption = []

    if (len(one_time_pad_bin) != len(message_bin)):
        print('message and one time pad must be the same length')
        return

    for i in range(len(message_bin)):
        new_bin = xor(message_bin[i], one_time_pad_bin[i])
        encryption.append(new_bin)

    return "".join(encryption)


def xor(a, b):
    binary = ''

    for i in range(len(a)):
        num = bin(int(a[i]) ^ int(b[i]))
        binary = binary + str(num[2])

    return binary


def string2bin(message):
    binary = []

    # We use our binaries.py file in order to get each letters correspoding
    # binary equivalent
    i = 0
    while (i < len(message)):
        binary.append(binaries[message[i]])
        i = i + 1

    return binary


def generate_random_word(length, alpha):
    a = list(alpha)
    word = []

    i = 0
    while (i < length):
        rand = random.randint(0, len(a) - 1)

        if (i == 0 and rand == 26) or (i == length - 1 and rand == 26):
            pass
        elif (rand == 26 and word[len(word) - 1] == ' '):
            pass
        i = i + 1

        word.append(a[rand])

    return "".join(word)


def generate_one_time_pad(message):
    alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz'
    copy = message.split(' ', 1)
    one_time_pad = []

    i = 0
    while (i < len(copy)):
        random_word = generate_random_word(len(copy[i]), alpha)
        rand = random.randint(0, len(alpha) - 1)

        one_time_pad.append(random_word)

        if (i < len(copy) - 1):
            one_time_pad.append(alpha[rand])

        i = i + 1

    return ''.join(one_time_pad)


if __name__ == '__main__':
    message = 'hey there kiddo this is the one time pad'
    result = generate_encryption(message)
    print(result)
