
cc.Class({
    extends: cc.Component,

    properties: {
        clickable: true,
    
        _index: 0,
        index: {
        type: cc.Integer,
            get() {
                return this._index;
            },

            set(value) {
                if (value === this._index || value > this.colors.length) {
                    return;
                }
        
                this._index = value % this.colors.length;
                this.node.color = this.colors[this._index];
           }
       },
       colors: [cc.Color],
    },

    onLoad() {
        if (this.clickable) {
            this.node.on(cc.Node.EventType.TOUCH_END, this.next, this);
        }
    },

    next() {
        this.index++;
    }
});
