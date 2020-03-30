
cc.Class({
    extends: cc.Component,

    properties: {

        numNode: cc.Label,
        nameLabel: cc.Label,
        scoreLabel: cc.Label,

    },

    onLoad () {

    },

    setData: function(index, info) {
       
        // this.numNode.node.active = true
        this.numNode.string = index + 1;
        
        this.nameLabel.string = info.name;
        this.scoreLabel.string = info.score;

       
    },

});
