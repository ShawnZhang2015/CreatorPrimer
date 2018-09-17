
cc.Class({
    extends: cc.Component,

    properties: {
        step: {
            type: cc.Float,
            default: 1,
        }
    },

    update() {
        this.node.rotation += this.step;
    }
});