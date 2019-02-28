import modelExtend from 'dva-model-extend';
import { commonModel } from '../../commonModel';


export default modelExtend(commonModel, {
  namespace: 'shopModel',
  state: null,
  reducers: {
  },
  effects: {
    *updateStateWithServer({ payload }, {put}) {
      yield put({type: 'updateState', payload});
      const cb = payload.cb;
      delete payload.cb;
      yield put({type: 'modifyShopInServer', payload: {shopModifiedPart: payload, cb}});
    },
    *modifyShopInServer({payload: {shopModifiedPart, cb}}, {call, select}){
      if(global.realm==='shop'){
        yield call(
          global.myFetch,
          {
            url:global.serverBaseUrl+'/MyUsers/me/shop',
            method: 'PUT', 
            data: shopModifiedPart,
          }
        );
      } else if(global.realm==='producer'){
        const {producerId, shopId} = yield select(
          function({producerModel:{id:producerId}, shopModel:{id:shopId}}){
            return {producerId, shopId}
          }
        );
        yield call(
          global.myFetch,
          {
            url:`${global.serverBaseUrl}/producers/${producerId}/shops/${shopId}`,
            method: 'PUT', 
            data: shopModifiedPart,
          }
        );
      }
      if(cb) cb();
    }
  },
});
