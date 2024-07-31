import * as THREE from 'three';
import { Scene } from './scene.js';
import { OrbitControls, UnrealBloomPass } from 'three/examples/jsm/Addons.js';

// shaders
import centerSphereVertexShader from './scene4_shaders/c_s_vertex_shader.glsl';
import centerSpereFragmentShader from './scene4_shaders/c_s_frag_shader.glsl';

// gui
// import * as dat from 'dat.gui';

const displacementMapPars = /* glsl */ `#include <displacementmap_pars_vertex>`
const displacementMapMain = /* glsl */ `#include <displacementmap_vertex>`

const bumpMapPars = /* glsl */ `#include <bumpmap_pars_fragment>`
const bumpMapMain = /* glsl */ `#include <normal_fragment_maps>`

export class Scene_4 extends Scene {

    track = './track_4.mp3'
    controls
    // gui
    topPlane
    bottomPlane
    centerSphere
    noise2d
    noise3d

    centerSpereVertexShaderPars
    centerSpereVertexShaderMain
    centerSpereFragmentShaderPars
    centerSpereFragmentShaderMain

    uniforms = {
        u_time: { value: 0 },
    }

    constructor(renderer) {
        super(renderer)

        this.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), .7, .4, .4))

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.25
        this.controls.panSpeed = 0.2
        this.controls.rotateSpeed = 0.2
        this.controls.zoomSpeed = 0.8

        // camera position
        this.camera.position.set(-22, 0, 0)

        // gui
        // this.gui = new dat.GUI()
        //gui camera folder
        // const cameraFolder = this.gui.addFolder('Camera')
        // cameraFolder.add(this.camera.position, 'x', -100, 100).name('x')
        // cameraFolder.add(this.camera.position, 'y', -100, 100).name('y')
        // cameraFolder.add(this.camera.position, 'z', -100, 100).name('z')

        // this.uniforms.u_texture.value = new THREE.TextureLoader().load('image.jpg')
        // console.log(this.uniforms.u_texture)

        // Get string in centerSphereVertexShader between // PARS_START and // // PARS_END
        this.centerSpereVertexShaderPars = this.getStringParts(centerSphereVertexShader, "// PARS_START", "// PARS_END")
        this.centerSpereVertexShaderMain = this.getStringParts(centerSphereVertexShader, "// MAIN_START", "// MAIN_END")
        this.centerSpereFragmentShaderPars = this.getStringParts(centerSpereFragmentShader, "// PARS_START", "// PARS_END")
        this.centerSpereFragmentShaderMain = this.getStringParts(centerSpereFragmentShader, "// MAIN_START", "// MAIN_END")
        
        this.light()
        this.axisHelper()
        this.centerSphere = this.createCenterSphere()
        this.scene.add(this.centerSphere)

        
    }

    
    getStringParts(code, from, end){
        const regex = new RegExp(`${from}([\\s\\S]*?)${end}`);
        const match = code.match(regex);
        return match ? match[1] : '';
    }

    light() {
        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        // this.scene.add(ambientLight)

        const pointLight = new THREE.DirectionalLight(0xffffff, 1.)
        pointLight.lookAt(new THREE.Vector3(0,0,0))
        pointLight.position.set(-10,10,-10)
        this.scene.add(pointLight)
        // const pointLightHelper = new THREE.PointLightHelper(pointLight)
        // this.scene.add(pointLightHelper)

        const pointLight2 = new THREE.PointLight(0xffffff, 100)
        pointLight2.lookAt(new THREE.Vector3(0,0,0))
        pointLight2.position.set(-15,-0,0)
        this.scene.add(pointLight2)
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
            color: 0x00ff00,
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
        this.controls.update()
        this.uniforms.u_time.value = elapsedTime / 20
        // gui
        // this.gui.updateDisplay()
    }

    finalize() {
        super.finalize()
        // this.gui.destroy()
    }

}