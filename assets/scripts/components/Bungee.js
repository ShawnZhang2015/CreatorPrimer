let TouchGraphics = require('TouchGraphics');

function getRotation(startPoint, endPoint, offset = 0) {
    let x = endPoint.x - startPoint.x;
    let y = endPoint.y - startPoint.y;
    //与Y轴的夹角弧度
    let radian = Math.atan2(x, y);
    let rotation = (180 * radian / Math.PI + offset) % 360;
    return rotation;
};

let Bungee = cc.Class({
    extends: TouchGraphics,

    properties: {
       dt: 5,
       yMax: -200,
       body: cc.Node,
       target: cc.RigidBody,

       camera: cc.Camera,
       sp: cc.Node,
    },

    start () {
        this.node.on('draw-end', this._updateBody, this);
    },

    _updateBody(sender, location){
        if (this.target.type === cc.RigidBodyType.Static) {
            this.target.type = cc.RigidBodyType.Dynamic;
        }
        let p1 = this._points[0];
        let p2 = this._points[this._points.length - 1];
        let rotation = getRotation(p1, p2, 90);
        this.body.rotation = rotation;
        this.body.width = p1.sub(p2).mag();
        this.body.position = this.body.parent.convertToNodeSpaceAR(location);
        
        let physicsPolygonCollider = this.body.getComponent(cc.PhysicsPolygonCollider);
        physicsPolygonCollider.points.splice(0, 4);
        physicsPolygonCollider.points.push(
            cc.v2(0, 5),
            cc.v2(0, -5),
            cc.v2(this.body.width, -5),
            cc.v2(this.body.width, 5)
        );
        physicsPolygonCollider.enabled = false;
        this.scheduleOnce(() => {
            physicsPolygonCollider.enabled = true;
        });
    },

    springing() {
        let p1 = this._points[0];
        let p2 = this._points[this._points.length - 1];
        let x = p1.x + Math.abs(p2.x - p1.x) / 2;
        this.x = x;
        this.p2 = p2;
        this.offset = this.yMax;
        this.schedule(this._drawCurve, 0.05);

        this.camera.node.runAction(cc.moveBy(1, cc.v2(0, cc.winSize.height / 2)));
    },

    _drawCurve() {
        if (Math.abs(this.offset) <= 1) {
            this.unschedule(this._drawCurve);
            this.strokeColor.a = 255;
            //this.node.parent.runAction(cc.moveBy(1, 0, 300));
            
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
        
    },

    getNodePoints(rect, angle, pt) {
        return getRectRotatePoints(rect, angle, pt).map(p => {
            return p;
        });
    },
    
});

cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
    Bungee._assembler = cc.Graphics._assembler;
});