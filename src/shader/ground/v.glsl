uniform float uTime;
uniform float uFrequence;
uniform float uHeightWave;
uniform float uSpeedWave;
varying vec2 vUv;
varying vec4 vModelPosition;
attribute float aRandom;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  // float sinX = sin(modelPosition.x * uFrequence + (uTime * uSpeedWave)) * aRandom;
  // float cosX = cos(modelPosition.z * uFrequence + (uTime * uSpeedWave)) * aRandom;
  // modelPosition.y = mod(1.,sinX + cosX + aRandom) * uHeightWave * aRandom;
  modelPosition.y += (sin(modelPosition.x) + sin(modelPosition.z)) * 0.1;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  vUv = uv;
  // vModelPosition = modelPosition;
}