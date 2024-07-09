import * as THREE from 'three';

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

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

// Point light
const pointLight = new THREE.PointLight(0xffffff, 10)
pointLight.position.x = 0
pointLight.position.y = 0
pointLight.position.z = 0
scene.add(pointLight)
// Add helper to show light position
const pointLightHelper = new THREE.PointLightHelper(pointLight)
scene.add(pointLightHelper)

function animate(elapsedTime) {
    cube.rotation.y = Math.sin(elapsedTime * 0.2)
    cube.rotation.x = Math.cos(elapsedTime * 0.2)
}

const SCENE = {
    scene: scene,
    camera: camera,
    animate: animate
}

export { SCENE }