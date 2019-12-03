// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var Base = cc.Class({
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

    // onLoad () {},

    start () {

    },
    backToIndex(){
        cc.director.loadScene("Index");
    },
    backToLevel(){
        cc.director.loadScene("Level");
    },
    layerShow(openLayer){
  
        let layerFather = cc.find("Canvas/Layer");      //父节点
        let layer = layerFather.getChildByName(openLayer);


        layerFather.active = true;
        layer.active = true;
    },
    layerClose(closeLayer){
        let layerFather = cc.find("Canvas/Layer");      //父节点
        let layer = layerFather.getChildByName(closeLayer);
        layerFather.active = false;
        layer.active = false;
    }
    // update (dt) {},
});

export default Base;
