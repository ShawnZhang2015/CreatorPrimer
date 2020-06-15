
const {ccclass, property, executeInEditMode} = cc._decorator;

enum MODE {
    TIME,
    DATE,
    DATETIME
}

function padStr(num, len = 2) {
    return num.toString().padStart(len, '0');
}

@ccclass
@executeInEditMode
export default class DateTime extends cc.Component {
    @property({ type: cc.Label , tooltip: '目标标签，默认为当前节点'})
    targetLabel: cc.Label = null;

    @property({type: cc.Enum(MODE), tooltip: '选择模式'})
    mode: number = MODE.DATETIME;

    @property({range:[1, 60, 1], tooltip:'刷新率'})
    refreshRate: number = 1

   
    _duration: number = 0;

    __preload() {
        if (!this.targetLabel) {
            this.targetLabel = this.getComponent(cc.Label);
        }
    }

    formatDataTime(): string {
        let date = new Date();
        let year = date.getFullYear();
        let month = padStr(date.getMonth());
        let day = padStr(date.getDate());
        let hours = padStr(date.getHours());
        let minutes = padStr(date.getMinutes());
        let seconds = padStr(date.getSeconds());
    
        if (this.mode=== MODE.DATETIME) {
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        } else if (this.mode=== MODE.DATE) {
            return `${year}-${month}-${day}`;
        } else if (this.mode=== MODE.TIME) {
            return `${hours}:${minutes}:${seconds}`;
        }
    }

    start () {
        if (!this.targetLabel) {
            cc.error('未设置 Label 节点，请检查！');
            return;
        }
        this.targetLabel.string = this.formatDataTime();
        if (CC_EDITOR) {
            //编辑器中实时更新时间
            setInterval(() => {
                this.updateLabel(1);
            }, 1000);
        } else {
            this.schedule(this.updateLabel, 1);
        }
    }

    updateLabel(dt) {
        this._duration += dt;
        if (this._duration >= this.refreshRate) {
            this.targetLabel.string = this.formatDataTime();
            this._duration = 0;
        }
    }

}
