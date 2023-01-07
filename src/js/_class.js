"use strict";

//スクロール量、率、正規化した値を取得するクラス
export class GetScrollNum {
  constructor() {
    this.scrollY = "";
    this.normalizeScrollY = "";
    this.scrollRate = "";
    this.viewH = document.documentElement.scrollHeight;
    this.totalScrollY = this.viewH - innerHeight;
  }

  getResult() {
    this.scrollY = window.pageYOffset; //スクロール量
    this.normalizeScrollY = this.scrollY / this.totalScrollY; //スクロール量正規化
    this.scrollRate = Math.floor(this.normalizeScrollY * 100); //スクロール率
  }
}
//----------------------------------------------------------------

//---------------------------------------------------------------

export class ScrollFunction {
  constructor(target, scrollMax, rootMargin, ease, min, max) {
    this.target = target; //変化させたいターゲット
    this.scrollMax = scrollMax; //任意のスクロール量の最大値
    this.rootMargin = rootMargin; //画面のどこにtargetが来たら検知開始するか
    this.ease = ease; //イージング関数を入れる
    this.min = min; //任意の範囲の最小値
    this.max = max; //任意の範囲の最大値
    this.scrollY = window.pageYOffset; //画面上部からのスクロール量
    this.targetPos = this.target.getBoundingClientRect().top + this.scrollY; //targetのページ上部からの位置
    this.targetScroll = ""; ///任意の要素がrootMarginの位置に来たときにスクロール量を0としてscrollMaxまで変化する
    this.winH = innerHeight;
    this.resultNormal = 0; //linearでmin~maxの間を変化する変数
    this.resultEase = 0; //イージングを適応してmin~maxまで変化する変数
    this._getResultNum(); //スクロール量を取得して値を更新する
  }

  //正規化
  _norm(v, a, b) {
    return (v - a) / (b - a);
  }

  //線形補完
  _lerp(a, b, t) {
    return a + (b - a) * t;
  }

  _getResultNum() {
    //要素が画面内に最初からいる時(FV内にある時)スクロール量をそのまま正規化に使用する
    if (this.targetPos < this.winH + this.target.clientHeight) {
      window.addEventListener(
        "scroll",
        function () {
          this.scrollY = window.pageYOffset;
          if (this.scrollY > this.scrollMax) {
            this.scrollY = this.scrollMax;
          }
          const normalizeNum = this._norm(this.scrollY, 0, this.scrollMax); //0~1
          const easeNum = this.ease(normalizeNum); //正規化した数値にイージングを効かせる
          this.resultNormal = this._lerp(
            this.min,
            this.max,
            normalizeNum
          ).toFixed(2); //イージングなし
          this.resultEase = this._lerp(this.min, this.max, easeNum).toFixed(2); //イージングが効いた値
        }.bind(this)
      );
    } else {
      window.addEventListener(
        "scroll",
        function () {
          this.scrollY = window.pageYOffset;
          this.targetScroll =
            this.scrollY - this.targetPos + this.winH + this.rootMargin;
          //要素が画面内に入ってからのスクロール量を0~this.scrollMaxに留める
          if (this.targetScroll !== undefined && this.targetScroll < 0) {
            this.targetScroll = 0;
          } else if (
            this.targetScroll !== undefined &&
            this.targetScroll > this.scrollMax
          ) {
            this.targetScroll = this.scrollMax;
          }
          const normalizeNum = this._norm(this.targetScroll, 0, this.scrollMax); //0~1
          const easeNum = this.ease(normalizeNum); //正規化した数値にイージングを効かせる
          this.resultNormal = this._lerp(
            this.min,
            this.max,
            normalizeNum
          ).toFixed(2); //イージングなし
          this.resultEase = this._lerp(this.min, this.max, easeNum).toFixed(2); //イージングが効いた値
        }.bind(this)
      );
    }
  }
}

//使い方
//target(第一引数)にはElementを入れる = document.getElementByID('任意の要素');
//使いたいイージング関数を変数に格納して用意
//スクロールイベント外でインスタンス化
//スクロールイベント内で欲しい値を取得(resultEase or resultNormal)
//targetの変更したいスタイルに取得した数値を適応する
//--------------------------------------------------------

//----------------------------------------------------------------
export class ScrollObserver {
  constructor(els, cb, rootMargin, options) {
    this.els = els; //NodeListを渡す
    const defaultOptions = {
      root: null, //交差対象
      rootMargin: rootMargin, //交差判定境界線
      threshold: 0, //targetのどこで交差判定するか
      once: true,
    };
    this.cb = cb;
    this.options = Object.assign(defaultOptions, options); //オブジェクトを合体させる
    this.once = this.options.once;
    this._init();
  }

  //初期化
  _init() {
    const callback = function (entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          //画面内に入った時
          this.cb(entry.target, true);
          if (this.once) {
            observer.unobserve(entry.target); //監視を終了する
          }
        } else {
          //画面外に出た時
          this.cb(entry.target, false);
        }
      });
    };

    this.io = new IntersectionObserver(callback.bind(this), this.options);
    this.els.forEach((el) => this.io.observe(el));
  }

  destroy() {
    this.io.disconnect(); //IOの監視を終了する
  }
}

