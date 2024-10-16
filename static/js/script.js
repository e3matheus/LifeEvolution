let board = [];
let isPlaying = false;
let autoPlayInterval;

document.addEventListener('DOMContentLoaded', () => {
    const nextGenBtn = document.getElementById('nextGen');
    const autoPlayBtn = document.getElementById('autoPlay');
    const resetBtn = document.getElementById('reset');
    const saveConfigBtn = document.getElementById('saveConfig');

    nextGenBtn.addEventListener('click', nextGeneration);
    autoPlayBtn.addEventListener('click', toggleAutoPlay);
    resetBtn.addEventListener('click', resetBoard);
    saveConfigBtn.addEventListener('click', saveConfiguration);

    createBoard();
});

function createBoard() {
    if (initialBoard) {
        board = initialBoard;
    } else {
        board = Array(gridSize).fill().map(() => 
            Array(gridSize).fill().map(() => 
                Array(gridSize).fill(0)
            )
        );
    }
    updateVisualization();
}

function updateVisualization() {
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            for (let z = 0; z < gridSize; z++) {
                updateCube(x, y, z, board[x][y][z] === 1);
            }
        }
    }
}

function toggleCell(x, y, z) {
    board[x][y][z] = 1 - board[x][y][z];
    updateVisualization();
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
        updateVisualization();
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

function resetBoard() {
    createBoard();
    resetCubes();
}

function initializeClickListener(renderer) {
    if (renderer && renderer.domElement) {
        renderer.domElement.addEventListener('click', onCubeClick, false);
    }
}

function setThreeJSObjects(rendererObj, cameraObj, sceneObj) {
    initializeClickListener(rendererObj);
}

function saveConfiguration() {
    fetch('/save_configuration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ board: board }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Configuration saved successfully!');
    });
}
