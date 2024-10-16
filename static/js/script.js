let board = [];
let boardSize = 20;
let isPlaying = false;
let autoPlayInterval;

document.addEventListener('DOMContentLoaded', () => {
    const createBoardBtn = document.getElementById('createBoard');
    const nextGenBtn = document.getElementById('nextGen');
    const autoPlayBtn = document.getElementById('autoPlay');
    const boardSizeInput = document.getElementById('boardSize');

    createBoardBtn.addEventListener('click', createBoard);
    nextGenBtn.addEventListener('click', nextGeneration);
    autoPlayBtn.addEventListener('click', toggleAutoPlay);
    boardSizeInput.addEventListener('change', () => {
        boardSize = parseInt(boardSizeInput.value);
    });

    createBoard();
});

function createBoard() {
    board = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
    renderBoard();
}

function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (board[i][j] === 1) {
                cell.classList.add('alive');
            }
            cell.addEventListener('click', () => toggleCell(i, j));
            boardElement.appendChild(cell);
        }
        boardElement.appendChild(document.createElement('br'));
    }
}

function toggleCell(row, col) {
    board[row][col] = 1 - board[row][col];
    renderBoard();
}

function nextGeneration() {
    fetch('/next_generation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ board: board }),
    })
    .then(response => response.json())
    .then(data => {
        board = data.board;
        renderBoard();
    });
}

function toggleAutoPlay() {
    const autoPlayBtn = document.getElementById('autoPlay');
    if (isPlaying) {
        clearInterval(autoPlayInterval);
        autoPlayBtn.textContent = 'Auto Play';
        autoPlayBtn.classList.remove('btn-danger');
        autoPlayBtn.classList.add('btn-info');
    } else {
        autoPlayInterval = setInterval(nextGeneration, 500);
        autoPlayBtn.textContent = 'Stop';
        autoPlayBtn.classList.remove('btn-info');
        autoPlayBtn.classList.add('btn-danger');
    }
    isPlaying = !isPlaying;
}
