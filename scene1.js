import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/Addons.js';
import { FontLoader } from 'three/examples/jsm/Addons.js';
// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

// Hello world text
let text = null
const fontLoader = new FontLoader()
fontLoader.load('./SuperCharge.json', (font)=>{
    const textGeometry = new TextGeometry("\\*.*\/", {
        font: font,
        size: 0.5,
        depth: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
    })
    const textMaterial = new THREE.MeshMatcapMaterial({
        color: 0xdddddd
    })
    text = new THREE.Mesh(textGeometry, textMaterial)
    textGeometry.computeBoundingBox()
    text.position.x = -textGeometry.boundingBox.max.x / 2
    text.position.y = -textGeometry.boundingBox.max.y / 2
    scene.add(text)
})

// Sphere at the center
// const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
// const sphereMaterial = new THREE.MeshMatcapMaterial({
//     color: 0xaaaaaa
// })
// const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
// sphere.position.x = 0
// sphere.position.y = 0
// sphere.position.z = 0
// scene.add(sphere)


// Object
function Cube3X3() {
    const group = new THREE.Group()
    const material = new THREE.MeshStandardMaterial({
        color: 0x000000,
        metalness: 1,
        roughness: 0.8,
    })
    material.side = THREE.DoubleSide
    const geometry = new THREE.SphereGeometry(0.5, 32, 32)
    for (const z of [-2, 0, 2 ]) {
        for (const y of [-2, 0, 2]) {
            for (const x of [-2, 0, 2]) {
                if (x === 0 && y === 0 && z === 0) {
                    continue   
                }
                const cube = new THREE.Mesh(geometry, material)
                cube.castShadow = true
                cube.position.x = x
                cube.position.y = y
                cube.position.z = z
                group.add(cube)
            }
        }
    }
    group.rotateY(0)
    group.rotateX(0)
    group.rotateZ(0)
    return group
}
const cube = Cube3X3()
scene.add(cube)

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.z = 5.15
camera.lookAt(cube.position)
scene.add(camera)

// Point light
const pointLight = new THREE.PointLight(0xffffff, 20, 1000, 1)
pointLight.position.x = 0
pointLight.position.y = 0
pointLight.position.z = 0
scene.add(pointLight)
// Add helper to show light position
// const pointLightHelper = new THREE.PointLightHelper(pointLight)
// scene.add(pointLightHelper)

// Directional light
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
// directionalLight.position.x = 5
// directionalLight.position.y = 5
// directionalLight.position.z = 5
// scene.add(directionalLight)

function animate(elapsedTime) {
    cube.rotation.y = Math.sin(elapsedTime * 0.2)
    cube.rotation.x = Math.cos(elapsedTime * 0.2)
    cube.rotation.z += 0.001
}

const SCENE = {
    scene: scene,
    camera: camera,
    animate: animate
}

export { SCENE }