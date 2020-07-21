// initializing variables.
let scene, camera, renderer, controls, pointLight, sun, planetList = [], saturnRing;
let baseDistanceFromSun = 30;

/**
 * function init to set up scene and camera and rendering them.
 */
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // camera.position.z = 5;
  // camera.lookAt(0, 2, 0);
  camera.position.set(0, 30, 95); // x, y, z - coordinate.

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  // renderer.setClearColor('#000000');
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  // to move scene with mouse.
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  // only enabling zoom and disabling rotate and pan.
  controls.enableZoom = true;
  controls.enableRotate = false;
  controls.enablePan = false;

  drawObjects();
} // end init;

/**
 * function to draw all objects in scene.
 */
function drawObjects() {

  // setting up point light.
  pointLight = new THREE.PointLight(0xffffff, 1, 500);
  pointLight.position.set(0, 0, 0);
  pointLight.castShadow = true;
  scene.add(pointLight);

  // setting up ambient light
  // let ambientLight = new THREE.AmbientLight(0xffffff);
  // scene.add(ambientLight);

  // draw sun.
  let sunMaterial = new THREE.MeshLambertMaterial({
    emissiveMap: new THREE.TextureLoader().load("./assets/sun.jpg"),
    emissive: 0xffffff
  });
  sun = createSphere(sunMaterial, 6, 50); // params: material, radius, segments.
  sun.position.set(0, 0, 0);
  scene.add(sun);

  // creating orbits and planets.
  for (let i = 0; i < 8; i++) {
    // orbit.
    let fromX = i * 5 + baseDistanceFromSun;

    let orbit = createOrbit(fromX, 320);
    scene.add(orbit);

    // planets.
    let planetPath = `./assets/planet-${i + 1}.jpg`;

    let planetMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: new THREE.TextureLoader().load(planetPath)
    });
    let planet = createSphere(planetMaterial, 2, 50); // params: material, radius, segments.
    planet.receiveShadow = true;
    planet.position.set(fromX, 0, 0);
    planet['speed'] = Math.random() * 2 + 0.2; // adding property.
    planet['fromX'] = fromX; // adding property.
    scene.add(planet);
    planetList.push(planet);

    // if its saturn also create its ring.
    if (i === 5) {
      saturnRing = createSaturnRing(fromX);
      scene.add(saturnRing);
    }

  } // end for.

} // end drawObjects.

// function to create sphere objects.
function createSphere(material, radius, segment) {
  let geometry = new THREE.SphereGeometry(radius, segment, segment); // params: radius, widthSegment, heightSegment.
  let sphereMesh = new THREE.Mesh(geometry, material);
  return sphereMesh;
} // end createSphere.

/**
 * function to create planet orbit.
 */
function createOrbit(radius, segment) {
  let ringGeometry = new THREE.RingGeometry(radius + 0.01, radius - 0.01, segment); // params: innerRadius, outerRadius, segments.
  let ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  let orbitMesh = new THREE.Mesh(ringGeometry, ringMaterial);
  orbitMesh.position.set(0, 0, 0);
  orbitMesh.rotation.x = Math.PI / 2;
  return orbitMesh;
} // end createOrbit.

/**
 * function to create saturn ring.
 */
function createSaturnRing(fromX) {
  let ringGeometry = new THREE.TorusGeometry(3, 0.2, 480, 480); // size, innerDiameter, facets, facets.
  let ringMaterial = new THREE.MeshBasicMaterial({ color: 0xc2b280 }); // setting sand color.
  let saturnRing = new THREE.Mesh(ringGeometry, ringMaterial);
  saturnRing.position.set(fromX, 0, 0);
  saturnRing.rotation.x = Math.PI / 2;
  return saturnRing;
} // end createSaturnRing.

/**
 * function to set animations and rate per seconds.
 */
function animate() {
  // updating controls.
  controls.update();

  // rotate and revolve.
  let time = Date.now();
  sun.rotation.y += 0.002;

  // planets rotation and revolve.
  for (let i = 0; i < 8; i++) {
    // rotating planets.
    planetList[i].rotation.y += 0.015; // rotation rate.

    // revolving planets.
    let fromX = planetList[i].fromX;

    planetList[i].position.x = Math.cos(time * 0.0001 * planetList[i].speed) * fromX;
    planetList[i].position.z = Math.sin(time * 0.0001 * planetList[i].speed) * fromX;

    // if its saturn also revolve its ring.
    if (i === 5) {
      saturnRing.position.x = Math.cos(time * 0.0001 * planetList[i].speed) * fromX;
      saturnRing.position.z = Math.sin(time * 0.0001 * planetList[i].speed) * fromX;
    }
  } // end for.

  // here basically we are rendering when we change size, or animation occurs.
  renderer.render(scene, camera);
  // this always calls ate 60 fps rate.
  requestAnimationFrame(animate);

} // end animate.

/**
 * function resizing the window.
 */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
} // end onWindowResize.

window.addEventListener('resize', onWindowResize, false);

// calling functions init and animate.
init();
animate();
