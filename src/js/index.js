import { GetScrollNum } from "./_class.js";
import { ScrollFunction } from "./_class.js";
import { ScrollObserver } from "./_class.js";
import { SplitTextAnimation } from "./_class.js";
import { SplitText } from "./_class.js";
import { StickAnime } from "./_class.js";
import gsap from "gsap";

const winH = innerHeight;
const winW = innerWidth;
let scrollY; //スクロール量格納用
let mediaQueryPC, mediaQueryTablet, mediaQueryMobile, mediaFlag; //メディアクエリ用変数

window.addEventListener("DOMContentLoaded", function () {
  // fvBg();
  fvParallax();
  mediaQueryFunc();
  aboutAnime();
  worksSlide();
  textFlow();
  scaleIn();
  // animate();
});

//----------------------------------------------------------------
//マウスストーカー
let cursorX, cursorY;
let scale = 0;
const cursorInner = document.getElementById("js-cursorInner");
const cursorOuter = document.getElementById("js-cursorOuter");
window.addEventListener("mousemove", function (e) {
  cursorX = e.clientX;
  cursorY = e.clientY;
  cursorInner.setAttribute(
    "style",
    `transform:translate(${cursorX}px,${cursorY}px)`
    );
    if (cursorOuter !== null) {
      cursorOuter.setAttribute(
        "style",
        `transform:translate(${cursorX}px,${cursorY}px) scale(${scale})`
        );
      }
    });
    
    const linkEls = document.querySelectorAll('a');
    linkEls.forEach(link => {
      link.addEventListener('mouseover', function () {
        cursorInner.classList.add('is-hovLink');
      });
      link.addEventListener('mouseout', function () {
        cursorInner.classList.remove('is-hovLink');
      });
    })
    //----------------------------------------------------------------
    
    

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

//----------------------------------------------------------------
//メディアクエリ用関数
function mediaQueryFunc() {
  mediaFlag;
  mediaQueryPC = window.matchMedia("(min-width:1024px)");
  mediaQueryTablet = window.matchMedia(
    "(max-width:1023px) and (min-width:768px)"
  );
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

  mediaQueryPC.addEventListener("change", mediaCheckPC);
  mediaQueryTablet.addEventListener("change", mediaCheckTablet);
  mediaQueryMobile.addEventListener("change", mediaCheckMobile);

  mediaCheckPC(mediaQueryPC);
  mediaCheckTablet(mediaQueryTablet);
  mediaCheckMobile(mediaQueryMobile);
}

//----------------------------------------------------------------

//----------------------------------------------------------------
//セクションタイトル
let sectionTtl = document.getElementById("js-sectionTtl");
const mvSecCb = function (el, isIntersecting) {
  if (isIntersecting) {
    sectionTtl.innerText = `00. Introduction`;
  }
};
const mvSecSo = new ScrollObserver(
  document.querySelectorAll(".js-mvSec"),
  mvSecCb,
  "-100px 0px -100px 0px",
  { once: false }
);

const aboutSecCb = function (el, isIntersecting) {
  if (isIntersecting) {
    sectionTtl.innerText = `01. Profile`;
  }
};
const aboutSecSo = new ScrollObserver(
  document.querySelectorAll(".js-aboutSec"),
  aboutSecCb,
  "-100px 0px -100px 0px",
  { once: false }
);

const worksSecCb = function (el, isIntersecting) {
  if (isIntersecting) {
    sectionTtl.innerText = `02. Works`;
  }
};
const worksSecSo = new ScrollObserver(
  document.querySelectorAll(".js-worksSec"),
  worksSecCb,
  "-100px 0px -100px 0px",
  { once: false }
);

const messageSecCb = function (el, isIntersecting) {
  if (isIntersecting) {
    sectionTtl.innerText = `03. Message`;
  }
};
const messageSecSo = new ScrollObserver(
  document.querySelectorAll(".js-messageSec"),
  messageSecCb,
  "-100px 0px -100px 0px",
  { once: false }
);

