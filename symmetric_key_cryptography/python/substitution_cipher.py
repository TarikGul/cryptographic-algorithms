from random import seed
from random import randrange

def create_object_key():
    key = {}

    used_indices = []
    alpha = 'abcdefghijklmnopqrstuvwxyz'

    for i in range(len(alpha)):
        random_num = 0
        unique = False

        while not unique:
            random_num = randrange(len(alpha))

            if random_num not in used_indices:
                unique = True
        
        # check below lines for syntax
        used_indices.append(random_num)
        key[alpha[i]] = alpha[random_num]

    print(key)
    return key

def substitution_cipher(str, key):
    new_str = []

    for char in str:
        new_str.append(key[char])
    
    encrypted_str = ''.join(new_str)

    print(encrypted_str)
    encrypted_str


key1 = create_object_key()
substitution_cipher('abc', key1)

key2 = create_object_key()
substitution_cipher('message', key2)

key3 = create_object_key()
substitution_cipher('substitutionmessage', key3)

            

