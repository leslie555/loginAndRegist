import React from 'react';
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class CouponTable extends React.Component{
  render() {
    const {coupons} = this.props;
    let providingCnt = 0;
    for(let coupon of coupons){
      if(coupon.startedDate&&!coupon.stoppedDate) providingCnt++;
      // coupon.gettedCouponCnt = coupon.gettedCoupons.length;
      // for(let tmp of coupon.inValidStatistics){
      //   coupon.gettedCouponCnt += tmp.count;
      // }
    }

    return (
      <Table height={coupons.length>5?'300px':undefined}>
        <TableHead>
          <TableRow>
            <TableCell style={{padding:'8px'}}>金额</TableCell>
            <TableCell style={{padding:'0px'}}>使用条件</TableCell>
            <TableCell style={{padding:'0px'}}>有效截止日期</TableCell>
            <TableCell style={{padding:'0px'}}>创建日期</TableCell>
            <TableCell style={{padding:'0px'}}>计划发放张数</TableCell>
            <TableCell style={{padding:'0px'}}>已发放张数</TableCell>
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
                <TableCell style={{padding:'0px'}}>{new Date(coupon.createdDate).toLocaleDateString()}</TableCell>
                <TableCell style={{padding:'0px'}}>{coupon.totalNum}张</TableCell>
                <TableCell style={{padding:'0px'}}>{coupon.gettedNum||0}张</TableCell>
                <TableCell style={{padding:'0px'}}>
                  {/*<Button label="编辑" color="primary" style={{minWidth:'auto'}}
                                      labelStyle={{paddingLeft:'3px',paddingRight:'3px'}}
                                      onClick={this.editCoupon.bind(null, coupon, index)}/>*/}
                  <Button color="primary" style={{minWidth:'auto'}}
                    onClick={this.deleteCoupon(index)}>删除</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
  editCoupon = (coupon, index)=>{
    const {couponTypeName, coupons, dispatch} = this.props;
    dispatch({
      type: 'editCouponModel/updateState',
      payload:{open:true, coupon, confirmCallback:(minus, full, totalNum, validDate)=>{
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
        global.myFetch( {
          url: global.serverBaseUrl+'/Shops/'+this.props.shopId+'/coupons/'+coupon.id,
          method: 'PUT', 
          data: {minus, full, totalNum, validDate},
        })
          .then((json)=>{
            coupons[index] = {...coupon, ...json};
            dispatch({type: 'couponsModel/updateState', payload: {[couponTypeName]: [...coupons]}});
          })
          .catch((ex)=>{
            console.error(ex);
            // hideCircularProgress(dispatch);
          })
        // for(let tmp of coupons){//代金券不能重复
        //   if(tmp.minus==minus){
        //     global.MyDialog.info(`价值${minus}元的代金券已经存在请勿重复创建!`);
        //     return;
        //   }
        // }
        // showCircularProgress(this.props.dispatch);
        // global.myFetch(global.serverBaseUrl+'/Shops/'+this.props.shopId+'/coupons'
        //   ,{method:'POST', credentials: 'include',
        //     headers: {'Content-Type': 'application/json', },
        //     body:JSON.stringify({full,minus,validDate,type:CouponType[couponTypeName],
        //       myUserId:this.props.myUserId})}
        // ).then((response)=>{
        //   if(response.status==200) {
        //     return response.json();
        //   }
        //   else throw('response.status!=200')
        // })
        //   .then((json)=>{
        //     // json.gettedCoupons = [];
        //     json.usedCnt = 0;
        //     coupons.unshift(json);
        //     // console.log('jjjjjjjjjj',couponsModel);
        //     couponsModel.push(json);
        //     // console.log('jjjjjjjjjj',couponsModel);
        //     couponsModel[couponTypeName] = [...coupons];//这有这样操作CouponTable才会重新渲染

        //     // console.log('jjjjjjjjjj',[...couponsModel]);
        //     let newCouponsModel = [...couponsModel];
        //     newCouponsModel.startConcernCoupons = couponsModel.startConcernCoupons;
        //     newCouponsModel.ordinaryCoupons = couponsModel.ordinaryCoupons;
        //     newCouponsModel.fansOnlyCoupons = couponsModel.fansOnlyCoupons;
        //     this.props.dispatch({
        //       type: 'couponsModel/replace',
        //       payload: newCouponsModel
        //     });
        //     // hideCircularProgress(this.props.dispatch);
        //   })
        //   .catch((ex)=>{
        //     console.error(ex);
        //     // hideCircularProgress(this.props.dispatch);
        //   })
      }}
    });
  };
  changeCouponProps = (index, newProps)=>()=>{
    let couponTypeName = this.props.couponTypeName;
    let coupons = this.props.coupons;
    let coupon = coupons[index];
    let dispatch = this.props.dispatch;

    // showCircularProgress(dispatch);
    global.myFetch( {
      url: global.serverBaseUrl+'/Shops/'+this.props.shopId+'/coupons/'+coupon.id,
      method: 'PUT', 
      data: newProps,
    })
      .then((json)=>{
        coupons[index] = {...coupon, ...json};
        dispatch({type: 'couponsModel/updateState', payload: {[couponTypeName]: [...coupons]}});
      })
      .catch((ex)=>{
        console.error(ex);
        // hideCircularProgress(dispatch);
      })
  }

  deleteCoupon = (index)=>()=>{
    this.props.dispatch({type: 'couponsModel/downloadCouponsInf', shopId:this.props.shopId});
    let couponTypeName = this.props.couponTypeName;
    let coupons = this.props.coupons;
    let coupon = coupons[index];
    let dispatch = this.props.dispatch;
    // if(coupon.gettedCoupons.length!=0){
    //   global.MyDialog.info('已经有顾客获得了该代金券，因此无法删除！');
    //   return;
    // }
    
    global.MyDialog.confirm({
      message:'确认要删除该代金券吗？',
      actions:[
        {
          text: '取消'
        },
        {
          text: '删除',
          cb: ()=>{
            // showCircularProgress(dispatch);
            global.myFetch( {
              url: global.serverBaseUrl+'/Shops/'+this.props.shopId+'/coupons/'+coupon.id,
              method: 'DELETE', 
            })
              .then(()=>{
                coupons.splice(index,1);
                dispatch({type: 'couponsModel/updateState', payload: {[couponTypeName]: [...coupons]}});
              })
              .catch((ex)=>{
                console.error(ex);
                // hideCircularProgress(dispatch);
              })
          }
        }
      ]
    });

  }
}

const mapStateToProps = ({couponsModel, shopModel}, ownProps)=>{
  return {
    couponTypeName: ownProps.couponTypeName,
    coupons: couponsModel[ownProps.couponTypeName],
    maxProvidingCnt: ownProps.maxProvidingCnt,
    shopId: shopModel.id,
  };
}
const mapDispatchToProps =(dispatch)=>{return {dispatch}};
export default connect(mapStateToProps,mapDispatchToProps)(CouponTable);
