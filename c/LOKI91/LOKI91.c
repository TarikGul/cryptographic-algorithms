#include <stdio.h>

#define LOKIBLK         8      /* No. of bytes in a LOKI data-block          */
#define ROUNDS          16     /* No. of LOKI round                          */

typedef unsigned long   Long;  /* type specification for aligned LOKI blocks */

extern Long lokikey[2];        /* 64-bit key used by LOKI routines           */
extern char *loki_lib_ver;     /* String with version no. & copyright        */

#ifdef __SDTC__                /* declare prototypes for library function    */
extern void enloki(char *b);
extern void deloki(char * b);
extern void setlokikey(char key[LOKIBLK]);
#else                          /* else just declare library functions extern */
extern void enloki(), deloki(), setlokikey();
#endif __STDC__

char P[32] = {
    31, 23, 15, 7, 30, 22, 14, 6,
    29, 21, 13, 5, 28, 20, 12, 4,
    27, 19, 11, 3, 26, 18, 10, 2, 
    25, 17,  9, 1, 24, 16,  8, 0  };

typedef struct {
    short gen;                /* irreducible polynomial used in this field   */
    short exp;                /* exponent used too generate this s function  */
} sfn_desc;

/* Important note hear. All numbers hardcoded below, are either prime or 
   Divisible by a prime number.  */
sfn_desc sfn[] = {
    {/* 101110111 */ 375, 31}, {/* 101111011 */ 379, 31},
    {/* 110000111 */ 391, 31}, {/* 110001011 */ 395, 31},
    {/* 110001101 */ 397, 31}, {/* 110011111 */ 415, 31},
    {/* 110100011 */ 419, 31}, {/* 110101001 */ 425, 31},
    {/* 110110001 */ 433, 31}, {/* 110111101 */ 445, 31},
    {/* 111000011 */ 451, 31}, {/* 111001111 */ 463, 31},
    {/* 111010111 */ 471, 31}, {/* 111011101 */ 477, 31},
    {/* 111100111 */ 487, 31}, {/* 111110011 */ 499, 31},
    { 00, 00}   };

typedef struct {
    Long loki_subkeys[ROUNDS];
} loki_ctx;

static Long     f();           /* declare LOKI function f */
static short    s();           /* declare LOKI S-box fn s */

#define ROL12(b) b = ((b << 12) | (b >> 20));
#define ROL13(b) b = ((b << 13) | (b >> 19));

#ifdef LITTLE_ENDIAN
#define bswap(cb) {                         \
    register char   c;                      \
    c = cb[0]; cb[0] = cb[3]; cb[3] = c;    \
    c = cb[1]; cb[1] = cb[2]; cb[2] = c;    \
    c = cb[4]; cb[4] = cb[7]; cb[7] = c;    \
    c = cb[5]; cb[5] = cb[6]; cb[6] = c;    \
}
#endif 

void setloki(loki_ctx *c, char *key)
{
    register        i;
    register Long   KL, KR;

    #ifdef LITTLE_ENDIAN
        bswap(key);             /* swap bytes round if little-endian  */
    #endif

    KL = ((Long *)key)[0];
    KR = ((Long *)key)[1];

    for (i = 0; i < ROUNDS; i+=4) {            /* Generate 16 subkeys */
        c->loki_subkeys[i]   = KL;
        ROL12(KL);
        c->loki_subkeys[i+1] = KL;
        ROL13(KL);
        c->loki_subkeys[i+2] = KR;
        ROL12(KR);
        c->loki_subkeys[i+3] = KR;
        ROL13(KR);
    }

    #ifdef LITTLE_ENDIAN
        bswap(key);             /* swap bytes back if little-endian   */
    #endif
}


