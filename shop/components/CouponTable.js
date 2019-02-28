import React from 'react';
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
class CouponTable extends React.Component{
  render() {
    const {width, coupons} = this.props;

    return (
      <Table height={coupons.length>5?'300px':undefined}>
        <TableHead>
          <TableRow>
            <TableCell style={{padding:'8px'}}>金额</TableCell>
            <TableCell style={{padding:'0px'}}>使用条件</TableCell>
            <TableCell style={{padding:'0px'}}>有效截止日期</TableCell>
            {isWidthUp('sm', width)&&<TableCell style={{padding:'0px'}}>创建日期</TableCell>}
            <TableCell style={{padding:'0px'}}>计划发放张数</TableCell>
            <TableCell style={{padding:'0px'}}>已发放张数</TableCell>
            <TableCell style={{padding:'0px'}}>状态</TableCell>
            <TableCell style={{padding:'0px'}}>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody >
          {coupons.map((coupon, index)=>{
            return(
              <TableRow key={index}
                style={coupon.startedDate&&!coupon.stoppedDate?{color:'green'}:{}}>
                <TableCell style={{padding:'8px'}}>{coupon.minus}元</TableCell>
                <TableCell style={{padding:'0px'}}>满{coupon.full}元</TableCell>
                <TableCell style={{padding:'0px'}}>{new Date(coupon.validDate).toLocaleDateString()}</TableCell>
                {isWidthUp('sm', width)&&<TableCell style={{padding:'0px'}}>{new Date(coupon.createdDate).toLocaleDateString()}</TableCell>}
                <TableCell style={{padding:'0px'}}>{coupon.totalNum}张</TableCell>
                <TableCell style={{padding:'0px'}}>{coupon.gettedNum||0}张</TableCell>
                <TableCell style={{padding:'0px'}}>
                  {
                    global.ServerDate.now()>new Date(coupon.validDate).getTime()?
                      <span style={{color:'orange'}}>过期</span>
                      :
                      (
                        coupon.totalNum===coupon.gettedNum?
                          <span style={{color:'orange'}}>发放完毕</span>
                          :
                          <span style={{color:'green'}}>发放中</span>
                      )
                  }
                </TableCell>
                <TableCell style={{padding:'0px'}}>
                  <Button color="primary" style={{minWidth:'auto'}}
                    onClick={this.deleteCoupon(index)}>
                    删除
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }


  deleteCoupon = (index)=>()=>{
    const {shopAuth} = this.props;
    if(global.realm==='shop'&&!shopAuth.writeCoupon) {
      global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
      return;
    }
    this.props.dispatch({type: 'couponsModel/downloadCouponsInf', shopId:this.props.shopId});
    const  {couponTypeName, coupons, shopId,producerId, dispatch} = this.props;
    const coupon = coupons[index];
    
    global.MyDialog.confirm({
      message:coupon.gettedNum?'删除该代金券后该代金券即会停止发放，但已发放给顾客的代金券依然有效，不影响顾客正常使用。':''+'确认要删除该代金券吗？',
      actions:[
        {
          text: '取消'
        },
        {
          text: '删除',
          cb: ()=>{
            global.myFetch( {
              url: global.serverBaseUrl+
              (global.realm==='shop'?`/Shops/${shopId}`:`/producers/${producerId}`)
              +'/coupons/'+coupon.id,
              method: 'DELETE', 
            })
              .then(()=>{
                coupons.splice(index,1);
                dispatch({type: 'couponsModel/updateState', payload: {[couponTypeName]: [...coupons]}});
              })
              .catch((ex)=>{
                console.error(ex);
              })
          }
        }
      ]
    });

  }
}

const mapStateToProps = ({couponsModel, shopModel, producerModel}, ownProps)=>{
  return {
    couponTypeName: ownProps.couponTypeName,
    coupons: couponsModel[ownProps.couponTypeName],
    // maxProvidingCnt: ownProps.maxProvidingCnt,
    shopId: shopModel.id,
    shopAuth:shopModel.shopAuth||{},
    producerId:producerModel&&producerModel.id,
  };
}
const mapDispatchToProps =(dispatch)=>{return {dispatch}};
export default connect(mapStateToProps,mapDispatchToProps)(withWidth()(CouponTable));
