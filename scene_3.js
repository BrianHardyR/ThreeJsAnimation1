import * as THREE from 'three';
import { Scene } from './scene.js';
import vertexShader from './vertexShader.glsl';
import fragmentShader from './fragmentShader.glsl';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export class Scene_3 extends Scene {

    track = './track_3.mp3'
    audio
    analyser
    controls
    audioControls = {
        playPauseButton: null,
        progressBar: null,
        uploadFile: null
    }
    uniforms = {
        u_time: { type: 'f', value: 0.0 },
        u_resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_mouse: { type: 'v2', value: new THREE.Vector2() },
        u_frequency_low: { type: 'f', value: 0.0 },
        u_frequency_mid: { type: 'f', value: 0.0 },
        u_frequency_high: { type: 'f', value: 0.0 },
    }
    constructor(renderer) {
        super(renderer)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.25
        this.controls.panSpeed = 0.2
        this.controls.rotateSpeed = 0.2
        this.controls.zoomSpeed = 0.8

        this.setupVisualizer()
        this.lights()
        this.helper()
        this.audioSetup(this.track)
        this.setupPlayerControls()
    }

    setupPlayerControls() {
        // Circular progress bar with play/pause button in the middle
        // 
        document.querySelector('#player').innerHTML = `
            <button id="play-pause">Play </button
            <label id="load_progress"><progress value="0" max="100">70 %</progress></label>
            <!-- Upload File only accept mp3-->
            <!-- <input type="file" id="file" accept="audio/mp3"> -->
        `
        this.audioControls.playPauseButton = document.querySelector('#play-pause')
        this.audioControls.progressBar = document.querySelector('progress')
        // Upload file
        // this.audioControls.uploadFile = document.querySelector('#file')
        // this.audioControls.uploadFile.addEventListener('change', (e) => {
            
        // })

        this.audioControls.playPauseButton.addEventListener('click', () => {
            if (this.audio.isPlaying) {
                this.audio.pause()
                // reset uniforms
                this.uniforms.u_frequency_low.value = 0.0
                this.uniforms.u_frequency_mid.value = 0.0
                this.uniforms.u_frequency_high.value = 0.0
                this.u_time = 0.0

                this.audioControls.playPauseButton.textContent = 'Play '
            } else {
                this.audio.play()
                this.audioControls.playPauseButton.textContent = 'Pause'
            }
        })

    }

    removePlayerControls() {
        document.querySelector('#player').innerHTML = ``
    }

    loadBuffer(trackFileData) {
        this.audio.stop()
        this.audioControls.playPauseButton.textContent = 'Play'
        const context = this.audio.context
        context.decodeAudioData(trackFileData, (buffer) => {
            this.audio.setBuffer(buffer)
            this.audio.setLoop(true)
            this.audio.setVolume(0.5)
            this.audio.play()
        })
    }

    /**
     * 
     * @param {string} track initial track to play
     */
    audioSetup(track) {
        // console.log(track)
        const listener = new THREE.AudioListener()
        this.camera.add(listener)
        this.audio = new THREE.Audio(listener)
        const audioLoader = new THREE.AudioLoader()
        
        audioLoader.load(
            track,
            (buffer) => {
                // console.log(buffer)
                this.audio.setBuffer(buffer)
                this.audio.setLoop(true)
                this.audio.setVolume(0.5)
                // this.audio.play()
            },
            (xhr) => {
                // console.log((xhr.loaded / xhr.total * 100) + '% loaded')
                // Update progress bar
                if (!this.audioControls.progressBar) return
                this.audioControls.progressBar.value = (xhr.loaded / xhr.total * 100)
            },
            (err) => {
                console.error('An error happened', err)
            }
        )
        this.analyser = new THREE.AudioAnalyser(this.audio, 64)
    }

    lights() {
        // const light = new THREE.DirectionalLight(0xffffff, 1)
        // light.position.set(0, 0, 5)
        // this.scene.add(light)
    }

    helper() {
        // const asixHelper = new THREE.AxesHelper(50)
        // this.scene.add(asixHelper)
    }

    setupCamera() {
        super.setupCamera()
        this.camera.position.z = 20
    }

    setupVisualizer() {
        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,

        })
        material.wireframe = true
        // material.transparent = true
        material.depthTest = true


        const geometry = new THREE.IcosahedronGeometry(4, 30)
        const mesh = new THREE.Mesh(geometry, material)
        this.scene.add(mesh)
    }

    animate(elapsedTime) {
        this.controls.update()
        this.uniforms.u_time.value = elapsedTime
        
        // Get low frequencies from the audio
        const f_data = this.analyser.getFrequencyData()
        const lowFreq = f_data.slice(0, 10)
        const lowFreqAvg = lowFreq.reduce((acc, curr) => acc + curr, 0) / lowFreq.length

        const midFreq = f_data.slice(10, 20)
        const midFreqAvg = midFreq.reduce((acc, curr) => acc + curr, 0) / midFreq.length

        const highFreq = f_data.slice(20, 30)
        const highFreqAvg = highFreq.reduce((acc, curr) => acc + curr, 0) / highFreq.length

    
        this.uniforms.u_frequency_low.value = lowFreqAvg
        this.uniforms.u_frequency_mid.value = midFreqAvg
        this.uniforms.u_frequency_high.value = highFreqAvg
        // this.scene.rotation.y += Math.sin(elapsedTime) * 0.005
        // this.scene.rotation.z += Math.cos(elapsedTime / 1000)
        // this.scene.rotation.x += Math.sin(elapsedTime / 1000)
    }

    finalize() {
        this.audio.stop()
        this.removePlayerControls()
    }

}