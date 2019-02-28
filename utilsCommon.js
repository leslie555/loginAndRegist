import { routerRedux } from 'dva/router';
import { Buffer } from 'buffer';
// require('promise.prototype.finally').shim();


if(typeof String.prototype.startsWith != 'function'){
  String.prototype.startsWith=function(str){  
    var reg=new RegExp('^'+str);  
    return reg.test(this);  
  }  
}


if(typeof String.prototype.endsWith != 'function'){
  String.prototype.endsWith=function(str){  
    var reg=new RegExp(str+'$');  
    return reg.test(this);  
  }
}

function dialogFn(iconType, param) {
  let dialogOptions;
  if(typeof param === 'string') dialogOptions = {message: param, iconType};
  else {
    dialogOptions = param;
    if(!dialogOptions.iconType) dialogOptions.iconType = iconType;
  }

  global.dispatch({
    type:'appModel/updateState', 
    payload: {
      dialogOpen: true,
      dialogOptions
    }
  });
}

global.MyDialog = {
  success: dialogFn.bind(undefined, 'success'),
  warning: dialogFn.bind(undefined, 'warning'),
  error: dialogFn.bind(undefined, 'error'),
  info: dialogFn.bind(undefined, 'info'),
  confirm: dialogFn.bind(undefined, 'confirm'),
}

global.Toast = {
  info: function(message, snackDuration){
    global.dispatch({
      type:'appModel/updateState',
      payload: {snackbarOpen: true, snackbarType: 'info', snackbarMessage: message, snackDuration}
    });
  },
  success: function(message, snackDuration){
    global.dispatch({
      type:'appModel/updateState',
      payload: {snackbarOpen: true, snackbarType: 'success', snackbarMessage: message, snackDuration}
    });
  },
  error: function(message, snackDuration){
    global.dispatch({
      type:'appModel/updateState',
      payload: {snackbarOpen: true, snackbarType: 'error', snackbarMessage: message, snackDuration}
    });
  },
  warning: function(message, snackDuration){
    global.dispatch({
      type:'appModel/updateState',
      payload: {snackbarOpen: true, snackbarType: 'warning', snackbarMessage: message, snackDuration}
    });
  },
};


global.myFetch = function(options){
  // console.log('dddddddddddddddddddd', window.location.hash)
  if(global.circularProgressShowControlArr&&global.circularProgressShowControlArr.length>0) {
    global.circularProgressShowControlArr.push(1);
  }
  else {
    global.circularProgressShowControlArr = [1];
    global.dispatch({
      type: 'appModel/updateState',
      payload: {circularProgressShow: true}
    });
  }
  let url = options.url;
  const method = options.method?options.method.toUpperCase():'GET';
  options.method = method;
  if(url.indexOf(global.serverBaseUrl)>-1&&global.yiyimapToken
  ) {
    if(options.headers) options.headers.authentication = global.yiyimapToken;
    else options.headers = {authentication: global.yiyimapToken};
  }
  if((!method||method==='GET')&&options.data){
    url = url + '?';
    for(let item in options.data){
      const val = options.data[item];
      url=`${url}${item}=${typeof val === 'object'?JSON.stringify(val):val}&`
    }
    url = url.slice(0, -1);
  }
  else if(method==='POST'||method==='PATCH'
    ||method==='PUT'||method==='DELETE') {
    options.body = JSON.stringify(options.data);
    if(options.headers) options.headers['Content-Type'] = 'application/json';
    else options.headers = {'Content-Type': 'application/json'};
  }
  delete(options.url);
  delete(options.data);
  return new Promise(function(resolve, reject){
    let resp;
    fetch(url, options)
      .then(function(response){
        // 同步服务器时间到本地
        if(!global.ServerDate) global.ServerDate = Date;
        if(url.startsWith(global.serverHost)) {
          const serverTime = new Date(response.headers.get('Date')).getTime();
          const minus = serverTime-global.ServerDate.now();
          if(Math.abs(minus)>1000*60*10) {
            global.dateMinus = serverTime-Date.now();
            const ServerDate = function(){
              const tmp = new Date(Date.now()+global.dateMinus);
              return tmp;
            };
            ServerDate.now = function(){return Date.now()+ global.dateMinus;};
            global.ServerDate = ServerDate;
          }
        }
        resp = response;
        if(resp.status===204) { //操作成功，但是没有数据需要返回
          return;
        }
        if(resp.status===401) { //没有操作权限，很有可能是没有登录
          if(window.location.hash.indexOf('console')>-1) {
            // global.dispatch(routerRedux.push('/login'));
          }
          return;
        }
        if (response.headers.get('Content-Type')==='application/json; charset=utf-8') {
          return response.json();
        }
        else return response.text();
      })
      .then(function(json){
        if(Math.floor(resp.status/100)!==2) {
          let message;
          if(json&&json.error&&json.error.message)
            message = json.error.message;
          else if(json&&json.data&&json.data.error&&json.data.error.message)
            message = json.data.error.message;
          else message = resp.statusText;
          throw(message);
        }
        global.circularProgressShowControlArr.shift();
        if(global.circularProgressShowControlArr.length===0) {
          global.dispatch({
            type: 'appModel/updateState',
            payload: {circularProgressShow: false}
          });
        }
        resolve(json);
      })
      .catch(function(err){
        // global.Toast.info('网络连接失败，请检查您的网络！');
        global.circularProgressShowControlArr.shift();
        if(global.circularProgressShowControlArr.length===0) {
          global.dispatch({
            type: 'appModel/updateState',
            payload: {circularProgressShow: false}
          });
        }
        reject(err);
      });
  });
}

