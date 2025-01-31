import './style.css'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

let scene, camera, model, pathCurve, boundingBoxFinal, stats, composer, speed = 0, position = 0, rounded = 0;
// Canvas
const canvas = document.querySelector('canvas.webgl')
// CREATE FOCAL POINT
// Creates a vector in reference to the bounding box of a given model
// Takes three values, usually set in a closed interval between 0 and 1
function setPointInModel(rangeX, rangeY, rangeZ)
{
    let minArray = [], maxArray = [];
    boundingBoxFinal.min.toArray( minArray );
    boundingBoxFinal.max.toArray( maxArray );

    let xOut = THREE.Math.lerp( minArray[0], maxArray[0], rangeX );
    let yOut = THREE.Math.lerp( minArray[1], maxArray[1], rangeY );
    let zOut = THREE.Math.lerp( minArray[2], maxArray[2], rangeZ );

    let output = new THREE.Vector3( xOut, yOut, zOut );
    return output;
}
// USED TO SET CAMERA POSITION
// return position on curve to match that percentage
function setCameraPosition(){
    if(position < 0){
        position = 0
    }
    if(position > 3){
        position = 3
    }
    let p = (position / 3);
    let positionCurve = pathCurve.getPointAt( p );
    
    return positionCurve;
}
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
/**
 * Sizes
 */
 let renderer = new THREE.WebGLRenderer(
    { alpha: true },
    { antialias: true }
);

 renderer.setSize(sizes.width, sizes.height)
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
 renderer.outputEncoding = THREE.sRGBEncoding
init();
animate();
    // CREATE RENDERER
  
function init() {

    // INITIAL ASSIGNS
    // Assign global variables, width, height
    let container = document.getElementById( 'container' );

    // CREATE SCENE
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75, // FOV
        sizes.width / sizes.height, // Aspect ratio
        0.1, // minimum render distance
        100 // maximum render distance
    );
    camera.position.x = 4;
    camera.position.y = 2;
    camera.position.z = 4;

    // CREATE CAMERA PATH
    pathCurve = new THREE.CatmullRomCurve3( [
            new THREE.Vector3( .3, .1, -1 ),
            new THREE.Vector3( .7, .3, 0 ),
            new THREE.Vector3( 0, .5, .75 ),
            new THREE.Vector3( -.7, .8, 0 ),
            new THREE.Vector3( 0, 1.2, -1 )
        ] );
    let pathPoints = pathCurve.getPoints( 100 );
    let pathGeometry = new THREE.BufferGeometry().setFromPoints( pathPoints );
    let pathMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
//
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.LinearEncoding;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( sizes.width, sizes.height );
    renderer.setClearColor( 0x000000, 1 );
    container.appendChild( renderer.domElement );
    renderer.domElement.style.position = "fixed";

    // COMPOSER
    composer = new EffectComposer( renderer );
    let renderPass = new RenderPass( scene, camera );
    composer.addPass( renderPass );

    let smaaPass = new SMAAPass(
        sizes.width * renderer.getPixelRatio(),
        sizes.height * renderer.getPixelRatio()
    );
    smaaPass.renderToScreen = true;
    composer.addPass( smaaPass );

    /**
     * Loaders
     */
    // Texture loader
    const textureLoader = new THREE.TextureLoader()
    // Draco loader
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('draco/')

    // ADD GLTF LOADER
    let objectLoader = new GLTFLoader();
    objectLoader.setDRACOLoader(dracoLoader)

    /**
     * Textures
     */
    const bakedTexture = textureLoader.load('baked.jpg')
    bakedTexture.flipY = false
    bakedTexture.encoding = THREE.sRGBEncoding

    /**
     * Materials
     */
    // Baked material
    const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

    // Portal light material
    const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

    // Pole light material
    const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

    /**
     * Model
     */

    objectLoader.load(
        'portal.glb',
        // If working, add gltf to scene
        function ( gltf ) {
            const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
            const portalLightMesh = gltf.scene.children.find(child => child.name === 'portalLight')
            const poleLightAMesh = gltf.scene.children.find(child => child.name === 'poleLightA')
            const poleLightBMesh = gltf.scene.children.find(child => child.name === 'poleLightB')
            bakedMesh.material = bakedMaterial
            portalLightMesh.material = portalLightMaterial
            poleLightAMesh.material = poleLightMaterial
            poleLightBMesh.material = poleLightMaterial
            
            model = gltf.scene;
            
            // Create bounding box with info on size, then rescale to max size of 1
            let boundingBox = new THREE.Box3().setFromObject( model );
            let boundingBoxSize = boundingBox.getSize( new THREE.Vector3() );
            let maxAxis = Math.max( boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z );
            model.scale.multiplyScalar( 1.0 / maxAxis );

            // Reset bounding box, set model's position to that box's center, reset bounding box
            boundingBox.setFromObject(model);
            let boxCenter = boundingBox.getCenter( new THREE.Vector3() );
            model.position.x += (model.position.x - boxCenter.x);
            model.position.y += (model.position.y - boxCenter.y);
            model.position.z += (model.position.z - boxCenter.z);
            boundingBoxFinal = boundingBox.setFromObject(model);

            model.updateMatrixWorld();
            // Add model to scene
            scene.add( model );
        },
        // Create 'loading' countdown output
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // Create 'error' output
        function ( error ) {
            console.log ( 'An error happened' );
        }
    );
}
/**
 * Renderer
 */
function onWindowResize() {
    
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    composer.renderer.setSize(sizes.width, sizes.height)
}

// RENDER LOOP
// Function to animate the scene on the canvas
function animate() {
    window.addEventListener( 'resize', onWindowResize() );

    // Set camera to position
    camera.position.copy( setCameraPosition() );

    // // If the model's loaded, set the camera to look at a given point in it
    if (model) {
        camera.lookAt( setPointInModel(.5,.5,.5) );
    }
   
     composer.render()
    //Soft movement
     position += speed;
     speed *= .8;

     rounded = Math.round(position);
     console.log(rounded);
     let diff = (rounded - position);
     position += Math.sign(diff)*Math.pow(Math.abs(diff),0.7)*0.015;
    
     requestAnimationFrame(animate)
}

window.addEventListener('wheel',(e) => {
    speed += e.deltaY * 0.0003;
    
})