let board = [];
const gridSize = 3;
let isPlaying = false;
let autoPlayInterval;

document.addEventListener('DOMContentLoaded', () => {
    const nextGenBtn = document.getElementById('nextGen');
    const autoPlayBtn = document.getElementById('autoPlay');
    const resetBtn = document.getElementById('reset');

    nextGenBtn.addEventListener('click', nextGeneration);
    autoPlayBtn.addEventListener('click', toggleAutoPlay);
    resetBtn.addEventListener('click', resetBoard);

    createBoard();
});

function createBoard() {
    board = Array(gridSize).fill().map(() => 
        Array(gridSize).fill().map(() => 
            Array(gridSize).fill(0)
        )
    );
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

// Add event listener for cube clicks
renderer.domElement.addEventListener('click', onCubeClick, false);

function onCubeClick(event) {
    event.preventDefault();

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const clickedCube = intersects[0].object;
        const index = scene.children.indexOf(clickedCube);
        const x = Math.floor(index / (gridSize * gridSize));
        const y = Math.floor((index % (gridSize * gridSize)) / gridSize);
        const z = index % gridSize;

        toggleCell(x, y, z);
    }
}
