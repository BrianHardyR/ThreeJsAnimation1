import './style.css'
import * as THREE from 'three'

document.querySelector('#app').innerHTML = `
  <div>
    <canvas class="webgl"></canvas>
  </div>
`

const canvas = document.querySelector('canvas.webgl')

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

// Plane Geometry
// const planeGeometry = new THREE.PlaneGeometry(10, 10)
// const planeMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff", side: THREE.DoubleSide })
// const plane = new THREE.Mesh(planeGeometry, planeMaterial)
// plane.rotation.x = -90
// plane.position.y = -5
// scene.add(plane)


// Object
function Cube3X3() {
    const group = new THREE.Group()
    const material = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        metalness: 0.3,
        roughness: 0.8,  
    })
    material.side = THREE.DoubleSide
    const geometry = new THREE.SphereGeometry(0.7)
    for (const z of [-2, 0, 2 ]) {
        for (const y of [-2, 0, 2]) {
            for (const x of [-2, 0, 2]) {

                const cube = new THREE.Mesh(geometry, material)
                if (x === 0 && y === 0 && z === 0) {
                    const bulb = new THREE.MeshStandardMaterial({
                        color: 0xff0000,
                        roughness: 0,
                        metalness: 1,
                        emissive: 0xff0000,
                        emissiveIntensity: 1,
                    })
                    cube.material = bulb
                    cube.scale.set(1.8, 1.8, 1.8)
                }
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

// On page resize set new renderer size
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
})

// // // Ambient light
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)

// Point light
const pointLight = new THREE.PointLight(0xffffff, 10)
pointLight.position.x = 0
pointLight.position.y = 0
pointLight.position.z = 0
scene.add(pointLight)
// Add helper to show light position
const pointLightHelper = new THREE.PointLightHelper(pointLight)
scene.add(pointLightHelper)

// // Directional light
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.01)
// directionalLight.position.x = 5
// directionalLight.position.y = 5
// directionalLight.position.z = 5
// scene.add(directionalLight)
// // Add helper to show light position
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
// scene.add(directionalLightHelper)


// Render Loop
const clock = new THREE.Clock()
function animate() {
    const elapsedTime = clock.getElapsedTime()
    // cube.rotation.z += 0.001
    cube.rotation.y = Math.sin(elapsedTime * 0.2)
    cube.rotation.x = Math.cos(elapsedTime * 0.2)
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate,);
