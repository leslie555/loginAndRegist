import React from 'react';
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import IconButton from '@material-ui/core/IconButton';
import HelpOutline from '@material-ui/icons/HelpOutline';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import CouponSetDialog from '../components/CouponSetDialog'
import CouponTable from '../components/CouponTable'
// import CouponTableFansOnly from '../components/CouponTableFansOnly'


class Coupon extends React.Component{
  UNSAFE_componentWillMount(){
    const {couponsModel, concerns} = this.props;
    if(!couponsModel || !(couponsModel instanceof Array)) {
      this.props.dispatch({type:'couponsModel/downloadCouponsInf',shopId:this.props.shopId/*, callback: this.clearInvalidCoupons*/});
    }
    if(!concerns || !(concerns instanceof Array)) {
      this.props.dispatch({type:'concernModel/downLoadConcernsInf', shopId:this.props.shopId});
    }
  }
  render(){
    const {couponsModel} = this.props;
    if(!couponsModel) return null;
    const {startConcernCoupons, ordinaryCoupons, fansOnlyCoupons} = couponsModel;
    if(!startConcernCoupons) return null;
    console.log('Coupon rendered');
    return (
      <div>
        <p >代价券分为3种：第一种代金券是添加店铺关注赠送的代金券，当顾客关注该店铺（即成为该店铺的粉丝）时将立即获得该代金券。顾客取消关注然后再次关注本店铺不会重复获得该代金券。第二种代金券是放在店铺首页，任何顾客都可以自由点击领取的代金券。第三种代金券是店铺主动推送给关注本店铺粉丝的代金券，推送后所有粉丝将立即获得该代金券。注意：代金券可以同店铺的其它优惠促销活动同时享受，店铺不得以任何理由拒绝顾客使用代金券。顾客一次购物仅限使用一张代金券。</p>
        <Paper style={paperStyle}>
          <p style={pStyle}>添加店铺关注赠送的代金券(只能1种处于发放状态)：</p>
          <IconButton tooltip="常见问题" style={{float:'right'}}>
            <HelpOutline />
          </IconButton><br style={{clear:'both'}}/>
          {startConcernCoupons.length!=0&&<CouponTable couponTypeName='startConcernCoupons' maxProvidingCnt={1}/>}
          {startConcernCoupons.length==0&&
            <div style={{marginLeft:'25px',marginTop:'35px',fontSize:'25px'}}>您尚未创建该类型代金券</div>
          }
          <br/><br/><br/>
          <Button color="primary" style={rightBottomBtnStyle}
            onClick={this.handleCouponAdd('startConcernCoupons')}
            icon={<AddCircleOutline/>}
          >创建新代金券</Button>
          <br style={{clear:'both'}}/>
        </Paper>

        <Paper style={paperStyle}>
          <p style={pStyle}>所有访问店铺页面的顾客都可以点击领取的代金券(最多3种处于发放状态)：</p>
          <IconButton tooltip="常见问题" style={{float:'right'}}>
            <HelpOutline />
          </IconButton><br style={{clear:'both'}}/>
          {ordinaryCoupons.length!=0&&<CouponTable couponTypeName='ordinaryCoupons' maxProvidingCnt={3}/>}
          {ordinaryCoupons.length==0&&
            <div style={{marginLeft:'25px',marginTop:'35px',fontSize:'25px'}}>您尚未创建该类型代金券</div>
          }
          <br/><br/><br/>
          <Button color="primary" style={rightBottomBtnStyle}
            onClick={this.handleCouponAdd('ordinaryCoupons')}
            icon={<AddCircleOutline/>}
          >创建新代金券</Button>
          <br style={{clear:'both'}}/>
        </Paper>


        {/*<Paper style={paperStyle}>
          <p style={pStyle}>推送给关注本店铺顾客(即“粉丝”)的代金券(两次推送间隔须大于30天)：</p>
          <IconButton tooltip="常见问题" style={{float:'right'}}>
            <HelpOutline />
          </IconButton><br style={{clear:'both'}}/>
          {fansOnlyCoupons.length!=0&&<CouponTableFansOnly couponTypeName='fansOnlyCoupons'/>}
          {fansOnlyCoupons.length==0&&
            <div style={{marginLeft:'25px',marginTop:'35px',fontSize:'25px'}}>您尚未向粉丝推送过该类型代金券</div>
          }
          <br/><br/><br/>
          <Button color="primary" style={rightBottomBtnStyle}
            onClick={this.handleFansOnlyCouponAdd}
            icon={<AddCircleOutline/>}
          >推送新代金券</Button>
          <br style={{clear:'both'}}/>
        </Paper>*/}

        <CouponSetDialog/>
      </div>
    );
  }
  handleCouponAdd = (couponTypeName)=> ()=>{
    let couponsModel = this.props.couponsModel;
    let coupons = couponsModel[couponTypeName];
    this.props.dispatch({
      type: 'editCouponModel/updateState',
      payload:{open:true, confirmCallback:(minus, full, totalNum, validDate)=>{
        minus = parseInt(minus);//代金券的金额
        full = parseInt(full);  //付款满多少才可以使用
        totalNum = parseInt(totalNum);  //计划发放钟张数
        // validDays = parseInt(validDays); //有效天数
        if(isNaN(full)||isNaN(minus)||isNaN(totalNum)||!validDate||
          full<=0||minus<=0||totalNum<=0||full<minus){
          global.Toast.error('输入错误！');
          return;
        }
        this.props.dispatch({
          type: 'editCouponModel/updateState',
          payload:{open:false}
        });
        for(let tmp of coupons){//代金券不能重复
          if(tmp.minus==minus){
            global.Toast.error(`${minus}元的代金券已经存在`);
            return;
          }
        }
        // showCircularProgress(this.props.dispatch);
        global.myFetch({
          url: global.serverBaseUrl+'/Shops/'+this.props.shopId+'/coupons',
          method:'POST', 
          data:{full,minus,totalNum, validDate,type:CouponType[couponTypeName],
            myUserId:this.props.myUserId}}
        )
          .then((json)=>{
            // json.gettedCoupons = [];
            json.usedCnt = 0;
            coupons.unshift(json);
            // console.log('jjjjjjjjjj',couponsModel);
            couponsModel.push(json);
            // console.log('jjjjjjjjjj',couponsModel);
            couponsModel[couponTypeName] = [...coupons];//这有这样操作CouponTable才会重新渲染

            // console.log('jjjjjjjjjj',[...couponsModel]);
            let newCouponsModel = [...couponsModel];
            newCouponsModel.startConcernCoupons = couponsModel.startConcernCoupons;
            newCouponsModel.ordinaryCoupons = couponsModel.ordinaryCoupons;
            newCouponsModel.fansOnlyCoupons = couponsModel.fansOnlyCoupons;
            this.props.dispatch({
              type: 'couponsModel/replace',
              payload: newCouponsModel
            });
            // hideCircularProgress(this.props.dispatch);
          })
          .catch((ex)=>{
            console.error(ex);
            // hideCircularProgress(this.props.dispatch);
          })
      }}
    });
  }

