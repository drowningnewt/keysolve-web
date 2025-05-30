import * as board from './board.mjs'
import {classify, FINGER_MAP} from './classify.mjs'

const FINGERS = ['LP', 'LR', 'LM', 'LI', 'LT', 'RT', 'RI', 'RM', 'RR', 'RP']

let MONOGRAMS = null
let BIGRAMS = null
let SKIPGRAMS = null
let TRIGRAMS = null
let QUADGRAMS = null

export async function init() {
    MONOGRAMS = await (await fetch('corpora/monograms.json')).json()
    BIGRAMS = await (await fetch('corpora/bigrams.json')).json()
    SKIPGRAMS = await (await fetch('corpora/skipgrams.json')).json()
    TRIGRAMS = await (await fetch('corpora/trigrams.json')).json()
    QUADGRAMS = await (await fetch('corpora/tetragrams.json')).json()
}

export function analyze() {
    const letters = board.layout()
    const layout = {}

    for (let i=0; i < letters.length; i++) {
        layout[letters[i]] = i
    }

    const res = {}
    for (const suffix of ['B', 'S', 'Q', '']) {
        let grams

        switch (suffix) {
            case 'B':
                grams = BIGRAMS
                break
            case 'S':
                grams = SKIPGRAMS
                break
            case 'Q':
                grams = QUADGRAMS
                break
            default:
                grams = TRIGRAMS
                break
        }

        let curr = {}
        let total = 0

        for (const [gram, count] of Object.entries(grams)) {
            const lower = gram.toLowerCase()
            const key = [...lower].map(x => layout[x])
            total += count

            if (key.indexOf(undefined) !== -1) {
                continue
            }

            const stats = classify(key)

            for (let stat of stats) {
                stat = stat + suffix

                curr[stat] ??= 0
                curr[stat] += count
            }
        }

        for (const [stat, count] of Object.entries(curr)) {
            res[stat] = count / total
        }
    }

    let curr = {}
    let total = 0

    for (const [gram, count] of Object.entries(MONOGRAMS)) {
        const finger = FINGERS[FINGER_MAP[layout[gram]]]

        if (finger === undefined) {
            continue
        }

        curr[finger] ??= 0
        curr[finger] += count
        total += count
    }

    for (const [stat, count] of Object.entries(curr)) {
        res[stat] = count / total
    }

    res['LH'] = ['LI', 'LM', 'LR', 'LP', 'LT'].reduce((sum, x) => sum + (res[x] ?? 0), 0)
    res['RH'] = ['RI', 'RM', 'RR', 'RP', 'RT'].reduce((sum, x) => sum + (res[x] ?? 0), 0)

    return res
}