global.LoginStateConsts = {
  unknown: 0,
  logined: 1,
  notLogined: 2,
  checkFailed: 3,
};


global.addHttpsToUrl = function(url) {
  if(!url.startsWith('http')&&!url.startsWith('data:image')) return `https:${url}`;
  return url;
}


global.preventContextMenu = function(node){
  if(node){
    node.addEventListener('contextmenu', function(e){
      e.preventDefault();
    });
    node.addEventListener('oncontextmenu', function(e){
      e.preventDefault();
    });
    node.addEventListener('touchstart', function(e){
      e.preventDefault();
    });
  }
}
// global.scaleImg = function(urlOrigin, scaleFlag) {
//   let url = global.addHttpsToUrl(urlOrigin);
//   if(url.indexOf('producer-img.') > -1) {
//     if (scaleFlag === 'tiny') {
//       return `${url}@w_120`;
//     }
//     else if (scaleFlag === 'half') {
//       return `${url}@w_360`;
//     }
//     else if (scaleFlag === 'small') {
//       return `${url}@w_120`;
//     }
//     else {
//       return `${url}@w_800`;
//     }
//   }
//   // const reg = /(\d\d\d+)x(\d\d\d+)/;
//   // const result = url.match(reg);
//   // if(result) {
//   //   if(url.indexOf('.360buyimg.com')>-1){
//   //     if (scaleFlag === 'half') {
//   //       return url.replace(reg, '350x350')+'!q70.dpg';
//   //     }
//   //     else if (scaleFlag === 'small') {
//   //       return url.replace(reg, '120x120')+'!q70.dpg';
//   //     }
//   //     else {
//   //       return url.replace(reg, '750x750')+'!q70.dpg';
//   //     }
//   //   }
//   //   if(url.indexOf('alicdn.com') > -1){
//   //     if (scaleFlag === 'half') {
//   //       return url.replace(reg, '360x360');
//   //     }
//   //     else if (scaleFlag === 'small') {
//   //       return url.replace(reg, '120x120');
//   //     }
//   //     else {
//   //       return url.replace(reg, '800x800');
//   //     }
//   //   }
//   // }
//   // if(url.indexOf('alicdn.com') > -1) { //来自alicdn.com且不带宽高信息的url
//   //   if(scaleFlag === 'half') return `${url}_360x360Q50s50.jpg`;
//   //   else if(scaleFlag === 'small') return `${url}_120x120Q50s50.jpg`;
//   //   else return `${url}_800x800Q50s50.jpg`;
//   // }
//   // if(url.indexOf('.360buyimg.com')>-1){
//   //   if (scaleFlag === 'half') {
//   //     return url.replace('/jfs/', '/s372x372_jfs/')+'!q70.dpg';
//   //   }
//   //   else if (scaleFlag === 'small') {
//   //     return url.replace('/jfs/', '/s120x120_jfs/')+'!q70.dpg';
//   //   }
//   //   else {
//   //     return url+'!q70.dpg';
//   //   }
//   // }
//   // if(url.indexOf('appsimg.com') > -1){ //唯品会
//   //   if (scaleFlag === 'half') {
//   //     if(url.match('720x909')) return url.replace('720x909', '360x360');
//   //     else return url.replace('.jpg', '_360x360_70.jpg');
//   //   }
//   //   else if (scaleFlag === 'small') {
//   //     if(url.match('720x909')) return url.replace('720x909', '120x120');
//   //     else return url.replace('.jpg', '_120x120_70.jpg');
//   //   }
//   //   else {
//   //     return url;
//   //   }
//   // }
//   return url;
// }


