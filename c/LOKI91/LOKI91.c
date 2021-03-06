#include <stdio.h>
#include "LOKI91.h"
#include "LOKI91.i"

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
    register int         i;
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

void enloki(loki_ctx *c, unsigned char *b)
{
    register int       i;
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

void deloki(loki_ctx *c, unsigned char *b)
{
    register int       i;
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

#define MSB     0x80000000L                 /* MSB of 32-bit word         */

int perm32(out, in, perm)
Long *out;                      /* Output 32-bit block to be permuted   */
Long *in;                       /* Input 32-bit block after permutation */
char perm[32];                  /* Permutation array                    */
{
    Long mask = MSB;            /* mask used to set bit in output       */
    register int i, o, b;       /* input bit no, output bit no, value   */
    register char *p = perm;    /* ptr to permutation array             */

    *out = 0;                   /* clear output block                   */
    for(o = 0; o < 32; o++) {   /* For each output bit position o       */
        i = (int)*p++;          /* get input bit permuted to output o   */
        b = (*in >> i) & 01;    /* value of input bit i                 */
        if (b)                  /* If the input bit i is set            */
            *out |= mask;       /* OR in mask to output i               */
        mask >>= 1;             /* Shift mask to nxt bit                */
    }

    return 0;
}

#define SIZE 256                /* 256 elements in GF(2^8)          */

short mult8(a, b, gen)  
short a, b;                     /* Operands for multiply            */
short gen;                      /* irreducible polynomial generating Galios Field */
{
    short product = 0;          /* Result of multiplication         */

    while(b != 0) {             /* While multiplier is non-zero     */
        if(b & 01)              
            product ^= a;       /* add multiplicand is LSB of b set */
        a <<= 1;                /* shift multiplicand one place     */
        if(a >= SIZE)           
            a ^= gen;           /* add modulo reduce if needed      */
        b >>= 1;                /* shift multiplier one place       */
    }
    return product; 
}

short exp8(base, exponent, gen)
short base;                     /* base of exponentiation  */
short exponent;                 /* exponent                */
short gen;                      /* irredecible polynomail generating Galios Field */
{
    short accum  = base;        /* superincreasing sequence of base */
    short result = 1;           /* result of exponentiation         */

    if (base == 0)              /* if zero base spsecified then     */
        return(0);              /* The result is "0" if base = 0    */
    
    while (exponent != 0) {     /* repeat while exponent non-zero   */
        if((exponent & 0x0001) == 0x0001)      /* multiply if exp 1 */
            result = mult8(result, accum, gen);
        exponent >>= 1;         /* shift exponent to next digit     */
        accum = mult8(accum, accum, gen);           /* & square     */
    }

    return(result);
}

void loki_key(loki_ctx *c, unsigned char *key) {
    setlokikey(c, key);
}

void loki_enc(loki_ctx *c, unsigned char *data, int blocks) {
    unsigned char *cp;
    int i;

    cp = data;
    for(i = 0; i < blocks; i++) {
        enloki(c, cp);
        cp += 8;
    }
}

void loki_dec(loki_ctx *c, unsigned char *data, int blocks) {
    unsigned char *cp;
    int i;

    cp = data;
    for(i = 0; i < blocks; i++) {
        deloki(c, cp);
        cp += 8;
    }
}

int main(void) {
    loki_ctx lc;
    unsigned int data[10];
    unsigned char *cp;
    unsigned char key[] = {0,1,2,3,4,5,6,7};
    int i;

    for(i = 0; i < 10; i++) data[i] = i;

    loki_key(&lc, key);

    cp = (unsigned char *)data;
    loki_enc(&lc, cp, 5);
    for(i = 0; i < 10; i += 2) printf("Block %01d = %081x %081x\n",
                                    i/2, data[i], data[i+1]);
    loki_dec(&lc, cp, 1);
    loki_dec(&lc, cp+8, 4);
    for(i = 0; i < 10; i += 1) printf("Block %01d = %081x %081x\n",
                                    i/2, data[i], data[i+1]);
                                    
}
