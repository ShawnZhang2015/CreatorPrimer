let TouchGraphics = require('TouchGraphics');

let Bungee = cc.Class({
    extends: TouchGraphics,

    properties: {
       dt: 5,
       yMax: -200,
    },

    start () {

    },

    springing() {
        let p1 = this._points[0];
        let p2 = this._points[this._points.length - 1];
        let x = p1.x + Math.abs(p2.x - p1.x) / 2;
        this.x = x;
        this.p2 = p2;
        this.offset = this.yMax;
        this.schedule(this._drawCurve, 0.05);
    },

    _drawCurve() {
        if (Math.abs(this.offset) <= 1) {
            this.unschedule(this._drawCurve);
            this.strokeColor.a = 255;
            return;
        }
        let p1 = this._points[0];
        this.clear();
        this.moveTo(p1.x, p1.y);
        this.strokeColor.a -= 25;
        this.quadraticCurveTo(this.x / 2, this.p2.y + this.offset, this.p2.x, this.p2.y);
        this.stroke();
        if (this.offset > 0) {
            this.offset = -(this.offset - this.dt);
        } else {
            this.offset = -(this.offset + this.dt);
        }
        cc.log(this.offset);
        
    }
    
});

cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
    Bungee._assembler = cc.Graphics._assembler;
});