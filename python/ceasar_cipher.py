# Give the alphabet globally, or as a parameter
alpha = 'abcdefghijklmnopqrstuvwxyz'

def ceasar_cipher(str, n, alpha):
    encrypted = ''

    for char in str:
        index = alpha.index(char)
        newIndex = index + n
        encrypted += alpha[newIndex]

    return encrypted

def decrypt_ceasar_cipher(str, n, alpha):
    decrypted = ''

    for char in str:
        index = alpha.index(char)
        newIndex = index - n
        decrypted += alpha[newIndex]

    return decrypted

print(ceasar_cipher('hello', 2, alpha))
print(decrypt_ceasar_cipher('jgnnq', 2, alpha))
