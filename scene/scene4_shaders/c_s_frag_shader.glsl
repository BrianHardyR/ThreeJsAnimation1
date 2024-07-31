// PARS_START
uniform float u_time;
varying float vDisplacement;

vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {

    // normalize is done to ensure that the bump map looks the same regardless of the texture's scale
    vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
    vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
    vec3 vN = surf_norm; // normalized

    vec3 R1 = cross( vSigmaY, vN );
    vec3 R2 = cross( vN, vSigmaX );

    float fDet = dot( vSigmaX, R1 ) * faceDirection;

    vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
    return normalize( abs( fDet ) * surf_norm - vGrad );

}

// PARS_END

void main(){
    // MAIN_START
    normal = perturbNormalArb( -vViewPosition, normal, vec2( dFdx( vDisplacement ), dFdy( vDisplacement ) ), faceDirection);
    // MAIN_END
}