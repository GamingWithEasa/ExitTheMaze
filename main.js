// Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas") });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new THREE.PointerLockControls(camera, document.body);

document.body.addEventListener('click', () => {
  controls.lock();
});

scene.add(controls.getObject());

// Maze generation (simple fixed layout)
const wallSize = 5;
const maze = [
  [1,1,1,1,1],
  [1,0,0,0,1],
  [1,0,1,0,1],
  [1,0,1,0,0],
  [1,1,1,1,1]
];

// Wall material
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x4444ff });

for (let z = 0; z < maze.length; z++) {
  for (let x = 0; x < maze[z].length; x++) {
    if (maze[z][x] === 1) {
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(wallSize, wallSize, wallSize),
        wallMaterial
      );
      wall.position.set(x * wallSize, wallSize / 2, z * wallSize);
      scene.add(wall);
    }
  }
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(maze[0].length * wallSize, maze.length * wallSize),
  new THREE.MeshBasicMaterial({ color: 0x222222 })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// End goal
const goal = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
goal.position.set((4 * wallSize), 1.5, (3 * wallSize));
scene.add(goal);

// Movement
let velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const speed = 0.1;

const keys = {};
document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

function animate() {
  requestAnimationFrame(animate);

  direction.z = Number(keys['KeyW']) - Number(keys['KeyS']);
  direction.x = Number(keys['KeyD']) - Number(keys['KeyA']);
  direction.normalize();

  velocity.x = direction.x * speed;
  velocity.z = direction.z * speed;

  controls.moveRight(velocity.x);
  controls.moveForward(velocity.z);

  // Check win condition
  if (camera.position.distanceTo(goal.position) < 3) {
    alert("You escaped the maze!");
    location.reload();
  }

  renderer.render(scene, camera);
}

animate();