const contactSecCb = function (el, isIntersecting) {
  if (isIntersecting) {
    sectionTtl.innerText = `04. Contact`;
  }
};
const contactSecSo = new ScrollObserver(
  document.querySelectorAll(".js-contactSec"),
  contactSecCb,
  "-100px 0px -100px 0px",
  { once: false }
);

//----------------------------------------------------------------
//テキストアニメーション用関数

const cbTxt = function (el, isIntersecting) {
  const sta = new SplitTextAnimation(el);
  if (isIntersecting) {
    sta.clip();
    sta.fadeUpText();
  }
};
const cbTxtLtR = function (el, isIntersecting) {
  const sta = new SplitTextAnimation(el);
  if (isIntersecting) {
    sta.scaleInLtR();
  }
};
const cbTxtRtL = function (el, isIntersecting) {
  const sta = new SplitTextAnimation(el);
  if (isIntersecting) {
    sta.scaleInRtL();
  }
};

const soTxtLtR = new ScrollObserver(document.querySelectorAll(".targetLtR"), cbTxtLtR,"0px 0px -150px 0px");
const soTxtRtL = new ScrollObserver(document.querySelectorAll(".targetRtL"), cbTxtRtL,"0px 0px -150px 0px");
//.fadeUpTargetに対してfadeUpアニメーションを実行
const aboutSo = new ScrollObserver(
  document.querySelectorAll(".fadeUpTarget"),
  cbTxt,
  `0px 0px -150px 0px`
);

//----------------------------------------------------------------
//aboutのセクションのアニメーション
const ease = function ease(x) {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
};

function aboutAnime() {
  const aboutImg = document.getElementById("js-aboutImg"); //自分の写真
  const aboutTxtL = document.querySelectorAll(".js-aboutTxt-l");
  const about = document.querySelector(".js-about");
  const aboutClass = about.classList;
  const scrollMax = winH * 1.7; //アニメーションを実行させたいスクロール量
  const transMin = -aboutImg.clientHeight - 100; //translateYの最小値
  const transMax = winH * 0.15; //translateYの最大値

  //js-aboutImgをtransformYさせる用
  const imgTransform = new ScrollFunction(
    aboutImg,
    scrollMax,
    0,
    ease,
    transMin,
    transMax
  );

  //js-aboutImgのx軸方向のclip-pathを変更
  let imgWidth, imgHeight;

  //初回ロード時インスタンスを出し分ける
  if (mediaFlag === "pc") {
    //pcサイズ(1024px以上)
    imgWidth = new ScrollFunction(aboutImg, scrollMax, 0, ease, -67, 30);
    imgHeight = new ScrollFunction(aboutImg, scrollMax, 0, ease, -20, 30);
  }
  if (mediaFlag === "tablet" || mediaFlag === "mobile") {
    //タブレットサイズ(1024px未満)
    imgWidth = new ScrollFunction(aboutImg, scrollMax, 0, ease, -60, 30);
    imgHeight = new ScrollFunction(aboutImg, scrollMax, 0, ease, -10, 30);
  }

  //リサイズ時にインスタンスを出し分ける
  mediaQueryPC.addEventListener("change", function () {
    if (mediaFlag === "pc") {
      //pcサイズ(1024px以上)
      imgWidth = new ScrollFunction(aboutImg, scrollMax, 0, ease, -67, 30);
      imgHeight = new ScrollFunction(aboutImg, scrollMax, 0, ease, -20, 30);
    }
  });
  mediaQueryTablet.addEventListener("change", function () {
    if (mediaFlag === "tablet") {
      //タブレットサイズ(768px以上1024px未満)
      imgWidth = new ScrollFunction(aboutImg, scrollMax, 0, ease, -60, 30);
      imgHeight = new ScrollFunction(aboutImg, scrollMax, 0, ease, -10, 30);
    }
  });
  mediaQueryMobile.addEventListener("change", function () {
    if (mediaFlag === "mobile") {
      //モバイルサイズ(768px未満)
      imgWidth = new ScrollFunction(aboutImg, scrollMax, 0, ease, -60, 30);
      imgHeight = new ScrollFunction(aboutImg, scrollMax, 0, ease, -10, 30);
    }
  });

  //scrollBaseの上限値を設定するための変数
  const scrollBaseMax = winW * 1.5;
  const opNum = new ScrollFunction(aboutImg, scrollMax, 0, ease, 0.5,1);//画像のopacityをスクロールで変化させる

  window.addEventListener("scroll", function () {
    const transY = imgTransform.resultNormal;
    const changeW = imgWidth.resultNormal;
    const changeH = imgHeight.resultNormal;
    aboutImg.setAttribute(
      "style",
      `
    transform:translateY(${transY}px);
    clip-path:polygon(${-1 * changeW}% ${-1 * changeH}%,130% ${
        -1 * changeH
      }%,130% 130%,${-1 * changeW}% 130%);
      opacity:${opNum.resultNormal};
    `
    );
    scrollY = window.pageYOffset;
    const scrollBase = scrollY - 3.2 * winH + 250; //aboutTxtLの高さの時のスクロール量を0とする

    if (about.style.position === "fixed") {
      aboutClass.add("js-float");
    } else if (
      about.style.position !== "fixed" &&
      imgTransform.resultEase < -100
    ) {
      aboutClass.remove("js-float");
    }

    if (scrollBase >= 0 && scrollBase < scrollBaseMax) {
      aboutTxtL[0].setAttribute(
        "style",
        `transform:translateX(${scrollBase * 0.7}px)`
      );
      aboutTxtL[1].setAttribute(
        "style",
        `transform:translateX(-${scrollBase * 0.7}px)`
      );
      aboutTxtL[2].setAttribute(
        "style",
        `transform:translateX(${scrollBase * 0.7}px)`
      );
    } else if (scrollBase < 0) {
      aboutTxtL[0].setAttribute("style", `transform:translateX(0px)`);
      aboutTxtL[1].setAttribute("style", `transform:translateX(0px)`);
      aboutTxtL[2].setAttribute("style", `transform:translateX(0px)`);
    }
  });

  ScrollTrigger.create({
    trigger: ".js-about",
    pin: true,
    // pinSpacing: false
  });

  ScrollTrigger.create({
    trigger: ".js-about--2d",
    pin: true,
    // pinSpacing: false
  });
}

