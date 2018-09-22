
cc.Class({
    extends: cc.Component,

    properties: {
       notificationName:'',
    },

    start () {

    },

    onBeginContact(contact, selfCollider, otherCollider) {
        cc.log(otherCollider.node.name);
        if (this.notificationName) {
            cc.director.emit(this.notificationName, contact, selfCollider, otherCollider);
        }
    }

    // update (dt) {},
});
