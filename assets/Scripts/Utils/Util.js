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

export default {
    inArray: inArray,
    getUniqueId:getUniqueId,
};