//テキストの分割(js-splitPartクラスを付与)
const st = new SplitText(
  document.querySelectorAll(".js-split"),
  "js-splitPart"
);

//----------------------------------------------------------------
//FVのテキストをパララックスさせる
function fvParallax() {
  const parallaxEls = document.querySelectorAll(".js-parallax");
  // let scrollY;
  const gsnInstance = new GetScrollNum();
  const fvCb = function (el, isIntersecting) {
    if (isIntersecting) {
      window.addEventListener(
        "scroll",
        function () {
          gsnInstance.getResult();
          scrollY = gsnInstance.scrollY;
          el.style.transform = `translateY(${scrollY * 0.5}px)`;
        },
        { passive: true }
      );
    }
  };
  const fvSO = new ScrollObserver(parallaxEls, fvCb, "0px", { once: false });

  gsap.to(".js-splitPart", {
    scrollTrigger: {
      trigger: ".js-parallax",
      start: "0px",
      scrub: true,
      delay: 0.4,
      ease: "power1.inOut",
    },
    y: -170,
    opacity: 0,
    stagger: {
      from: "start",
      amount: "1",
    },
  });
}

//----------------------------------------------------------------
//worksのスライダーカスタマイズ

function worksSlide() {
  const ttlSlide = document.querySelector(".js-ttlSlide");
  // let ttlSlideH = ttlSlide.clientHeight;
  const handleSlide = document.querySelector(".js-handleSlide");
  // let handleSlideH = handleSlide.clientHeight;
  const mainSlideContainer = document.querySelector(".js-mainSlide");
  const slideElem = document.querySelectorAll(".js-slide");
  const cursorInner = document.getElementById("js-cursorInner");
const cursorOuter = document.getElementById("js-cursorOuter");
  const cursorInnerClass = cursorInner.classList;
  const cursorOuterClass = cursorOuter.classList;
  for (let i = 0; i < slideElem.length; i++) {
    slideElem[i].addEventListener("mouseover", function () {
      scale = 1;
      cursorInnerClass.add("is-hov");
      cursorOuterClass.add("is-hov");
      cursorOuter.setAttribute(
        "style",
        `transform:translate(${cursorX}px,${cursorY}px) scale(${scale})`
      );
    });
    slideElem[i].addEventListener("mouseout", function () {
      scale = 0;
      cursorInnerClass.remove("is-hov");
      cursorOuterClass.remove("is-hov");
      cursorOuter.setAttribute(
        "style",
        `transform:translate(${cursorX}px,${cursorY}px) scale(${scale})`
      );
    });
  }

  const mainSplide = new Splide(".works-mainSlide", {
    perMove: 1,
    gap: "15vw",
    padding: "35%",
    heightRatio: 1.43,
    autoHeight: true,
    autoWidth: true,
    isNavigation: true,
    arrows: false,
    pagination: false,
    drag:true,
    easing: "cubic-bezier(1,.01,.17,1)",
    speed: 1000,
    waitForTransition: false,
    breakpoints: {
      768: {
        padding: "20%",
        arrows:true,
      }
    }
  }).mount();

  let currentSlide = mainSlideContainer.querySelector(".is-active");
  let currentSlideItem = currentSlide.querySelector(".js-slideItem");

  let slideCurrentIndex = 0; //移動後のスライドのインデックス
  let slidePrevIndex = 0; //移動する前のスライドのインデックス
  let slideNextIndex = 0;

  //スライド番号を表示
  const currentNum = document.querySelector(".js-currentIndex");
  const currentNum2 = document.querySelector(".js-currentIndex2");
  const totalNum = document.querySelector(".js-totalNum");
  totalNum.textContent = `0${mainSplide.length}`;

  const slideTtl = document.querySelector('.js-slideTtl');
  const slideSubTtl = document.querySelector('.js-slideSubTtl');
  const slideTtlOuter = document.querySelector('.js-ttlOuter');
  const slideSubTtlOuter = document.querySelector('.js-subTtlOuter');
  let slideTtlH = slideTtl.clientHeight;
  let slideSubTtlH = slideSubTtl.clientHeight;
  slideTtlOuter.setAttribute('style', `height:${slideTtlH}px`);
  slideSubTtlOuter.setAttribute('style', `height:${slideSubTtlH}px`);
  
  window.addEventListener('resize', function () {
    slideTtlH = slideTtl.clientHeight;
    slideTtlOuter.setAttribute('style', `height:${slideTtlH}px`);
  })
  
  mainSplide.on("move", function () {
    slideCurrentIndex = mainSplide.index;
    slidePrevIndex = mainSplide.Components.Controller.getIndex(true);
    slideNextIndex = mainSplide.Components.Controller.getPrev(true);
    currentSlideItem.setAttribute(
      "style",
      `transform:rotateX(0deg) rotateY(0deg)`
      );
      //タイトルをアニメーションさせたい
    gsap.to('.js-slideTtl', {
      y: "100%",
      ease:"Power4.easeInOut",
      })
    gsap.to('.js-slideSubTtl', {
      y: "100%",
      ease:"Power4.easeInOut",
      })
  });

  
  mainSplide.on("moved", function () {
    // ttlSplide.Components.Controller.go(slideCurrentIndex);
    // handleSplide.Components.Controller.go(slideCurrentIndex);
    currentNum.textContent = `0${mainSplide.index + 1}`;
    currentNum2.textContent = `0${mainSplide.index + 1}`;
    currentSlide = mainSlideContainer.querySelector(".is-active");
    currentSlideItem.setAttribute(
      "style",
      `transform:rotateX(0deg) rotateY(0deg)`
    );
    gsap.fromTo(".js-slideTtl", {
      y:"100%"
    }, {
      y: 0,
      ease:"Power4.easeInOut",
    })
    gsap.fromTo(".js-slideSubTtl", {
      y:"100%"
    }, {
      y: 0,
      ease:"Power4.easeInOut",
    })
    getOnMouse();
  });

  //スライドにカーソルを乗せた時
  const slide = document.querySelectorAll(".js-slide");
  let slideW = slide[0].clientWidth;
  let slideH = slide[0].clientHeight;
  const slideLPos = slide[0].getBoundingClientRect().left;
  let slideTPos = slide[0].getBoundingClientRect().top;
  let mouseX, mouseY, alignNum, verticalNum;

  function getOnMouse() {
    currentSlide = mainSlideContainer.querySelector(".is-active");
    currentSlideItem = currentSlide.querySelector(".js-slideItem");
    mainSlideContainer.addEventListener("mousemove", function (e) {
      slideTPos = slide[0].getBoundingClientRect().top;
      mouseX = ((e.clientX - slideLPos) / slideW).toFixed(2); //0~1
      mouseY = ((e.clientY - slideTPos) / slideH).toFixed(2); //0~1
      alignNum = ((mouseX - 0.5) * 30).toFixed(2);
      verticalNum = ((mouseY - 0.5) * 35).toFixed(2);

      if (mouseX < 0 || mouseX > 1 || mouseY < 0 || mouseY > 1) {
        currentSlideItem.setAttribute(
          "style",
          `transform:rotateX(0deg) rotateY(0deg)`
        );
      }
    });

    currentSlide.addEventListener("mouseout", function () {
      currentSlideItem.setAttribute(
        "style",
        `transform:rotateX(0deg) rotateY(0deg)`
      );
    });

    if (currentSlide.classList.contains("is-active")) {
      currentSlideItem.addEventListener("mousemove", function () {
        currentSlideItem.setAttribute(
          "style",
          `transform:rotateX(${verticalNum * -1}deg) rotateY(${alignNum}deg)`
        );
      });
    }
  }
  getOnMouse();
}

