/**
 * 
 */
cc.Class({

    //依赖刚体组件
    editor: CC_EDITOR && {
        requireComponent: cc.RigidBody,
    },

    extends: cc.Component,

    properties: {
        linearVelocity: cc.Vec2,
        angularVelocity: 0,
    },

    /**
     * 获取刚体组件
     */
    start() {
        this._rigidBody = this.getComponent(cc.RigidBody);
    },

    /**
     * 给刚体施力，力的参数由组件属性控制
     * 写这个函数是方便cc.Button组件click属性调用
     */
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
