// import './style.css'
// import * as dat from 'dat.gui'
// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
// import { Vector3 } from 'three'
// import CameraControls from '../dist/camera-controls.js'


// import {
//     RollerCoasterGeometry,
//     RollerCoasterShadowGeometry,
//     RollerCoasterLiftersGeometry,
//     TreesGeometry,
//     SkyGeometry
// } from 'three/examples/jsm/misc/RollerCoaster.js';
// // /**
// //  * Spector JS
// //  */
// // const SPECTOR = require('spectorjs')
// // const spector = new SPECTOR.Spector()
// // spector.displayUI()
// CameraControls.install({THREE:THREE});
// const clock = new THREE.Clock();
 
// /**
//  * Base
//  */

// // Canvas
// const canvas = document.querySelector('canvas.webgl')

// // Scene
// const scene = new THREE.Scene()

// /**
//  * Loaders
//  */
// // Texture loader
// const textureLoader = new THREE.TextureLoader()

// // Draco loader
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('draco/')

// // GLTF loader
// const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)

// /**
//  * Textures
//  */
// const bakedTexture = textureLoader.load('baked.jpg')
// bakedTexture.flipY = false
// bakedTexture.encoding = THREE.sRGBEncoding

// /**
//  * Materials
//  */
// // Baked material
// const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

// // Portal light material
// const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

// // Pole light material
// const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

// /**
//  * Model
//  */
// gltfLoader.load(
//     'portal.glb',
//     (gltf) =>
//     {
//         const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
//         const portalLightMesh = gltf.scene.children.find(child => child.name === 'portalLight')
//         const poleLightAMesh = gltf.scene.children.find(child => child.name === 'poleLightA')
//         const poleLightBMesh = gltf.scene.children.find(child => child.name === 'poleLightB')

//         bakedMesh.material = bakedMaterial
//         portalLightMesh.material = portalLightMaterial
//         poleLightAMesh.material = poleLightMaterial
//         poleLightBMesh.material = poleLightMaterial

//         scene.add(gltf.scene)
//     }
// )

// /**
//  * Sizes
//  */
// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight
// }

// window.addEventListener('resize', () =>
// {
//     // Update sizes
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight

//     // Update camera
//     camera.aspect = sizes.width / sizes.height
//     camera.updateProjectionMatrix()

//     // Update renderer
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// })

// /**
//  * Camera
//  */
// // Base camera
// const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
// camera.position.x = 4
// camera.position.y = 2
// camera.position.z = 4

// scene.add(camera)

//  //Controls
//  const controls = new OrbitControls(camera, canvas)
//  controls.enableZoom = false

// //Mouse Scroll
// var scrollingDirection = 0;
// var lastScroll = 9999;
// var scrollIdleTime = 300;
// //var z = camera.position.z;

// window.addEventListener("wheel", wheel);
// var camerax = 1;
// function wheel(e)
// {
//     var delta = e.deltaY;
//     var timeNow = performance.now();
//     console.log(scrollingDirection);
//     console.log("timenow " +timeNow);
//     console.log("last scroll "+ lastScroll + scrollIdleTime);

//     if((delta > 0 && scrollingDirection != 1) || (scrollingDirection == 1 && (timeNow > lastScroll + scrollIdleTime)))
//     {      
//         let startAzimuthAngle = cameraControls.azimuthAngle;
//         new TWEEN.Tween(cameraControls)
//         .to( { azimuthAngle: 90 * THREE.MathUtils.DEG2RAD + startAzimuthAngle }, 1000 )
//         .easing( TWEEN.Easing.Bounce.Out )
//         .onStart( function() {

//             // disable user control while the animation
//             cameraControls.enabled = false;

//         } )
//         .onComplete( function() {

//             cameraControls.enabled = true;

//         } )
//         .start();
//         scrollingDirection = 1

//     }          
//     else if((delta < 0 &&(scrollingDirection != 2) || (scrollingDirection == 2) && timeNow > lastScroll + scrollIdleTime))
//     {
//         let startAzimuthAngle = cameraControls.azimuthAngle;
//         new TWEEN.Tween(cameraControls)
//         .to( { azimuthAngle: -90 * THREE.MathUtils.DEG2RAD + startAzimuthAngle }, 1000 )
//         .easing( TWEEN.Easing.Bounce.Out)
//         .onStart( function() {

//             // disable user control while the animation
//             cameraControls.enabled = false;

//         } )
//         .onComplete( function() {

//             cameraControls.enabled = true;

//         } )
//         .start();
//         scrollingDirection = 2
//     }
//     lastScroll = timeNow
//     // console.log(e.deltaY)
//     // if(e.deltaY > 0)
//     // {
//     //     z --
//     // }
//     // else{
//     //     z ++
//     // }    
//     //console.log(camera.position.z);
// }
  
// /**
//  * Renderer
//  */
// const renderer = new THREE.WebGLRenderer({
//     canvas: canvas,
//     antialias: true
// })
// renderer.setSize(sizes.width, sizes.height)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.outputEncoding = THREE.sRGBEncoding

// //Camera Control

// const cameraControls = new CameraControls( camera, renderer.domElement );
// cameraControls.dollySpeed = 0
// // Debug
// const gui = new dat.GUI({
//     width: 400
// })
// gui.addFolder('My folder');

// //folder.add(params, 'ClickMe');

// // folder.open();
// /**
//  * Animate
//  */
// renderer.render(scene, camera);

// (function anim(){
//     const delta = clock.getDelta();
// 	const elapsed = clock.getElapsedTime();
//     const elapsedTime = clock.getElapsedTime()
//     const updated = cameraControls.update( delta );
//     requestAnimationFrame( anim );

// 	TWEEN.update( elapsed * 1000 );

// 	if ( updated ) {

// 		renderer.render( scene, camera );
// 	}
// })();
// // const tick = () =>
// // {
// //     // Update controls
   
// //     cameraControls.update()

// //     // Render
// //     renderer.render(scene, camera)

// //     // Call tick again on the next frame
// //     window.requestAnimationFrame(tick)
// // }

// // tick()