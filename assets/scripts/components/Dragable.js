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
        //通过touchEvent获取当前触摸坐标点
        let location = touchEvent.getLocation();
        //修改节点位置，注意要使用父节点进行对触摸点进行坐标转换
        this.node.position = this.node.parent.convertToNodeSpaceAR(location);
    }
});