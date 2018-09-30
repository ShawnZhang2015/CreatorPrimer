
cc.Class({
    extends: cc.Component,

    properties: {
        notificationName: '',
        label: cc.Label,
        step: 1,
        score: {
            type: cc.Integer,
            default: 0,
            notify() {
                this.label.string = this.score.toString();
            }
        }
    },  

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.label.string = this.score.toString();
        if (this.notificationName) {
            cc.director.on(this.notificationName, this.notificationHandle, this);
        }
    },

    notificationHandle() {
        this.score += this.step;
    },
});
