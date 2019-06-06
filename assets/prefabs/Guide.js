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

        pointerPrefab: cc.Prefab,
        animationTimes: 0,
    },

    onLoad() {
        window.guide = this;
        let node = this.node.getChildByName('mask');
        if (!node) {
           return;
        }
        //获取遮罩组件 
        this._mask = node.getComponent(cc.Mask);
        this._mask.inverted = true;
        //初始化指示器
        this._pointer = cc.instantiate(this.pointerPrefab);
        this._pointer.parent = this.node;
        this._pointer.zIndex = 100;
        this._pointer.position = cc.v2(cc.winSize.width / 2 + this._pointer.width, -cc.winSize.height / 2);
    },

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            if (!this._targetGuide) {
                this.node._touchListener.setSwallowTouches(false);
                return;
            }

            let p = event.getLocation();
            //let rect = this._targetGuide.node.getBoundingBoxToWorld();
            // if (!rect.contain(p)) {
            if (cc.Intersection.pointInPolygon(p, this._targetGuide.points)) {
                this.node._touchListener.setSwallowTouches(false);
            } else {
                cc.log('未命中目标节点')
            }
            // }
        }, this);
    },

    locateNode(root, value, cb) {
        root = root instanceof cc.Node ? root : cc.find('Canvas');
        locator.locateNode(root, value, (error, node) => {
            if (error) {
                cc.log(error);
                return;
            }
            cc.log('定位节点成功');
            this._focusNode(node);
            if (cb) {
                cb(node);
            }
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
            //保存节点多边形描点
            if (this._targetGuide) {
                this._targetGuide.points = points;
            }
            
            let duration = this._pointer.position.sub(rect.center).mag() / 1000;
            let delay = cc.delayTime(0.5);
            let moveTo = cc.moveTo(duration, rect.center);
            this._pointer.runAction(cc.sequence(delay, moveTo));
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
        if (this._dispatchEvent) {
            return;
        }

        this._dispatchEvent =  cc.Node.prototype.dispatchEvent;
        let self = this;
        this._touchNodes = [];
        cc.Node.prototype.dispatchEvent = function(event) {
            self._dispatchEvent.call(this, event);  
            if (event.currentTarget !== self.node && event.type === cc.Node.EventType.TOUCH_END) {
                let path = self.getNodeFullPath(this);
                self._touchNodes.push({node:this, path, points: null});
                cc.log(event.type, ':', path);
            }
        }
    },

    /**
     * 停止记录
     */
    stopRecordTouchNode() {
        if (this._dispatchEvent) {
            cc.Node.prototype.dispatchEvent = this._dispatchEvent;
            this._dispatchEvent = null;
        }
    },

    playRecordTouchNode() {
        this.stopRecordTouchNode();
        async.eachLimit(this._touchNodes, 1, (item, cb) => {
            this._targetGuide = item;
            this.locateNode(null, item.path, (node) => {
                let touchEnd = () => {
                    this._currentNode = null;
                    cc.log('引导点击节点：', node.name);
                    cb();
                    node.off(cc.Node.EventType.TOUCH_END, touchEnd, this);
                };
                node.on(cc.Node.EventType.TOUCH_END, touchEnd, this); 
            });
        }, () => {
            cc.log('任务完成');
            this.node.destroy();
        });
    },

    beginGuide() {

    }
});

