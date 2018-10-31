/**
 * 预制件加载
 */
cc.Class({

    editor: {
        executeInEditMode: true,
    },

    extends: cc.Component,
    properties: {
        PREFAB: cc.Prefab, //预制件
        parent: cc.Node,   //预制件实例化后所在的父节点
        autoLoad: false,   //自动加载
    },

    onLoad() {
        if (this.autoLoad) {
            this.loadPrefab();
        }
    },

    loadPrefab() {
        try {
            let node = cc.instantiate(this.PREFAB);
            //不持久化到编辑器
            node._objFlags = cc.Object.Flags.DontSave;
            node.parent = this.parent || this.node;
        }
        catch (error) {
            cc.error(this.PREFAB);
            cc.error(error);
        }
    }
});