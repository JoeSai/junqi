// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    
        // var button = this.node.getComponent(cc.Button);
        // var that = this;
        // this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {

        //     button.interactable = false;  //移动过程中按钮禁用

       
        //     var moveXY = cc.v2;
        //     var toXY = cc.v2;
            
        //     // moveXY.x = event.getDeltaX()       //获取鼠标距离上一次事件移动的 X轴距离。
        //     moveXY.y = event.getDeltaY()      //获取鼠标距离上一次事件移动的 Y轴距离。
       
        //     toXY.x = that.node.position.x;
        //     toXY.y = that.node.position.y + moveXY.y;

        //     if(toXY.y > -600 && toXY.y <=0){
        //         that.node.setPosition(toXY);
        //     }
        
        //     // this.node.setPosition(this.node)
        // })

        // this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
           
        //     button.interactable = true;  //按钮可用
        // })
        
       
    },

    start () {

    },

    // update (dt) {},
});
