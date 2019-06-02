/**
 * @object
 * Location主要用从场景树中检索UI节点
 */
var Locator = {

    timeout: 5000, //超时
    /**
     * 定位解析
     * @param locator
     * @returns {Array}
     */
    parse: function (locator) {
        cc.assert(locator, 'locator string is null');

        //使用正则表达示分隔名字
        var names = locator.split(/[.,//,>,#]/g);
        var segments = names.map(function (name) {
            var index = locator.indexOf(name);
            var symbol = locator[index - 1] || '>';
            return {symbol: symbol, name: name.trim()};
        });
        return segments;
    },

    /**
     * 通过节点名搜索节点对象
     * @param root
     * @param name
     * @returns {*}
     */
    seekNodeByName: function (root, name) {
        if (!root)
            return null;

        if (root.getName() == name)
            return root;
        var arrayRootChildren = root.getChildren();
        var length = arrayRootChildren.length;
        for (var i = 0; i < length; i++) {
            var child = arrayRootChildren[i];
            var res = this.seekNodeByName(child, name);
            if (res != null)
                return res;
        }
        return null;
    },

    /**
     * 在root节点中，定位locator
     * @param root
     * @param locator
     * @param cb
     */
    locateNode: function (root, locator, cb) {
        if (!this.locating) {
            this.startTime = Date.now();    
            this.locating = true;
        }
        
        var segments = this.parse(locator);
        cc.assert(segments && segments.length);
        //cc.log('locateNode:' + locator);
        var child, node = root;

        for (var i = 0; i < segments.length; i++) {
            var item = segments[i];
            switch (item.symbol) {
                case '/':
                    child = node.getChildByName(item.name);
                    break;
                case '.':
                    child = node[item.name];
                    break;
                case '>':
                    child = this.seekNodeByName(node, item.name);
                    break;
                case '#':
                    child = this.seekNodeByTag(node, item.name);
                    break;
            }

            if (!child) {
                node = null;
                break;
            }
            node = child;
        }

        if (node && node.active && cb) {
            this.locating = false;
            cb(null, node);
        } else if (cb) {
            if (Date.now() - this.startTime > this.timeout) {
                cb({error:'timeout', locator});
            }  else {
                setTimeout(function () {
                    Locator.locateNode(root, locator, cb);
                }, 10);
            }
        }

        return node;
    }
};

window.Locator = Locator;
module.exports = Locator;