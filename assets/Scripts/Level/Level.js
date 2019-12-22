import Base from "../Base";


// const level_aiDepth = {"1":[1],"2":[2,3],"3":[3,4]};

cc.Class({
    extends: Base,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    chooseLevel(event,level){




        // console.log(level_aiDepth[level]);
        GameController.level = parseInt(level) + 1;

        cc.director.loadScene("Game");
    },
    openLayer(target,openLayer){
        this.layerShow(openLayer);
    },
    closeLayer(target,closeLayer){
        this.layerClose(closeLayer);
    },


    // update (dt) {},
});
