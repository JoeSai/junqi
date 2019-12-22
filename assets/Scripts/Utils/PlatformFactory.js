import {PLATFORM, PLATFORM_TYPE} from "./Utils/Config";

import Web_Desktop_Api from "./Web_Desktop_Api";


window.getPlatform = function(){
    // console.log("get")
  
    if(PLATFORM === PLATFORM_TYPE.WEB_DESKTOP){
        return new Web_Desktop_Api();
    }
}

