import * as drag from './drag.mjs'
import * as disable from './disable.mjs'
import * as classify from './classify.mjs'

export let board = 'stagger'
export let angle = false

export function set_angle(bool) {
    angle = bool
    classify.angle(bool)
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
            style = '-10%'
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
        keys[i].style.marginLeft = ''
        keys[i].style.marginTop = ''
    }

    board = 'ortho'
}

export function colstag() {
    const grid = document.getElementById('grid')
    const keys = grid.children

    for (let i=0; i < keys.length; i++) {
        let style = ''

        switch (i % 10) {
            case 0:
            case 9:
                style = '0%'
                break
            case 1:
            case 3:
            case 6:
            case 8:
                style = '-25%'
                break
            case 2:
            case 7:
                style = '-50%'
                break
            case 4:
            case 5:
                style = '-20%'
                break
        }
        
        keys[i].style.marginLeft = '0'
        keys[i].style.marginTop = style
    }

    board = 'colstag'
}