// A Brief History
// The Feistel cipher or Feistel Network is named after Horst Feistel, who developed it while working at IBM.He and a colleague, Don Coppersmith, published a cipher called Lucifer in 1973 that was the first public example of a cipher using a Feistel structure.Due to the benefits of the Feistel structure, other encryption algorithms based upon the structure and upon Lucifer have been created and adopted for common use.

//     Note: Please don't be confused by the name Feistel cipher. Feistel cipher is not one particular cipher. It is a structure on which many ciphers such as the Lucifer cipher are based.

// Overview of the Feistel Network
// A Feistel cipher is a multi - round cipher that divides the current internal state of the cipher into two parts and operates only on a single part in each round of encryption or decryption.Between rounds, the left and right sides of the internal states switch sides.The image below shows a notional Feistel cipher with two rounds


// Diagram for encryption and decryption in a Feistel network.
// The left side of the image shows the encryption of the plaintext to the ciphertext and the right side shows the creation of round keys via a key scheduling algorithm, K.

// Encryption in a Feistel Network
// The steps for encrypting with the example Feistel network are as follows:

// Alice and Bob exchange a secret key, S, through a secure channel
// Alice selects a plaintext, P, to send to Bob and breaks it into blocks of the length that the cipher accepts.For each block, the following steps are followed.
// Alice splits the plaintext into a left piece and a right piece, L0 and R0
// Alice sets the value of round key zero to the initial secret key.That is, RK0 = S.Here, RK stands for Round Key.
// The left side of round i + 1 is set as the right side of round i.That is, Li + 1 = Ri
// Alice evaluates the function F(Ri, RKi), where Ri is the right side of the current round.The result is exclusive - ored with Li and stored as the right side of round i + 1. That is, Ri + 1 = Li ⊕ F(Ri, RKi)
// If not the last round, Alice evaluates the function K(RKi) and stores the result as round key i + 1. That is, RKi + 1 = K(RKi).
// Alice repeats steps 5 - 7 for n rounds(one in the case of the diagram above)
// Ln and Rn are combined to create the ciphertext block for this plaintext block.
// All ciphertext blocks are combined to a single ciphertext C.Alice sends the result C to Bob.
// In the next couple of sections, we will talk about the encryption part(steps 5 and 6) and the key scheduling part(step 7) of a Feistel structure in more detail.

// The Encryption Phase
// As shown, the plaintext is split into two pieces.The right piece of one round becomes the left piece of the next.The left piece is exclusive - ored with the result of performing the function F on the right piece.The result of this is placed on the right side for the next round.This means that the two pieces of the original plaintext will be transformed in alternate rounds(since whatever is in the right side during a round moves on to the next round unchanged).

// The F function is what makes a Feistel cipher unique from other Feistel ciphers.The F function is where the "encryption" happens and its security is vital to the security of the cipher.For example, an F function that completely discards the round key input and operates only on the plaintext can be trivially broken since all an attacker has to do is guess the plaintext and confirm that the ciphertext matches.

// Key Scheduling
// Feistel ciphers also have what is called a key schedule that acts as an input to each round of the cipher.There are two possible options for a key schedule.

// The first is that the key for each round of the cipher(or "round key") is included in the secret key shared by the two parties(resulting in a long shared secret key).

// The other option is that the shared secret key is used as an input to a "key expansion" function (shown in the diagram as K), which performs some operation on the previous round key or the current internal state of the key generation algorithm to generate the next round key.

// The K function transforms the initial secret key into round keys for each round of encryption.This function must be selected to maintain the key space of the encryption function.If a 64 - bit secret key is required, but at some point the effective key space shrinks to 32 bits, then an attacker only has to search a space of 32 - bit keys in order to decrypt the ciphertext.

// Decryption in a Feistel Network
// The major benefit of the Feistel network is that the same structure can be used for encryption and decryption.For a ciphertext encrypted with the Feistel network shown in the diagram, we can use the exact same structure to decrypt.The only difference is that, in decryption, we use the round keys in reverse.

// The steps for decryption in a Feistel network are as follows:

// Alice and Bob exchange a secret key, S, through a secure channel and Alice sends Bob a ciphertext, C.
// Bob calculates the round keys for all rounds using the key scheduling functions K, i.e.RKi + 1 = K(RKi)
// Bob breaks C into blocks of the length that the cipher accepts.For each block, the following steps are followed.
// Bob splits the ciphertext block into a left piece and a right piece.These are Ln and Rn.
// The right side of round i is simply the left side of round i + 1. That is, Ri = Li + 1
// Li is calculated as follows.Li = Ri + 1 ⊕ F(Ri, RKi).This works because the xor - function (⊕) has the property that A = B ⊕ C implies B = A ⊕ C.More details below.
// Alice repeats steps 5 - 6 for n rounds(one in the case of the diagram above).
// L0 and R0 are combined to create the plaintext block for this ciphertext block.
// All plaintext blocks are combined to a single plaintext P!
// Why decryption works
// It may seem odd that the same operation can be used to perform and undo itself.To understand this, we need to take another look at the diagram of the Feistel cipher shown above.

// Seeing how the right half undoes itself is easy, all that happens is that something switches sides.
// Undoing the left half depends on two crucial things.
//     First, we have all the information that was available to the function F during the encryption phase, i.e.Ri and RKi
// Second, the xor - function (⊕) has the property that B ⊕ B = 0 for all values of B.This implies that if A = B ⊕ C, then A ⊕ C = B ⊕ C ⊕ C = B ⊕ 0 = B.That is, the xor - function, A = B ⊕ C implies A ⊕ C = B.Hence, we have Li = Ri + 1 ⊕ F(Ri, RKi).
// Notice that this will only work for an operation that is its own inverse(like exclusive - or), which is why Feistel networks always use exclusive - or for changing the transformed half of the state in a round.

// Making strong Feistel ciphers
// The Feistel structure does not clearly map to the cryptographic principles of confusion and diffusion.Confusion requires that each bit of the ciphertext is based upon several bits of the shared secret key.Diffusion means that a change of a single bit of the plaintext should change roughly half of the bits of the bits of the ciphertext after encryption(and vice versa after decryption).All of these properties must be handled within the round function, F, which is not specified as part of the Feistel structure.

// Advantages of Feistel Ciphers
// Feistel ciphers have two main advantages

// Structural reusability: As we discussed previously, the same structure can be used for encryption and decryption as long as the key schedule is reversed for decryption.This is extremely useful for hardware implementations of ciphers since all of the encryption logic does not have to be reimplemented in reverse for decryption.

// Ability to use one - way round functions: The other major advantage of Feistel ciphers is that the round function, F, does not have to be reversible.Most ciphers require that every transformation of the plaintext performed in encryption be reversible so that they can be undone in decryption.Since this is not a requirement for ciphers using the Feistel structure, it opens up new possibilities for round functions.

// Disadvantages of Feistel Ciphers
// One disadvantage of Feistel ciphers is that they are limited in their ability to be parallelized as compared to other ciphers.In other ciphers, the entire internal state of the cipher changes with each round, while Feistel ciphers only change part of the internal state each round.