// global.dereplication = (arr)=>{
//   if(!arr||!(arr instanceof Array)||arr.length<2) return arr;
//   const toRemoveIndexs=[];
//   for(let i=0;i<arr.length;i++){
//     let item = arr[i];
//     for(let j=0;j<i;j++){
//       if(item===arr[j]) {
//         toRemoveIndexs.push(i);
//         break;
//       }
//     }
//   }
//   if(toRemoveIndexs.length===0) return arr;
//   return arr.filter(function(item, index){
//     if(toRemoveIndexs.indexOf(index)>-1) return false;
//     return true;
//   })
// }


function deepClone(o){
  var k, ret= o, b;
  if(o && ((b = (o instanceof Array)) || o instanceof Object)) {
      ret = b ? [] : {};
      for(k in o){
          if(o.hasOwnProperty(k)){
              ret[k] = deepClone(o[k]);
          }
      }
  }
  return ret;
}
global.deepClone = deepClone;

//获取一个对象被修改的部分，返回值为一个对象，其key为被修改的属性
global.getObjectModifiedPart = (oldObj, newObj, ignoreProps)=>{
  let returnObj = {};
  if (typeof ignoreProps == 'undefined') ignoreProps = [];
  for(let key in oldObj){
    if (ignoreProps.includes(key)) continue;
    ignoreProps.push(key);
    if(!deepCompare(oldObj[key], newObj[key])){
      if(typeof newObj[key] == 'undefined') returnObj[key] = null;//当前属性可能是被删除了，undefined不能转换为json字符串，所以改为null
      else returnObj[key] = newObj[key];
    }
  }
  for(let key in newObj){
    if (ignoreProps.includes(key)) continue;
    if(!deepCompare(oldObj[key], newObj[key])){
      if(typeof newObj[key] == 'undefined') returnObj[key] = null;
      else returnObj[key] = newObj[key];
    }
  }
  return returnObj;
}

function deepCompare(x, y){
    var i, l, leftChain, rightChain;

    function compare2Objects(x, y) {
        var p;

        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
            return true;
        }

        // Compare primitives and functions.
        // Check if both arguments link to the same object.
        // Especially useful on the step where we compare prototypes
        if (x === y) {
            return true;
        }

        // Works in case when functions are created in constructor.
        // Comparing dates is a common scenario. Another built-ins?
        // We can even handle functions passed across iframes
        if ((typeof x === 'function' && typeof y === 'function') ||
            (x instanceof Date && y instanceof Date) ||
            (x instanceof RegExp && y instanceof RegExp) ||
            (x instanceof String && y instanceof String) ||
            (x instanceof Number && y instanceof Number)) {
            return x.toString() === y.toString();
        }

        // At last checking prototypes as good as we can
        if (!(x instanceof Object && y instanceof Object)) {
            return false;
        }

        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
            return false;
        }

        if (x.constructor !== y.constructor) {
            return false;
        }

        if (x.prototype !== y.prototype) {
            return false;
        }

        // Check for infinitive linking loops
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
            return false;
        }

        // Quick checking of one object being a subset of another.
        // todo: cache the structure of arguments[0] for performance
        for (p in y) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            } else if (typeof y[p] !== typeof x[p]) {
                return false;
            }
        }

        for (p in x) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            } else if (typeof y[p] !== typeof x[p]) {
                return false;
            }

            switch (typeof(x[p])) {
                case 'object':
                case 'function':

                    leftChain.push(x);
                    rightChain.push(y);

                    if (!compare2Objects(x[p], y[p])) {
                        return false;
                    }

                    leftChain.pop();
                    rightChain.pop();
                    break;

                default:
                    if (x[p] !== y[p]) {
                        return false;
                    }
                    break;
            }
        }

        return true;
    }

    if (arguments.length < 1) {
        return true; //Die silently? Don't know how to handle such case, please help...
        // throw "Need two or more arguments to compare";
    }

    for (i = 1, l = arguments.length; i < l; i++) {

        leftChain = []; //Todo: this can be cached
        rightChain = [];

        if (!compare2Objects(arguments[0], arguments[i])) {
            return false;
        }
    }

    return true;
}

global.deepCompare = deepCompare;

/**获得操作系统***/
global.OS = (function () {
  // alert('11111111111111111111111111'+ navigator.platform+' '+ navigator.userAgent.toLowerCase())
  const  userAgentLowerCase = navigator.userAgent.toLowerCase();
  if (navigator.platform == 'Mac68K' || navigator.platform == 'MacPPC' || 
    navigator.platform == 'Macintosh' || navigator.platform == 'MacIntel')
    return 'mac';
  if (navigator.platform === 'Win32' || navigator.platform === 'Windows') {
    if(userAgentLowerCase.indexOf('win64')>=0||userAgentLowerCase.indexOf('wow64')>=0) return 'x64';
    return 'x86';
  }
  if(userAgentLowerCase.indexOf('android')>-1) return 'android';
  if(userAgentLowerCase.indexOf('iphone')>-1) return 'ios';
  return 'other';
})();

