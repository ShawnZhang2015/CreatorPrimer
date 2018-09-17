
cc.Class({
    extends: cc.Component,
    editor: CC_EDITOR && {
        menu: 'my/SpriteIndex',
        executeInEditMode: true,
        requireComponent: cc.Sprite,
    },

    properties: {
        spriteFrames: [cc.SpriteFrame],

        _index: 0,
        index: {
            type: cc.Integer,
            set(value) {
                if (value < 0) {
                    return;
                }
                this._index = value % this.spriteFrames.length;
                let sprite = this.node.getComponent(cc.Sprite);
                sprite.spriteFrame = this.spriteFrames[this._index];
            },
            get() {
                return this._index;
            }
        }
    },

    next() {
        this.index++
    }
});
