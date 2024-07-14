uniform vec2 u_resolution;
void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  // colour is RGBA: u, v, 0, 1
  gl_FragColor = vec4( vec3( st.x, st.y, st ),.0 );
}