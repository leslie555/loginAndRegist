import React from 'react';
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button';
import {Table,TableBody,TableHeader,TableHeaderColumn,TableRow,TableRowColumn}
  from '@material-ui/core/Table';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
class CouponTableFansOnly extends React.Component{
  render() {
    const {coupons, maxValidCnt} = this.props;
    let validCnt = 0;
    for(let coupon of coupons){
      if(coupon.startedDate&&!coupon.stoppedDate) validCnt++;
    }
    return (
      <Table height={coupons.length>5?"300px":undefined}>
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
          enableSelectAll={false}
        >
          <TableRow>
            <TableHeaderColumn style={{padding:'8px'}}>金额</TableHeaderColumn>
            <TableHeaderColumn style={{padding:'0px'}}>使用条件</TableHeaderColumn>
            <TableHeaderColumn style={{padding:'0px'}}>有效天数</TableHeaderColumn>
            <TableHeaderColumn style={{padding:'0px'}}>推送总数</TableHeaderColumn>
            <TableHeaderColumn style={{padding:'0px'}}>已使用张数</TableHeaderColumn>
            <TableHeaderColumn style={{padding:'0px'}}>推送日期</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {coupons.map((coupon, index)=>{
            return(
              <TableRow key={index}>
                <TableRowColumn style={{padding:'8px'}}>{coupon.minus}元</TableRowColumn>
                <TableRowColumn style={{padding:'0px'}}>满{coupon.full}元</TableRowColumn>
                <TableRowColumn style={{padding:'0px'}}>{coupon.validDays}天</TableRowColumn>
                {/*<TableRowColumn style={{padding:'0px'}}>{coupon.gettedCoupons.length}张</TableRowColumn>*/}
                <TableRowColumn style={{padding:'0px'}}>{coupon.usedCnt}张</TableRowColumn>
                <TableRowColumn style={{padding:'0px'}}>{new Date(coupon.createdDate).toLocaleDateString()}</TableRowColumn>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

const mapStateToProps = ({appModel, couponsModel, shopModel}, ownProps)=>{
  return {
    couponTypeName: ownProps.couponTypeName,
    coupons: couponsModel[ownProps.couponTypeName],
    maxValidCnt: ownProps.maxValidCnt,
    shopId: shopModel.id,
  };
}
const mapDispatchToProps =(dispatch)=>{return {dispatch}};
export default connect(mapStateToProps,mapDispatchToProps)(CouponTableFansOnly);
