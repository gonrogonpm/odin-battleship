import style from "./style.css";

const GameboardWidth  = 10;
const GameboardHeight = 10;

function createBoardContent() {
    const frag = document.createDocumentFragment();

    for (let y = 0; y < GameboardHeight; y++) {
        frag.appendChild(createBoardRow(y));
    }

    return frag;
}

function createBoardRow(y) {
    const div = document.createElement('div');
    div.classList.add('row');
    
    if (y == 0) {
        div.classList.add('first');
    }

    if (y == GameboardHeight - 1) {
        div.classList.add('last');
    }

    for (let x = 0; x < GameboardWidth; x++) {
        div.appendChild(createBoardCell(x, y));
    }

    return div;
}

function createBoardCell(x, y) {
    const div = document.createElement('div');
    div.classList.add('cell', `x-${x}`, `y-${y}`);
    div.dataset.x = x;
    div.dataset.y = y;
    return div;
}

function handleClick(event, board) {
    const cell = event.target.closest('.cell');
    if (!cell) {
        return;
    }

    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);

    if (isNaN(x) || x < 0 || x >= GameboardWidth) {
        console.error(`invalid cell x-coordinate, received ${x}`);
        return;
    }

    if (isNaN(y) || y < 0 || y >= GameboardHeight) { 
        console.error(`invalid cell y-coordinate, received ${y}`);
    }

    console.log(`click detected in board (${board}) at cell (${x}, ${y})`);
}

(function setup() {
    const boardLHS = document.querySelector('.display-player .board');
    const boardRHS = document.querySelector('.display-enemy .board');

    if (!boardLHS) {
        console.error('board for player 1 not found');
        return;
    }

    if (!boardRHS) {
        console.error('board for player 2 not found');
        return;
    }

    boardLHS.appendChild(createBoardContent());
    boardRHS.appendChild(createBoardContent());

    boardLHS.addEventListener('click', event => handleClick(event, 1));
    boardRHS.addEventListener('click', event => handleClick(event, 2));
})();