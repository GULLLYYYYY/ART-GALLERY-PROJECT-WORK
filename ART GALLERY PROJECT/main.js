console.log('Three Object', THREE);
import * as THREE from 'three'
import { PointerLockControls } from 'three-stdlib';
const scene = new THREE.Scene(); // create a new scene

// Create a camera, which defines where we're looking at.
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1, // near clipping plane
  1000 // far clipping plane
);
scene.add(camera); // add the camera to the scene
camera.position.z = 5; // move camera back 5 units

// Create a render and set the size and background color
const renderer = new THREE.WebGLRenderer({ antialias: false }); // antialias means smooth edges
renderer.setSize(window.innerWidth, window.innerHeight); // set size of renderer
renderer.setClearColor(0xffffff, 1); //background color
document.body.appendChild(renderer.domElement); // add renderer to html

// Ambient light is a soft light that lights up all the objects in the scene equally
const ambientLight = new THREE.AmbientLight(0xdddddd, 1.0); // color, intensity, distance, decay
ambientLight.position.set(camera.position.x, camera.position.y, camera.position.z);
scene.add(ambientLight);
// ambientLight.position = camera.position; //light follows camera
// scene.add(ambientLight);

// Directional light is a light source that acts like the sun, that illuminates all objects in the scene equally from a specific direction.
const sunLight = new THREE.DirectionalLight(0xdddddd, 1.0); // color, intensity, distance, decay
sunLight.position.y = 15;
scene.add(sunLight);

const geometry = new THREE.BoxGeometry(1, 1, 1); // BoxGeometry is the shape of the object
const material = new THREE.MeshBasicMaterial({ color: 'blue' }); // MeshBasicMaterial is the color of the object
const cube = new THREE.Mesh(geometry, material); // create cube with geometry and material
scene.add(cube); // add cube to scene


//Texture of the floor
const floorTexture = new THREE.TextureLoader().load('https://media.githubusercontent.com/media/GULLLYYYYY/ART-GALLERY-PROJECT-WORK/main/ART%20GALLERY%20PROJECT/public/img/Floor%201.jpg')
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(10,10);

//create floor plane.
const planeGeometry = new THREE.PlaneBufferGeometry(50, 50); //box geometery is the shape of the object
const planeMaterial = new THREE.MeshBasicMaterial({
  map: floorTexture,
  side: THREE.DoubleSide, 
});
const floorPlane = new THREE.Mesh(planeGeometry, planeMaterial);
floorPlane.rotation.x = Math.PI / 2; //90 degrees
floorPlane.position.y = -Math.PI; //-180 degrees
scene.add(floorPlane);


//create walls
let wallGroup = new THREE.Group();
scene.add(wallGroup);


//frontwall texture
const frontWallTexture = new THREE.TextureLoader().load('https://media.githubusercontent.com/media/GULLLYYYYY/ART-GALLERY-PROJECT-WORK/main/ART%20GALLERY%20PROJECT/public/img/annie-spratt-6a3nqQ1YwBw-unsplash.jpg')
frontWallTexture.wrapS = THREE.RepeatWrapping;
frontWallTexture.wrapT = THREE.RepeatWrapping;
frontWallTexture.repeat.set(3,1);

//frontwall
const frontWall = new THREE.Mesh(
  new THREE.BoxGeometry(50, 20, 0.001),
  new THREE.MeshLambertMaterial({ 
    map: frontWallTexture,
    side: THREE.DoubleSide
   })
);

frontWall.position.z = -25


//backwall
const backWall = new THREE.Mesh(
  new THREE.BoxGeometry(50, 20, 0.001),
  new THREE.MeshLambertMaterial({ 
    map: frontWallTexture,
    side: THREE.DoubleSide
   })
);

backWall.position.z = 23


//left wall
const leftWall = new THREE.Mesh(
  new THREE.BoxGeometry(50, 20, 0.001),
  new THREE.MeshLambertMaterial({ 
    map: frontWallTexture,
    side: THREE.DoubleSide
   })
);

leftWall.rotation.y = Math.PI / 2;
leftWall.position.x = -20;


//right wall
const rightWall = new THREE.Mesh(
  new THREE.BoxGeometry(50, 20, 0.001),
  new THREE.MeshLambertMaterial({ 
    map: frontWallTexture,
    side: THREE.DoubleSide
   })
);

rightWall.rotation.y = Math.PI / 2;
rightWall.position.x = 20;

wallGroup.add(frontWall, backWall, leftWall, rightWall);

//loop through the walls and create a bounding box to ensure that you cannot move through the walls
for (let i = 0; i < wallGroup.children.length; i++) {
  wallGroup.children[i].BoundingBox = new THREE.Box3();
  wallGroup.children[i].BoundingBox.setFromObject(wallGroup.children[i]);
}

function checkCollision() {
  const playerBoundingBox = new THREE.Box3(); // create a bounding box for the player.
  const cameraWorldPosition = new THREE.Vector3(); //vector used to hold the cameras position
  camera.getWorldPosition(cameraWorldPosition); //gets the cameras position and stores it in the above vector to represent the "players" position
  playerBoundingBox.setFromCenterAndSize(
    cameraWorldPosition,
    new THREE.Vector3(1, 1, 1)
  );

  for (let i = 0; i < wallGroup.children.length; i++) {
    const wall = wallGroup.children[i];
    if (playerBoundingBox.intersectsBox(wall.BoundingBox)) {
      return true;
    }
  }

  return false;
}




