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

  // float sinX = sin(modelPosition.x * uFrequence + (uTime * uSpeedWave)) * aRandom;
  // float cosX = cos(modelPosition.z * uFrequence + (uTime * uSpeedWave)) * aRandom;
  // modelPosition.y = mod(1.,sinX + cosX + aRandom) * uHeightWave * aRandom;
  modelPosition.y += textureColor.y;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  vUv = uv;
  // vModelPosition = modelPosition;
}