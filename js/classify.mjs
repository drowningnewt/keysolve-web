import * as board from './board.mjs'

export const STANDARD = [
    0, 1, 2, 3, 3, 6, 6, 7, 8, 9,
    0, 1, 2, 3, 3, 6, 6, 7, 8, 9,
    0, 1, 2, 3, 3, 6, 6, 7, 8, 9,
    5, 5, 5
]

export const ANGLE = [
    0, 1, 2, 3, 3, 6, 6, 7, 8, 9,
    0, 1, 2, 3, 3, 6, 6, 7, 8, 9,
    1, 2, 3, 3, 3, 6, 6, 7, 8, 9,
    5, 5, 5
]

export let FINGER_MAP = STANDARD

export function angle(bool) {
    if (bool) {
        FINGER_MAP = ANGLE
    } else {
        FINGER_MAP = STANDARD
    }
}

function finger(idx) {
    return FINGER_MAP[idx]
}

function column(idx) {
    if (idx >= 30) {
        return 0
    } 
    
    return idx % 10
}

function hand(idx) {
    if (idx >= 30) {
        return 1
    } 

    if (idx % 10 < 5) {
        return 0
    } else {
        return 1
    }
}

function row(idx) {
    return Math.floor(idx / 10)
}

function ordered(idx) {
    if (idx.length < 2) return true; // Arrays with less than 2 elements are trivially ordered

    let isIncreasing = true;
    let isDecreasing = true;

    for (let i = 1; i < idx.length; i++) {
        const current = finger(idx[i]);
        const previous = finger(idx[i - 1]);

        if (current < previous) {
            isIncreasing = false;
        }
        if (current > previous) {
            isDecreasing = false;
        }
    }

    return isIncreasing || isDecreasing;
}


export function classify(key, gram) {
    switch(key.length) {
        case 2:
            return bigrams(key)
        case 3:
            return trigrams(key)
        case 4:
            return quadgrams(key, gram)
    }
}

function X(c, r) {
    let sx = c
    console.log(board.board)
    if (board.board === 'stagger') {
        if (r == 0) {
            sx = c - 0.25
        } else if (r == 2) {
            sx = c + 0.5
        } else {
            sx = c
        }
    }
	return sx
}

function twoKeyDist(k1, k2) {
    ax = X(column(k1), row(k1))
    bx = X(column(k2), row(k2))
    ay = row(k1)
    by = row(k2)

    x = ax - bx
    y = ay - by

    return Math.sqrt((x * x) + (y * y))
}

function bigrams(key) {
    const buckets = []

    if (
        finger(key[0]) == finger(key[1]) &&
        key[0] != key[1]
    ) {
        buckets.push('SF')
        return buckets
    }
    
    if (
        hand(key[0]) == hand(key[1]) && 
        Math.abs(finger(key[0]) - finger(key[1])) == 1 &&
        Math.abs(X(column(key[0]), row(key[0])) - X(column(key[1]), row(key[1]))) >= 2
    ) {
        buckets.push('LS')
    }

    if (
        (
            row(key[0]) - row(key[1]) == -1 &&
            hand(key[0]) == hand(key[1]) &&
            [1, 2, 7, 8].includes(finger(key[1]))
        ) ||
        (
            row(key[0]) - row(key[1]) == 1 &&
            hand(key[0]) == hand(key[1]) &&
            [1, 2, 7, 8].includes(finger(key[0]))
        )
    ) {
        buckets.push('HS')
    }

    if (
        (
            row(key[0]) - row(key[1]) == -2 &&
            hand(key[0]) == hand(key[1]) &&
            [1, 2, 7, 8].includes(finger(key[1]))
        ) ||
        (
            row(key[0]) - row(key[1]) == 2 &&
            hand(key[0]) == hand(key[1]) &&
            [1, 2, 7, 8].includes(finger(key[0]))
        )
    ) {
        buckets.push('FS')
    }

    return buckets
}

function trigrams(key) {
    const buckets = []

    if (
        hand(key[0]) == hand(key[2]) &&
        hand(key[0]) != hand(key[1])
    ) {
        buckets.push('ALT')
    }

    if (
        new Set(key.map(x => hand(x))).size == 2 &&
        new Set(key.map(x => finger(x))).size == 3 &&
        hand(key[0]) != hand(key[2])
    ) {
        buckets.push('ROL')
    }

    if (
        new Set(key.map(x => hand(x))).size == 1 &&
        new Set(key.map(x => finger(x))).size == 3 &&
        ordered(key)
    ) {
        buckets.push('ONE')
    }

    if (
        new Set(key.map(x => hand(x))).size == 1 &&
        finger(key[0]) != finger(key[1]) &&
        finger(key[1]) != finger(key[2]) &&
        !ordered(key)
    ) {
        buckets.push('RED')
    }

    return buckets
}

function quadgrams(key, gram) {
    const buckets = []

    if (
        hand(key[0]) == hand(key[2]) &&
        hand(key[1]) == hand(key[3]) &&
        hand(key[0]) != hand(key[1])
    ) {
        if (new Set(key.map(x => finger(x))).size == 4) {
            buckets.push('CA')
            buckets.push('SA')
        } else {
            buckets.push('SA')
        }
    }

    if (
        new Set(key.map(x => hand(x))).size == 2 &&
        new Set(key.map(x => finger(x))).size == 4 &&
        hand(key[0]) == hand(key[1]) &&
        hand(key[1]) != hand(key[2]) &&
        hand(key[2]) == hand(key[3])
    ) {
        buckets.push('CR')
    }

    if (
        new Set(key.map(x => hand(x))).size == 2 &&
        hand(key[0]) != hand(key[1]) && 
        hand(key[1]) == hand(key[2]) && 
        hand(key[2]) != hand(key[3]) &&
        finger(key[1]) != finger(key[2])
    ) {
        buckets.push('TR')
        if (new Set(key.map(x => finger(x))).size == 4) {
            buckets.push('BT')
        }
    }

    if (
        new Set(key.map(x => hand(x))).size == 1 &&
        new Set(key.map(x => finger(x))).size == 4 &&
        ordered(key)
    ) {
        buckets.push('4R')
    }

    if (
        new Set(key.map(x => hand(x))).size == 1 &&
        finger(key[0]) != finger(key[1]) &&
        finger(key[1]) != finger(key[2]) &&
        finger(key[2]) != finger(key[3]) &&
        !ordered(key)
    ) {
        buckets.push('RD')
    }

    return buckets
}