import modelExtend from 'dva-model-extend';
import { commonModel } from '../loginAndRegist/commonModel';

export default modelExtend(commonModel, {
  namespace: 'conversationModel',
  state: {
  },
  effects: {
    *updateStateWithServer({ payload }, {put}) {
      yield put({type: 'updateState', payload});
      // const cb = payload.cb;
      // delete payload.cb;
      yield put({type: 'modifyConversationInServer', payload: {conversation: payload.conversation,id:payload.id}});
      // console.log('withServer');
    },
    *modifyConversationInServer({payload: {conversation,id}}, {call}){
      try{
        yield call(
          global.myFetch,
          {
            url:global.serverBaseUrl+`/Myusers/me/feedbacks/${id}?`,
            method: 'PUT', headers: {'Content-Type': 'application/json'},
            data: {'conversation':conversation},
          }
        );
        // console.log('modifyArr',newArr)
      } catch(err){
        alert(err);
      }
      
      // if(cb) cb();
    },
    *updateStatusCodeWithServer({payload},{put}){
      yield put({type:'updateState',payload});
      yield put({type:'modifyStatusCodeInserver',payload:{statusCode:100,id:payload.id}})
    },
    *modifyStatusCodeInserver({payload:{statusCode,id}},{call}){
      try{
        yield call(
          global.myFetch,
          {
            url:global.serverBaseUrl+`/Myusers/me/feedbacks/${id}?`,
            method: 'PUT', headers: {'Content-Type': 'application/json'},
            data: {'statusCode':statusCode},
          }
        );
      } catch(err){
        alert(err);
      } 
    },

  },
});
