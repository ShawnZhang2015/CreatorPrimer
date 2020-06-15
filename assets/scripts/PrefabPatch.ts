// 屏蔽2.3.1版本prefab嵌套prefab的弹框问题
if (CC_EDITOR && !window["Editor"].isBuilder) {
    window["_Scene"].DetectConflict.beforeAddChild = function() {
        return false
    }
}