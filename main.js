import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

var renderer, scene, camera, control, torus, corgi, moon, mars, star;
/* SET UP INITIAL CANVAS */
function setUpCanvas() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( // mimicking human eyeballs POV
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
  }); // render graphic to the scene

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setZ(-100);
  renderer.render(scene, camera);
}
setUpCanvas();

/* Ring Shape */
function addRingShape() {
  const geometry = new THREE.TorusGeometry(10, 1.2, 16, 100); // a ring
  // const material = new THREE.MeshStandardMaterial({ color: 0xffb703 }); // Standard material reacts to light bouncing off (vs Basic)
  const asteroid = new THREE.TextureLoader().load("./img/asteroid.jpeg");
  const asteroidNormalTexture = new THREE.TextureLoader().load(
    "./img/asteroidNormal.jpeg"
  );
  const material = new THREE.MeshStandardMaterial({
    map: asteroid,
    normalMap: asteroidNormalTexture, // add bumpy texture, more realistic
  });
  torus = new THREE.Mesh(geometry, material);
  scene.add(torus);
  torus.position.setZ(-32);
  torus.position.setX(25);
  torus.position.setY(5);
}
addRingShape();

/* Avatar */
function addAvatar() {
  const corgiTexture = new THREE.TextureLoader().load("./img/corgi2.png");
  corgi = new THREE.Mesh(
    new THREE.BoxGeometry(6, 6, 6),
    new THREE.MeshBasicMaterial({ map: corgiTexture })
  );
  scene.add(corgi);
  corgi.position.setZ(-32);
  corgi.position.setX(25);
  corgi.position.setY(5);
}
addAvatar();

/* Lighting */
function addLighting() {
  const pointLight = new THREE.PointLight(0xffffff); // emit light in all directions - accent light
  pointLight.position.set(5, 5, 5); // bigger numbers moving light further away

  const ambientLight = new THREE.AmbientLight(0xffffff); // light up the whole scene
  scene.add(pointLight, ambientLight);
}
addLighting();

function addHelper() {
  const lightHelper = new THREE.PointLightHelper(pointLight);
  const gridHelper = new THREE.GridHelper(200, 50);
  scene.add(lightHelper, gridHelper);
}
// addHelper();

function addOrbitControl() {
  control = new OrbitControls(camera, renderer.domElement);
  control.enableDamping = true;
}
// addOrbitControl();

/* add star at random position */
function addStar() {
  const geometry = new THREE.OctahedronGeometry(0.25, 0);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  star = new THREE.Mesh(geometry, material);

  /* randomly positioned on the screen */
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);

/* Background */
function addBackground() {
  const spaceTexture = new THREE.TextureLoader().load("./img/space.jpg");
  scene.background = spaceTexture;
}
addBackground();

/* MOON */
function addMoon() {
  const moonTexture = new THREE.TextureLoader().load("./img/moon.jpg");
  const normalTexture = new THREE.TextureLoader().load("./img/normal.jpg");

  moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({
      map: moonTexture,
      normalMap: normalTexture, // add bumpy texture, more realistic
    })
  );
  scene.add(moon);

  moon.position.z = 23;
  moon.position.setX(-7); // same as assigning
}
addMoon();

/* MARS */
function addMars() {
  const marsTexture = new THREE.TextureLoader().load("./img/mars.jpeg");
  const marsNormalTexture = new THREE.TextureLoader().load(
    "./img/marsNormal.jpeg"
  );

  mars = new THREE.Mesh(
    new THREE.SphereGeometry(3, 28, 28),
    new THREE.MeshStandardMaterial({
      map: marsTexture,
      normalMap: marsNormalTexture, // add bumpy texture, more realistic
    })
  );
  scene.add(mars);

  mars.position.z = -25;
  mars.position.x = -10;
  mars.position.y = -10;
}
addMars();

function moveCamera() {
  // get where the client scroll to
  const t = document.body.getBoundingClientRect().top;

  // moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  corgi.rotation.y += 0.01;
  corgi.rotation.z += 0.01;

  // mars.rotation.x += 0.05;
  mars.rotation.y += 0.075;
  mars.rotation.z += 0.05;

  // update camera position according to scroll
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}
document.body.onscroll = moveCamera;
moveCamera();

/* Handle Resize */
window.addEventListener("resize", () => {
  // update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* Game Loop: recursive function to animate in order to not call .render() repeatedly
 * whenever browser re-paint the screen, render method is called
 **/
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.005;
  torus.rotation.y += 0.001;
  torus.rotation.z += 0.005;

  corgi.rotation.x += 0.005;

  moon.rotation.x += 0.005;

  mars.rotation.x += 0.005;

  // control.update();

  renderer.render(scene, camera);
}
animate();
