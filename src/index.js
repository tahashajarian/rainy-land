import * as THREE from 'three';
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';

import {
  Sky
} from 'three/examples/jsm/objects/Sky';

import * as dat from 'dat.gui';

import vertextGround from './shader/ground/v.glsl'
import fragGround from './shader/ground/f.glsl'


class Land {
  constructor() {
    this.configures()
    this.init();
    // this.initSky();
    this.creatEnviroment();
    this.addMeshes();
    this.handleEvents()
    this.addLight();
    //
    this.tick();
  }

  configures() {
    this.canvas = document.getElementById('land');
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.z = 5;
    this.camera.position.y = 5;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    })
    // document.body.append(this.renderer.domElement)
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enablePan = false
    this.controls.minDistance = 1;
    this.controls.maxDistance = 100;
    this.controls.maxPolarAngle = Math.PI / 2 - .1;
    this.textureLoader = new THREE.TextureLoader();
    this.scene.background = new THREE.Color(0xaaaaff);
    // this.renderer.setClearColor(0xffffff, 1)
    this.gui = new dat.GUI();

  }

  creatEnviroment() {

  }



  initSky() {

    // Add Sky
    this.sky = new Sky();
    this.sky.scale.setScalar(1000);
    this.scene.add(this.sky);

    this.sun = new THREE.Vector3();

    /// GUI

    this.effectController = {
      turbidity: 1,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
      elevation: 2,
      azimuth: 180,
      exposure: this.renderer.toneMappingExposure
    };



    this.gui.add(this.effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(() => this.guiChanged());
    this.gui.add(this.effectController, 'rayleigh', 0.0, 4, 0.001).onChange(() => this.guiChanged());
    this.gui.add(this.effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(() => this.guiChanged());
    this.gui.add(this.effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(() => this.guiChanged());
    this.gui.add(this.effectController, 'elevation', 0, 90, 0.1).onChange(() => this.guiChanged());
    this.gui.add(this.effectController, 'azimuth', -180, 180, 0.1).onChange(() => this.guiChanged());
    this.gui.add(this.effectController, 'exposure', 0, 1, 0.0001).onChange(() => this.guiChanged());

    this.guiChanged();

  }

  guiChanged() {

    const uniforms = this.sky.material.uniforms;
    uniforms['turbidity'].value = this.effectController.turbidity;
    uniforms['rayleigh'].value = this.effectController.rayleigh;
    uniforms['mieCoefficient'].value = this.effectController.mieCoefficient;
    uniforms['mieDirectionalG'].value = this.effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad(90 - this.effectController.elevation);
    const theta = THREE.MathUtils.degToRad(this.effectController.azimuth);

    this.sun.setFromSphericalCoords(1, phi, theta);

    uniforms['sunPosition'].value.copy(this.sun);

    this.renderer.toneMappingExposure = this.effectController.exposure;
    // renderer.render(scene, camera);

  }

  addMeshes() {
    const geometry = new THREE.PlaneGeometry(16, 16, 128, 128);
    const grassTexture = this.textureLoader.load('/textures/perlin-noise.png')
    const material = new THREE.ShaderMaterial({
      vertexShader: vertextGround,
      fragmentShader: fragGround,
      // wireframe: true,
      side: THREE.DoubleSide,
      uniforms: {
        uTexture: {
          value: grassTexture
        }
      }
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;

    this.scene.add(plane);
  }

  addLight() {
    let light = new THREE.DirectionalLight(0x808080, 1, 100);
    light.position.set(-100, 100, -100);
    light.target.position.set(0, 0, 0);
    light.castShadow = false;
    this.scene.add(light, new THREE.DirectionalLightHelper(light, 5));

    light = new THREE.DirectionalLight(0x404040, 1, 100);
    light.position.set(100, 100, -100);
    light.target.position.set(0, 0, 0);
    light.castShadow = false;
    this.scene.add(light, new THREE.DirectionalLightHelper(light, 5));

  }

  handleEvents() {
    window.addEventListener('resize', () => {

      // Update camera
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()

      // Update renderer
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

  }

  tick() {
    requestAnimationFrame(this.tick.bind(this))
    this.renderer.render(this.scene, this.camera);

  }

}



const land = new Land();