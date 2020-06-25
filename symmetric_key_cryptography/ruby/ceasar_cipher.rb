# Also known as shift cipher this is an implementation of both,
# The only difference is shift allows you to declare how many steps,
# you want to shift in the algorithm

def ceasar_cipher (str, n)
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
ceasar_cipher('abc', 1) # => BCD
ceasar_cipher('CAESARMESSAGE', 3) # => FDGVDUPHVVDJH
ceasar_cipher('asiknxh', 8) # => IAQSVFP

def decode_cipher (str) 
    alpha = "abcdefghijklmnopqrstuvwxyz"
    str_arr = str.downcase().split('')
    possible_words = []

    (0...alpha.length).each do |i|
      decrypted_word = []

      str_arr.each do |char|
        index = alpha.split('').index(char)
        new_letter = alpha[(index + i) % 26]

        decrypted_word << new_letter
      end

      possible_words << decrypted_word.join('')
    end

    possible_words
end

decoded1 = decode_cipher('bcd'); 
decoded2 = decode_cipher('FHDVDUPHVVDJH'); 
decoded3 = decode_cipher('asiknxh');

puts decoded1.include?('abc') # => true
puts decoded2.include?('ceasarmessage') # => true
puts decoded3.include?('asiknxh') # => true