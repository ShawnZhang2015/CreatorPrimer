/**
 * 控件节点Z轴
 */
cc.Class({
    extends: cc.Component,

    properties: {
        zIndex: {
            type: cc.Integer,
            default: 0,
        }
    },
    
    onLoad () {
        this.node.zIndex = this.zIndex;
    },
});
