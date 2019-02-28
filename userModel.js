import modelExtend from 'dva-model-extend';
import { routerRedux } from 'dva/router';
import { commonModel } from '../loginAndRegist/commonModel';
import Cookies from 'js-cookie';
const {unknown, logined, notLogined, checkFailed}=global.LoginStateConsts;

export default modelExtend(commonModel, {

  namespace: 'userModel',

  state: null,

  reducers: {
  },

  effects: {
    *getVerifyCode(
      { payload: { mobile, purpose, errCb } },
      { call },
    ) {
      try {
        const response = yield call(global.myFetch, {
          url: `${global.serverBaseUrl}/MobileVerifyCodes/getMobileVerifyCode`,
          method: 'get',
          data: { mobileNumber: mobile.replace(/\s/g, ''), purpose, realm:global.realm },
        });
        global.Toast.success(`短信已发出，60秒后可点击重新发送${response.code||''}`, undefined, undefined, false);
        let timeToAvailable = 60;
        const setIntervalHandler = setInterval(function(){
          global.dispatch({ type: 'appModel/updateState', payload: { [`${purpose}TimeToAvailable`]: --timeToAvailable } });
          if(timeToAvailable === 0) clearInterval(setIntervalHandler); 
        }, 1000);
      } catch (err) {
        errCb(err);
      }
    },

    *loginUsingPassword(
      { payload: { mobile, password, errCb }},
      { call, put },
    ) {
      try {
        const {id:yiyimapToken} = yield call(global.myFetch, {
          url: `${global.serverBaseUrl}/MyUsers/loginUsingMobileAndPassword`,
          method: 'post',
          data: { mobileNumber: mobile.replace(/\s/g, ''), password, realm:global.realm },
        });
        console.log('call',yiyimapToken)
        global.Toast.success('登录成功', undefined, undefined, false);
        global.yiyimapToken = yiyimapToken;
        Cookies.set(global.realm+'yiyimapToken', yiyimapToken, { expires: 365, })
        yield put({
          type: 'appModel/queryWithAdditions',
          redirect: true
        });
      } catch (err) {
        errCb(err);
      }
    },
    *loginUsingMobileVerifyCode(
      { payload: { mobile, verifyCode, errCb } },
      { call, put },
    ) {
      try {
        const {id:yiyimapToken} = yield call(global.myFetch, {
          url: `${global.serverBaseUrl}/MyUsers/loginUsingMobileVerifyCode`,
          method: 'post',
          data: { mobileNumber: mobile.replace(/\s/g, ''), mobileVerifyCode: verifyCode, realm:global.realm },
        });
        global.yiyimapToken = yiyimapToken;
        Cookies.set(global.realm+'yiyimapToken', yiyimapToken, { expires: 365, })
        global.Toast.success('登录成功', undefined, undefined, false);
        yield put(routerRedux.push('/changePassword'));
      } catch (err) {
        errCb(err);
      }
    },
    *regist(
      { payload: { mobile, verifyCode, password, errCb } },
      { call, put },
    ) {
      try {
        const {id:yiyimapToken} = yield call(global.myFetch, {
          url: `${global.serverBaseUrl}/MyUsers/registUsingMobile`,
          method: 'post',
          data: {
            mobileNumber: mobile.replace(/\s/g, ''),
            mobileVerifyCode: verifyCode,
            realm:global.realm,
            password,
            purpose: 'regist',
            tellerId: global.tellerId,
            tellerShopId: global.tellerShopId,
          },
        });
        global.yiyimapToken = yiyimapToken;
        Cookies.set(global.realm+'yiyimapToken', yiyimapToken, { expires: 365, })
        yield put(routerRedux.push('/changePassword'));
        global.Toast.success('注册成功', undefined, undefined, false);
      } catch (err) {
        errCb(err);
      }
    },
    *changePassword({ payload: { password, errCb } }, { call, put }) {
      try{
        yield call(global.myFetch, {
          url: `${global.serverBaseUrl}/MyUsers/reset-password`,
          method: 'post',
          data: {
            newPassword: password,
          },
        });
        global.Toast.success('密码设置成功', undefined, undefined, false);

        yield put({ type: 'appModel/queryWithAdditions', redirect: true });
      }catch(err){
        errCb(err)
      }
    },
    *logout({payload:{exitAllDevices}}, { put, call, select }) {
      // yield call(new Promise());
      // yield put(navigateBack({ key: getCurrentStackKey(routerModel) }));//目的是在登录页按返回键返回home页

      if(!exitAllDevices) {
        yield call(global.myFetch, {
          url: `${global.serverBaseUrl}/MyUsers/logout`,
          method: 'post',
        });
      }
      else {
        const myUserId = yield select(function({userModel:{id: myUserId}}){return myUserId});
        yield call(global.myFetch, {
          url: `${global.serverBaseUrl}/accessTokens`,//使用myusers/me/accessTokens 无法跟where条件
          method: 'delete',
          data: {
            where: {and:[{userId: myUserId}, {ttl: {neq: global.foreverProducerAkTtl}}]}
          }
        });
      }
      
      global.Toast.success('退出登录成功', undefined, undefined, false);
      yield put(routerRedux.push('/'));
      global.dispatch({type: 'appModel/clearData'});
      global.dispatch({type:'appModel/updateState', payload:{loginState: notLogined}});
    },
  },

});
