import modelExtend from 'dva-model-extend';
import { commonModel } from '../../commonModel';

import {CouponType} from '../pages/Coupons';

export default modelExtend(commonModel, {
  namespace: 'couponsModel',
  state: null,
  reducers: {},
  effects: {
    *downloadCouponsInf({shopId}, {put, select}) {
      console.log('downloadCouponsInf run!');
      let json;
      if(global.realm==='shop'){
        json = yield global.myFetch(
          {
            url: global.serverBaseUrl+'/Shops/'+shopId+'/coupons',/*,\"order\":[\"startedDate DESC\",\"id DESC\"]*/
            data:{filter:'{\"order\":\"minus ASC\"}'},
          });
      } 
      else if(global.realm==='producer'){
        const producerId = yield select(function({producerModel:{id: producerId}}){return producerId});
        const result = yield global.myFetch(
          {
            url: global.serverBaseUrl+'/producers/'+producerId+'/shops',/*,\"order\":[\"startedDate DESC\",\"id DESC\"]*/
            data:{filter:{where:{id:shopId}, include:'coupons'}},
          });
        json = result[0].coupons;
      }
      //将代金券分类后放入couponsInf中，且将发放中和新建的代金券放在最前面
      //同时计算各个代金券的使用数量
      let startConcernCoupons = [];
      let ordinaryCoupons = [];
      let fansOnlyCoupons = [];
      for(let coupon of json){
        let type = coupon.type;
        let startedDate = coupon.startedDate;
        let stoppedDate = coupon.stoppedDate;
        if(type==CouponType.startConcernCoupons){
          if(!startedDate||(startedDate&&!stoppedDate)) startConcernCoupons.unshift(coupon);
          else startConcernCoupons.push(coupon);
          coupon.usedCnt = 0;
        }
        else if(type==CouponType.ordinaryCoupons){
          if(!startedDate||(startedDate&&!stoppedDate)) ordinaryCoupons.unshift(coupon);
          else ordinaryCoupons.push(coupon);
          coupon.usedCnt = 0;
        }
        else if(type==CouponType.fansOnlyCoupons){
          fansOnlyCoupons.push(coupon);
          coupon.usedCnt = 0;
        }
        else console.error('coupon.type error!');
      }
      fansOnlyCoupons.sort((a,b)=>{
        return new Date(b.createdDate)-new Date(a.createdDate);
      })
      yield put({
        type: 'replace',
        payload: {arr: json, startConcernCoupons, ordinaryCoupons, fansOnlyCoupons},
      });
    },
  },
});
