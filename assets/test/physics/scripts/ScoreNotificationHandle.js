
cc.Class({
    extends: cc.Component,

    properties: {
        notifycationName: '',
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
        if (this.notifycationName) {
            cc.director.on(this.notifycationName, this.notificationHandle, this);
        }
    },

    notificationHandle() {
        this.score += this.step;
    },
});
