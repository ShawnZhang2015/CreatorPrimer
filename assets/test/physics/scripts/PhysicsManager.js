

/**
 * 		e_aabbBit = 0,
		e_pairBit = 0,
		e_centerOfMassBit = 0,
		e_jointBit = 0,
		e_shapeBit = 0,	
 */
cc.Class({
    extends: cc.Component,

    properties: {
       active: { 
           default: true,
           tooltip: '是否启用物理引擎',
       },
       aabb:{
           default: true,
           tooltip: '是否显示包围盒',
       },
       pair: {
           default: true,
           tooltip: '我也不知道是什么用:-('
       },
       centerOfMass: { 
           default: true,
           tooltip: '是否显示中心点'
       },
       joint: { 
           default: true,
           tooltip: '是否显示连接线'
       },
       shape: {
           default: true,
           tooltip: '是否填充形状'
       },
       mouseJoint: {
           default: false,
           tooltip: '是否开启鼠标关节，可以拖动动态刚体'
       }
    },

    onLoad () {
        //开启或关闭物理系统
        let physicsManager = cc.director.getPhysicsManager();
        if (physicsManager.enabled && this.active) {
            cc.warn('The physical system is enabled！');
        }

        physicsManager.enabled = this.active;
        if (!this.active) {
            return;
        }

        //设置调试标志
        let DrawBits = cc.PhysicsManager.DrawBits;
        physicsManager.debugDrawFlags = 
            (this.aabb && DrawBits.e_aabbBit) |
            (this.pair && DrawBits.e_pairBit) |
            (this.centerOfMass && DrawBits.e_centerOfMassBit) |
            (this.joint && DrawBits.e_jointBit) |
            (this.shape && DrawBits.e_shapeBit);
    },

    start() {
        //鼠标可拖刚体
        if(this.mouseJoint && this.active) {
            let node = this.node;
            let rigidBody = node.addComponent(cc.RigidBody);
            let mouseJoint = node.addComponent(cc.MouseJoint);
            rigidBody.type = cc.RigidBodyType.Static;
            mouseJoint.mouseRegion = node;
            //node.parent = this.node;
        }
    },

    onDisable() {
        cc.director.getPhysicsManager().enabled = false;
    }

});
