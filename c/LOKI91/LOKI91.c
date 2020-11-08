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

void enloki(loki_ctx *c, char *b)
{
    register        i;
    register Long   L, R;       /* left and right data halves */

    #ifdef LITTLE_ENDIAN
        bswap(b);               /* swap bytes round if little-endian */
    #endif

    L = ((Long *)b)[0];
    R = ((Long *)b)[1];

    for (i = 0; i < ROUNDS; i+=2) {     /* Encrypt with the 16 subkeys */
        L ^= f (R, c->loki_subkeys[i]);
        R ^= f (L, c->loki_subkeys[i+1]);
    }

    ((Long *)b)[0] = R;         /* Y = swap(LR) */
    ((Long *)b)[1] = L;

    #ifdef LITTLE_ENDIAN
        bswap(b);               /* swap bytes round if little-endian   */
    #endif
}

void deloki(loki_ctx *c, char *b)
{
    register        i;
    register Long   L, R;       /* left & right data halves */

    #ifdef LITTLE_ENDIAN
        bswap(b);               /* swap bytes round if little-endian   */
    #endif

    L = ((Long *)b)[0];         /* LR = X XOR K */
    R = ((Long *)b)[1];

    for(i = ROUNDS; i > 0; i -= 2) {        /* subkeys in reverse order */
        L ^= f(R, c->loki_subkeys[i-2]);
        R ^= f(L, c->loki_subkeys[i-2]);
    }

    ((Long *)b)[0] = R;         /* Y = LR COR K */
    ((Long *)b)[1] = L;
}

#define MASK12      0x0fff      /* 12 bit mask for expansion E */

static Long f(r, k)
register Long   r;          /* Data value R(i-1)           */
Long            k;          /* Key        K(i)             */
{
    Long a, b, c;           /* 32 bit mask for expansion E */

    a = r ^ k;              /* A = R(i-1) XOR K(i)         */

    /* want to use slow speed.small size version */
    b = ((Long)s(( a        & MASK12)))       | /* B = S(E(R(i-1))^K(i)) */
        ((Long)s(((a >>  8) & MASK12)) <<  8) |
        ((Long)s(((a >> 16) & MASK12)) << 16) |
        ((Long)s((((a >> 24) | (a << 8)) & MASK12)) << 24);

    perm32(&c, &b, P);      /* C = P(S( E(R(i-1)) XOR k(i))) */

    return(c);              /* f returns the result C */
}

static short s(i)
register Long i;            /* return S-box value for input i */
{
    register short r, c, v, t;
    short exp8();           /* exponentiation routine for GF(2^8) */

    r = ((i >> 8) & 0xc) | (i & 0x3);       /* row value-top 2 & bottom 2 */
    c = (i >> 2) & 0xff;                    /* column value-middle 8 bits */
    t = (c = ((r * 17) ^ 0xff)) & 0xff;     /* base value for Sfn         */
    v = exp8(t, sfn[r].exp, sfn[r].gen);    /* Sfn[r] = t ^ exp mod gen   */
    return(v);
}
