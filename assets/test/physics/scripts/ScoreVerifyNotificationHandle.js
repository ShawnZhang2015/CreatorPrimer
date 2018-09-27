
cc.Class({
    extends: cc.Component,

    properties: {
        notificationName: '',
    
        topToDown: {
            default: false,
            tooltip: '从上向下碰撞有效',
            notify() {
                if (this.topToDown) {
                    this.downToTop = false;
                }
            }
        },

        downToTop: {
            default: false,
            tooltip: '从下往上碰撞有效',
            notify() {
                if (this.downToTop) {
                    this.topToDown = false;
                }
            }
        },

        leftToRight: {
            default: false,
            tooltip: '从左到右碰撞有效',
            notify() {
                if (this.leftToRight) {
                    this.rightToLeft = false;
                }
            }
        },

        rightToLeft: {
            default: false,
            tooltip: '从右到左碰撞有效',
            notify() {
                if (this.rightToLeft) {
                    this.leftToRight = false;
                }
            }
        },

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

    notificationHandle(contact, p0, p1) {
        let dx = p1.x - p0.x;
        let dy = p1.y - p0.y;
        let flag = true;
        if (this.topToDown) {
            flag = dy < 0;
        } if (this.downToTop) {
            flag = dy > 0;
        }
        
        if (flag) {
            if (this.leftToRight) {
                flag = dx > 0;
            } else if (this.rightToLeft) {
                flag = dx < 0;
            }
        }
       

        if (flag) {
            this.score += this.step;
        }
    },
});
