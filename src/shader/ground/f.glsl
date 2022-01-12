uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
  vec4 textureColor = texture2D(uTexture, vUv);
  gl_FragColor = vec4(textureColor.x * 0.1 + 0.3, textureColor.y * 0.6 , textureColor.z * .1 + 0.2, 1.0);
  // gl_FragColor = vec4(vUv.y, vUv.y, vUv.y, 1.0);
}