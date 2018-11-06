let _ = require('lodash');

cc.Class({
    extends: cc.Component,

    properties: {
        number: {
            type: cc.Integer,
            range: [0, 100],
            default: 0,
            notify() {
                this.updateContent();
            }
        },
        ITEM_PREFAB: cc.Prefab,
    },

    start () {
        this.updateContent();
    },

    updateContent() {
        let content = this.node.getChildByName('ScrollView').getComponent(cc.ScrollView).content;
        content.removeAllChildren();
        _.range(0, this.number).forEach((i) => {
            let node = cc.instantiate(this.ITEM_PREFAB);
            node._objFlags = cc.Object.Flags.DontSave;
            let shopItem = node.getComponent('ShopItem');
            shopItem.index = i % 3;
            node.parent = content;
        });
    }
});
