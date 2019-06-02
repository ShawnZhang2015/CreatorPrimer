
cc.Class({
    extends: cc.Component,

    properties: {
        _num: 1,
        num: {
            get() {
                return this._num;
            },

            set(value) {
                if (value === this._num) {
                    return;
                }

                if (!this.label) {
                    this.label = this.getComponentInChildren(cc.Label);
                }

                this._num = value;
                this.label.string = this._num.toString();
                this.label.node.active = this._num !== 0
                if (this._num) {
                    this._reset();
                }
            }
        }
    },


    onLoad() {
        this.label = this.getComponentInChildren(cc.Label);

        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    },

    _onTouchStart(touchEvent) {
        if (this.num === 0) {
            return;
        }
        let location = touchEvent.getLocation();
        this.label.node.parent = this.node.parent;
        this.label.node.position = this.node.parent.convertToNodeSpaceAR(location);

    },

    _onTouchMove(touchEvent) {
        if (this.num === 0) {
            return;
        }

        let delta = touchEvent.getDelta();
        this.label.node.position = delta.add(this.label.node.position);
    },

    _onTouchEnd() {
        if (this.num === 0) {
            this.num = 1;
        } else {
            this._reset();
        }
    },


    _onTouchCancel(touchEvent) {

        let location = touchEvent.getLocation();
        let point = this.node.parent.convertToNodeSpaceAR(location);
        let seats = this.node.parent.children;
        let seat = this._findTargetSeat(seats, point);
        if (seat) {
            this._enterTargetSeat(seat);
        } else {
            this._reset();
        }
    },

    _reset() {
        this.label.node.parent = this.node;
        this.label.node.position = cc.v2(0, 0);
    },

    _findTargetSeat(seats, point) {
        let seatNode = seats.find(node => {
            let seat = node.getComponent('Seat');
            if (seat) {
                let rect = node.getBoundingBox();
                return rect.contains(point);
            }
        });

        return seatNode;
    },

    _enterTargetSeat(targetSeat) {
        let seat = targetSeat.getComponent('Seat');

        if (seat.num === 0) {
            seat.num = this.num;
            this.num = 0;
        } else if (seat.num === this.num) {
            seat.num *= 2;
            this.num = 0;
        } else {
            let temp = this.num;
            this.num = seat.num;
            seat.num = temp;
        }
    },

    start () {

    },


});
