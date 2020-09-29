# Blowfish

## Resources
[Wiki on Blowfish](https://en.wikipedia.org/wiki/Blowfish_(cipher))<br/>
[Java interpretation](https://www.geeksforgeeks.org/blowfish-algorithm-with-examples/)<br/>
[Bruce Schneier Blog](https://www.schneier.com/)

Todos
----
Add fiestel network visual,
explain the process we use with the 64 bit blocks

#### Encrypt
```
node blowfish.js -m e -k <insert_key_here> -s <insert_secret_here>
```

#### Decrypt
```
node blowfish.js -m e -k <insert_key_here> -s <insert_hex_here>
```