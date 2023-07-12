console.log('Three Object', THREE);
import * as THREE from 'three'
import { PointerLockControls } from 'three-stdlib';
const scene = new THREE.Scene(); // create a new scene
// var mouse, raycaster;
// var paintings = createPainting;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

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




////////////////////////////////
//adding paintings to the scene
function createPainting(imageURL, width, height, position, description) {
  const textureLoader = new THREE.TextureLoader();
  const paintingTexture = textureLoader.load(imageURL);
  const paintingMaterial = new THREE.MeshBasicMaterial({
    map: paintingTexture,
  });
  const paintingGeometry = new THREE.PlaneGeometry(width, height);
  const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
  painting.position.set(position.x, position.y, position.z);


//Add description to painting's userData
painting.userData = {
  description: description
};
  return painting; 
}

//front wall paintings (rene magritte)
const painting1 = createPainting(
  'https://media.githubusercontent.com/media/GULLLYYYYY/ART-GALLERY-PROJECT-WORK/main/ART%20GALLERY%20PROJECT/public/img/Picture2.jpg',
  7,
  5,
  new THREE.Vector3(0, 3, -24.99),
  'This is the description for Painting 1.'
);

const painting2 = createPainting(
  'https://media.githubusercontent.com/media/GULLLYYYYY/ART-GALLERY-PROJECT-WORK/main/ART%20GALLERY%20PROJECT/public/img/056.jpg',
  7,
  5,
  new THREE.Vector3(11, 3, -24.99),
  'This is the description for Painting 2.'
);

const painting3 = createPainting(
  'https://media.githubusercontent.com/media/GULLLYYYYY/ART-GALLERY-PROJECT-WORK/main/ART%20GALLERY%20PROJECT/public/img/Summer2022_web-images_26_27_Caravaggio.jpg',
  7,
  5,
  new THREE.Vector3(-11, 3, -24.99),
  'This is the description for Painting 3.'
);






//left wall paintings (Edward Hopper)

//left wall painting (center)
const painting4 = createPainting(
  'https://media.githubusercontent.com/media/GULLLYYYYY/ART-GALLERY-PROJECT-WORK/main/ART%20GALLERY%20PROJECT/public/img/Nighthawks_by_Edward_Hopper_1942.jpg',
  8,
  5,
  new THREE.Vector3(-19.99, 3, -1),
  'This is the description for Painting 4.'
);
painting4.rotation.y = Math.PI / 2;

//left wall painting (left)
const painting11 = createPainting(
  'https://media.githubusercontent.com/media/GULLLYYYYY/ART-GALLERY-PROJECT-WORK/main/ART%20GALLERY%20PROJECT/public/img/large_70_1208_Hopper_Soir_Bleu.jpg',
  8,
  5,
  new THREE.Vector3(-19.99, 3, -14),
  'This is the description for Painting 5.'
);
painting11.rotation.y = Math.PI / 2;

//left wall painting (left)
const painting12 = createPainting(
  'https://media.githubusercontent.com/media/GULLLYYYYY/ART-GALLERY-PROJECT-WORK/main/ART%20GALLERY%20PROJECT/public/img/Picture3.jpg',
  8,
  5,
  new THREE.Vector3(-19.99, 3, 14),
  'This is the description for Painting 6.'
);
painting12.rotation.y = Math.PI / 2;





//rightwall paintings (Cabanel)

//right wall (center)
const painting5 = createPainting(
  'https://media.githubusercontent.com/media/GULLLYYYYY/ART-GALLERY-PROJECT-WORK/main/ART%20GALLERY%20PROJECT/public/img/Alexandre_Cabanel_Ph%C3%A8dre.jpg',
  8,
  5,
  new THREE.Vector3(19.99, 3, -1),
  'This is the description for Painting 7.'
);
painting5.rotation.y = -Math.PI / 2;

//right wall (left)
const painting9 = createPainting(
  'https://media.githubusercontent.com/media/GULLLYYYYY/ART-GALLERY-PROJECT-WORK/main/ART%20GALLERY%20PROJECT/public/img/alexandre-cabanel-obelisk-art-history.jpg',
  8,
  5,
  new THREE.Vector3(19.99, 3, -14),
  'This is the description for Painting 8.'
);
painting9.rotation.y = -Math.PI / 2;

//right wall (right)
const painting10 = createPainting(
  'https://media.githubusercontent.com/media/GULLLYYYYY/ART-GALLERY-PROJECT-WORK/main/ART%20GALLERY%20PROJECT/public/img/the-fallen-angel-alexandre-cabanel.jpg',
  8,
  5,
  new THREE.Vector3(19.99, 3, 14),
  'This is the description for Painting 9.'
);
painting10.rotation.y = -Math.PI / 2;




//back wall paintings(Caravaggio)

