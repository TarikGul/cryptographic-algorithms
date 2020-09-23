require('byebug');

def create_object_key 
  key = {}

  used_indicies = [];
  alpha = 'abcdefghijklmnopqrstuvwxyz'

  (0...alpha.length).each do |i|
    random = 0

    unique = false
    while(!unique) do
        random = rand(0...alpha.length)

        unique = true if(!used_indicies.include?(random))
    end

    used_indicies << random
    key[alpha.split('')[i]] = alpha[random];
  end

  puts key
  key
end

def substitution_cipher (str, key)
  new_str = [];

  str.each_char do |char|
    new_str << key[char]
  end

  encrypted_str = new_str.join('')
  puts encrypted_str
  encrypted_str
end

key1 = create_object_key()
substitution_cipher('abc', key1)

key2 = create_object_key()
substitution_cipher('message', key2)

key3 = create_object_key()
substitution_cipher('substitutionmessage', key3)