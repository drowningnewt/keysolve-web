# KeySolve

![Keysolve](keysolve.png)

## How to Use

**Search**  
You can search for layouts by clicking the layout header and typing in a layout name. The search bar will provide completion suggestions as you type.

**Swaps**  
You can swap letters around by clicking a key on the heatmap and dragging it over another key.

**Toggle Ngram/Use Metrics**  
You can toggle between the bigram/trigram/skipgram table and the use table by clicking the `stats` button.

**Copy and Paste**  
By clicking the button with the gear icon, you can see the layout in text form. Here you can either copy the layout to easily share it or use it with other analyzers, or you can paste in another layout.

**Misc Features**  
- You can flip a layout by clicking the `mirror` button.
- You can toggle between an ortholinear board or a row-staggered board by clicking the `board` button.

## Metric Classes

Hand patterns will be specified using the letters a and b where a is any hand and b is the alternating hand.

**Bigrams**  
A bigram is a pattern of two letters that occur next to each other. All bigram metrics have the letter `B` at the end of their abbreviation. 
- The word `the` has two bigrams: `th` and `he`.

**Skipgrams**  
A skipgram is a pattern of two letters that are separated by any other letter. All skipgram metrics have the letter `S` at the end of their abbreviation.
- The word `the` has only one skipgram: `te`.

**Trigrams**  
A trigram is a pattern of three letters that occur next to each other. 
- The word `the` has only one trigram: `the`.

**Quadgrams**
A quadgram is a pattern of four letters that occur next to each other. 
- The word `just` has only one quadgram: `just`

## Bigram Types

**SF (Same Finger)**  
SFs are patterns that involve using the same finger twice to hit both letters. These sequences are generally very slow and should be minimized as much as possible.
- On QWERTY, `ed` is a very common SFB.

**LS (Lateral Stretch)**  
Lateral stretches are patterns that involve reaches into the outer index column with the index followed or preceded by middle finger use.
- On QWERTY, `et`, `ct`, and 'eg` are all examples of LSBs.

**HS (Half-Scissor)**  
A half-scissor is a pattern where one finger needs to stretch or contract to press a key on the top or bottom row and another finger on the same hand stays on the homerow - but the finger that is on the lower of the two rows is either middle or ring.
- `ok`, `sc`, and `rd` are common examples of half-scissors on QWERTY.

**FS (Full-Scissor)**  
A full-scissor is a pattern where one finger needs to reach to the top row and another finger on the same hand needs to contract to hit the bottom row - but the finger that is on the lower of two rows is either middle or ring.
- `cr`, `ex`, `xt` are all FSBs on QWERTY.

## Trigram Types

**ALT (Alternation)**  
An alternation sequence is when hand use alternates over three consecutive keypresses - aba.

**ROL (Roll)**  
A roll is when one hand presses two keys consecutively and is followed or preceded by a keypress on the other hand - either aab or abb.

**ONE (Onehand)**  
A onehand is when all three keypresses are pressed on the same hand, and in an order from left to right or right to left - aaa.
- `asd`, `sdf`, and `fds` are all onehands on QWERTY.

**RED (Redirect)**  
A redirect is when all three keypresses are pressed on the same hand but don't occur in a smooth order - aaa.
- `sea`, `sca`, and `rse` are all redirects on QWERTY.

## Quadgram Types

**CAQ (Non-SFS Chained Alternation)**
An alternation sequence combined with another alternation sequence where a hand alternates over four cosecutive keypresses. All keypresses must have unique fingers - abab.
- `with`, `othe`, and `make` are valid patterns on QWERTY.

**SAQ (Total Chained Alternation)**
Chained alternation but without CAQ's requirement of unique fingers.
- `than`, `ight`, and `when` are valid patterns on QWERTY.

**CRQ (Chained Roll)**
A roll pattern followed by another roll pattern (roll start + roll end / aab + abb) - aabb.
- `atio`, `life`, and `ings` are valid patterns on QWERTY.

**BTQ (Bidirectional/Non-SFS True Rolls)**
A pattern where a key is pressed on one hand, a roll is done on the other, and then returning back to the initial hand (roll end + roll start / abb + bba). The pattern a__a must not be an SFS - abba.
- `some`, `this`, and `time` are valid patterns on QWERTY.

**TRQ (Total True Rolls)**
True rolls without BTQ's restriction of a__a not being an SFS.
- `ting`, `come`, and `bout` are valid patterns on QWERTY.

**4RQ (4roll)**
A 4roll is when all four keypresses are pressed on the same hand, and in an order from left to right or right to left - aaaa.
- `poin`, `plin`, and `rewa` are valid patterns on QWERTY.

**RDQ (4red)**
A 4red is when all four keypresses are pressed on the same hand but don't occur in a smooth order - aaaa.
- `you'`, `hink`, and `reat` are valid patterns on QWERTY.

## Color buckets are broken for the following stats:
- SAQ
- RDQ