  handleFansOnlyCouponAdd = ()=>{
    if(this.props.concerns.length==0){
      global.Toast.error('目前还没有人关注您的店铺。');
      return;
    }
    let couponsModel = this.props.couponsModel;
    let fansOnlyCoupons = couponsModel.fansOnlyCoupons;
    if(fansOnlyCoupons.length!=0){
      let lastPushDate = new Date(fansOnlyCoupons[0].createdDate);//因为fansOnlyCoupons已经根据创建时间进行排序，所以第一个coupon就是最后推送的那个coupon
      lastPushDate.setHours(0, 0, 0, 0);
      let tmp = lastPushDate.getTime()+1000*60*60*24*30-global.ServerDate.now();
      if(tmp>0) {
        global.Toast.error('两次推送间隔须大于30天,'+Math.ceil(tmp/(1000*60*60*24))
                  +'天后才能再次推送');
        return;
      }
    }

    this.props.dispatch({
      type: 'editCouponModel/updateState',
      payload:{open:true, confirmCallback:(minus, full, validDays)=>{
        minus = parseInt(minus);//代金券的金额
        full = parseInt(full);  //付款满多少才可以使用
        validDays = parseInt(validDays); //有效天数
        if(isNaN(full)||isNaN(minus)||isNaN(validDays)||
          full<=0||minus<=0||validDays<=0||full<minus){
          global.Toast.error('输入错误！');
          return;
        }
        this.props.dispatch({
          type: 'editCouponModel/updateState',
          payload:{open:false}
        });
        // showCircularProgress(this.props.dispatch);
        global.myFetch({
          url: global.serverBaseUrl+'/Shops/'+this.props.shopId+'/coupons',
          method:'POST', 
          data:{full,minus,validDays,
            type:CouponType.fansOnlyCoupons,myUserId:this.props.myUserId}}
        )
        .then((newCreatedCoupon)=>{
          // console.log('---------在这里加入post gettedCoupon的逻辑--------');
          // let body=[];
          // for(let tmp of this.props.concerns){
          //   body.push({shopId: this.props.shopId, customerId:tmp.customerId});
          // }
          // global.myFetch(global.serverBaseUrl+'/Coupons/'+newCreatedCoupon.id+'/gettedCoupons'
          //   ,{method:'POST', credentials: 'include',
          //     headers: {'Content-Type': 'application/json', },
          //     body:JSON.stringify(body)}
          // ).then((response)=>{
          //   if(response.status==200) {
          //     return response.json();
          //   }
          //   else throw('response.status!=200')
          // }).then((newCreatedGettedCouponArray)=>{
          //   newCreatedCoupon.gettedCoupons = newCreatedGettedCouponArray;
          //   newCreatedCoupon.usedCnt = 0;
          //   let couponsModel = this.props.couponsModel;
          //   fansOnlyCoupons.unshift(newCreatedCoupon);
          //   couponsModel.fansOnlyCoupons = [...fansOnlyCoupons];//这有这样操作CouponTable才会重新渲染
          //   let newCouponModel = [...couponsModel];
          //   newCouponModel.startConcernCoupons = couponsModel.startConcernCoupons;
          //   newCouponModel.ordinaryCoupons = couponsModel.ordinaryCoupons;
          //   newCouponModel.fansOnlyCoupons = couponsModel.fansOnlyCoupons;
          //   this.props.dispatch({
          //     type: 'couponsModel/replace',
          //     payload: newCouponModel
          //   });
          // // hideCircularProgress(this.props.dispatch);
          // })
          })
          .catch((ex)=>{
            console.error(ex);
            // hideCircularProgress(this.props.dispatch);
          })
      }}
    });
  }
  // //清理过期超过30天的gettedCoupon
  // clearInvalidCoupons = ()=>{
  //   for(let coupon of this.props.couponsModel){
  //     let invalidGettedCoupons = [];
  //     let invalidIds = [];
  //     for(let gettedCoupon  of coupon.gettedCoupons){
  //       let gettedDate = new Date(gettedCoupon.gettedDate);
  //       gettedDate.setHours(0, 0, 0, 0);
  //       if(!gettedCoupon.usedDate
  //         &&gettedDate.getTime()+(coupon.validDays+30)*1000*60*60*24
  //         <global.ServerDate.now()){
  //         invalidGettedCoupons.push(gettedCoupon);
  //         invalidIds.push(gettedCoupon.id);
  //       }
  //     }
  //     if(invalidGettedCoupons.length>3){
  //       global.myFetch(global.serverBaseUrl+'/GettedCoupons',
  //         {
  //         method: 'DELETE',
  //         credentials: 'include',
  //         body: JSON.stringify({where:{id:{inq:invalidIds}}}),
  //         }
  //       )
  //       .then((response)=>{
  //         if(response.status==200) return response.json();
  //         else throw 'response.status error'
  //       })
  //       .then((json)=>{
  //         if(typeof json.count!='number') throw 'json.count!=\'number\'';
  //         let inValidStatistics = coupon.inValidStatistics;
  //         for(let tmp of invalidGettedCoupons){
  //           let gettedDateStr = new Date(tmp.gettedDate).toLocaleDateString();
  //           let month = gettedDateStr.substring(0,gettedDateStr.lastIndexOf('/'));
  //           if (!inValidStatistics||!(inValidStatistics instanceof Array)
  //             ||inValidStatistics.length==0){
  //             inValidStatistics = [{month:month, count:1}];
  //           }
  //           else{
  //             for(let k in inValidStatistics){
  //               if(inValidStatistics[k].month==month) {
  //                 inValidStatistics[k].count++;
  //                 break;
  //               }
  //               if(k==inValidStatistics.length-1)
  //                 inValidStatistics.push({month:month, count:1});
  //             }
  //           }
  //         }
  //         global.myFetch(global.serverBaseUrl+'/Shops/'+this.props.shopId+'/coupons/'+coupon.id, {
  //           method: 'PUT', headers: {'Content-Type': 'application/json'},
  //           body: JSON.stringify({inValidStatistics}),
  //           credentials: 'include'
  //         })
  //         .then((response)=>{
  //           if(response.status==200) return response.json();
  //           else throw ('handleStart error');
  //         })
  //         .then((json)=>{
  //           // hideCircularProgress(this.props.dispatch);
  //         })
  //         .catch((ex)=>{
  //           console.error(ex);
  //           // hideCircularProgress(this.props.dispatch);
  //         })

  //       })
  //       .catch((ex)=>{
  //         console.error(ex);
  //        });
  //      }
  //    }
  // };

}

const mapStateToProps = ({couponsModel, concernModel: concerns, shopModel})=>{
  return {
    couponsModel,
    myUserId:shopModel.id,
    shopId: shopModel.id,
    concerns
  };
}
const mapDispatchToProps =(dispatch)=>{return {dispatch}};
export default connect(mapStateToProps,mapDispatchToProps)(Coupon);

export const CouponType = {startConcernCoupons:0, ordinaryCoupons:1, fansOnlyCoupons:2}


const paperStyle = {
  minHeight:'200px',
  marginBottom:'20px',
  position:'relative'
};
const pStyle = {
  float:'left',
  width:'auto'
};
const rightBottomBtnStyle = {
  float:'right',
  marginRight:'5px',
  marginBottom:'5px'
};
