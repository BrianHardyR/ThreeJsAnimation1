import * as THREE from 'three'
export class Scene {

    camera
    renderer
    scene

    constructor(renderer) {
        // type guard for renderer
        if (!(renderer instanceof THREE.WebGLRenderer)) {
            throw new Error('Scene constructor expects a THREE.WebGLRenderer as an argument');
        }
        this.renderer = renderer;
        this.scene = new THREE.Scene();
        this.setupRenderer();
        this.setupCamera();
    }

    setupCamera() {
        // 
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.lookAt(0, 0, 0)
    }

    setupRenderer() {
        // 
        this.renderer.setClearColor(0x000000, 1)
    }

    getCamera() {
        // 
        return this.camera;
    }

    getScene() {
        // 
        return this.scene;
    }

    finalize() {
        // 
    }

    animate() {
        // 
    }

    

    resize(width, height) {
        // type guard for width and height as numbers
        if (typeof width !== 'number' || typeof height !== 'number') {
            throw new Error('Scene.resize expects width and height as numbers')
        }
        this.getCamera().aspect = width / height
        this.getCamera().updateProjectionMatrix()
    }

}