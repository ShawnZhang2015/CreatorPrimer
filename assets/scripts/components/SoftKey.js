
let SoftKey = cc.Class({
    extends: cc.Component,
    editor: {
        executeInEditMode: true,
    },

    properties: {
        string:  {
            type: cc.String,
            //default: '',
            // notify() {
            //     let node = this.node.getChildByName('Label');
            //     let label = node.getComponent(cc.Label);
            //     label.string = this.string;
            // }
            get() {
                return this._label.string;
            },

            set(value) {
                this._label.string = value;
            }
        },
        deleteKey: false,
        targets: [cc.Component],

        _label: null,
    },

    onLoad() {
        this._data = {name:'sfsf'};

        cc.log('onLoad');
        let node = this.node.getChildByName('Label');
        this._label = node.getComponent(cc.Label);
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
