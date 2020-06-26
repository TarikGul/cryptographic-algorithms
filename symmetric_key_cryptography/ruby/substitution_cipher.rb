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

create_object_key()