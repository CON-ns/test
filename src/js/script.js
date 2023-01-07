import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import fragment from "../shader/fragment.glsl";
import vertex from "../shader/vertex.glsl";
import { GetScrollNum } from "./_class.js";
import { ScrollFunction } from "./_class.js";
import { ScrollObserver } from "./_class.js";
import { SplitTextAnimation } from "./_class.js";
import { SplitText } from "./_class.js";
import { StickAnime } from "./_class.js";



const winH = innerHeight;
const winW = innerWidth;
let scrollY; //スクロール量格納用

window.addEventListener('DOMContentLoaded', function () {
  mediaQueryFunc();
  mediaReload();
  playgroundLink();
});


// //----------------------------------------------------------------
//背景ノイズ--------------------------------------------------------
const gradient = new Gradient();
gradient.initGradient("#canvas-bg");
//---------------------------------------------------------------------------------
//スクロール方向検知
let scrollDir = "down";
let set_position = 0;
window.addEventListener("scroll", function () {
  if (set_position < document.documentElement.scrollTop) {
    scrollDir = "down";
  } else {
    scrollDir = "up";
  }
  set_position = document.documentElement.scrollTop;
});
window.addEventListener("touchmove", function () {
  if (set_position < document.documentElement.scrollTop) {
    scrollDir = "down";
  } else {
    scrollDir = "up";
  }
  set_position = document.documentElement.scrollTop;
});
//---------------------------------------------------------------------------------
//fadeUpAnimation
const fadeUpCb = function fadeUpAnime(el, isIntersecting) {
  el.setAttribute('style', `opacity:0;transform:translateY(50px)`);
  if (isIntersecting) {
    let timings = {
      easing: "cubic-bezier(.19,.2,.1,.38)",
      fill: "forwards",
    };
    timings.duration = 1300;
    el.animate(
      [
        { transform: `translateY(30px)`, opacity: 0, },
        { transform: `translateY(-8px)`, opacity: 1, },
        { transform: `translateY(0px)`, opacity: 1, },
      ],
      timings
      );
    }
  }
  const fadeLtRCb = function fadeUpAnime(el, isIntersecting) {
    el.setAttribute('style', `opacity:0;transform:translateY(50px)`);
    if (isIntersecting) {
      let timings = {
        easing: "cubic-bezier(.19,.2,.1,.38)",
        fill: "forwards",
      };
      timings.duration = 1300;
      el.animate(
        [
          { transform: `translateX(-30px)`, opacity: 0, },
          { transform: `translateX(8px)`, opacity: 1, },
          { transform: `translateX(0px)`, opacity: 1, },
        ],
        timings
        );
      }
    }

    const fadeLtREls = document.querySelectorAll('.js-fadeLtRTarget')
    const fadeLtrSo = new ScrollObserver(fadeLtREls, fadeLtRCb, "0px 0px -150px 0px");
    const fadeUpEls = document.querySelectorAll('.js-fadeUpTarget')
    const fadeUpSo = new ScrollObserver(fadeUpEls, fadeUpCb, "0px 0px -150px 0px");


//-----------------------------------------------------------------------------------------
//吸い付くボタン
const stickAnimeInstance = new StickAnime(document.querySelectorAll(".js-stickOuter"),40);
const stickAnimeInstanceProfile = new StickAnime(document.querySelectorAll(".js-stickOuterProfile"),20);
// const stickAnimeInstanceTop = new StickAnime(document.querySelectorAll(".js-stickOuterTop"),20);
stickAnimeInstance.stickyMovePx();
stickAnimeInstanceProfile.stickyMovePx();
// stickAnimeInstanceTop.stickyMovePx();
//-


let mediaQueryPC, mediaQueryTablet, mediaQueryMobile,mediaFlag;

