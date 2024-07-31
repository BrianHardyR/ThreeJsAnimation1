uniform float time;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

float wave_x = 0.0;
float wave_y = 0.0;
float wave_z = 0.0;

void main(){
    vPosition = position;
    vNormal = normal;
    vUv = uv;

    // wave effect
    // wave_x = cos(position.y + time * .1);
    // vPosition.x += wave_x;

    // wave_y = sin(position.x + time);
    // vPosition.y += wave_y;

    // wave_z = sin(position.y +) * .5;
    // vPosition.z = wave_z;

    


    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}