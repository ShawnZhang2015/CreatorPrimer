
cc.Class({
    extends: cc.Component,

    properties: {
       notificationName:'',
       _p0: null,
       _p1: null,
    },

    start () {

    },

    onBeginContact(contact, selfCollider, otherCollider) {
        cc.log(otherCollider.node.name);
        this._p0 = otherCollider.node.position;
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
        this._p1 = otherCollider.node.position;
        if (this.notificationName) {
            cc.director.emit(this.notificationName, contact, this._p0, this._p1);
        }
    },

    // // 每次将要处理碰撞体接触逻辑时被调用
    // onPreSolve: function (contact, selfCollider, otherCollider) {
    //     cc.log('onPreSolve', otherCollider.node.y);
    // },

    // onPostSolve: function (contact, selfCollider, otherCollider) {
    //     cc.log('onPostSolve', otherCollider.node.y);
    // }

    // update (dt) {},
});