//メディアクエリ用関数
function mediaQueryFunc() {
  mediaFlag;
  mediaQueryPC = window.matchMedia("(min-width:1024px)");
  mediaQueryTablet = window.matchMedia("(max-width:1023px) and (min-width:768px)");
  mediaQueryMobile = window.matchMedia("(max-width:767px)");
  
  function mediaCheckPC(event) {
    if (event.matches) {
      mediaFlag = "pc";
    }
  }
  function mediaCheckTablet(event) {
    if (event.matches) {
      mediaFlag = "tablet";
    }
  }
  function mediaCheckMobile(event) {
    if (event.matches) {
      mediaFlag = "mobile";
    }
  }
  
  mediaQueryPC.addEventListener('change',mediaCheckPC);
  mediaQueryTablet.addEventListener('change',mediaCheckTablet);
  mediaQueryMobile.addEventListener('change', mediaCheckMobile);
  
  mediaCheckPC(mediaQueryPC);
  mediaCheckTablet(mediaQueryTablet);
  mediaCheckMobile(mediaQueryMobile);
}

function mediaReload(){
    //リサイズ時(ブレイクポイントを超える度に発火)
  mediaQueryPC.addEventListener('change', function () {
    if (mediaFlag === "pc") {
      //pcサイズ(1024px以上)
      window.location.reload();
    }
  });
  mediaQueryTablet.addEventListener('change', function () {
    if (mediaFlag === "tablet") {
      //タブレットサイズ(768px以上1024px未満)
      window.location.reload();
    }
  });
  mediaQueryMobile.addEventListener('change', function () {
    if (mediaFlag === "mobile") {
      //モバイルサイズ(768px未満)
      window.location.reload();
    }
  });
}




// ---------------------------------------------------------------
// three.js

function playgroundLink() {
  let text;
const canvas = document.getElementById('js-playgroundCanvas');
// Scene
  const scene = new THREE.Scene();
  
  if (!canvas) return;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight / 3,
}

const camera = new THREE.PerspectiveCamera(
  70,
  sizes.width / sizes.height,
  0.001,
  1000
);
if (mediaFlag === "pcL" || mediaFlag === "pc") {
  camera.position.set(0, 0, 0.5);
} else {
  camera.position.set(0, 0, 0.6);
}
scene.add(camera);

canvas.addEventListener('mouseover', function () {
  gsap.to(camera.position, {
    z: 0.45,
    duration: 0.4,
    onComplete: () => {
      camera.updateProjectionMatrix();
    }
  })
});

canvas.addEventListener('mouseout', function () {
  gsap.to(camera.position, {
    z: 0.5,
    duration: 0.4,
    onComplete: () => {
      camera.updateProjectionMatrix();
    }
  })
});


//Fonts
const fontLoader = new FontLoader();
fontLoader.load("./fonts/Lobster_Regular.json", (font) => {
  const textGeometry = new TextGeometry("PLAYGROUND", {
    font: font,
    size: 0.05,
    height: 0.01,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.0001,
    bevelSize: 0.001,
    bevelOffset: 0,
    bevelSegments: 10,
    letterSpacing: 200
  });
  console.log(textGeometry.parameters);
  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial({
    depthTest:true,
    depthWrite:true,
    color:0xd9c4b1,
  });
  text = new THREE.Mesh(textGeometry, textMaterial);
  text.position.set(0, 0, 0.3);
  text.rotation.z = (Math.PI / 2) / 15;
  scene.add(text);
  
});



// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas:canvas,
  alpha:true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000,0);

// Animate
let rotateX = 0;
const animate = () => {
  if (text !== undefined && scrollDir === "down") {
    rotateX += 0.005;
    text.rotation.x += 0.005;
  } else if (text !== undefined && scrollDir === "up") {
    rotateX -= 0.005;
    text.rotation.x -= 0.005;
  }
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};

window.addEventListener('scroll', function (e) {
  scrollY = window.pageYOffset;
  text.rotation.x = rotateX + scrollY * 0.003;
})

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth / 2;
  sizes.height = window.innerHeight / 3;

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
animate();
}

//-------------------------------------------------------------------------------
//宇宙
function lerp(a, b, t) {
  return a * (1 - t) + b*t;
}

