

/**
 * 物理引擎管理组件，开启各种调试
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
           tooltip: '是否显示关节连接线'
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

    onEnable() {
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
        let drawBits = cc.PhysicsManager.DrawBits;
        if (CC_PREVIEW) {
            physicsManager.debugDrawFlags = 
            (this.aabb && drawBits.e_aabbBit) |
            (this.pair && drawBits.e_pairBit) |
            (this.centerOfMass && drawBits.e_centerOfMassBit) |
            (this.joint && drawBits.e_jointBit) |
            (this.shape && drawBits.e_shapeBit);
        } else {
            physicsManager.debugDrawFlags = 0;
        }
       

        this._setMouseJoint();    
    },

    _setMouseJoint() {
        //鼠标可拖刚体
        if(this.mouseJoint && this.active) {
            let node = this.node;
            //获取节点上的刚体组件
            let rigidBody = node.getComponent(cc.RigidBody);
            //不存在添加一个
            if (!rigidBody) {
                rigidBody = node.addComponent(cc.RigidBody);
            }
            //获取组件上的鼠标关节组件
            let mouseJoint = node.getComponent(cc.MouseJoint);
            //不存在添加一个
            if (!mouseJoint) {
                mouseJoint = node.addComponent(cc.MouseJoint);
            }
            //设置为静态刚体
            rigidBody.type = cc.RigidBodyType.Static;
            //设置鼠标范围
            mouseJoint.mouseRegion = node;
        }
    },

    onDisable() {
        cc.director.getPhysicsManager().enabled = false;
    }

});
