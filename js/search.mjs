import * as board from './board.mjs'
import {LAYOUTS} from './layouts.mjs'
import {ANGLES} from './angles.mjs'

export function init() {
    const input = document.getElementById('search')
    input.addEventListener("input", change)
    input.addEventListener("focusout", unfocus)

    // Add listener for Ctrl+F / Cmd+F to use custom search
    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
            event.preventDefault();
            input.focus();
            input.select();
        }
    })
}

function unfocus() {
    const complete = document.getElementById('complete')
    complete.style.display = 'none'
}

function change() {
    let stored = {}
    if ('layouts' in localStorage) {
        stored = JSON.parse(localStorage.layouts)
    }

    for (const name in stored) {
        LAYOUTS[name] = stored[name]
    }

    const input = document.getElementById('search')
    const layout = input.value.toLowerCase()

    const complete = document.getElementById('complete')

    let completion = ''
    for (const key in LAYOUTS) {
        if (layout === '') {
            break
        }

        if (key === layout) {
            continue
        }

        if (key.startsWith(layout)) {
            completion = key.slice(layout.length, key.length)
            break
        }
    }

    complete.innerHTML = (
        ' '.repeat(completion.length) +
        ' '.repeat(input.value.length) +
        completion
    )

    complete.style.display = 'flex'

    if (!(layout in LAYOUTS)) {
        return
    }

    const matrix = LAYOUTS[layout]
    const angle_bool = ANGLES.includes(layout)

    board.set_angle(angle_bool)
    board.update(matrix)

    // Bandaid fix since some settings reset on new layout
    document.getElementById('angleButton').innerHTML = '<i class="fa-solid fa-hands"></i> ' + (board.angle ? 'Angle' : 'Standard')

    document.getElementById('boardButton').innerHTML = '<i class="fa-solid fa-keyboard"></i> ' + board.board.charAt(0).toUpperCase() + board.board.slice(1)
    switch (board.board) {
        case 'stagger':
            board.stagger()
            break
        case 'ortho':
            board.ortho()
            break
        case 'colstag':
            board.colstag()
            break
        }

    const thumbLayout = grid.children.length > 30;
    const thumbValue = board.thumb_side === 'L' ? 'Left' : 'Right';
    const thumbIcon = thumbLayout
        ? (board.thumb_side === 'L'
            ? '<i class="fa-solid fa-hand-point-left"></i>'
            : '<i class="fa-solid fa-hand-point-right"></i>')
        : '<i class="fa-solid fa-x"></i>';
    const thumbLabel = thumbLayout ? thumbValue : 'N/A';
    document.getElementById('thumbButton').innerHTML = `${thumbIcon} Thumb: ${thumbLabel}`;

    board.set_finger_condition(board.fingerCondition)
    const iconMap = {
        'None': '<i class="fa-solid fa-x"></i> ',
        'SR': '<i class="fa-solid fa-grip-lines"></i> ',
        'SRAF': '<i class="fa-solid fa-plus"></i> '
    };
    document.getElementById('rowConditionButton').innerHTML = iconMap[board.fingerCondition] + (board.fingerCondition === 'None' ? 'No SRAF' : board.fingerCondition)
}