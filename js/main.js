import * as search from './search.mjs'
import * as drag from './drag.mjs'
import * as board from './board.mjs'
import * as disable from './disable.mjs'
import * as stats from './stats.mjs'
import * as settings from './settings.mjs'
import * as themes from './themes.mjs'

let base = {}

window.onload = async function() {
    search.init()
    drag.init()
    disable.init()
    stats.init()
    settings.init()
    themes.init()

    base = await (await fetch('percentiles.json')).json()

    // Bandaid fix to disable Firefox's quick find shortcut
    document.addEventListener('keydown', function(event) {
        if (event.key === "'" && document.activeElement !== document.getElementById('search')) {
            event.preventDefault();
        }
    });
}

window.info = function() {
    const url = 'https://github.com/drowningnewt/keysolve-web'
    window.open(url, '_blank')
}

window.toggle = function() {
    const ngrams = document.getElementById('ngrams')
    const use = document.getElementById('use')
    const button = document.getElementById('statsButton')

    if (use.hasAttribute('hidden')) {
        use.removeAttribute('hidden')
        ngrams.setAttribute('hidden', 'true')
    } else {
        use.setAttribute('hidden', 'true')
        ngrams.removeAttribute('hidden')
    }

    if (use.hasAttribute('hidden')) {
        button.innerHTML = '<i class="fa-solid fa-chart-simple"></i> Stats'
    } else {
        button.innerHTML = '<i class="fa-solid fa-chart-simple"></i> Usage'
    }
}

window.stats = function() {
    const res = stats.analyze()

    for (const [stat, freq] of Object.entries(res)) {
        const cell = document.getElementById(stat)
        const perc = freq.toLocaleString(
            undefined, { style: 'percent', minimumFractionDigits:2 }
        )

        if (!(stat in base)) {
            continue
        }

        let color = ''
        for (let i=0; i < 5; i++) {
            if (freq > base[stat][i]) {
                color = `var(--color-${4-i})`
            }
        }

        cell.innerHTML = `${stat}: ${perc}`
        cell.style.background = color
    }
}

window.mirror = function() {
    const grid = document.getElementById('grid')
    const keys = grid.children

    let letters = []
    for (const key of keys) {
        letters.push(key.innerHTML)
    }

    letters = letters.slice(0, 30)

    for (let row=0; row < 3; row++) {
        for (let col=0; col < 10; col++) {
            const key = keys[(2-row)*10 + col]
            const letter = letters.pop()

            key.className = `cell center ${letter}`
            key.innerHTML = letter
        }
    }

    window.stats()
}

window.invert = function() {
    const grid = document.getElementById('grid')
    const keys = grid.children

    let letters = []
    for (const key of keys) {
        letters.push(key.innerHTML)
    }

    letters = letters.slice(0, 30)

    for (let row=0; row < 3; row++) {
        for (let col=0; col < 10; col++) {
            const key = keys[(2-row)*10 + col]
            const letter = letters.shift()

            key.className = `cell center ${letter}`
            key.innerHTML = letter
        }
    }

    window.stats()
}

window.copy = function() {
    const matrix = document.getElementById('matrix')
    navigator.clipboard.writeText(matrix.value)
}

window.settings = function() {
    settings.open()
}

window.board = function() {
    switch (board.board) {
        case 'stagger':
            board.ortho()
            break
        case 'ortho':
            board.colstag()
            break
        case 'colstag':
            board.stagger()
            break
        }

    window.stats()

    const button = document.getElementById('boardButton')
    const fmtValue = board.board.charAt(0).toUpperCase() + board.board.slice(1)
    button.innerHTML = '<i class="fa-solid fa-keyboard"></i> ' + fmtValue
}

window.angle = function() {
    switch (board.angle) {
        case true:
            board.set_angle(false)
            break
        case false:
            board.set_angle(true)
            break
        }

    window.stats()

    const button = document.getElementById('angleButton')
    const fmtValue = board.angle ? 'Angle' : 'Standard'
    button.innerHTML = '<i class="fa-solid fa-hands"></i> ' + fmtValue
}

window.rowCondition = function() {
    switch (board.fingerCondition) {
        case 'None':
            board.set_finger_condition('SR')
            break
        case 'SR':
            board.set_finger_condition('SRAF')
            break
        case 'SRAF':
            board.set_finger_condition('None')
            break
        }

    window.stats()

    const button = document.getElementById('rowConditionButton')
    const iconMap = {
        'None': '<i class="fa-solid fa-x"></i> ',
        'SR': '<i class="fa-solid fa-grip-lines"></i> ',
        'SRAF': '<i class="fa-solid fa-plus"></i> '
    };
    const fmtIcon = iconMap[board.fingerCondition] || '';
    const fmtValue = board.fingerCondition === 'None' ? 'No SRAF' : board.fingerCondition
    button.innerHTML = fmtIcon + fmtValue
}

window.thumb = function() {
    board.set_thumb_side(board.thumb_side === 'L' ? 'R' : 'L');

    switch (board.board) {
        case 'ortho':
            board.ortho()
            break
        case 'colstag':
            board.colstag()
            break
        case 'stagger':
            board.stagger()
            break
    }

    window.stats()

    const button = document.getElementById('thumbButton')
    const thumbLayout = grid.children.length > 30;
    const thumbValue = board.thumb_side === 'L' ? 'Left' : 'Right';
    const thumbIcon = thumbLayout
        ? (board.thumb_side === 'L'
            ? '<i class="fa-solid fa-hand-point-left"></i>'
            : '<i class="fa-solid fa-hand-point-right"></i>')
        : '<i class="fa-solid fa-x"></i>';
    const thumbLabel = thumbLayout ? thumbValue : 'N/A';
    button.innerHTML = `${thumbIcon} Thumb: ${thumbLabel}`;
}

window.heatmap = function() {
    const repeatmap = document.getElementById('repeatmap')

    if (repeatmap.disabled) {
        repeatmap.removeAttribute('disabled')
    } else {
        repeatmap.setAttribute('disabled', '')
    }
}