uniform sampler2D uTexture;
uniform float uAlpha;
varying vec2 vUv;
uniform vec3 uColor;

vec2 scaleUV(vec2 uv, float scale) {
  float center = 0.5;
  return ((uv - center) * scale) + center;
}
void main() {
  vec3 color = texture2D(uTexture, scaleUV(vUv, 0.8)).rgb;
  gl_FragColor = vec4(color, uAlpha);
          // gl_FragColor = vec4(color,1.0);
}