
cc.Class({
    extends: cc.Component,
    properties: {
        balls: [cc.RigidBody],
    },
    onLoad() {
        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;

        physicsManager.debugDrawFlags = 0;
            //cc.PhysicsManager.DrawBits.e_aabbBit  | 
            //cc.PhysicsManager.DrawBits.e_jointBit |
            //cc.PhysicsManager.DrawBits.e_shapeBit;
    },

    onDestroy() {
        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = false;
    },

    bounceBall() {
        this.balls.forEach((ball) => {
            let v2 = ball.linearVelocity;
            v2.y = 300;
            v2.x = ball.node.x > 0 ? 200 : -200;
            ball.linearVelocity = v2;
        })
    }
});
