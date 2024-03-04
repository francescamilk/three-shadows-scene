import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

// Debugger init
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas#webgl');

// Scene
const scene = new THREE.Scene();

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1);
scene.add(hemisphereLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(2, 2, -1);
scene.add(directionalLight);

// &plug debugger
gui
    .add(ambientLight, 'intensity')
    .min(0).max(4).step(0.001)
    .name('ambient light intensity');

gui
    .add(hemisphereLight, 'intensity')
    .min(0).max(4).step(0.001)
    .name('hemisphere light intensity');

gui
    .add(directionalLight, 'intensity')
    .min(0).max(4).step(0.001)    
    .name('directional lights intensity');

gui
    .add(directionalLight.position, 'x')
    .min(- 5).max(5).step(0.001)
    .name('directional lights x');

gui
    .add(directionalLight.position, 'y')
    .min(- 5).max(5).step(0.001)
    .name('directional lights y');

gui
    .add(directionalLight.position, 'z')
    .min(- 5).max(5).step(0.001)
    .name('directional lights z');

// Materials
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;
material.metalness = 0.2;

// &plug debugger
gui
    .add(material, 'metalness')
    .min(0).max(1).step(0.001)
    .name('material metalness');

gui
    .add(material, 'roughness')
    .min(0).max(1).step(0.001)
    .name('material roughness');

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
);

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

scene.add(sphere, plane);

// Shadows
sphere.castShadow   = true;
plane.receiveShadow = true;

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width  = 1024;
directionalLight.shadow.mapSize.height = 1024;

// Window
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    // update sizes
    sizes.width  = window.innerWidth;
    sizes.height = window.innerHeight;

    // update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// activate shadow maps
renderer.shadowMap.enabled = true;

// Animate
// const clock    = new THREE.Clock();
const animLoop = () =>
{
    // const elapsedTime = clock.getElapsedTime();
    // enable damping
    controls.update();

    // call again on the next frame
    renderer.render(scene, camera);
    window.requestAnimationFrame(animLoop);
}

animLoop();