//value是否存在数组中
const inArray = function(value,array){
    for(var i in array){
        if(array[i] === value){
            return i;
        }
    }
    return -1;
}

export default {
    inArray: inArray,
};