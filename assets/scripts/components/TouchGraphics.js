/**
 * 触摸绘图
 */
let TouchGraphics = cc.Class({
    extends: cc.Graphics,

    properties: {
        _points: null,
    },

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    },

    _onTouchStart(event) {
        this._points = [];
        let location = event.getLocation();
        this._drawGraphics(location);
    },

    drawGraphics(location) {
        this._drawGraphics(location);
    },

    _onTouchMove(event) {
        let location = event.getLocation();
        this._drawGraphics(location);
    },

    _onTouchEnd(event) {
        let location = event.getLocation();
        this._drawGraphics(location);
        this.node.emit('draw-end', this, location);
    },

    getTrailPoints() {
        return this._points;
    },

    _drawGraphics(location) {
        let point = this.node.convertToNodeSpaceAR(location);
        let rect = this.node.getBoundingBox();
        rect.origin = cc.v2(0, 0);

        if (!rect.contains(this.node.convertToNodeSpace(location))) {
            return;
        }
      
        if (this._points.length === 0) {
            this.moveTo(point.x, point.y);
            this._points.push(point);
            this.node.emit('draw-start', this);
            return;
        }

        if (point.x === 0 && point.y === 0) {
            return;
        }

        let last = this._points[this._points.length - 1];
        if (last && last.sub(point).mag() < 4) {
            return;
        }
        
        this._points.push(point);
        this.lineTo(point.x, point.y);
        this.stroke();
        this.node.emit('draw-move', this);
    },
});

cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
    TouchGraphics._assembler = cc.Graphics._assembler;
});

cc.Class.Attr.setClassAttr(TouchGraphics, 'miterLimit', 'visible', false);

module.exports = TouchGraphics;