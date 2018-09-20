let MapType = cc.Class({
    name: 'MapType',
    properties: {
        key: '',
        value: '',
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        url: '',
        params: [MapType],
    },

    open(sender) {
        let url;
        if (typeof sender === 'string') {
            url = sender;
        } else if (typeof sender === 'object') {
            url = sender.string || this.url;
        }
        
        if (!url) {
            cc.warn(`url is empty`);
            return;
        }
        window.location.href = url;
    }
});
