import React from 'react';
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import IconButton from '@material-ui/core/IconButton';
import HelpOutline from '@material-ui/icons/HelpOutline';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import CouponSetDialog from '../components/CouponSetDialog'
import CouponTable from '../components/CouponTable'

import { withStyles } from '@material-ui/core/styles';

class Coupons extends React.Component{
  UNSAFE_componentWillMount(){
    const {couponsModel} = this.props;
    if(!couponsModel || !couponsModel.arr) {
      this.props.dispatch({type:'couponsModel/downloadCouponsInf',shopId:this.props.shopId/*, callback: this.clearInvalidCoupons*/});
    }
  }
  render(){
    const {couponsModel, classes} = this.props;
    if(!couponsModel) return null;
    const {startConcernCoupons, ordinaryCoupons} = couponsModel;
    if(!startConcernCoupons) return null;
    console.log('Coupon rendered', ordinaryCoupons);
    return (
      <div>
        <div className={global.classes.wingBlank}>
          <p>代价券分为2种：</p>
          <p>第一种代金券是普通代金券，任何顾客都可以领取的代金券。</p>
          <p>第二种代金券是新客专享代金券，主要用于吸引顾客关注本店铺。同样使用条件下，金额应高于普通代金券。顾客在关注本店铺30日内可以领取此种代金券。此种代金券对老顾客不可见。顾客取消关注然后再次关注本店铺无法重复领取此种代金券。</p>
          <p>注意：代金券可以同店铺当前的优惠促销活动同时享受，店铺不得以任何理由拒绝顾客使用代金券。顾客一次购物仅限使用一张代金券。</p>
        </div>
        <Paper className={classes.paper}>
          <div className={classes.title} style={{backgroundColor: '#ff004ac4'}}>普通代金券(最多发放3种面额)：</div>
          <IconButton tooltip="常见问题" style={{float:'right'}}>
            <HelpOutline />
          </IconButton><br style={{clear:'both'}}/>
          {ordinaryCoupons.length!=0&&<CouponTable couponTypeName='ordinaryCoupons' /*maxProvidingCnt={3}*//>}
          {ordinaryCoupons.length==0&&
            <div style={{marginLeft:'25px',marginTop:'35px',fontSize:'25px'}}>您尚未创建该类型代金券</div>
          }
          <br/><br/><br/>
          <Button color="primary" className={classes.rightBottomBtnStyle}
            onClick={this.handleCouponAdd('ordinaryCoupons')}
            icon={<AddCircleOutline/>}
            variant="contained"
          >创建新代金券</Button>
          <br style={{clear:'both'}}/>
        </Paper>

        <Paper className={classes.paper}>
          <div className={classes.title} style={{backgroundColor: '#0069ffb8'}}>新客专享代金券(最多发放3种面额)：</div>
          <IconButton tooltip="常见问题" style={{float:'right'}}>
            <HelpOutline />
          </IconButton><br style={{clear:'both'}}/>
          {startConcernCoupons.length!=0&&<CouponTable couponTypeName='startConcernCoupons' /*maxProvidingCnt={1}*//>}
          {startConcernCoupons.length==0&&
            <div style={{marginLeft:'25px',marginTop:'35px',fontSize:'25px'}}>您尚未创建该类型代金券</div>
          }
          <br/><br/><br/>
          <Button color="primary" className={classes.rightBottomBtnStyle}
            onClick={this.handleCouponAdd('startConcernCoupons')}
            icon={<AddCircleOutline/>}
            variant="contained"
          >创建新代金券</Button>
          <br style={{clear:'both'}}/>
        </Paper>
        <CouponSetDialog/>
      </div>
    );
  }
  handleCouponAdd = (couponTypeName)=> ()=>{
    const {couponsModel, shopAuth, shopId, myUserId, producerId, dispatch} = this.props;
    if(global.realm==='shop'&&!shopAuth.writeCoupon) {
      global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
      return;
    }
    let coupons = couponsModel[couponTypeName];
    if(coupons.length===3) {
      global.Toast.error(`${couponTypeName==='ordinaryCoupons'?'普通':'新客专享'}代金券不能超过3种`);
      return;
    }
    dispatch({
      type: 'editCouponModel/updateState',
      payload:{open:true, confirmCallback:(minus, full, totalNum, validDate)=>{
        minus = parseInt(minus);//代金券的金额
        full = parseInt(full);  //付款满多少才可以使用
        totalNum = parseInt(totalNum);  //计划发放钟张数
        for(let tmp of coupons){//代金券不能重复
          if(tmp.minus==minus){
            global.Toast.error(`${minus}元的代金券已经存在`);
            return;
          }
        }
        global.myFetch({
          url: global.serverBaseUrl+
          (global.realm==='shop'?`/Shops/${shopId}`:`/producers/${producerId}`)
          +'/coupons',
          method:'POST', 
          data:{full,minus,totalNum, validDate,type:CouponType[couponTypeName],
            myUserId:myUserId, producerId, shopId}}
        )
          .then((json)=>{
            json.usedCnt = 0;

            let newCouponsModel = {...couponsModel};

            coupons.unshift(json);
            newCouponsModel.arr.push(json);
            newCouponsModel[couponTypeName] = [...coupons];//这样操作CouponTable才会重新渲染
            
            dispatch({
              type: 'couponsModel/replace',
              payload: newCouponsModel
            });
          })
          .catch((ex)=>{
            console.error(ex);
          })
      }}
    });
  }
}

const mapStateToProps = ({couponsModel, shopModel})=>{
  return {
    couponsModel,
    myUserId:shopModel.id,
    shopId: shopModel.id,
    shopAuth: shopModel.shopAuth||{},
    producerId: shopModel.producerId,
  };
}
const styles={
  paper :{
    minHeight:'200px',
    marginBottom:'20px',
  },
  title :{
    display:'inline-block',
    margin: '0.7rem',
    padding: '0.5rem 0.8rem',
    height: '2.4rem',
    width: '18rem',
    borderRadius: '1.2rem',
    color: '#fff',
  },
  rightBottomBtnStyle :{
    float:'right',
    marginRight:'5px',
    marginBottom:'5px'
  },
}
export default connect(mapStateToProps)(withStyles(styles)(Coupons));

export const CouponType = {ordinaryCoupons:0, startConcernCoupons:1, fansOnlyCoupons:2}

