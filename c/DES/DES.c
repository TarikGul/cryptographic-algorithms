#define EN0 0  /* MODE == encrypt */
#define DE1 1  /* MODE == decrypt */

typedef struct {
    unsigned long ek[32];
    unsigned long dk[32];
} des_ctx;

extern void deskey(unsigned char *, short);
/*                  Hheykey[8]  MODE
* Sets the internal key register according to the hexadecimal
* key contained in the 8 bytes of hexkey, according to the DES,
* for encryption or decryption according to the MODE
*/

extern void useKey(unsigned long *);
/*                  cookedkey[32]
* Loads the internal key register with the data in cookedkey
*/

extern void cpkey(unsigned long *);
/*                  cookedkey[32]
* Copies the contents of the internal key register into the storage 
* located at &cookedkey[0]
*/

extern void des(unsigned char *, unsigned char *);
/*                  from[8]     to[8]
* Encrypts/Decrypts (according to the key currently loaded in the 
* internal key register) one block of eight bytes at address 'from'
* into the block at address 'to'. They can be the same.
*/

static void scrunch(unsigned char *, unsigned long *);
static void unscrun(unsigned long *, unsigned char *);
static void desfunc(unsigned long *, unsigned long *);
static void cookey(unsigned long *);

static unsigned long KnL[32] = { 0L };
static unsigned long KnR[32] = { 0L };
static unsigned long Kn3[32] = { 0L };
static unsigned long Df_Key[24] = {
    0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef,
    0xfe, 0xdc, 0xba, 0x98, 0x76, 0x54, 0x32, 0x10,
    0x89, 0xab, 0xcd, 0xef, 0x01, 0x23, 0x45, 0x67 };

static unsigned short bytebit[8] = {
    0200, 0100, 040, 020, 010, 04, 02, 01 };

static unsigned long bigbyte[24] = {
    
}