import modelExtend from 'dva-model-extend';
import { commonModel } from '../../commonModel';
// import {BosClient} from '@baiducloud/sdk';
import { Buffer } from 'buffer';
import async from 'async';

// import {preprocessInShopCommodity, } from '../utils'

export default modelExtend(commonModel, {
  namespace: 'inShopCommoditiesModel',
  state: null,
  reducers: {},
  effects: {
    *addCommodity(action, {put, select}) {
      let toAddCommodity = action.toAddCommodity;
      //不存在commodity.id说明该commodity来自网络搜索，需要先保
      // 存commodity到服务器
      const {shopModel:{id: shopId}} = yield select(({userModel, shopModel})=>{return {userModel, shopModel}});
      if(!toAddCommodity.id){
        const json = yield global.myFetch(
          {
            url: `${global.serverBaseUrl}/Shops/${shopId}/Commodities`,
            method: 'POST',
            data: {
              ...toAddCommodity,
              shopId: shopId,
            },
          }
        );
        //数据库中commodity的url设置了唯一索引，造成了
        // 下面的错误。
        if (json.error && json.error.code == 'ER_DUP_ENTRY'){
          const filter =
            {where:{url:encodeURIComponent(toAddCommodity.url)}};
          toAddCommodity = yield global.myFetch( {
            url:global.serverBaseUrl+'/Commodities/findOne',
            data:{filter:JSON.stringify(filter)},
          });
        } else {
          toAddCommodity = json;
          addImgToBos(shopId, json);
        }
      }

      const { addInShopCommodityModel, commodityOrderModel, inShopCommoditiesModel } = yield select((state)=>{return state})
      // let unknownInShopCommodityId = 'unknownInShopCommodityId'+Math.floor(Math.random()*10000);
      const commodityOrder = [...commodityOrderModel];
      const inShopCommodities = inShopCommoditiesModel instanceof Array?[...inShopCommoditiesModel]:[];
      for(let k in commodityOrder){
        if(commodityOrder[k].regionName == addInShopCommodityModel.toAddRegion){
          commodityOrder[k].commodities.push(String(toAddCommodity.id));
          // console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjj',action.toAddCommodity.id,JSON.stringify(commodityOrder[k].commodities));
          commodityOrder[k] = {...commodityOrder[k]};//只有这样，目标region才会重新渲染
          break;
        }
      }
      let addedInShopCommodity = {
        commodityId:toAddCommodity.id,
        commodity:toAddCommodity,
      };

      // preprocessInShopCommodity(
      //   addedInShopCommodity,
      //   shopModel.salesInf,
      //   shopModel.salesEndDate
      // );
      inShopCommodities.push(global.normalizeInShopCommodity(addedInShopCommodity));
      yield put({type: 'commodityOrderModel/replace', payload: commodityOrder,});
      yield put({type: 'replace', payload: inShopCommodities, });
      yield put({type: 'addInShopCommodityModel/updateState', payload:{open:false}});
      yield put({type: 'addInShopCommodityInServer', payload: {addedInShopCommodity}});
      yield put({type: 'shopModel/modifyShopInServer', payload: {shopModifiedPart: {commodityOrder}}});
    },
    //删除商品，首先从commodityOrder中删除该商品，然后从inShopCommodities中删除
    *deleteInShopCommodity(action, {select, put}) {
      const { commodityOrderModel, inShopCommoditiesModel } = yield select(state => state);
      const commodityOrder = [...commodityOrderModel];
      const inShopCommodities = [...inShopCommoditiesModel];
      outer:for(let i in commodityOrder){
        let commodities = commodityOrder[i].commodities;
        for(let j in commodities){
          if(commodities[j] == action.commodityId) {
            commodities.splice(j, 1);
            break outer;
          }
        }
      }
      for(let k in inShopCommodities) {
        if(inShopCommodities[k].id == action.inShopCommodityId){
          inShopCommodities.splice(k,1);
          break;
        }
      }
      yield put({type: 'commodityOrderModel/replace', payload: commodityOrder});
      yield put({type: 'replace', payload: inShopCommodities});
      yield put({type: 'deleteInShopCommodityInServer',
        payload: {deletedInShopCommodityId: action.inShopCommodityId}});
      yield put({type: 'shopModel/modifyShopInServer',
        payload: {shopModifiedPart: {commodityOrder}}});
    },
    *toggleCommodityHide(action, {put, select}) {
      const {inShopCommoditiesModel} = yield select(state => state);
      let inShopCommodity = action.inShopCommodity;
      inShopCommodity.hide = !inShopCommodity.hide;
      yield put({type: 'replace', payload: [...inShopCommoditiesModel]});
      yield put({
        type: 'modifyInShopCommodityInServer',
        payload: {
          modifiedInShopCommodityId: inShopCommodity.id,
          inShopCommodityModifiedPart: {hide:inShopCommodity.hide}
        }
      });
    },

    *addInShopCommodityInServer({payload: {addedInShopCommodity}}, {call, select}) {
      const {shopModel:{id: shopId, producerId}} = yield select(state=>state);
      const json = yield call(
        global.myFetch,
        {
          url: global.serverBaseUrl+
            (global.realm==='shop'?`/shops/${shopId}`:`/producers/${producerId}`)
            +'/inShopCommodities',
          method: 'POST', 
          data: {
            ...addedInShopCommodity, shopId,commodity:undefined, producerId: producerId
          },
        }
      );
      for(let k in json){
        addedInShopCommodity[k] = json[k];
      }
    },
    *deleteInShopCommodityInServer({payload: {deletedInShopCommodityId}}, {call, select}) {
      const {shopModel, producerModel} = yield select(state=>state);
      const producerId = producerModel&&producerModel.id;
      yield call(
        global.myFetch,
        {
          url: global.serverBaseUrl+
          (global.realm==='shop'?`/shops/${shopModel.id}`:`/producers/${producerId}`)
          +'/inShopCommodities/'+deletedInShopCommodityId,
          method: 'DELETE',
        }
      );
    },
    *modifyInShopCommodityInServer({payload: {modifiedInShopCommodityId, inShopCommodityModifiedPart}}, {call, select}) {
      const {shopModel:{id: shopId}, producerModel} = yield select(state=>state);
      const producerId = producerModel&&producerModel.id;
      yield call(
        global.myFetch,
        {
          url:global.serverBaseUrl+
          (global.realm==='shop'?`/shops/${shopId}`:`/producers/${producerId}`)
          +'/inShopCommodities/'+modifiedInShopCommodityId,
          method: 'PUT', 
          data: inShopCommodityModifiedPart,
        }
      )
      global.Toast.success('操作成功！');
    }
  },
});


