uniform float uTime;
uniform float uFrequence;
uniform float uHeightWave;
uniform float uSpeedWave;
varying vec2 vUv;
varying vec4 vModelPosition;
attribute float aRandom;
uniform sampler2D uTexture;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 textureColor = texture2D(uTexture, uv);

  float sinX = sin(modelPosition.x * uFrequence + (uTime * uSpeedWave));
  float cosX = sin(modelPosition.z * uFrequence + (uTime * uSpeedWave));
  modelPosition.y += (textureColor.y * .4);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  vUv = uv;
  // vModelPosition = modelPosition;
}