global.ThemeColor1 = '#f74774'//'#EC008C';
global.ThemeColor2 = '#FE8649';
global.StatusBarColor = '#EC008C';
global.TheBlue = '#4395ff';

global.getUrlOnBos = function({fileName, bucketName, producerId, commodityId}){
  return `https://${bucketName||'producer-img'}.gz.bcebos.com/${producerId}/${commodityId}/${fileName}`;
}

global.urlToBosFileName = function(url){
  return Buffer.from(url, 'utf-8').toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+/, '');
}

global.bosFileNameToUrl = function(key){
  return Buffer.from(key.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
}

let matchResult = window.location.href.match(/tellerId=(\d+)/);
if(matchResult&&matchResult[1]) global.tellerId = parseInt(matchResult[1]);

matchResult = window.location.href.match(/\/#\/shop\/(\d+)$/);
if(matchResult&&matchResult[1]) {
  global.tellerShopId = parseInt(matchResult[1]);
}

global.isUserHasRole = function(user, roleName){
  if(!user.roleMappings||user.roleMappings.length===0) return false;
  for(let roleMapping of user.roleMappings){
    if(roleMapping.role&&roleMapping.role.name===roleName) return true;
  }
  return false;
}

global.apkUrl = '//yiyimap-apk.cdn.bcebos.com/衣衣地图_release.apk';
global.appUrlInAppStore = 'https://itunes.apple.com/cn/app/%E8%A1%A3%E8%A1%A3%E5%9C%B0%E5%9B%BE/id1446153760?mt=8';

global.foreverProducerAkTtl = 60*60*24*365*60; //超过68年mysql的11位int就装不下了

global.mobileRegExpStr = '^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\\d{8}$';
global.emailRegExpStr = '.+@.+\\..+';


global.normalizeCommodity = function(commodity){
  if(!commodity.sizes||commodity.sizes.length===0){
    commodity.sizes = ['默认尺码'];
  }
  if(!commodity.colors||commodity.colors.length===0){
    commodity.colors = [{color:'默认颜色', iconImg: commodity.smallImgs[0], colorImg: commodity.smallImgs[0]}];
  } else {
    for(let item of commodity.colors){
      if(!item.iconImg) item.iconImg = item.colorImg||commodity.smallImgs[0];
      if(!item.colorImg) item.colorImg = item.iconImg||commodity.smallImgs[0];
    }
  }
  return commodity;
}

global.normalizeInShopCommodity = function(inShopCommodity){
  if(!inShopCommodity.signPrice){
    inShopCommodity.signPrice = inShopCommodity.commodity.signPrice;
  }
  if(!inShopCommodity.priceInShop){
    inShopCommodity.priceInShop = inShopCommodity.signPrice;
  }
  if(!inShopCommodity.quantities) inShopCommodity.quantities = {};
  inShopCommodity.commodity = global.normalizeCommodity(inShopCommodity.commodity)
  return inShopCommodity;
}

// {"白色": {"L":{"quantity":12}}} [{color:'白色', img:'ssss'}]
global.getIconColors = function(inShopCommodity){
  const commodity = inShopCommodity.commodity;
  return commodity.colors.filter(function(item){
    let color = item.color;
    let quantitiesInAColor = inShopCommodity.quantities[color];
    for(let size in quantitiesInAColor) {
      if(quantitiesInAColor[size].quantity>0) return true;
    }
  })
}


global.dereplication = function(arr){
  if(!arr||!(arr instanceof Array)||arr.length<2) return arr;
  var obj = {};
  var newArr = [...arr];
  for(var i=0;i<newArr.length;i++){
    var item = newArr[i];
    if(!obj[item]) {
      obj[item] = 1;
    } else {
      newArr[i] = undefined;
    }
  }
  return newArr.filter(function(item){return Boolean(item)})
}

global.getImgsInCommodity = function(commodity){
  var smallImgs = commodity.smallImgs || [];
  var bigImgs = commodity.bigImgs || [];
  var colorImgs = (commodity.colors || []).map(function(item) {
    return item.colorImg;
  });
  var iconImgs = (commodity.colors || []).map(function(item) {
    return item.iconImg;
  });
  var imgs = smallImgs.concat(bigImgs).concat(colorImgs).concat(iconImgs).filter(
    function(imgUrl){return Boolean(imgUrl)}
  );
  return global.dereplication(imgs);
}