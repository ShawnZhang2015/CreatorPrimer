/**
 * 常驻节点
 */
cc.Class({
    extends: cc.Component,

    start () {
        if (!cc.game.isPersistRootNode(this.node)) {
            cc.game.addPersistRootNode(this.node);
        }
    },
});
