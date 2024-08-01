import * as THREE from 'three';
import { Scene } from './scene.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { UnrealBloomPass } from 'three/examples/jsm/Addons.js';
import { OutputPass } from 'three/examples/jsm/Addons.js';

// shaders
import centerSphereVertexShader from './scene4_shaders/c_s_vertex_shader.glsl';
import centerSpereFragmentShader from './scene4_shaders/c_s_frag_shader.glsl';

// gui
import * as dat from 'dat.gui';

const displacementMapPars = /* glsl */ `#include <displacementmap_pars_vertex>`
const displacementMapMain = /* glsl */ `#include <displacementmap_vertex>`

const bumpMapPars = /* glsl */ `#include <bumpmap_pars_fragment>`
const bumpMapMain = /* glsl */ `#include <normal_fragment_maps>`

export class Scene_4 extends Scene {

    track = './track_4.mp3'
    controls
    gui
    topPlane
    bottomPlane
    centerSphere

    centerSpereVertexShaderPars
    centerSpereVertexShaderMain
    centerSpereFragmentShaderPars
    centerSpereFragmentShaderMain

    uniforms = {
        u_time: { value: 0 },
    }

    constructor(renderer) {
        super(renderer)

        // gui
        this.gui = new dat.GUI()

        this.setupControls()
        this.centerSpereVertexShaderPars = this.getStringParts(centerSphereVertexShader, "// PARS_START", "// PARS_END")
        this.centerSpereVertexShaderMain = this.getStringParts(centerSphereVertexShader, "// MAIN_START", "// MAIN_END")
        this.centerSpereFragmentShaderPars = this.getStringParts(centerSpereFragmentShader, "// PARS_START", "// PARS_END")
        this.centerSpereFragmentShaderMain = this.getStringParts(centerSpereFragmentShader, "// MAIN_START", "// MAIN_END")
        
        this.light()
        // this.axisHelper()
        this.centerSphere = this.createCenterSphere()
        this.scene.add(this.centerSphere)
        this.setupBloomPass() 
        console.log(this.composer)
    }

    setupBloomPass() {
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
        bloomPass.threshold = .2
        bloomPass.strength = .1
        bloomPass.radius = .1
        this.renderer.toneMappingExposure = 5.0

        this.addPass(bloomPass)

        this.setOutputPass()

        // bloom gui folder
        const bloomFolder = this.gui.addFolder('Bloom')
        bloomFolder.add(bloomPass, 'threshold').min(0).max(.5).step(0.0001).name('Threshold')
        bloomFolder.add(bloomPass, 'strength').min(0).max(0.5).step(0.0001).name('Strength')
        bloomFolder.add(bloomPass, 'radius').min(0.0).max(1.0).step(0.01).name('Radius')

        // exposure
        this.gui.add(this.renderer, 'toneMappingExposure').min(Math.pow(0.001, 4.0)).max(Math.pow(2,4.0)).step(0.0001).name('Exposure')

    }

    setupControls(){
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.25
        this.controls.panSpeed = 0.2
        this.controls.rotateSpeed = 0.2
        this.controls.zoomSpeed = 0.8

        // camera position
        this.camera.position.set(-22, 0, 0)
    }

    
    getStringParts(code, from, end){
        const regex = new RegExp(`${from}([\\s\\S]*?)${end}`);
        const match = code.match(regex);
        return match ? match[1] : '';
    }

    light() {
        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        // this.scene.add(ambientLight)

        const pointLight = new THREE.PointLight(new THREE.Color(0,2,0), 100)
        pointLight.lookAt(new THREE.Vector3(0,0,0))
        pointLight.position.set(-10,0,-20)
        this.scene.add(pointLight)
        // light gui folder
        const lightFolder = this.gui.addFolder('Light1')
        lightFolder.add(pointLight.position, 'x').min(-20).max(20).step(0.1).name('X')
        lightFolder.add(pointLight.position, 'y').min(-20).max(20).step(0.1).name('Y')
        lightFolder.add(pointLight.position, 'z').min(-20).max(20).step(0.1).name('Z')
        // intensity
        lightFolder.add(pointLight, 'intensity').min(0).max(500).step(0.1).name('Intensity')
        // color
        lightFolder.addColor(pointLight, 'color').name('Color')

        const pointLight2 = new THREE.PointLight(new THREE.Color(0,2,2), 100)
        pointLight2.lookAt(new THREE.Vector3(0,0,0))
        pointLight2.position.set(-15, 0, 20)
        this.scene.add(pointLight2)
        // light gui folder
        const lightFolder2 = this.gui.addFolder('Light2')
        lightFolder2.add(pointLight2.position, 'x').min(-20).max(20).step(0.1).name('X')
        lightFolder2.add(pointLight2.position, 'y').min(-20).max(20).step(0.1).name('Y')
        lightFolder2.add(pointLight2.position, 'z').min(-20).max(20).step(0.1).name('Z')
        lightFolder2.add(pointLight2, 'intensity').min(0).max(500).step(0.1).name('Intensity')
        lightFolder2.addColor(pointLight2, 'color').name('Color')

        // light helper
        // const pointLightHelper = new THREE.PointLightHelper(pointLight)
        // this.scene.add(pointLightHelper)
        // const pointLightHelper2 = new THREE.PointLightHelper(pointLight2)
        // this.scene.add(pointLightHelper2)
    }

    axisHelper() {
        const axesHelper = new THREE.AxesHelper(50)
        this.scene.add(axesHelper)
    }

    createCenterSphere() {
        const geometry = new THREE.IcosahedronGeometry(6, 150)
        const material = new THREE.MeshStandardMaterial({
            emissive: 0x000000,
            emissiveIntensity: 0.1,
        })
        material.onBeforeCompile = (shader) => {
            shader.vertexShader = shader.vertexShader.replace(displacementMapPars, displacementMapPars + this.centerSpereVertexShaderPars)
            shader.vertexShader = shader.vertexShader.replace(displacementMapMain, displacementMapMain + this.centerSpereVertexShaderMain)
            shader.fragmentShader = shader.fragmentShader.replace(bumpMapPars, bumpMapPars + this.centerSpereFragmentShaderPars)
            shader.fragmentShader = shader.fragmentShader.replace(bumpMapMain, bumpMapMain + this.centerSpereFragmentShaderMain)
            material.userData.shader = shader
            shader.uniforms.u_time = this.uniforms.u_time
        }
        const sphere = new THREE.Mesh(geometry, material)
        // position
        sphere.position.set(0, 0, 0)
        return sphere
    }

    animate(elapsedTime) {
        super.animate(elapsedTime)
        this.controls.update()
        this.uniforms.u_time.value = elapsedTime / 20
        // gui
        this.gui.updateDisplay()
    }

    finalize() {
        super.finalize()
        this.gui.destroy()
    }

}