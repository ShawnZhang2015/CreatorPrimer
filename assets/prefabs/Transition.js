
let Transition = cc.Class({
    extends: cc.Component,
    statics: {
        instance: null
    },

    // onLoad() {
    //     cc.game.addPersistRootNode(this.node);
    // },

    start () {
        let node = this.node.getChildByName('Cloud');
        let animation = node.getComponent(cc.Animation);
        this.cloudAnimation = animation;
        Transition.instance = this;
        this.playOpen();
    },

    playClose(cb) {
        cc.log('playClose');
        this.cloudAnimation.play('cloud_close')
        this.cloudAnimation.once('finished', cb);
    },

    playOpen() {
        cc.log('playOpen');
        this.cloudAnimation.play('cloud_open');
    },

    loadScene(name) {
        this.playClose(() => {
            cc.director.loadScene(name, () => {
                this.playOpen();
            });
        });
    },

    backSceneList() {
        this.loadScene('SceneList');
    }
});

module.exports = Transition;
// cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LOADING, (event) => {
//     if (Transition.instance) {
//         Transition.instance.playClose();
//     }
// });

// cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, (event) => {
//     if (Transition.instance) {
//         Transition.instance.playOpen();
//     }
// });