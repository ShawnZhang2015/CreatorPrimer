/**
 * 列表项目
 */

cc.Class({
    extends: cc.Component,

    properties: {
        text: {
            default: '',
            notify() {
                let label = this.node.getComponentInChildren(cc.Label);
                if (label) {
                    label.string = this.text;
                }
            }
        }
    },

    click() {
        this.node.emit('click', this);
    }
});
