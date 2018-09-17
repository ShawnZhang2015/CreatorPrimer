/**
 * 场景加载
 */
cc.Class({
    extends: cc.Component,

    properties: {
       scene: cc.SceneAsset,
       clickable: true,
    },

    onLoad() {
        if (this.clickable) {
            this.node.on(cc.Node.EventType.TOUCH_END, this.loadScene, this);
        }
    },

    loadScene() {
        if (this.scene) {
            cc.director.loadScene(this.scene.name);
        }
    }
});
