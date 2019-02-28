import React from 'react';
import {connect} from 'react-redux'
import DatePicker from 'material-ui/DatePicker';
import Paper from '@material-ui/core/Paper';
import areIntlLocalesSupported from 'intl-locales-supported';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import UsedCouponTable from '../components/UsedCouponTable';


let DateTimeFormat;
if (areIntlLocalesSupported(['zh-CN'])) {
  DateTimeFormat = global.Intl.DateTimeFormat;
} else {
  const IntlPolyfill = require('intl');
  DateTimeFormat = IntlPolyfill.DateTimeFormat;
  require('intl/locale-data/jsonp/zh');
}

class CouponFinance extends React.Component{
  UNSAFE_componentWillMount(){
    const {couponFinanceModel, gettedCouponArr, shopId, dispatch} = this.props;
    if(couponFinanceModel.result) {}
    else if(gettedCouponArr) this.calculate();
    else dispatch({type:'gettedCouponModel/query',shopId: shopId,callback:this.calculate});
  }
  render(){
    let {gettedCouponArr, couponFinanceModel, dispatch, classes, theme} = this.props;
    const mainColor = theme.palette.primary.main;
    if(!gettedCouponArr||!couponFinanceModel||!couponFinanceModel.result) return null;
    let {startDate, endDate, result} = couponFinanceModel;
    let total = {count:0, sum:0};
    for(let tmp of result){
      total.count+=tmp.count;
      total.sum+=tmp.sum;
    }
    return (
      <div>
        <Paper className={classes.paper} zDepth={2}>
          <div className={classes.title} style={{backgroundColor: '#0069ffb8'}}>已使用代金券统计：</div>
          <p className={global.classes.wingBlank}>输入日期范围，便可以计算出在这段时间内，顾客使用了多少张代金券，这些代金券的总金额是多少，以及收银员是谁。</p>
          <div style={{margin:'0 auto', maxWidth:'256px', paddingTop:'20px'}}>
            <span>开始日期：</span>
            <DatePicker
              id='startDatePicker'
              value={startDate}
              maxDate={endDate}
              disableYearSelection={true}
              DateTimeFormat={DateTimeFormat}
              okLabel="确定"
              cancelLabel="取消"
              locale="zh"
              firstDayOfWeek={0}
              style={{width: '100%', marginTop: '1rem'}}
              textFieldStyle={{width: '100%'}}
              onChange={(evt, date)=>{
                dispatch({
                  type: 'couponFinanceModel/updateState',
                  payload:{ startDate:date}
                });
                setTimeout(this.calculate, 0);
              }}
            />
            <br/>
            <span>截止日期：</span>
            <DatePicker
              id='endDatePicker'
              value={endDate}
              minDate={startDate}
              maxDate={new global.ServerDate()}
              disableYearSelection={true}
              DateTimeFormat={DateTimeFormat}
              okLabel="确定"
              cancelLabel="取消"
              locale="zh"
              firstDayOfWeek={0}
              style={{width: '100%', marginTop: '1rem'}}
              textFieldStyle={{width: '100%'}}
              onChange={(evt, date)=>{
                dispatch({
                  type: 'couponFinanceModel/updateState',
                  payload:{ endDate:date}
                });
                setTimeout(this.calculate, 0);
              }}
            />
            
          </div>
          <Table style={{maxWidth:'400px',margin:'1rem auto'}}>
            <TableHead
              displaySelectAll={false}
              adjustForCheckbox={false}
              enableSelectAll={false}
            >
              <TableRow>
                <TableCell style={{color: mainColor, padding:'0px', paddingLeft:'24px'}}>收银员</TableCell>
                <TableCell style={{color: mainColor, padding:'0px'}}>代金券张数</TableCell>
                <TableCell style={{color: mainColor, padding:'0px'}}>总金额</TableCell>
              </TableRow>
            </TableHead>
            <TableBody displayRowCheckbox={false}>
              {result.map((item, index)=>{
                return(
                  <TableRow key={index}>
                    <TableCell  style={{padding:'0px', paddingLeft:'24px'}}>{item.cashier?item.cashier:'-'}</TableCell>
                    <TableCell  style={{padding:'0px'}}>{item.count}张</TableCell>
                    <TableCell  style={{padding:'0px'}}>{item.sum}元</TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell style={{padding:'0px', paddingLeft:'24px'}}>合计</TableCell>
                <TableCell style={{padding:'0px'}}>{total.count}张</TableCell>
                <TableCell style={{padding:'0px'}}>{total.sum}元</TableCell>
              </TableRow>
            </TableBody>
            {/*<TableFooter adjustForCheckbox={false}>
            </TableFooter>*/}
          </Table>
        </Paper>

        <Paper className={classes.paper}  zDepth={2}>
          <div className={classes.title} style={{backgroundColor: '#ff004ac4'}}>已使用代金券详情：</div>
          <UsedCouponTable/>
        </Paper>
      </div>
    )
  }

  calculate = ()=>{
    console.log('calculate run!');
    let {gettedCouponArr, couponFinanceModel, dispatch} = this.props;
    if(!couponFinanceModel.startDate) couponFinanceModel = {
      startDate : new Date(new global.ServerDate()),
      endDate : new Date(new global.ServerDate())
    }
    let {startDate, endDate} = couponFinanceModel;
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    let result=[];
    for(let i=0;i<gettedCouponArr.length;i++){//1111111111222222222
      let gettedCoupon = gettedCouponArr[i];
      let usedDate = new Date(gettedCoupon.usedDate);
      if((usedDate.getTime()>startDate.getTime())&&
        (usedDate.getTime()<endDate.getTime())){
        if (result.length==0) {
          result =
            [{cashier:gettedCoupon.cashier, count:1, sum:gettedCoupon.minus,}];
        }
        else{
          for(let k in result){
            if(result[k].cashier == gettedCoupon.cashier){
              result[k].count++;
              result[k].sum+=gettedCoupon.minus;
              break;
            }
            if(k==result.length-1) result.push({
              cashier:gettedCoupon.cashier, count:1, sum:gettedCoupon.minus,
            });
          }
        }
      }
    }
    dispatch({
      type: 'couponFinanceModel/replace',
      payload:{...couponFinanceModel, result}
    });
  }
}

const mapStateToProps = ({couponFinanceModel, gettedCouponModel:{gettedCouponArr}, shopModel:{id: shopId}})=>{
  return {
    shopId,
    couponFinanceModel,
    gettedCouponArr,
  };
}
const styles=(theme)=>({
  paper :{
    minHeight:'20rem',
    marginBottom:'1.5rem',
    paddingBottom:'3rem',
    [theme.breakpoints.up('sm')]: {
      paddingLeft: '1rem',
      paddingRight: '1rem',
    },
  },
  title :{
    display:'inline-block',
    marginTop: '0.7rem',
    padding: '0.5rem 0.8rem',
    height: '2.4rem',
    width: '13rem',
    borderRadius: '1.2rem',
    color: '#fff',
  },
});
export default connect(mapStateToProps)(withStyles(styles, {withTheme: true })(CouponFinance));


