import * as THREE from 'three';

// Particle Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000)

// Particles
// Geometry
// const particleGeometry = new THREE.SphereGeometry(1,32,32)
const particleGeometry = new THREE.BufferGeometry()
const count = 20000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
// Texture
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('circle_03.png')
// Material
const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    // color: 0xaaffaa,
    map: particleTexture,
    transparent: true,
    alphaMap: particleTexture,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
})
// Points
const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)


// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.z = 2
camera.lookAt(scene.position)
scene.add(camera)

function animate(elapsedTime) {

    // Update Particles
    particles.rotation.y = Math.sin(elapsedTime * 0.5) * 0.4
    particles.rotation.x = Math.cos(elapsedTime * 0.5) * 0.4
    particles.rotation.z = Math.cos(elapsedTime * 0.5) * 0.4
}

const SCENE = {
    scene: scene,
    camera: camera ? camera : null,
    animate: animate
}

export { SCENE }