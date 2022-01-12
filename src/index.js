import * as THREE from 'three';
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';

import {
  Sky
} from 'three/examples/jsm/objects/Sky';

import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';

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
    this.addHome();
    this.addRain();
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
      // alpha: true
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
    // this.scene.background = new THREE.Color(0xaaaaff);
    // this.renderer.setClearColor(0xffffff, 1)
    this.gui = new dat.GUI();
    this.clock = new THREE.Clock()
    const fogColor = new THREE.Color(0xffffff);

    // this.scene.background = fogColor;
    // this.scene.fog = new THREE.Fog(fogColor, 0.0025, 20);

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
    const geometry = new THREE.PlaneGeometry(64, 64, 128, 128);
    const grassTexture = this.textureLoader.load('/textures/perlin-noise.png')
    const material = new THREE.ShaderMaterial({
      vertexShader: vertextGround,
      fragmentShader: fragGround,
      // wireframe: true,
      side: THREE.DoubleSide,
      uniforms: {
        uTexture: {
          value: grassTexture
        },
        uTime: {
          value: 0
        },
        uFrequence: {
          value: .1,
        },
        uSpeedWave: {
          value: 1.,
        }
      }
    });
    this.plane = new THREE.Mesh(geometry, material);
    this.plane.rotation.x = -Math.PI / 2;

    this.scene.add(this.plane);
  }

  addLight() {
    let light = new THREE.DirectionalLight(0x808080, 1, 100);
    light.position.set(-100, 50, -100);
    light.target.position.set(0, 0, 0);
    light.castShadow = false;
    this.scene.add(light, new THREE.DirectionalLightHelper(light, 5));

    light = new THREE.DirectionalLight(0x404040, 1, 100);
    light.position.set(100, 50, -100);
    light.target.position.set(0, 0, 0);
    light.castShadow = false;
    this.scene.add(light, new THREE.DirectionalLightHelper(light, 5));

  }



  addRain() {
    const particleTexture = this.textureLoader.load('/textures/particles/12.png')
    const particlesGeometry = new THREE.BufferGeometry()
    const count = 50000;

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 64
      colors[i] = Math.random()
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    // particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Material
    const particlesMaterial = new THREE.PointsMaterial()

    particlesMaterial.size = 0.2
    particlesMaterial.sizeAttenuation = true

    particlesMaterial.color = new THREE.Color('#ff88cc')

    particlesMaterial.transparent = true
    particlesMaterial.alphaMap = particleTexture
    // particlesMaterial.alphaTest = 0.01
    // particlesMaterial.depthTest = false
    particlesMaterial.depthWrite = false
    particlesMaterial.blending = THREE.AdditiveBlending

    particlesMaterial.vertexColors = true

    // Points
    this.particles = new THREE.Points(particlesGeometry, particlesMaterial)
    this.scene.add(this.particles)
  }

  addHome() {
    this.gltflLoder = new GLTFLoader();
    this.gltflLoder.load('/models/house2.glb', (model) => {
      for (let i = 0; i <= model.scene.children.length; i++) {
        const child = model.scene.children[i]
        child.position.y += 3
        this.scene.add(child)
      }
    })
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
    this.plane.material.uniforms.uTime.value = this.clock.getElapsedTime();
    this.particles.position.y -= 0.08
    if (this.particles.position.y <= 0) {
      this.particles.position.y = 31

    }
  }

}



const land = new Land();