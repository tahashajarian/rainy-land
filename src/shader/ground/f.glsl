uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
  vec4 textureColor = texture2D(uTexture, vUv);
  gl_FragColor = textureColor;
  // gl_FragColor = vec4(vUv.y, vUv.y, vUv.y, 1.0);
}