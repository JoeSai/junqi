//value是否存在数组中
const inArray = function(value,array){
    for(var i in array){
        if(array[i] === value){
            return i;
        }
    }
    return -1;
}

const getUniqueId = function(){
    return Number(Math.random().toString().substr(3,3) + Date.now()).toString(36);
}

//数组去重
const clearRepeat = function(array){

    var result = [];
    for(var i = 0; i < array.length; i++){
        for(var j = i + 1; j < array.length; j++){
            if(array[i] === array[j]){
                j = ++i;
            }
        }
        result.push(array[i]);
    }
    return result;
    
}

export default {
    inArray: inArray,
    getUniqueId:getUniqueId,
    clearRepeat,clearRepeat
};