//ceiling texture
const ceilingTexture = new THREE.TextureLoader().load('https://media.githubusercontent.com/media/GULLLYYYYY/ART-GALLERY-PROJECT-WORK/main/ART%20GALLERY%20PROJECT/public/img/360_F_356921564_y3kjX7ce4GlEWR7vCuybqmUq6iP6jWxY.jpg')
ceilingTexture.wrapS = THREE.RepeatWrapping;
ceilingTexture.wrapT = THREE.RepeatWrapping;
ceilingTexture.repeat.set(3.5,3.5);

//creating ceiling 
const ceilingGeometry = new THREE.PlaneBufferGeometry(50, 50);
const ceilingMaterial = new THREE.MeshLambertMaterial({ 
  map: ceilingTexture,
    side: THREE.DoubleSide
 });
const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);

ceilingPlane.rotation.x = Math.PI / 2;
ceilingPlane.position.y = 10;

scene.add(ceilingPlane);



function createPainting(imageURL, width, height, position) {
  const textureLoader = new THREE.TextureLoader();
  const paintingTexture = textureLoader.load(imageURL);
  const paintingMaterial = new THREE.MeshBasicMaterial({
    map: paintingTexture,
  });
  const paintingGeometry = new THREE.PlaneGeometry(width, height);
  const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
  painting.position.set(position.x, position.y, position.z);
  return painting; 
}

const painting1 = createPainting(
  'https://raw.githubusercontent.com/GULLLYYYYY/Art-Gallery-Three.js/main/Images/12.-Son-of-Man.jpg',
  10,
  5,
  new THREE.Vector3(-10, 5, -18)
);

const painting2 = createPainting(
  'https://raw.githubusercontent.com/GULLLYYYYY/Art-Gallery-Three.js/main/Images/Rene%20Magritte.jpg',
  10,
  5,
  new THREE.Vector3(-10, 5, -20)
);

scene.add(painting1, painting2);


////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//you ended here, you have to go over to git hub and push the new shit, Especially the paintings you will use, 
//after that you just have to continue working.
//46:46 is the timestamp on the vid!!!!!!!!!!!!!!



// Controls

const controls = new PointerLockControls(camera, document.body);

function StartExperience() {
  controls.lock();

  hideMenu();
}

const playButton = document.getElementById('play_button');
playButton.addEventListener('click', StartExperience);

function hideMenu() {
  const menu = document.getElementById('menu')
  menu.style.display = 'none';
}

function showMenu() {
  const menu = document.getElementById('menu')
  menu.style.display = 'block';
}

controls.addEventListener('unlock', showMenu);


//movement
const keysPressed = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false, 
};

// // Event Listenet for when we press the keys
document.addEventListener('keydown',
 (event) => {
  if (event.key in keysPressed) {
    //check if the key pressed is withing the KeysPressed object
    keysPressed[event.key] = true; //if it is one of the assigned movement key, it returns true and now will execute the assigned value and direction to make the player move.
  }
 },
 false
);

document.addEventListener('keyup',
 (event) => {
  if (event.key in keysPressed) {
    //check if the key released is withing the KeysPressed object
    keysPressed[event.key] = false; //if it is released, the value is set to false (essentially setting the movement to static)
  }
 },
 false
);

const clock = new THREE.Clock();

function updateMovement(delta) {
  const moveSpeed = 7 * delta;
  const previousPosition = camera.position.clone();

  if (keysPressed.ArrowRight || keysPressed.d) {
    controls.moveRight(moveSpeed);
  }
  if (keysPressed.ArrowLeft || keysPressed.a) {
    controls.moveRight(-moveSpeed);
  }
  if (keysPressed.ArrowUp || keysPressed.w) {
    controls.moveForward(moveSpeed);
  }
  if (keysPressed.ArrowDown || keysPressed.s) {
    controls.moveForward(-moveSpeed);
  }
  
  if (checkCollision()) {
    camera.position.copy(previousPosition);
  }
}













// // function when a key is pressed, execute this function
// function onKeyDown(event) {
//   let keycode = event.which;

//   // right arrow key
//   if (keycode === 39 || keycode === 68) {
//     controls.moveRight(0.3);
//   }
//   // left arrow key
//   else if (keycode === 37 || keycode === 65) {
//     controls.moveRight(-0.3);
//   }
//   // up arrow key
//   else if (keycode === 38 || keycode === 87) {
//     controls.moveForward(0.3);
//   }
//   // down arrow key
//   else if (keycode === 40 || keycode === 83) {
//     controls.moveForward(-0.3);
//   }
// }

let render = function () {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  const delta = clock.getDelta();//get the time between frames, making it more accessible across all kinds of laptops etc, with different refresh rates.
  updateMovement(delta);//update the movement with the time between frames.
  renderer.render(scene, camera); //renders the scene
  requestAnimationFrame(render);
};

render();