async function addImgToBos(shopId, commodity) {
  //获取BOS STS和相应的bosClient
  while(true) {
    if(global.bosSts && new global.ServerDate().getTime() < new Date(global.bosSts.expiration).getTime() - 1000 * 60) {
      break;
    } else if(global.fetchingSts) {  //global.fetchingSts保证不会一次发出多个STS的请求
      await new Promise(function(resolve){
        (function(){setTimeout(function(){resolve()},1000)})();
      })
    } else {
      global.fetchingSts = true;
      try{
        global.bosSts = await global.myFetch({
          url: `${global.serverBaseUrl}/Shops/${shopId}/getBosSTS`,
          method: 'get'
        })
      } catch(err) {
        console.log('${global.serverBaseUrl}/Shops/${shopId}/getBosSTS error!');
        return;
      }
      const config = {
        endpoint: 'https://gz.bcebos.com',
        credentials: {
          ak: global.bosSts.accessKeyId,
          sk: global.bosSts.secretAccessKey
        },
      };
      global.bosClient = new global.baidubce.sdk.BosClient(config);//global.baidubce是在index.html中引入的，不能使用import引入
      global.fetchingSts = false;
    }
  }

  async.each(
    [...commodity.smallImgs, ...commodity.bigImgs],
    function(imgUrl, callback) {
      fetch(imgUrl)
        .then(function(resp){return resp.blob()})
        .then(function(blob){
          const bucketName = global.bosSts.bucketName;
          const headers = {'x-bce-security-token': global.bosSts.sessionToken, 'x-bce-meta-shopid': shopId, };
          const objectName = getFileNameOnBos(imgUrl);
          return global.bosClient.putObjectFromBlob(bucketName, objectName, blob, headers);
        })
        .then(function(){
          callback()
        })
        .catch(function(err){
          console.log('.catch(function(err){')
          callback(err)
        })
    },
    function(err){
      if(err) {
        console.warn('async.each error', err)
        return;
      }
      
      global.myFetch(
        {
          url: `${global.serverBaseUrl}/Shops/${shopId}/Commodities/${commodity.id}`,
          method: 'PUT',
          data: {
            imgStored: true,
          },
        }
      )

    }
  );
}

function getFileNameOnBos(url){
  return new Buffer(url).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+/, '')
    .split('').reverse().join('');
}