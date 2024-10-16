let board = [];
const gridSize = 3;
let isPlaying = false;
let autoPlayInterval;

document.addEventListener('DOMContentLoaded', () => {
    const nextGenBtn = document.getElementById('nextGen');
    const autoPlayBtn = document.getElementById('autoPlay');

    nextGenBtn.addEventListener('click', nextGeneration);
    autoPlayBtn.addEventListener('click', toggleAutoPlay);

    createBoard();
});

function createBoard() {
    board = Array(gridSize).fill().map(() => 
        Array(gridSize).fill().map(() => 
            Array(gridSize).fill(0)
        )
    );
    renderBoard();
}

function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    
    for (let l = 0; l < gridSize; l++) {
        const layer = document.createElement('div');
        layer.classList.add('layer');
        
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                if (board[l][i][j] === 1) {
                    cell.classList.add('alive');
                }
                cell.addEventListener('click', () => toggleCell(l, i, j));
                layer.appendChild(cell);
            }
            layer.appendChild(document.createElement('br'));
        }
        boardElement.appendChild(layer);
    }
}

function toggleCell(layer, row, col) {
    board[layer][row][col] = 1 - board[layer][row][col];
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
