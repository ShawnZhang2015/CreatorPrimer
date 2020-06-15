/**
 * 可拖动组件
 */
cc.Class({
    extends: cc.Component,

    onLoad() {
        //注册TOUCH_MOVE事件
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        cc.log('onload');
    },

    start() {
        cc.log('start');
    },

    onEnable() {
        cc.log('enable');
    },

    _onTouchMove(touchEvent) {
        let dt = touchEvent.getDelta();
        this.node.x += dt.x;
        this.node.y += dt.y;
    }
});