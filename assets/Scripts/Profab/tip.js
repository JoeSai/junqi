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

        label: cc.Label,

    },

    onLoad: function() {
        this.node.name = "TipNode";
    },

    showTip: function(strMsg) {
        let that = this;
        this.node.active = true;
        this.label.string = strMsg;
        // this.unscheduleAllCallbacks();
        this.scheduleOnce(function() {
            that.node.active = false;
        }, 2);
    },

    onDestroy: function() {
        // this.unscheduleAllCallbacks();
        console.log("destroy")
    },

});
