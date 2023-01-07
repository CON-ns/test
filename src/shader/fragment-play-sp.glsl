varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform float uTime;
  
        void main(){
          //rgbシフトありの場合以下を適応(uTimeに乗算する数値でシフト幅を調整)
          vec2 offset = vec2(0.0,uTime * 0.0003);
          vec3 normalColor = texture2D(uTexture,vUv).rgb;
          gl_FragColor = vec4(normalColor, 1.0);
        }