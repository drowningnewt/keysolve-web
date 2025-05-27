import * as drag from './drag.mjs'
import * as disable from './disable.mjs'
import * as classify from './classify.mjs'

export let board = 'ortho'
export let angle = false
export let fingerCondition = 'None'
export let thumb_side = 'R'

export function set_angle(bool) {
    angle = bool
    classify.angle(bool)
}

export function set_finger_condition(cond) {
    fingerCondition = cond
    classify.fingerCondition(cond)
}

export function set_thumb_side(side) {
    thumb_side = side
    classify.set_thumb(side)
}

export function layout() {
    const grid = document.getElementById('grid')
    let layout = ''

    for (const key of grid.children) {
        if (key.classList.contains('empty')) {
            continue
        }

        if (key.classList.contains('excluded')) {
            layout += '�'
        } else {
            layout += key.innerHTML.toLowerCase()
        }
    }

    return layout
}

export function update(layout) {
    grid.innerHTML = ''

    for (let i=0; i < layout.length; i++) {
        if (i == 30) {
            for (let j=0; j < 6; j++) {
                const filler = document.createElement('div')
                filler.className = 'empty'
                grid.appendChild(filler)
            }
        }

        const letter = layout[i].toUpperCase()

        const key = document.createElement('div')
        key.className = `cell center ${letter}`
        key.innerHTML = letter

        key.setAttribute('draggable', 'true')
        grid.appendChild(key)
    }

    if (board == 'stagger') {
        stagger()
    }

    drag.init()
    disable.init()

    window.stats()
}

const columnOffsetMap = new Map([
    [0, '0%'], [9, '0%'],
    [1, '-25%'], [3, '-25%'], [6, '-25%'], [8, '-25%'],
    [2, '-50%'], [7, '-50%'],
    [4, '-20%'], [5, '-20%']
]);

const rowOffsetMap = new Map([
    ['L', '-320%'], ['R', '0%']
]);

export function stagger() {
    const grid = document.getElementById('grid')
    const keys = grid.children

    for (let i=0; i < keys.length; i++) {
        let style = ''
        if (i < 10) {
            style = '-30%'
        } else if (i < 20) {
            style = '-10%'
        } else if (i < 30) {
            style =  '30%'
        } else {
            style = rowOffsetMap.get(thumb_side) || '0%'
        }

        keys[i].style.marginLeft = style
        keys[i].style.marginTop = ''
    }

    board = 'stagger'
}

export function ortho() {
    const grid = document.getElementById('grid')
    const keys = grid.children

    for (let i=0; i < keys.length; i++) {
        keys[i].style.marginLeft = (Math.floor(i / 10) > 2) ? rowOffsetMap.get(thumb_side) : '0%';
        keys[i].style.marginTop = ''
    }

    board = 'ortho'
}

export function colstag() {
    const grid = document.getElementById('grid')
    const keys = grid.children

    for (let i=0; i < keys.length; i++) {
        const key = keys[i];

        const columnIndex = i % 10;
        const rowIndex = Math.floor(i / 10);

        key.style.marginTop = columnOffsetMap.get(columnIndex) || '0%';
        key.style.marginLeft = rowIndex > 2 ? (rowOffsetMap.get(thumb_side) || '0%') : '';
    }

    board = 'colstag'
}