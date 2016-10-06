const glslify = require('glslify')

module.exports = function renderCubeMap (regl) {
  return regl({
    vert: `
    precision mediump float;
    attribute vec2 position;
    varying vec2 screenPos;
    void main () {
      screenPos = position;
      gl_Position = vec4(position, 1, 1);
    }
    `,

    frag: glslify`
    precision mediump float;
    varying vec2 screenPos;
    uniform mat4 projection, view;
    uniform samplerCube envmap;
    #pragma glslify: inverse = require('glsl-inverse')
    void main () {
      mat4 inv = inverse(projection * view);

      vec4 s0 = inv * vec4(screenPos, 0, 1);
      vec4 s1 = inv * vec4(screenPos, 0, 1);

      vec3 x0 = s0.xyz / s0.w;
      vec3 x1 = s1.xyz / s1.w;

      vec3 dir = normalize(x1 - x0);

      return textureCube(envmap, dir);
    }
    `,

    uniforms: {
      envmap: regl.prop('envmap')
    },

    attributes: {
      position: [
        [-4, 0],
        [4, 4],
        [4, -4]
      ]
    },

    depth: {
      enable: false,
      mask: true
    },

    count: 3,

    elements: null,

    primitive: 'triangles'
  })
}
