import modelExtend from 'dva-model-extend';
import { routerRedux } from 'dva/router';
// import {TextDecoder} from 'text-encoding'
import { commonModel } from '../..//commonModel';
import Cookies from 'js-cookie';

const {unknown, logined, notLogined, checkFailed}=global.LoginStateConsts;

export const getScreenWidth = ()=>{
  let screenWidth = document.body.clientWidth;
  return screenWidth<700?1:(screenWidth<1024?2:3);
}

export default modelExtend(commonModel, {
  namespace: 'appModel',
  state: {
    loginState: unknown,
    screenWidth: getScreenWidth(),
  },
  reducers: {
  },
  effects: {
    *queryWithAdditions({redirect}, {put}) {
      if(!global.yiyimapToken) { //刷新操作会使global.yiyimapToken丢失，需要从cookie中恢复
        const yiyimapToken = Cookies.get(global.realm+'yiyimapToken');
        if(yiyimapToken) {
          global.yiyimapToken = yiyimapToken;
        }
      }

      let json;
      try {
        json = yield global.myFetch({
          url: global.serverBaseUrl+'/MyUsers/me',
          data:{filter:{include:{shop:[{inShopCommodities:'commodity'}]}}},
        });
      } catch(err){
        yield put({type: 'updateState', payload: {loginState: notLogined}});
        throw err;
      }
      if(!json.shop) {
        if(redirect) yield put(routerRedux.push('/bindShop')); //rederect说明了是登录或注册后的操作，而不是刷新操作
        return;
      }
      
      if(!json.shop.name) { // 用户刚注册，shop信息还没有创建
        yield put({type: 'userModel/replace', payload: json});
        yield put({type: 'shopModel/replace', payload: json.shop});
      } else {
        yield put({type: 'userModel/replace', payload: json});
        storeDataToModels(json.shop)        
      }
      yield put({type: 'updateState', payload: {loginState: logined}});
      if(redirect) {
        if(typeof redirect === 'string') {
          yield put(routerRedux.push(redirect));
        }
        else if(!json.shop || !json.shop.name || !json.shop.brandId){
          yield put(routerRedux.push('/consoleOfShop/setShop'));
        } else {
          yield put(routerRedux.push('/consoleOfShop/inShopCommoditiesManage'));
        }
      }
    },
    //asyn actioncreator
    *clearData(action, {put}){
      yield put({ type: 'userModel/replace', payload: {} });
      yield put({ type: 'shopModel/replace', payload: {} });
      yield put({type: 'commodityOrderModel/replace', payload: {}});
      yield put({type: 'inShopCommoditiesModel/replace', payload: {}});
      yield put({ type: 'createFeedbackModel/replace', payload: {} });
      yield put({ type: 'inputDialogModel/replace', payload: {} });
      yield put({ type: 'couponsModel/replace', payload: {} });
      window.location.reload();
    },
    
  },
});


const getCommodityIds = function(inShopCommodities){
  let commodityIds = [];
  for(let i in inShopCommodities){
    commodityIds.push(inShopCommodities[i].commodityId.toString());//id可能是数字，统一转换为字符串，以便后续处理
  }
  return commodityIds;
};
const clearUpCommodityOrder = function(commodityOrder,commodityIds){
  if(!(commodityOrder instanceof Array)) commodityOrder=[];
  for(let i in commodityOrder){
    if(!(commodityOrder[i].commodities instanceof Array))
      commodityOrder[i].commodities = [];
    let commodities = commodityOrder[i].commodities;
    for(let j in commodities){
      let tmp = typeof commodities[j];//tmp实际上时commodity id
      if((tmp!='number' && tmp!='string')//需要排除tmp为null或undefined的情况
        || commodityIds.indexOf(commodities[j].toString())<0) {
        commodities.splice(j,1);
      }
    }
  }
  return commodityOrder;
}
const getOrderedCommodityIds = function(commodityOrder){
  let commodityIds = [];
  for(let i in commodityOrder){
    let commodities = commodityOrder[i].commodities;
    for(let j in commodities){
      commodityIds.push(commodities[j]);
    }
  }
  return commodityIds;
};
const getUnOrderedCommodityIds = function(commodityIds, orderedCommodityIds) {
  let unOrderedCommodityIds = [];
  outer:for(let i in commodityIds){
    for(let j in orderedCommodityIds){
      if(commodityIds[i] == orderedCommodityIds[j]) continue outer;
    }
    unOrderedCommodityIds.push(commodityIds[i]);
  }
  return unOrderedCommodityIds;
};
export const storeDataToModels = function(shop){
  global.dispatch({type: 'shopModel/replace', payload: shop});
  //获取获取店铺内所有commodity的id构成的数组
  const inShopCommodities = shop.inShopCommodities;
  let commodityIds = getCommodityIds(inShopCommodities);
  let commodityOrder = shop.commodityOrder;
  //清理掉commodityOrder中不在commodityIds数组中的commodity id
  commodityOrder = clearUpCommodityOrder(commodityOrder, commodityIds);
  //获取commodityOrder中所有commodity id构成的数组
  let orderedCommodityIds = getOrderedCommodityIds(commodityOrder);
  //获取在commodityIds中但不在commodityOrder中的commodity id构成的数组
  let unOrderedCommodityIds
    = getUnOrderedCommodityIds(commodityIds, orderedCommodityIds);
  if(unOrderedCommodityIds && unOrderedCommodityIds.length > 0) 
    commodityOrder.push({regionName:'未分类商品',commodities:unOrderedCommodityIds});
  global.dispatch({type: 'commodityOrderModel/replace', payload: commodityOrder});
  for(let inShopCommodity of inShopCommodities){
    global.normalizeInShopCommodity(inShopCommodity);
  }
  global.dispatch({type: 'inShopCommoditiesModel/replace', payload: inShopCommodities});
}