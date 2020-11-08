/* HEADERS */

#define LOKIBLK 8 /* No. of bytes in a LOKI data-block          */
#define ROUNDS 16 /* No. of LOKI round                          */

typedef unsigned long Long; /* type specification for aligned LOKI blocks */

extern Long lokikey[2];    /* 64-bit key used by LOKI routines           */
extern char *loki_lib_ver; /* String with version no. & copyright        */
extern int perm32();
extern int mult8();

#ifdef __SDTC__ /* declare prototypes for library function    */
extern void enloki(char *b);
extern void deloki(char *b);
extern void setlokikey(char key[LOKIBLK]);
#else  /* else just declare library functions extern */
extern void enloki(), deloki(), setlokikey();
#endif // __STDC__