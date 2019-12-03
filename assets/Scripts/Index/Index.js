import Base from "../Base";

cc.Class({
    extends: Base,

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
    startBtn(){
        cc.director.loadScene("Level");
    },

    openLayer(target,openLayer){
        this.layerShow(openLayer);
    },
    closeLayer(target,closeLayer){
        this.layerClose(closeLayer);
    },

    // update (dt) {},
});