//----------------------------------------------------------------
//流れるテキスト

function textFlow() {
  const flowR = document.querySelectorAll(".js-flowingToR");
  const flowRW = flowR[0].offsetWidth;
  const flowL = document.querySelectorAll(".js-flowingToL");
  const flowLW = flowL[0].offsetWidth;
  let transX1 = -flowRW;
  let transX2 = -flowRW;
  let transX3 = -flowLW;
  let transX4 = -flowLW;

  function flowing() {
    if (scrollDir === "down") {
      transX1 += 2;
      transX2 += 2;
      transX3 -= 2;
      transX4 -= 2;

      if (transX1 > flowRW) {
        transX1 = -flowRW;
      }
      if (transX2 > 0) {
        transX2 = -flowRW * 2;
      }
      if (transX3 < -flowLW) {
        transX3 = flowLW;
      }
      if (transX4 < -flowLW * 2) {
        transX4 = 0;
      }

      flowR[0].setAttribute(
        "style",
        `transform:translate3d(${transX1}px,0px,0px)`
      );
      flowR[1].setAttribute(
        "style",
        `transform:translate3d(${transX2}px,0px,0px)`
      );
      flowL[0].setAttribute(
        "style",
        `transform:translate3d(${transX3}px,0px,0px)`
      );
      flowL[1].setAttribute(
        "style",
        `transform:translate3d(${transX4}px,0px,0px)`
      );
    } else if (scrollDir === "up") {
      transX1 -= 2;
      transX2 -= 2;
      transX3 += 2;
      transX4 += 2;
      if (transX1 < -flowRW) {
        transX1 = flowRW;
      }
      if (transX2 < -flowRW * 2) {
        transX2 = 0;
      }
      if (transX3 > flowLW) {
        transX3 = -flowLW;
      }
      if (transX4 > 0) {
        transX4 = -flowLW * 2;
      }
      flowR[0].setAttribute(
        "style",
        `transform:translate3d(${transX1}px,0px,0px)`
      );
      flowR[1].setAttribute(
        "style",
        `transform:translate3d(${transX2}px,0px,0px)`
      );
      flowL[0].setAttribute(
        "style",
        `transform:translate3d(${transX3}px,0px,0px)`
      );
      flowL[1].setAttribute(
        "style",
        `transform:translate3d(${transX4}px,0px,0px)`
      );
    }

    requestAnimationFrame(flowing);
  }
  flowing();
}

