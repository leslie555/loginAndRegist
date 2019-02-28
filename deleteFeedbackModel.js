import modelExtend from 'dva-model-extend';
import { commonModel } from '../loginAndRegist/commonModel';


export default modelExtend(commonModel, {
  namespace: 'deleteFeedbackModel',
  state: {},
  reducers: {},
  effects: {
    *deleteFeedback({payload:{adminId,id}},{call}){
      console.log('can delfeed');
      yield call(
        global.myFetch,
        {
          url:global.serverBaseUrl+`/Admins/${adminId}/feedbacks/${id}?`,
          method: 'DELETE',
          
        }
      )
      console.log('can delfeed2');
    }
  },
});
