import './style.css'
import { SCENE as SCENE_1 } from './scene1'
import { SCENE as SCENE_2 } from './scene2'
import * as THREE from 'three'

document.querySelector('#app').innerHTML = `
  <div>
    <canvas class="webgl"></canvas>
    <!-- horizonatal list of for switching scenes -->
    <div class="scene-switcher">
        <button id="scene1">Scene 1</button>
        <button id="scene2">Scene 2</button>
    </div>
  </div>
`

const canvas = document.querySelector('canvas.webgl')
let currentScene = SCENE_1

// Switch scenes
document.getElementById('scene1').addEventListener('click', () => {
    currentScene = SCENE_1
})

document.getElementById('scene2').addEventListener('click', () => {
    currentScene = SCENE_2
})

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true



// On page resize set new renderer size
window.addEventListener('resize', () => {
    if (!currentScene && !currentScene.camera) return
    renderer.setSize(window.innerWidth, window.innerHeight)
    currentScene.camera.aspect = window.innerWidth / window.innerHeight
    currentScene.camera.updateProjectionMatrix()
})


// Render Loop
const clock = new THREE.Clock()
function animate() {
    if (!currentScene) return
    const elapsedTime = clock.getElapsedTime()
    currentScene.animate(elapsedTime)
    renderer.render(currentScene.scene, currentScene.camera)
}

renderer.setAnimationLoop(animate,);
