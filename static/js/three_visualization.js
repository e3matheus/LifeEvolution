let scene, camera, renderer, controls;
const gridSize = 3;
const cubeSize = 1;
const spacing = 1.2;

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('board').appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create a 3x3x3 grid of cubes
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            for (let z = 0; z < gridSize; z++) {
                const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                const material = new THREE.MeshPhongMaterial({ color: 0x00ff00, wireframe: true });
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(
                    (x - (gridSize - 1) / 2) * spacing,
                    (y - (gridSize - 1) / 2) * spacing,
                    (z - (gridSize - 1) / 2) * spacing
                );
                cube.userData.originalColor = cube.material.color.getHex();
                scene.add(cube);
            }
        }
    }

    // Adjust camera position for a better view
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    // Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    renderer.domElement.addEventListener('mousemove', onMouseMove, false);

    animate();

    // Call the function to set Three.js objects in script.js
    if (typeof setThreeJSObjects === 'function') {
        setThreeJSObjects(renderer, camera, scene);
    }
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function updateCube(x, y, z, isAlive) {
    const index = x * gridSize * gridSize + y * gridSize + z;
    const cube = scene.children[index + 2]; // +2 to account for the lights
    cube.material.color.setHex(isAlive ? 0x00ff00 : 0xffffff);
    cube.material.wireframe = !isAlive;
    cube.userData.originalColor = cube.material.color.getHex();
}

function resetCubes() {
    scene.children.slice(2).forEach(cube => {
        cube.material.wireframe = true;
        cube.material.color.setHex(0x00ff00);
        cube.userData.originalColor = 0x00ff00;
    });
}

function onCubeHover(event) {
    event.object.material.color.setHex(0xff0000);
}

function onCubeHoverOut(event) {
    event.object.material.color.setHex(event.object.userData.originalColor);
}

function onMouseMove(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        if (intersects[0].object.userData.isHovered) return;
        intersects[0].object.userData.isHovered = true;
        onCubeHover(intersects[0]);
    }
    scene.children.forEach(child => {
        if (child.userData.isHovered && !intersects.find(i => i.object === child)) {
            child.userData.isHovered = false;
            onCubeHoverOut({object: child});
        }
    });
}

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
        const index = scene.children.indexOf(clickedCube) - 2; // Subtract 2 to account for lights
        const x = Math.floor(index / (gridSize * gridSize));
        const y = Math.floor((index % (gridSize * gridSize)) / gridSize);
        const z = index % gridSize;
        toggleCell(x, y, z);
    }
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener('DOMContentLoaded', initThreeJS);
