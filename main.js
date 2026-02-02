// ==========================
// SCENE SETUP
// ==========================
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 10, 80);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ==========================
// LIGHTS
// ==========================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// ==========================
// ROAD
// ==========================
const roadGeometry = new THREE.PlaneGeometry(10, 200);
const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2;
road.position.z = -80;
scene.add(road);

// ==========================
// PLAYER (Girl)
// ==========================
const girl = new THREE.Mesh(
  new THREE.BoxGeometry(0.8, 1.5, 0.8),
  new THREE.MeshStandardMaterial({ color: 0xff69b4 })
);
girl.position.set(0, 0.75, 2);
scene.add(girl);

// ==========================
// ROBO BOY (Always loses)
// ==========================
const robo = new THREE.Mesh(
  new THREE.BoxGeometry(0.8, 1.5, 0.8),
  new THREE.MeshStandardMaterial({ color: 0x00ffff })
);
robo.position.set(1.2, 0.75, 4);
scene.add(robo);

// ==========================
// CITY BUILDINGS
// ==========================
for (let i = 0; i < 40; i++) {
  const building = new THREE.Mesh(
    new THREE.BoxGeometry(
      Math.random() + 1,
      Math.random() * 6 + 2,
      Math.random() + 1
    ),
    new THREE.MeshStandardMaterial({ color: 0x555555 })
  );
  building.position.set(
    Math.random() > 0.5 ? 6 : -6,
    building.geometry.parameters.height / 2,
    -i * 10
  );
  scene.add(building);
}

// ==========================
// COINS
// ==========================
let coins = [];
let score = 0;

function spawnCoin() {
  const coin = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.12, 16, 32),
    new THREE.MeshStandardMaterial({ color: 0xffd700 })
  );
  coin.rotation.x = Math.PI / 2;
  coin.position.set((Math.random() - 0.5) * 6, 1, -60);
  scene.add(coin);
  coins.push(coin);
}

// ==========================
// CONTROLS
// ==========================
const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// ==========================
// CAMERA
// ==========================
camera.position.set(0, 5, 8);
camera.lookAt(0, 0, -20);

// ==========================
// ANIMATION LOOP
// ==========================
function animate() {
  requestAnimationFrame(animate);

  // Player movement
  if (keys["ArrowLeft"]) girl.position.x -= 0.08;
  if (keys["ArrowRight"]) girl.position.x += 0.08;

  girl.position.x = THREE.MathUtils.clamp(girl.position.x, -3, 3);

  // Robo boy always slower
  robo.position.x += (girl.position.x - robo.position.x) * 0.02;
  robo.position.z = girl.position.z + 2;

  // Move world forward
  scene.children.forEach(obj => {
    if (obj !== girl && obj !== robo) {
      obj.position.z += 0.3;
      if (obj.position.z > 10) obj.position.z -= 200;
    }
  });

  // Coins
  if (Math.random() < 0.03) spawnCoin();

  coins.forEach((coin, i) => {
    coin.position.z += 0.3;
    coin.rotation.y += 0.1;

    if (coin.position.distanceTo(girl.position) < 1) {
      score++;
      document.getElementById("score").textContent = score;
      scene.remove(coin);
      coins.splice(i, 1);
    }
  });

  renderer.render(scene, camera);
}

animate();

// ==========================
// RESIZE
// ==========================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