class Sketch{
  constructor(options) {
    this.scene = scene;
    this.container = options.dom;
    this.width = sizes.width;
    this.height = sizes.height;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container,
      antialias:true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000,0);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.point = new THREE.Vector3();

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    this.camera.position.set(0, 0.2, 0.5);
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.materials = [];

    this.isPlaying = true;

    let opts = [
      {
      min_radius:0.3,
      max_radius: 1.5,
      color: '#F29979',
        size: 0.3,
      amp:1
      },
      {
      min_radius:0.3,
      max_radius: 1.6,
      color: '#CABFD9',
        size: 0.4,
      amp:3
      },
      {
      min_radius:0.3,
      max_radius: 1.6,
      color: '#0C0F40',
        size: 0.2,
      amp:3
      },
      {
      min_radius:0.3,
      max_radius: 1.6,
      color: '#646E8C',
        size: 0.4,
      amp:3
      },
      {
      min_radius:0.3,
      max_radius: 1.6,
      color: '#ECF2DF',
        size: 0.3,
      amp:3
      },
    ]

    opts.forEach(op => {
      this.addObject(op);
    });
    this.pointer = [];
    this.resize();
    this.render();
    this.setupResize();
  }

  raycasterEvent() {

    let mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10,10,10).rotateX(-Math.PI/2),
      new THREE.MeshBasicMaterial({ color: 0xff0000,wireframe:true })
    )

    let test = new THREE.Mesh(
      new THREE.SphereGeometry(0.1,10,10),
      new THREE.MeshBasicMaterial({ color: 0xff0000,wireframe:true })
    )

    this.scene.add(test);

    window.addEventListener('pointermove', (event)=>{
      this.pointer.x = (event.clientX / this.width) * 2 - 1;
      this.pointer.y = -(event.clientY / this.height) * 2 + 1;
      
      this.raycaster.setFromCamera(this.pointer, this.camera);

      const intersects = this.raycaster.intersectObjects([mesh]);

      if (intersects[0]) {
        test.position.copy(intersects[0].point);
        this.point.copy(intersects[0].point);
      }
    })
  }

  settings() {
    let that = this;
    this.settings = {
      progress: 0,
    }
    this.gui = new GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.camera.updateProjectionMatrix();
  }

  addObject(opts) {
    let that = this;
    let count = 1000;
    let min_radius = opts.min_radius;//円の内側の半径
    let max_radius =opts.max_radius;//円の外側の半径
    let particlegeo = new THREE.PlaneGeometry(1, 1);
    let geo = new THREE.InstancedBufferGeometry();
    geo.instanceCount = count;
    geo.setAttribute('position', particlegeo.getAttribute('position'));
    geo.index = particlegeo.index;

    let pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      let theta = Math.random() * 2 * Math.PI;
      let r = lerp(min_radius, max_radius, Math.random());
      let x = r*Math.sin(theta);
      let y = (Math.random()-0.5)*0.1;
      let z = r*Math.cos(theta);
      pos.set([
        x,y,z
      ],i*3)
    }

    geo.setAttribute('pos', new THREE.InstancedBufferAttribute(pos, 3,false));

    let material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        uTexture: { value: new THREE.TextureLoader().load(particleTexture) },
        time: { value: 0 },
        uAmp: { value:opts.amp },
        uMouse: { value:new THREE.Vector3() },
        size: { value: opts.size },
        uColor:{value:new THREE.Color(opts.color)},
        resolution: { value: new THREE.Vector4() }
      },
      transparent: true,
      depthTest: false,
      vertexShader:vertex,
      fragmentShader:fragment
    });
    this.materials.push(material);

    this.geometry = new THREE.PlaneGeometry(1,1);

    this.points = new THREE.Mesh(geo,material);
    this.scene.add(this.points);
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.05;
    this.materials.forEach(m => {
      m.uniforms.time.value = this.time*0.3;
      m.uniforms.uMouse.value = this.point;
    })
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

// const mv = new Sketch({
//   dom: document.getElementById('js-playground')
// });