//---------------------------------------------------------------
//three.js

// let text;
// const canvas = document.getElementById('textCanvas');
// // Scene
// const scene = new THREE.Scene();

// const sizes = {
//   width: window.innerWidth /3 * 2,
//   height: window.innerHeight / 3,
// };

// //camera
// const camera = new THREE.PerspectiveCamera(
//   75,
//   sizes.width / sizes.height,
//   0.1,
//   100
// );
// camera.position.set(0, 0, 1.7);
// scene.add(camera);

// //Fonts
// const fontLoader = new FontLoader();
// fontLoader.load("./fonts/Lobster_Regular.json", (font) => {
//   const textGeometry = new TextGeometry("Playground", {
//     font: font,
//     size: 0.4,
//     height: 0.3,
//     curveSegments: 5,
//     bevelEnabled: true,
//     bevelThickness: 0.001,
//     bevelSize: 0.001,
//     bevelOffset: 0,
//     bevelSegments: 1,
//   });
//   textGeometry.center();

//   const textMaterial = new THREE.MeshNormalMaterial();
//   text = new THREE.Mesh(textGeometry, textMaterial);
//   scene.add(text);
// });

// // Renderer
// const renderer = new THREE.WebGLRenderer({
//   canvas:canvas,
//   alpha:true
// });
// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setClearColor(0x000000, 0);

