
cc.Class({
    extends: cc.Component,
    editor: CC_EDITOR && {
        requireComponent: cc.Label,
    },

    properties: {
        default: '???',
        moduleName: {
            default: '',
            notify(oldValue) {
                if (CC_EDITOR || oldValue === this.moduleName) {
                    return;
                }
                this._updateContent();
            } 
        }
    },

    start () {
        //获取Label组件
        this.label = this.getComponent(cc.Label);
        //更新版本内容
        this._updateContent();
    },

    /**
     * 更新内容
     */
    _updateContent() {
        if (cc.sys.isNative) {
            let remoteAssets = cc.path.join(jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/', 'remote-assets');
            let url = cc.path.join(remoteAssets, this.moduleName, '-project.manifest');
            let content = jsb.fileUtils.getStringFromFile(url);
            if (content) {
                this._setVersion(content);
                return;
            }
        }

        let url = `manifest/${this.moduleName}-project`;
        this._getManifestContent(url, (content) => {
            this._setVersion(content);
        });
    },

    /**
     * 
     * @param {String} url      resources以下路径
     * @param {Function} cb     异步回调函数，返回manifest上下文
     */
    _getManifestContent(url, cb) {
        cc.loader.loadRes(url, cc.Asset, null, (error, asset) => {
            if (error) {
                cb(null);
                return;
            }
            //通过nativeUrl读取文件内容
            let content = cc.loader.getRes(asset.nativeUrl);
            cb(content); 
        });
    },

    /**
     * 设置Label文本
     * @param {String} content 
     */
    _setVersion(content) {
        let data;
        try {
            data = JSON.parse(content);
            this.label.string = data.version;
        } catch(e) {
            cc.warn(e);
            this.label.string = this.default;
        }
    }
});
