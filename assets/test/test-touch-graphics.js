
cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
        touchGraphics: [cc.Node],
    },

    start () {
        this._label = this.node.getChildByName('label').getComponent(cc.Label);
        
        this.touchGraphics.forEach(node => {
            this._registerEvent(node);
        });
    },

    _registerEvent(node) {
        node.on('draw-move', (sender) => {
            this._label.string = `${sender.node.name}: 绘图开始`;  
        });
        node.on('draw-move', (sender) => {
            this._label.string =  `${sender.node.name}: 绘图中...`;  
        });
        node.on('draw-end', (sender) => {
            this._label.string =  `${sender.node.name}: 绘图结束`;  
        });
    }
    // update (dt) {},
});
