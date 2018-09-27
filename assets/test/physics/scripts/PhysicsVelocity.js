
cc.Class({
    editor: CC_EDITOR && {
        requireComponent: cc.RigidBody,
    },

    extends: cc.Component,

    properties: {
        linearVelocity: cc.Vec2,
        angularVelocity: 0,
    },

    start() {
        this._rigidBody = this.getComponent(cc.RigidBody);
    },

    force() {
        let v2 = this._rigidBody.linearVelocity;
        v2.y = this.linearVelocity.y;
        v2.x = this.linearVelocity.x * (this.node.x > 0 ? 1 : -1);
        this._rigidBody.linearVelocity = v2;
        if (this.angularVelocity) {
            this._rigidBody.angularVelocity = this.angularVelocity;
        }
        
    }
});
