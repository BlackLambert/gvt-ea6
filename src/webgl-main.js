let gl;

// Scene
let scene;
let renderer;

let glPositionAttributeLocation = null;
let glColorAttributeLocation = null;
let glMatrixLocation = null;

let vertexBuffer = null;
let lineIndicesBuffer = null
let triangleColorBuffer = null;
let lineColorBuffer = null;
let triangleIndicesBuffer = null;


const torusInnerRadius = 60;
const torusOuterRadius = 120;
const torusPosition = new Vector3(0, 0, 0);
const torusResolution = 20;
const torusLineColor = Color.black();
const torusColor = Color.white();
const torusRotationSpeed = 5;

const sphereRadius = 50;
const sphereCount = 4;
const spherePositionRadius = 150;
const sphereResolution = 4;
const sphereLineColor = Color.white();
const sphereColor = Color.black();
const sphereRotationSpeed = 6;
const sphereOrbitRadius = 150;
const sphereOrbitSpeed = 5;
const maxScale = 1.5;
const minScale = 0.8;

let spherePositions = [];
let sphereOrbitAngles = [];
let spheres = [];
let baseScaleAngles = [];


function webglMain()
{
    renderer = new Renderer();
    gl = renderer.gl;
    scene = createScene();
}

function createScene()
{
    // ------------------------------------------
    // Creates meshes 
    // ------------------------------------------


    let glObjects = [];

    // Torus
    createTorus(glObjects);

    // Sphere
    createSpheres(glObjects);

    // ------------------------------------------
    // Creates scene 
    // ------------------------------------------

    let cam = Camera.createPerspective();
    const clearColor = [0.0,0.0,0.0,1.0];
    return new Scene(clearColor, glObjects, cam);
}

function render()
{
    renderer.render(scene);
}

function colorRandom(glObject)
{
    for (let index = 0; index < glObject.vertices.length; index++) {
        glObject.setSingleFaceColor(index, Color.random());
    }
}

function createTorus(glObjects)
{
    let torus = Torus.createBasic(torusInnerRadius, torusOuterRadius, torusResolution, torusPosition, torusLineColor, torusColor);
    torus.localPosition = torusPosition;
    torus.deltaRotation = new Vector3(0, torusRotationSpeed, 0);
    glObjects.push(torus);
}

function createSpheres(glObjects)
{
    let deltaAngle = 360 / sphereCount;
    let angle = 0;
    for (let i = 0; i < sphereCount; i++) 
    {
        let x = spherePositionRadius * Math.cos(angleToRadians(angle));
        let y = 0;
        let z = spherePositionRadius * Math.sin(angleToRadians(angle));
        let pos = new Vector3(x, y, z);
        let sphere = RecursiveSphere.createBasic(sphereRadius, sphereResolution, sphereLineColor, sphereColor); 
        sphere.localPosition = pos;
        spherePositions.push(pos);
        sphereOrbitAngles.push(0);
        baseScaleAngles.push(angle);
        sphere.deltaRotation = new Vector3(0, sphereRotationSpeed, 0);
        //colorRandom(sphere);
        glObjects.push(sphere);
        spheres.push(sphere);
        angle += deltaAngle;
    }
    animateSpherePositions();
}

function animateSpherePositions()
{
    for (let i = 0; i < spheres.length; i++)
    {
        animateSpherePosition(i);
    }
}

function animateSpherePosition(index)
{
    let angle = sphereOrbitAngles[index];
    let orbitCenter = spherePositions[index];
    let sphere = spheres[index];
    let baseScaleAngle = baseScaleAngles[index];

    updateSpherePosition(sphere, angle, orbitCenter);
    updateSphereScale(sphere, angle + (360 - baseScaleAngle));

    sphereOrbitAngles[index] = angle + sphereOrbitSpeed;
}

function updateSpherePosition(sphere, angle, orbitCenter)
{
    let x = spherePositionRadius * Math.cos(angleToRadians(angle));
    let y = 0;
    let z = spherePositionRadius * Math.sin(angleToRadians(angle));
    //console.log(orbitCenter);
    let pos = orbitCenter.add(new Vector3(x, y, z));
    sphere.localPosition = pos;
}

function updateSphereScale(sphere, angle)
{
    let factor = (Math.cos(angleToRadians(angle)) + 1) /2;
    let delta = (maxScale - minScale) * factor;
    let scale = minScale + delta;
    sphere.localScale = new Vector3(scale, scale, scale);
    //console.log(scale, delta);
}