const SHOP_ITEMS = [
    {id:0, name:'哈密瓜', price: 8},
    {id:1, name:'波萝', price: 4},
    {id:2, name:'西瓜', price: 3},
]

cc.Class({
    extends: cc.Component,

    properties: {
        _index: 0,
        index: {
            type: cc.Integer,
            range: [0, 2],
            get() {
                return this._index;
            },

            set(value) {
                if (this._index === value) {
                    return;
                }
                this._index = value;
                this.updateContent();
            }
        }    
    },

    onLoad() {
        this.updateContent();
    },

    updateContent() {
        let item = SHOP_ITEMS[this._index];
        if (!item) {
            cc.error('无此商品');
            return;
        }
        let image = this.node.getChildByName('image');
        let spriteIndex = image.getComponent('SpriteEx');
        spriteIndex.index = this._index;

        let label = this.node.getChildByName('labelName');
        label.getComponent(cc.Label).string = item.name;
        label = this.node.getChildByName('labelPrice');
        label.getComponent(cc.Label).string = `￥${item.price}`;
    }
});
