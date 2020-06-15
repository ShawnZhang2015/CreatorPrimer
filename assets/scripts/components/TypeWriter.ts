const {ccclass, property} = cc._decorator;

@ccclass
export default class TypeWriter extends cc.Component {

    //目标 Label 组件 
    @property(cc.Label)
    label: cc.Label = null;

    //节点完成节点
    @property(cc.Node)
    quick: cc.Node = null;

    //要显示的文本
    @property
    text: string = '';

    //单字显示时间
    @property
    interval: number = 0.2;
      
    //当前索引位置
    _index: number = 0;
    start () {
        //初始化文字为空
        this.label.string = '';

        //设定逐字显示文本
        this.schedule(this.updateText, this.interval);

        //注册触摸事件，点击立即显示所有文本
        if (this.quick) {
            this.quick.on(cc.Node.EventType.TOUCH_END, () => {
                this._index = this.text.length;
                this.label.string = this.text;
            });
        }
    }

    /**
     * 更新文本
     */
    updateText() {
        let char = this.text[this._index++];
        if (!char) {
            this.unschedule(this.updateText);
            return;
        }
        this.label.string += char;
    }
}
