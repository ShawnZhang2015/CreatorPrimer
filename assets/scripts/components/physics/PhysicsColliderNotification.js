
/**
 * 物理碰撞通知组件，要以让非物理组件或脚本能收到物理碰撞事件
 */
cc.Class({
    //依赖刚体组件
    editor: CC_EDITOR && {
        requireComponent: cc.RigidBody,
    },

    extends: cc.Component,

    properties: {
       notificationName:'',
       _p0: null,
       _p1: null,
    },

    start () {
        //开启碰撞监听
        cc.log(this.node.name);
        let rigidBody = this.getComponent(cc.RigidBody);
        rigidBody.enabledContactListener = true;
    },

    /**
     * 只在两个碰撞体开始接触时被调用一次
     */
    onBeginContact(contact, selfCollider, otherCollider) {
        cc.log(otherCollider.node.name);
        this._p0 = otherCollider.node.position;
    },

    /**
     * 只在两个碰撞体结束接触时被调用一次
     */
    onEndContact: function (contact, selfCollider, otherCollider) {
        this._p1 = otherCollider.node.position;
        if (this.notificationName) {
            cc.director.emit(this.notificationName, contact, this._p0, this._p1);
        }
    },
});
