let TouchGraphics = require('TouchGraphics');
let _ = require('lodash');

let MatchingItem = cc.Class({
    name: 'MatchingItem',
    properties: {
        item1: cc.Node,
        item2: cc.Node
    }
})

cc.Class({
    extends: TouchGraphics,

    properties: {
        audioYES: {
            type:cc.AudioClip, //正确音效
            default: null,
        },
        
        audioNO: {
            type: cc.AudioClip, //错误音效
            default: null,
        },
        LINE_PREFAB: cc.Prefab,
        items: [MatchingItem],
    },

    _checkInOne(item, p) {
        let pt = item.item1.parent.convertToNodeSpaceAR(p);
        let rect = item.item1.getBoundingBox();
        
        if (rect.contains(pt)) {
            return item.item1;
        }

        pt = item.item2.parent.convertToNodeSpaceAR(p);
        rect = item.item2.getBoundingBox();
        if (rect.contains(pt)) {
            return item.item2;
        }
    },

    check(item, p1, p2) {
        let item1 = this._checkInOne(item, p1);
        let item2 = this._checkInOne(item, p2);
        return item1 && item2 && item1 !== item2;
    },

    _onTouchStart(event) {
        let point = event.getLocation();
        let item = _.find(this.items, item => this._checkInOne(item, point));
        if (item) {
            this._super(event);
        }
    },

    _onTouchEnd(event) {
        let first = event.getStartLocation();
        let last = event.getLocation();
        let item = this.items.find((item) => {
            return this.check(item, first, last);
        });

        this.clear();
        let p1 = this.node.convertToNodeSpaceAR(first);
        let p2 = this.node.convertToNodeSpaceAR(last);
        if (item) {
            this.drawLineYes(item.item1.position, item.item2.position);
        } else {
            this.drawLineNo(p1, p2);
        }

    },

    drawLineNo(p1, p2) {
        if (!this.LINE_PREFAB) {
            return;
        }
        let line = cc.instantiate(this.LINE_PREFAB);
        this._setLine(line, p1, p2);
        cc.audioEngine.playEffect(this.audioNO);
        this.scheduleOnce(() => {
            line.removeFromParent();
        }, 1);
    },

    drawLineYes(p1, p2) {
        if (!this.LINE_PREFAB) {
            return;
        }
        let line = cc.instantiate(this.LINE_PREFAB);
        this._setLine(line, p1, p2);
        cc.audioEngine.playEffect(this.audioYES)
    },

    _setLine(line, p1, p2) {
        line.parent = this.node;
        line.position = p1;
        let dt = p1.sub(p2);
        let radian = Math.atan2(dt.x, dt.y);
        let rotation = (180 * radian / Math.PI + 90) % 360;
        line.rotation = rotation;
        line.width = dt.mag();
    },

});