//使い方
//1.コールバック関数を定義する
// const cb = function (el, isIntersecting) {
//   if (isIntersecting) {
//     ここに画面内に入ったら行いたい処理をかく
//   }
// }
//※上記のelにはセレクタではなくElement(entry.target)が渡ることに注意する
//2.インスタンス化する(第一引数にNodeListを渡す)
// const so = new ScrollObserver(document.querySelectorAll('.監視したい要素'), cb, rootMargin,options:あってもなくても良い,{once:false});
//once:falseだと何度も監視をする。デフォルトはtrueで画面内に入った時に一度だけ処理を実行する
//----------------------------------------------------------------

export class SplitTextAnimation {
  constructor(el) {
    this.el = el; //Elementを渡す
    this.chars = this.el.innerText.trim();
    this.concatStr = "";
    this.el.innerHTML = this._splitText(); //クラスに渡された引数が分割された状態のDOM
    this.animations = [];
    this.chars = "";
    this.transY = "170px"; //transformY
    this.outer = document.createElement("div"); //対象の親にdivを追加
    this._init();
  }

  //テキストがcharクラスをもつspanで1文字ずつ分割される関数
  _splitText() {
    for (let c of this.chars) {
      c = c.replace(" ", "&nbsp;");
      this.concatStr += `<span class="char">${c}</span>`;
    }
    return this.concatStr;
  }

  //分割したテキストにデフォルトスタイルを付与
  _init() {
    this.chars = this.el.querySelectorAll(".char"); //指定した要素(el)のcharクラスを取得する
    this.chars.forEach((char) => {
      char.style.display = "inline-block";
      char.style.transform = `translateY(${this.transY})`;
    });
  }

  //アニメーションの対象をdivで囲みclip-path
  clip() {
    this.outer.classList.add("js-outer"); //囲むdivにクラスを付与
    this.el.parentNode.insertBefore(this.outer, this.el); //対象の親要素の子要素にdivを挿入
    this.outer.appendChild(this.el); //生成したdivの中に対象を入れる
    this.outer.style.clipPath = "polygon(0 0,100% 0,100% 100%,0 100%)"; //divより外側をclip-pathで切り取る
  }

  //1文字ずつfadeUpする
  fadeUpText() {
    // this._clip(); //isIntersectingになったら実行される
    //タイミング制御用オブジェクトを定義
    let timings = {
      easing: "ease-in-out",
      fill: "forwards",
    };
    let x, easing;

    this.chars = this.el.querySelectorAll(".char"); //指定した要素(el)のcharクラスを取得する
    this.chars.forEach((char, i) => {
      x = i / (this.chars.length - 1); //0 ~ 1
      const maxDelay = 170; //delay最大値
      //イージング関数
      function ease(x) {
        return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
      }
      easing = ease(x);
      timings.delay = easing * maxDelay;
      timings.duration = 550;
      const animation1 = char.animate(
        [
          { transform: `translateY(${this.transY}) rotateZ(20deg)` },
          { transform: "translateY(0px) rotateZ(0)" },
        ],
        timings
      );
      animation1.cancel();
      this.animations.push(animation1);
    });
    this.animations.forEach((anim) => {
      anim.play();
    });
  }

  scaleInLtR() {
    let timings = {
      easing: "ease-in-out",
      fill: "forwards",
    };
    let x, easing;
    this.chars = this.el.querySelectorAll(".char"); //指定した要素(el)のcharクラスを取得する
    this.chars.forEach((char, i) => {
      x = i / (this.chars.length - 1); //0 ~ 1
      const maxDelay = 0; //delay最大値
      //イージング関数
      function ease(x){
        return Math.sqrt(1 - Math.pow(x - 1, 2));
        }
      easing = ease(x);
      timings.delay = easing * maxDelay;
      timings.duration = 800;
      const animation1 = char.animate(
        [
          { transform: `translateX(-50px) skewX(20deg)`,opacity:0 },
          { transform: "translateX(0px) skewX(0)", opacity: 1},
        ],
        timings
      );
      animation1.cancel();
      this.animations.push(animation1);
    });
    this.animations.forEach((anim) => {
      anim.play();
    });
  }
  scaleInRtL() {
    let timings = {
      easing: "ease-in-out",
      fill: "forwards",
    };
    let x, easing;
    this.chars = this.el.querySelectorAll(".char"); //指定した要素(el)のcharクラスを取得する
    this.chars.forEach((char, i) => {
      x = i / (this.chars.length - 1); //0 ~ 1
      const maxDelay = 0; //delay最大値
      //イージング関数
      function ease(x){
        return Math.sqrt(1 - Math.pow(x - 1, 2));
        }
      easing = ease(x);
      timings.delay = easing * maxDelay;
      timings.duration = 800;
      const animation1 = char.animate(
        [
          { transform: `translateX(50px) skewX(-20deg)`,opacity:0 },
          { transform: "translateX(0px) skewX(0)", opacity: 1},
        ],
        timings
      );
      animation1.cancel();
      this.animations.push(animation1);
    });
    this.animations.forEach((anim) => {
      anim.play();
    });
  }
}