//painting on the back wall (left)
const painting6 = createPainting(
  'https://raw.githubusercontent.com/GULLLYYYYY/Art-Gallery-Three.js/main/Images/Rene%20Magritte.jpg',
  8,
  5,
  new THREE.Vector3(-11, 3, 22.99),
  'This is the description for Painting 10.'
);
painting6.rotation.y = Math.PI;

//painting on the back wall (right)
const painting7 = createPainting(
  'https://media.githubusercontent.com/media/GULLLYYYYY/ART-GALLERY-PROJECT-WORK/main/ART%20GALLERY%20PROJECT/public/img/tokyo-rene-magritte-exhibition-114438.jpg',
  8,
  5,
  new THREE.Vector3(11, 3, 22.99),
  'This is the description for Painting 11.'
);
painting7.rotation.y = Math.PI;

//painting on the back wall (center)
const painting8 = createPainting(
  'https://raw.githubusercontent.com/GULLLYYYYY/Art-Gallery-Three.js/main/Images/12.-Son-of-Man.jpg',
  6,
  7,
  new THREE.Vector3(0, 3, 22.99),
  'This is the description for Painting 12.'
);
painting8.rotation.y = Math.PI;



scene.add(painting1, painting2, painting3, painting4, painting5, painting6, 
  painting7, painting8, painting9, painting10, painting11, painting12);

 
////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// const player = new Tone.Player("https://od.lk/s/NTFfMzIxNzgxMDFf/the-lamp-is-low%20%281%29.mp3").toDestination();


// Controls

const controls = new PointerLockControls(camera, document.body);

async function StartExperience() {
  controls.lock();

  hideMenu();

  // // Make sure audio is allowed to play
  // await Tone.start();

  // // Wait for the player to load and then start it
  // await player.load("https://od.lk/s/NTFfMzIxNzgxMDFf/the-lamp-is-low%20%281%29.mp3");
  // // Start the player
  // player.start();
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


// Attach the mouse click event listener

const paintings = [painting1, painting2, painting3, painting4, painting5, painting6, painting7, painting8, painting9, painting10, painting11, painting12];

function onMouseClick(event) {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Cast a ray from the camera's perspective through the mouse position
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections with the paintings only
  const intersects = raycaster.intersectObjects(paintings, true);

  console.log('Intersects:', intersects);

  // If there is an intersection with a painting, show the description popup
  if (intersects.length > 0) {
    const painting = intersects[0].object;
    showPaintingDescriptionPopup(painting.userData.description);
  }
}

// Attach the mouse click event listener
window.addEventListener('click', onMouseClick, false);

// Show the painting description popup
function closePopupOnF(event) {
  if (event.key === 'f') {
    // Check if there is a current popup and remove it
    if (window.currentPopup) {
      const container = document.getElementById('popup-container');
      // container.removeChild(window.currentPopup);
      // window.currentPopup = null; // Reset the global variable
// Remove the "show" class to fade out the popup
container.classList.remove('show');

// Remove the popup after the fade out animation is complete
setTimeout(function() {
  container.removeChild(window.currentPopup);
  window.currentPopup = null; // Reset the global variable
}, 300); // 300ms is the duration of the fade out animation
      // Remove this event listener since popup is closed
      document.removeEventListener('keydown', closePopupOnF);
    }
  }
}

// Show the painting description popup
function showPaintingDescriptionPopup(description) {
  const container = document.getElementById('popup-container');

  // Clear the popup container's contents
  container.innerHTML = '';

  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.innerHTML = description;
  container.appendChild(popup);

  // Save the popup to the global scope for later access
  window.currentPopup = popup;

  // Add the event listener to close popup when 'E' is pressed
  document.addEventListener('keydown', closePopupOnF);

   // Add the "show" class to fade in the popup
   setTimeout(function() {
    container.classList.add('show');
  }, 50);
}
// function showPaintingDescriptionPopup(description) {
//   const container = document.getElementById('popup-container');

//   const popup = document.createElement('div');
//   popup.classList.add('popup');
//   popup.innerHTML = description;
//   container.appendChild(popup);

//   // Add a button to close the popup
//   const closeButton = document.createElement('button');
//   closeButton.innerText = 'Close';
//   closeButton.addEventListener('click', () => {
//     container.removeChild(popup);
//   });
//   popup.appendChild(closeButton);
// }

///////////////////////////////////////////////////////////////
let render = function () {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  const delta = clock.getDelta();//get the time between frames, making it more accessible across all kinds of laptops etc, with different refresh rates.
  updateMovement(delta);//update the movement with the time between frames.

 // Cast a ray from the camera's perspective through the mouse position
 raycaster.setFromCamera(mouse, camera);

 // Check for intersections with the paintings
 const intersects = raycaster.intersectObjects(scene.children, true);

 // Change cursor style based on intersection
 if (intersects.length > 0) {
   document.body.style.cursor = 'pointer';
 } else {
   document.body.style.cursor = 'auto';
 }


  renderer.render(scene, camera); //renders the scene
  requestAnimationFrame(render);
};

render();