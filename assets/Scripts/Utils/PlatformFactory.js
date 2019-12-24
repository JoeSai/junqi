import {PLATFORM, PLATFORM_TYPE} from "./Config";

import WebDesktopApi from "./WebDesktopApi";
import WxApi from "./WxApi";

window.getPlatform = function(){
    // console.log("get")
  
        if(PLATFORM === PLATFORM_TYPE.WX){
            return new WxApi();
        }
        // return new Web_Desktop_Api();
        else if(PLATFORM === PLATFORM_TYPE.WEB_DESKTOP){
            return new WebDesktopApi();
            console.log("11111111112")
        }
        // return new Web_Desktop_Api();
}