//使い方
//1.インスタンス化
// const ta = new SplitTextAnimation(ここにアニメーションさせたい要素のセレクタを渡す)
//2.アニメーション関数の実行
// ta.fadeUpText()

//----------------------------------------------------------------
//classNameに任意のクラス名を渡すことで、テキスト分割時のspanのクラスを指定できる
export class SplitText {
  constructor(els,className) {
    this.els = els;//NodeListを渡す
    this.className = className
    this.els.forEach((el) => {
      this.chars = el.innerText.trim();
      this.concatStr = "";
      el.innerHTML = this._splitText();
    })
  }
  //テキストがcharクラスをもつspanで1文字ずつ分割される関数
  _splitText() {
    for (let c of this.chars) {
      c = c.replace(" ", "&nbsp;");
      this.concatStr += `<span class="${this.className}">${c}</span>`;
    }
    return this.concatStr;
  }
}



//----------------------------------------------------------------
//吸い付くテキスト
export class StickAnime {
  constructor(els,range) {
    this.els = els;
    if (range !== undefined) {
    this.range = range;
    }
    this.mouseX = 0;//マウス座標
    this.mouseY = 0;
    this.normX = 0;//マウス座標を-1~+1の数値へ変換
    this.normY = 0;
    this.getHoverMousePos();
  }

  //ホバーした時のマウス座標と、それを−１~１へ変換した数値を取得
  getHoverMousePos() {
    this.els.forEach((el) => {
      let elW = el.clientWidth;
      let elH = el.clientHeight;
      let elPosX, elPosY;
      window.addEventListener("resize", function () {
        elW = el.clientWidth;
        elH = el.clientHeight;
      });
      //ホバーした時に要素の位置を取得
      el.addEventListener("mouseover", function () {
        elPosX = el.getBoundingClientRect().left;
        elPosY = el.getBoundingClientRect().top;
      });


      el.addEventListener("mousemove", function (e) {
        //ホバーしているときにマウス座標を取得
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        this.normX = (((this.mouseX - elPosX) / elW - 0.5) * 2).toFixed(2); //-1~1
        this.normY = (((this.mouseY - elPosY) / elH - 0.5) * 2).toFixed(2); //-1~1
      }.bind(this));
    });
  }

  //stickTargetに吸い付くアニメーションを付与
  stickyMovePar() {
    this.els.forEach((el) => {
      const target = el.querySelector(".stickTarget");
      el.addEventListener("mousemove", function () {
        target.setAttribute(
          "style",
          `transform:translate(${this.normX * 10}%,${this.normY * 80}%);`//Y座標の方が動きが小さくなるため適宜調整
        );
      }.bind(this));
      //mouseoutでリセット
      el.addEventListener("mouseout", function () {
        target.setAttribute("style", `transform:translate(0%,0%)`);
        this.mouseX = 0;
        this.mouseY = 0;
        this.normX = 0;
        this.normY = 0;
      });
    });
  }
  stickyMovePx() {
    this.els.forEach((el) => {
      const target = el.querySelector(".stickTarget");
      let transX = (this.normX * this.range).toFixed(2);
      let transY = (this.normY * this.range).toFixed(2);
      el.addEventListener("mousemove", function () {
      transX = (this.normX * this.range).toFixed(2);
      transY = (this.normY * this.range).toFixed(2);

        target.setAttribute(
          "style",
          `transform:translate(${transX}px,${transY}px);`
          //上下[this.range]px四方の範囲で追従する
        );
      }.bind(this));
      //mouseoutでリセット
      el.addEventListener("mouseout", function () {
        target.setAttribute("style", `transform:translate(0%,0%)`);
        this.mouseX = 0;
        this.mouseY = 0;
        this.normX = 0;
        this.normY = 0;
      });
    });
  }
}

//できること
//任意のクラスを持つ要素にホバーした時にカーソル座標の取得、また座標の正規化(0~1へ変換)
//任意のクラスを持つ要素の中にある「stickTarge」クラスを持つ要素のtranslateを正規化したカーソル座標と連動させて、吸い付く動きをつける。
//任意のクラスを持つ要素は複数でも可能。

//使い方
//HTML側で、ホバーした時にカーソル座標を取得したい要素を用意
//吸い付くテキストを生成したい場合は、上記の中に[stickTarget]クラスを持つ要素を作る
//引数にNodeListと、px指定で移動させたい時は、要素を追従させたい範囲(range:px)を渡してインスタンス化
//stickyMovePar(%指定)stickyMovePx(px指定、追従範囲指定可能)かを実行。
//cssで任意のtransitionを付与

const sa = new StickAnime(document.querySelectorAll(".wrapper"),50);
sa.stickyMovePx();
// const sa = new StickAnime(document.querySelectorAll(".wrapper"));
// sa.stickyMovePar();
