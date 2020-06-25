# Also known as shift cipher this is an implementation of both,
# The only difference is shift allows you to declare how many steps,
# you want to shift in the algorithm

def ceasarCipher (str, n)
    alpha = "abcdefghijklmnopqrstuvwxyz"
    str_arr = str.downcase().split('')
    encryptedArr = []

    str_arr.each do |char|
        index = alpha.split('').index(char)
        newLetter = alpha[(index + n) % 26]
        encryptedArr << newLetter
    end

    encrypted = encryptedArr.join('').upcase
    puts encrypted
    encrypted
end

# Test cases
ceasarCipher('abc', 1) # => BCD
ceasarCipher('CAESARMESSAGE', 3) # => FDGVDUPHVVDJH
ceasarCipher('asiknxh', 8) # => IAQSVFP