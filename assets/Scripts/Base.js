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
    },
    openOrCloseMenuGroup(){
        let menuGroup = cc.find("Canvas/MenuBtn/menuGroup");      //父节点
        menuGroup.active = !menuGroup.active;

    },
    clickVolume(){
        let layerFather = cc.find("Canvas/MenuBtn/menuGroup/menuGroup-icon/layout");      //父节点
        let soundOn = layerFather.getChildByName("soundOn");
        let soundOff = layerFather.getChildByName("soundOff");
        
        soundOn.active = ! soundOn.active;
        soundOff.active = ! soundOff.active;
        Animation.haveVolume = ! Animation.haveVolume;  //Animation 为 window 变量

        this.openOrCloseMenuGroup();
    }
    // update (dt) {},
});

export default Base;
