import modelExtend from 'dva-model-extend';
import { commonModel } from '../../commonModel';



export default modelExtend(commonModel, {
  namespace: 'concernModel',
  state: null,
  reducers: {},
  effects: {
    *downLoadConcernsInf({shopId, callback}, {put}) {
      // showCircularProgress(dispatch);
      const json = yield global.myFetch({
        url: global.serverBaseUrl+'/Shops/'+shopId+'/concerns',
      });
      yield put({
        type: 'replace',
        payload: json
      });
      if(callback) {
        callback();
      };
    },
  },
});
