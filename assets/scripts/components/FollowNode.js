
cc.Class({
    extends: cc.Component,

    properties: {
        target: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.target.on(cc.Node.EventType.POSITION_CHANGED, () => {
            this.node.position = this.target.position;
        });
    },

    // update (dt) {},
});
