let locator = require('locator');
let async = require('async');

const RADIAN = 2 * Math.PI / 360;

function getRotatePoint(p, angle, center) {
    let out = cc.v2();
    let radian = -angle * RADIAN;
    out.x = (p.x - center.x) * Math.cos(radian) - (p.y - center.y) * Math.sin(radian) + center.x;
    out.y = (p.x - center.x) * Math.sin(radian) + (p.y - center.y) * Math.cos(radian) + center.y;   
    return out;
}

function getRectRotatePoints(rect, angle, pt) {
    let array = [
        cc.v2(rect.x, rect.y),
        cc.v2(rect.x + rect.width, rect.y),
        cc.v2(rect.x + rect.width, rect.y + rect.height),
        cc.v2(rect.x, rect.y + rect.height),
    ];
    return array.map(p => getRotatePoint(p, angle, pt));
}

let Guide = cc.Class({
    editor: {
        requireComponent: cc.Mask,
    },
    extends: cc.Component,

    properties: {
        _selector: '',
        selector: {
            get() {
                return this._selector;
            },
            
            set(value) {
                this._selector = value;
                this.locateNode(null, value);
            },
        },

        type: {
            default: cc.Mask.Type.RECT,
            type: cc.Mask.Type,
        },

        animationTimes: 0,
    },

    onLoad() {
        window.guide = this;
        this._mask = this.getComponent(cc.Mask);
        this._mask.inverted = true;
    },

    locateNode(root, value) {
        root = root instanceof cc.Node ? root : cc.find('Canvas');
        locator.locateNode(root, value, (error, node) => {
            if (error) {
                cc.log(error);
                return;
            }
            cc.log('定位节点成功');
            this._focusNode(node);
        });
    },

    locateNodeByEvent(sender) {
        this.selector = sender.string;
    },

    getNodePoints(rect, angle, pt) {
        return getRectRotatePoints(rect, angle, pt).map(p => {
            return p;
        });
    },

    fillPoints(points) {
        let p0 = points[0];
        this._mask._graphics.moveTo(p0.x, p0.y);
        points.slice(1).forEach( p => {
            this._mask._graphics.lineTo(p.x, p.y);
        });
        this._mask._graphics.lineTo(p0.x, p0.y);
        this._mask._graphics.stroke();
        this._mask._graphics.fill();
    },

    _focusNode(node) {
        this._mask._graphics.clear();
        let rect = node.getBoundingBoxToWorld();
        if (node.rotation !== 0) {
            rect.width = node.width;
            rect.height = node.height;
            let pos = node.parent.convertToWorldSpaceAR(node.position);
            rect.x = pos.x - node.width * node.anchorX;
            rect.y = pos.y - node.height * node.anchorY;
        }
        // rect.width = node.width;
        // rect.height = node.height;
        let p = this.node.convertToNodeSpaceAR(this.type === cc.Mask.Type.RECT ? rect.origin : rect.center);
        if (this.animationTimes === 0) {
            rect.x = p.x;
            rect.y = p.y;
            let points = this.getNodePoints(rect, node.rotation, rect.center);
            this.fillPoints(points);
            // if (this.type === cc.Mask.Type.RECT) {
            //     this._mask._graphics.rect(p.x, p.y, rect.width, rect.height);
            // } else {
            //     this._mask._graphics.circle(p.x, p.y, Math.min(rect.height, rect.width) / 2);
            // }
            // this._mask._graphics.fill();
        } else {
            this._times = 0;
            this._rect = rect;
            this._p = p;
            this.schedule(this._playFocusNode, 0)
        }
    },

    _playFocusNode(dt) {
        this._times += dt;
        let percent = 1 - this._times / this.animationTimes; 
        if (this._times >= this.animationTimes) {
            this.unschedule(this._playFocusNode);
            return;
        }
        let r = cc.winSize.height / 2 * percent + this._rect.height / 2;
        this._mask._graphics.clear();
        this._mask._graphics.circle(this._p.x, this._p.y, r);
        this._mask._graphics.fill();
    },

    getNodeFullPath(node) {
        let array = [];
        let temp = node;
        do {
            array.unshift(temp.name);
            temp = temp.parent;
        } while(temp && temp.name !== 'Canvas')
        return array.join('/');
    },

    /**
     * 记得触摸节点
     */
    startRecordTouchNode() {
        this._dispatchEvent =  cc.Node.prototype.dispatchEvent;
        let self = this;
        this._touchNodes = [];
        cc.Node.prototype.dispatchEvent = function(event) {
            self._dispatchEvent.call(this, event);  
            if (event.type === cc.Node.EventType.TOUCH_END) {
                let nodePath = self.getNodeFullPath(this);
                self._touchNodes.push(nodePath);
                cc.log(event.type, ':', nodePath);
            }
        }
    },

    /**
     * 停止记录
     */
    stopRecordTouchNode() {
        if (this._dispatchEvent) {
            cc.Node.prototype.dispatchEvent = this._dispatchEvent;
        }
    },

    playRecordTouchNode() {
        async.eachLimit(this._touchNodes, 1, (nodePath, cb) => {
            this.locateNode(null, nodePath);
            this.scheduleOnce(() => cb(), 1);
        }, () => {
            cc.log('任务完成');
        });
    }
});

