const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;

const shader = {
    name: 'Dissolve',
    params: [
        { name: 'time', type: renderer.PARAM_FLOAT, defaultValue: 0 },
    ],

    start() {
        this._start = Date.now();
    },

    update(sprite, material) {
        const now = Date.now();
        let time = ((now - this._start) / 1000) / 5;
        if (time >= 1) {
            time = 0;
            this._start = now;
        }
        material.setParamValue('time', time);
    },

    defines:[],

    vert: `
        uniform mat4 viewProj;
        attribute vec3 a_position;
        attribute vec2 a_uv0;
        varying vec2 uv0;
        void main () {
            vec4 pos = viewProj * vec4(a_position, 1);
            gl_Position = pos;
            uv0 = a_uv0;
        }`,

    frag:
        `
        uniform sampler2D texture;
uniform vec4 color;
uniform float time;
varying vec2 uv0;

void main()
{
    vec4 c = color * texture2D(texture,uv0);
    float height = c.r;
    if(height < time)
    {
        discard;
    }
    if(height < time+0.04)
    {
        // 溶解颜色，可以自定义
        c = vec4(.9,.6,0.3,c.a);
    }
    gl_FragColor = c;
}`,
};

module.exports = shader;