// // Animate
// let rotateX = 0;
// const animate = () => {
//   renderer.render(scene, camera);
//   if (text !== undefined && scrollDir === "down") {
//     rotateX += 0.005;
//     text.rotation.x += 0.005;
//   } else if (text !== undefined && scrollDir === "up") {
//     rotateX -= 0.005;
//     text.rotation.x -= 0.005;
//   }
//   window.requestAnimationFrame(animate);
// };

// window.addEventListener('scroll', function (e) {
//   scrollY = window.pageYOffset;
//   text.rotation.x = rotateX + scrollY * 0.003;
// })

// window.addEventListener("resize", () => {
//   // Update sizes
//   sizes.width = window.innerWidth / 2;
//   sizes.height = window.innerHeight / 3;

//   // Update camera
//   camera.aspect = sizes.width / sizes.height;
//   camera.updateProjectionMatrix();

//   // Update renderer
//   renderer.setSize(sizes.width, sizes.height);
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });
//------------------------------------------------------------------------------------------------
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
    


//テキストアニメーション
const animeStart = innerHeight - 100; //開始位置
const animeEnd = innerHeight - 300; //終了位置
const scrubNum = 1; //アニメーションを指定秒の間実行させる
function scaleIn() {
  //下から縮小しながら
  const scaleInBtTEls = document.querySelectorAll(".js-scaleInBtT");
  scaleInBtTEls.forEach(BtTel => {
    gsap.from(BtTel, {
      scrollTrigger: {
        trigger: BtTel,
        start: `top ${animeStart}px`,
        end: `top ${animeEnd}px`,
        scrub: scrubNum,
      },
      y: -100,
      opacity: 0,
      scale: 2,
    });
  });
  

  const scaleInBtTYEls = document.querySelectorAll(".js-scaleInBtTY");

  scaleInBtTYEls.forEach(BtTYel => {
    gsap.from(BtTYel, {
      scrollTrigger: {
        trigger:BtTYel,
        start: `top ${animeStart}px`,
        end: `top ${animeEnd}px`,
        scrub: scrubNum,
      },
      y:150,
      scaleY:1.5,
      opacity: 0,
    })
  })
}
