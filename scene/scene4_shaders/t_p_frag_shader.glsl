uniform float time;
uniform sampler2D u_texture;

uniform float radius;
varying vec3 vPosition;
varying vec3 vNormal;


varying vec2 vUv;

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

void main(){
    
    vec2 uv = vUv - vec2(.5);
    // vec3(step(radius, length(uv)))
    // vec3(step(0.5,(fract(vUv.x * 10.0))))
    // vec3(step(0.5,(mod(vUv.x * 10.0, 2.0))))
    // vec3(mix(.0, 1., vUv.x))

    // frasnel effect
    // vec3 viewDirection = normalize(cameraPosition - vPosition);
    // float frasnel = pow(1.0 - dot(viewDirection, vNormal), 1.0);
    // gl_FragColor = vec4( vec3(frasnel) , 1.);

    //line
    // vec3(step(.1, abs(vUv.y - .5)))
    // circle

    // const vec3 DESATURATE = vec3(0.3, 0.59, 0.11);

    // vec3 color = texture2D(u_texture, vUv).xyz;
    // float finalColor = dot(color, DESATURATE);

    gl_FragColor = vec4(vec3(1.), 1.0);
}