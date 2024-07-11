import * as THREE from 'three';

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)


const parameters = {
    count: 300,
    radius: 2,
    spin: 50,
    speed: -0.1,
    height: 2,
    insideColor: '#6c3f04',
    outsideColor: '#000000'
}

const planets = []

for (let i = 0; i < parameters.count; i++) {
    const geometry = new THREE.SphereGeometry(0.2, 15, 15)
    const material = new THREE.MeshStandardMaterial({
        metalness: .5,
        roughness: 0.3,
    })
    const planet = new THREE.Mesh(geometry, material)
    planet.castShadow = true
    planet.receiveShadow = true
    scene.add(planet)
    planets.push(planet)
}

let INSTANCE_INSIDE_COLOR
let INSTANCE_OUTSIDE_COLOR

function setColors() {
    INSTANCE_INSIDE_COLOR = new THREE.Color(parameters.insideColor)
    INSTANCE_OUTSIDE_COLOR = new THREE.Color(parameters.outsideColor)
}

function plotParticles(elapsedTime) {
    
    for (let i = 0; i < parameters.count; i++) {
        // Move to next position assuming the particle is moving in a spiral towards the center
        const speed = parameters.speed
        const angle = (elapsedTime * speed) + (i / parameters.count) * (parameters.spin) // spin
        const spiralRadius = i / parameters.count // spiral
        const x = Math.cos(angle) * spiralRadius * parameters.radius // 10 is the radius of the spiral
        const z = Math.sin(angle) * spiralRadius * parameters.radius
        const y = (spiralRadius) * parameters.height

        // Color
        const mixedColor = INSTANCE_INSIDE_COLOR.clone()
        mixedColor.lerp(INSTANCE_OUTSIDE_COLOR, spiralRadius)

        // Update the position of the planet
        planets[i].position.x = x + Math.cos(angle) * 0.5
        planets[i].position.y = y
        planets[i].position.z = z + Math.sin(angle) * 0.5
        planets[i].material.color = mixedColor
    }
    

}

setColors()

// Light
const pointLight = new THREE.PointLight(0xffffff, 1, 100, 1)
pointLight.position.x = 0
pointLight.position.y = 0
pointLight.position.z = 0
scene.add(pointLight)

// Bulb Sphere
const bulbGeometry = new THREE.SphereGeometry(.4)
const bulbMaterial = new THREE.MeshStandardMaterial({
    emissive: 0xffffdd,
    emissiveIntensity: .4,
    color: 0xecb82b,
    roughness: 0,
    metalness: 1
})
const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial)
bulb.position.set(pointLight.position.x, pointLight.position.y, pointLight.position.z)
scene.add(bulb)
// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.x = 2
camera.position.y = 2.5
camera.position.z = 1
camera.lookAt(bulb.position)
scene.add(camera)

// gui.close()

function animate(elapsedTime) {
    plotParticles(elapsedTime)
}

const SCENE = {
    scene: scene,
    camera: camera,
    animate: animate
}

export { SCENE }