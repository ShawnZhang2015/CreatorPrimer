
cc.Class({
    extends: cc.Component,

    properties: {
        velocity: cc.v2(0, 0),   
        graphics: cc.Node,

    },

    start () {
        //this._rigidBody = this.getComponent(cc.RigidBody);
    },

    onEndContact(contact, selfCollider, otherCollider) {
        let rigidBody = otherCollider.getComponent(cc.RigidBody);
        let y = Math.min(rigidBody.linearVelocity.y * 3, cc.winSize.height);

        rigidBody.linearVelocity = cc.v2(rigidBody.linearVelocity.x, y);
        cc.log(rigidBody.linearVelocity);
    
        let bungee = this.graphics.getComponent('Bungee');
        bungee.springing();
    },
});
