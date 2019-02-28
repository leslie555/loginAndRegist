import modelExtend from 'dva-model-extend';
import { commonModel } from '../../commonModel';

import urlencode from 'isomorphic-urlencode'
// import {corFetch, changePcToMobileUrlAndRemoveUnusedParams, getCommodityFromGongxiaoHtmlStr, getProductCode, getBrandName, getBrandId} from '../components/AddInShopCommodityUsingUrl';


export default modelExtend(commonModel, {
  namespace: 'addInShopCommodityModel',
  state: {},
  reducers: {},
  effects: {
    *searchCommodity({payload: {searchedBrandId, searchedBrandName, searchText}}, {put, select}) {
      const limit = 30;
      let json = [];
      if(searchedBrandId) {
        json = yield searchFromDb(searchedBrandId, searchText, limit);
      }
      let length = json.length;
      if(length>0 && length<limit) {
        for(let k in json){
          let productCode = json[k].productCode;
          if(searchText==productCode){
            let tmp = json.splice(k, 1);
            json.unshift(tmp[0]);
            break;
          }
        }
      }
      for(let commodity of json){
        if(commodity.url&&
          (commodity.url.indexOf('gongxiao')>-1||
          commodity.url.indexOf('/product/product_detail.htm?productId')>-1)){
          yield put({
            type:'updateState',
            payload:{'searchResult':json}
          });
          global.Toast.success('搜索成功');
          return;
        }
      }

      // let  resultFromTmallGongxiao;
      // try{
      //   const brandsArray = yield select(function({brandModel: {brandsArray}}){return brandsArray});
      //   resultFromTmallGongxiao = yield searchFromTmallGongxiao(searchedBrandId, searchedBrandName, searchText, brandsArray);
      // }catch(e){
      //   console.error(e);
      // }
      // if(resultFromTmallGongxiao) json.push(resultFromTmallGongxiao);
      yield put({
        type:'updateState',
        payload:{'searchResult':json}
      });
      if(json.length>0){
        global.Toast.success('搜索成功');
      }
    },
  },
});

async function searchFromDb(searchedBrandId, searchText, limit) {
  const filter =
    {where:{brandId:searchedBrandId,productCode:{like:searchText+'%25'}},limit};//百分号是mysql查询中的通配符，%25是百分号的url编码
  const json = await global.myFetch( {
    url: global.serverBaseUrl+'/Commodities',
    data:{filter:JSON.stringify(filter)},
  });
  if(!(json instanceof Array)){
    throw new Error('服务器返回的json数据不为数组！');
  }
  if(json.length>0) console.log('从数据库中搜索到结果');
  return json;
}

// async function searchFromTmallGongxiao(searchedBrandId, searchedBrandName, searchText, brands) {
// //-----------从天猫供销平台搜索商品信息----------------
//   let searchUrl = 'https://gongxiao.tmall.com/search.htm?key='+urlencode(searchedBrandName,'gbk')+' '+searchText;//不能使用urlencode.dom,IE不支持
//   // let searchUrl = 'https://gongxiao.tmall.com/search.htm?key='+searchedBrandName+' '+searchText;//不能使用urlencode.dom,IE不支持
//   let response = await corFetch(searchUrl);
//   let text = await response.text();
//   //-------------从搜索结果中提取商品url--------------
//   let index1 = text.indexOf('J_ThumbTrigger')+68;
//   if(index1<68){
//     return;
//   }
//   let index2 = text.indexOf('\"',index1);
//   let productUrl = 'https://goods.gongxiao.tmall.com' + text.substring(index1, index2);
//   const url = changePcToMobileUrlAndRemoveUnusedParams(productUrl);
//   //------------获取商品信息的html---------------
//   response = await corFetch(url);
//   text = await response.arrayBuffer();
//   let htmlStr = new TextDecoder('gbk').decode(new DataView(text));
//   const commodity = getCommodityFromGongxiaoHtmlStr(htmlStr);
//   commodity.url = url;
//   commodity.productCode = getProductCode(commodity);
//   commodity.brandName = commodity.brandName||searchedBrandName||getBrandName(commodity);
//   commodity.brandId = searchedBrandId||getBrandId(commodity.brandName, brands, url);
//   return commodity;
// }

