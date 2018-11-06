
cc.pRotation = function (startPoint, endPoint) {
    let x = endPoint.x - startPoint.x;
    let y = endPoint.y - startPoint.y;
    let radian = Math.atan2(x, y);
    let rotation = 180 * radian / Math.PI;
    if (rotation < 0) {
        rotation = 360 + rotation;
    }
    return rotation;
};

cc.Class({
    extends: cc.Component,
    properties: {
        justNodes: [cc.Node],
    },

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
    },

    _getRotation(event) {
        let location = this.node.parent.convertToNodeSpaceAR(event.getLocation());
        let rotation = parseInt(cc.pRotation(this.node.position, location), 10); 
        return rotation;  
    },

    _onTouchStart(event) {
        this.rotation = this._getRotation(event);
    },

    _onTouchMove(event) {
        let rotation = this._getRotation(event);
        let delta = rotation - this.rotation;
        this.rotation = rotation;
        this.node.rotation += delta;
        this._handleJustNodes();
    },

    _handleJustNodes() {
        this.justNodes.forEach(node => {
            node.rotation = -this.node.rotation;
        });
    }

});
