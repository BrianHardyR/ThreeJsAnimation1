import * as THREE from 'three';
import { Scene } from './scene.js';
import vertexShader from './vertexShader.glsl';
import fragmentShader from './fragmentShader.glsl';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export class Scene_3 extends Scene {

    controls
    uniforms = {
        u_time: { type: 'f', value: 0.0 },
        u_resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_mouse: { type: 'v2', value: new THREE.Vector2() }
    }
    constructor(renderer) {
        super(renderer)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.setupVisualizer()
        this.lights()
        this.helper()
    }

    lights() {
        // const light = new THREE.DirectionalLight(0xffffff, 1)
        // light.position.set(0, 0, 5)
        // this.scene.add(light)
    }

    helper() {
        const asixHelper = new THREE.AxesHelper(50)
        this.scene.add(asixHelper)
    }

    setupCamera() {
        super.setupCamera()
        this.camera.position.z = 10
    }

    setupVisualizer() {
        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,

        })
        material.wireframe = true
        const geometry = new THREE.IcosahedronGeometry(4, 30)
        const mesh = new THREE.Mesh(geometry, material)
        this.scene.add(mesh)
    }

    animate(elapsedTime) {
        this.controls.update()
        this.uniforms.u_time.value = elapsedTime
    }

}