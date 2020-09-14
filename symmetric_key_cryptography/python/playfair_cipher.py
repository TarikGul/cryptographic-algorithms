class Playfair:

    def __init__(self, keyword: str, message: str):
        super().__init__()
        self._keyword = keyword
        self._message = message
        self.alpha = 'abcdefghiklmnopqrstuvwxyz'
        self._matrix = []
        self._positions = {}
    
    def encrypt(self):
        # Populate the matrix
        self._matrix_cipher(self._keyword, self.alpha)
        # Turn the secret message into pairs of characters. 
        # Read the _split_message function to see rules regarding play_fairs pairs
        paired_chars = self._split_message(self._message)

        encrypted_message = []

        for i in range(len(paired_chars)):
            pair = paired_chars[i]
            # Memoize the position of the chracters in order to stay DRY
            pos_0 = self._positions[pair[0]]
            pos_1 = self._positions[pair[1]]

            if (pos_0[1] == pos_1[1]):
                # This is if the letters are both in the same column
                # Doing basic modular arithmatic to make sure that if the letters
                # are at the end of the matrix that they'll come back to the begining
                new_pos_0 = [(pos_0[0] + 1) % len(self._matrix), pos_0[1]]
                new_pos_1 = [(pos_1[0] + 1) % len(self._matrix), pos_1[1]]
            elif (pos_0[0] == pos_1[0]):
                # Like the previous conditional this checks if the letters are in
                # in the same row in the matrix
                new_pos_0 = [pos_0[0], (pos_0[1] + 1) % len(self._matrix[0])]
                new_pos_1 = [pos_1[0], (pos_1[1] + 1) % len(self._matrix[0])]
            elif (pos_0[1] != pos_1[1]):
                # If the position of the two letters arent in the same row or column
                # in the matrix all you have to do is swap the column numbers and you
                # have found the cipher letter that will be replacing the cur letter
                new_pos_0 = [pos_0[0], pos_1[1]]
                new_pos_1 = [pos_1[0], pos_0[1]]

            
            letter_1 = self._matrix[new_pos_0[0]][new_pos_0[1]]
            letter_2 = self._matrix[new_pos_1[0]][new_pos_1[1]]

            new_pair = letter_1 + letter_2

            encrypted_message.append(new_pair)

        return ''.join(encrypted_message)

    def _split_message(self, message: str):
        message_list = message.split(' ')
        joined = ''.join(message_list).upper()
        split_message = []

        i = 0
        while (i < len(joined)):
            if (joined[i] == joined[i + 1]):
                split_message.append(joined[i] + 'X')
                i += 1
                continue
            if (joined[i + 1] == None):
                split_message.append(joined[i] + 'X')
                break
        
            split_message.append(joined[i] + (joined[i + 1]))

            i += 2
        return split_message

    def _matrix_cipher(self, keyword: str, alpha: str):
        letters_obj = {}
        letters = list((keyword + alpha).upper())

        # Set all the letters to false in the hash
        for char in list(letters):
            letters_obj[char] = False
        
        # Tracks the index of the next letter in the array
        x = 0
        for i in range(5):
            matrix_layer = []

            # We use a while loop and the counter so that we can count backwards 
            # and forward depending on the matrix layer setup
            count = 0
            while(count < 5):
                cur = letters[x]
                # Check the hash if the letter has been used
                if letters_obj[cur] == False:
                    # print('hit it heres the count', count)

                    # Push the letter in the right position
                    matrix_layer.append(letters[x])
                    letters_obj[cur] = True 
                    # Save the position of the letter in the mattrix for O(1) lookup
                    # Instead of having to constantly loop through the matrix
                    self._positions[letters[x]] = [i, count]
                else:
                    count -= 1

                count += 1
                x += 1

            self._matrix.append(matrix_layer)

message = 'secret message';
key = 'keyword'
alpha = 'abcdefghijklmnopqrstuvwxyz'

encryption = Playfair(key, message)
print(encryption.encrypt())
