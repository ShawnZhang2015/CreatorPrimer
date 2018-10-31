
let Transition = require('../prefabs/Transition');

const SCENE_INFO = [];
cc.Class({
    extends: cc.Component,

    properties: {
        LIST_ITEM_PREFAB: cc.Prefab,
        listView: cc.ScrollView,
    },

    onLoad() {
        
        let games = cc.game._sceneInfos.map(sceneInfo => {
            let name = cc.path.basename(sceneInfo.url, '.fire');
            return { name, title: SCENE_INFO[name] };      
        }).filter(item => item.name !== 'SceneList');

        let componentName = this.LIST_ITEM_PREFAB.name;
        games.forEach((item) => {
            let node = cc.instantiate(this.LIST_ITEM_PREFAB);
            let listItem = node.getComponent(componentName);
            node.on('click', (sender) => {
                //cc.director.loadScene(listItem.text);
                Transition.instance.loadScene(listItem.text);
            });
            listItem.text = item.name;
            this.listView.content.addChild(node);
        });
    },
});
