# Read JS file for more on vigeneres cipher

def vigeneresCipher (str, key) 
  if str.length != key.length 
      puts 'The str length and key length must be the same'
      return
  end

  alpha = %(abcdefghijklmnopqrstuvwxyz)

  realStr = str.downcase()
  realKey = key.downcase()

  cipher = []

  (0...str.length).each do |i|
    strIndex = alpha.index(realStr[i])
    keyIndex = alpha.index(realKey[i])

    cipherIndex = (strIndex + keyIndex) % 26

    cipher << alpha[cipherIndex]
  end

  puts cipher.join('').upcase()
  return cipher.join('')
end

vigeneresCipher('THISISATEST', 'VECTORVECTO') # => OLKLWJVXGLH