
cc.Class({
    extends: cc.Component,

    start() {
        let slider = this.getComponent(cc.Slider);
        if (slider) {
            this.updateVolume(slider);
        } else {
            cc.warn('AudioVolume组件需要配合Slider组件使用');
        }
    },

    updateVolume (sender) {
        cc.audioEngine.setAllVolume( sender.progress);
    },

});
