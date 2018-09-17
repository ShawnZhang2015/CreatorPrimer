/**
 * 精灵增加 
 */

let SpriteEx = cc.Class({
    extends: cc.Sprite,

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
                this.spriteFrame = this.spriteFrames[this._index];
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


cc.Class.Attr.setClassAttr(SpriteEx, 'spriteFrame', 'visible', false);
cc.Class.Attr.setClassAttr(SpriteEx, '_atlas', 'visible', false);

cc.Class.Attr.setClassAttr(SpriteEx, 'fillType', 'visible', function() {
    return this._type === cc.Sprite.Type.FILLED;
});

cc.Class.Attr.setClassAttr(SpriteEx, 'fillCenter', 'visible', function() {
    return this._type === cc.Sprite.Type.FILLED;
});
cc.Class.Attr.setClassAttr(SpriteEx, 'fillStart', 'visible', function() {
    return this._type === cc.Sprite.Type.FILLED;
});
cc.Class.Attr.setClassAttr(SpriteEx, 'fillEnd', 'visible', function() {
    return this._type === cc.Sprite.Type.FILLED;
});
cc.Class.Attr.setClassAttr(SpriteEx, 'fillRange', 'visible', function() {
    return this._type === cc.Sprite.Type.FILLED;
});

cc.Class.Attr.setClassAttr(SpriteEx, 'srcBlendFactor', 'visible', function() {
    return this._type === cc.Sprite.Type.FILLED;
});
cc.Class.Attr.setClassAttr(SpriteEx, 'dstBlendFactor', 'visible', function() {
    return this._type === cc.Sprite.Type.FILLED;
});