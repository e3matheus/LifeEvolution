let scene, camera, renderer, cube;
const gridSize = 3;
const cubeSize = 1;
const spacing = 1.2;

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('board').appendChild(renderer.domElement);

    // Create a 3x3x3 grid of cubes
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            for (let z = 0; z < gridSize; z++) {
                const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(
                    (x - (gridSize - 1) / 2) * spacing,
                    (y - (gridSize - 1) / 2) * spacing,
                    (z - (gridSize - 1) / 2) * spacing
                );
                scene.add(cube);
            }
        }
    }

    camera.position.z = 5;

    // Add orbit controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function updateCube(x, y, z, isAlive) {
    const index = x * gridSize * gridSize + y * gridSize + z;
    const cube = scene.children[index];
    cube.material.wireframe = !isAlive;
    cube.material.color.setHex(isAlive ? 0x00ff00 : 0xffffff);
}

function resetCubes() {
    scene.children.forEach(cube => {
        cube.material.wireframe = true;
        cube.material.color.setHex(0x00ff00);
    });
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener('DOMContentLoaded', initThreeJS);
