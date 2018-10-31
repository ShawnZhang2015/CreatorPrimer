
let SoftKey = cc.Class({
    extends: cc.Component,

    properties: {
        string: '',
        deleteKey: false,
        targets: [cc.Component],
    },

    start () {
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.submit();
        });
    },

    submit() {
        this.targets.forEach((target) => {
            if (!target || target.string == undefined) {
                return;
            }
            
            if (this.deleteKey) {
                let string = target.string;
                if (string) {
                    target.string = string.substr(0, string.length - 1);
                }
            } else {
                target.string += this.string;
            }
        })
    },

});


cc.Class.Attr.setClassAttr(SoftKey, 'string', 'visible', function() {
    return !this.deleteKey;
});
