import modelExtend from 'dva-model-extend';
import { commonModel } from '../../commonModel';


export default modelExtend(commonModel, {
  namespace: 'gettedCouponModel',
  state: null,
  reducers: {},
  effects: {
    *query({shopId, callback}, {call, put, select}){
      let json;
      if(global.realm==='shop'){
        json = yield call(global.myFetch,
          {
            url:  global.serverBaseUrl+'/Shops/'+shopId+'/gettedCoupons',/*,\"order\":[\"startedDate DESC\",\"id DESC\"]*/
          }
        );
      } else if(global.realm==='producer'){
        const producerId = yield select(function({producerModel:{id: producerId}}){return producerId});
        const result = yield call(
          global.myFetch,
          {
            url:  global.serverBaseUrl+'/producers/'+producerId+'/shops',/*,\"order\":[\"startedDate DESC\",\"id DESC\"]*/
            data:{filter: {where:{id:shopId}, include:'gettedCoupons'}}
          }
        );
        json = result[0].gettedCoupons;
      }
      const gettedCouponMap = {};
      for(let item of json) {
        gettedCouponMap[item.id] = item;
      }
      yield put({type:'updateState', payload: {gettedCouponArr: json, gettedCouponMap}})
      if(callback) callback();
    },
  },
});
