import * as THREE from 'three';
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';



class Land {
  constructor() {
    this.configures()
    this.init();
    this.addCube();
    // this.addLight();
    //
    this.tick();
  }

  configures() {
    this.canvas = document.getElementById('land');
    console.log(this.canvas)
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
    this.camera.position.z = 5;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      // powerPreference: 'high-performance',
      antialias: true,
      background: 0xffffff,
    })
    // document.body.append(this.renderer.domElement)
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true

  }

  addCube() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true
    });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  }

  addLight() {
    const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
    directionalLight.position.set(0.25, 3, 2.25)
    this.scene.add(directionalLight)
  }

  tick() {
    requestAnimationFrame(this.tick.bind(this))
    this.renderer.render(this.scene, this.camera);
  }

}



const land = new Land();
console.log('object')